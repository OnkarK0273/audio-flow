import { calculateAudioLevel, createPCMBlob } from "@/lib/audioUtils";
import { INPUT_SAMPLE_RATE } from "@/lib/constants";
import {
  AgentState,
  ConnectConfig,
  ConnectionState,
  LiveManagerCallbacks,
} from "@/types";
import {
  GoogleGenAI,
  LiveServerMessage,
  Modality,
  Session,
} from "@google/genai";

// gemini-2.5-flash supports Live API bidiGenerateContent
const LIVE_MODEL = "gemini-3.5-transcribe-live";

export class AudioService {
  private ai: GoogleGenAI;
  private activeSession: Session | null = null;
  private inputAudioContext: AudioContext | null = null;
  private workletNode: AudioWorkletNode | null = null;
  private mediaStream: MediaStream | null = null;
  private inputSource: MediaStreamAudioSourceNode | null = null;
  private callbacks: LiveManagerCallbacks;
  private isMuted = false;
  private currentTranscription = "";
  private isConnecting = false;

  constructor(callbacks: LiveManagerCallbacks, tokenOrKey: string) {
    this.ai = new GoogleGenAI({
      apiKey: tokenOrKey,
      apiVersion: "v1alpha",
    });
    this.callbacks = callbacks;
  }

  async startSession(connectConfig: ConnectConfig) {
    if (this.isConnecting) return;
    this.isConnecting = true;

    try {
      this.callbacks.onConectionStateChange(ConnectionState.CONNECTING);
      this.currentTranscription = "";

      // Fall back to LIVE_MODEL if gemini-3.5-transcribe is passed
      const targetModel =
        connectConfig.model && !connectConfig.model.includes("transcribe")
          ? connectConfig.model
          : LIVE_MODEL;

      const transcriptionConfig: Record<string, any> = {
        mode: connectConfig.mode || "SMART",
      };

      if (connectConfig.languageCode) {
        transcriptionConfig.languageCodes = [connectConfig.languageCode];
      }

      const config = {
        responseModalities: [Modality.TEXT],
        inputAudioTranscription: transcriptionConfig,
        systemInstruction: {
          parts: [
            {
              text: "You are a real-time speech transcription assistant. Transcribe the user's speech accurately. Do not generate conversational replies, commentary, or additional text beyond the direct transcription.",
            },
          ],
        },
      };

      this.activeSession = await this.ai.live.connect({
        model: targetModel,
        callbacks: {
          onopen: () => {
            this.callbacks.onConectionStateChange(ConnectionState.CONNECTED);
            this.callbacks.onAgentStateChange(AgentState.LISTENING);
          },
          onmessage: this.handleMessage.bind(this),
          onerror: (e: any) => {
            console.error("Gemini Live API Error:", e);
            this.callbacks.onConectionStateChange(ConnectionState.ERROR);
            this.callbacks.onAgentStateChange(AgentState.ERROR);
            this.callbacks.onError(
              typeof e === "string"
                ? e
                : e?.message || "Failed to establish Live API connection.",
            );
          },
          onclose: (e: any) => {
            console.log("Live session closed:", e?.reason);
            this.callbacks.onConectionStateChange(ConnectionState.DISCONNECTED);
            this.callbacks.onAgentStateChange(AgentState.IDLE);
          },
        },
        config: config,
      });

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.inputAudioContext = new AudioContextClass({
        sampleRate: INPUT_SAMPLE_RATE,
      });

      if (this.inputAudioContext.state === "suspended") {
        await this.inputAudioContext.resume();
      }

      await this.inputAudioContext.audioWorklet.addModule(
        "/worklet/mic-processor.js",
      );

      this.workletNode = new AudioWorkletNode(
        this.inputAudioContext,
        "mic-processor",
      );

      this.workletNode.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const float32Data = event.data;
        if (!float32Data || this.isMuted) return;

        if (this.callbacks.onAudioLevel) {
          const level = calculateAudioLevel(float32Data);
          this.callbacks.onAudioLevel(level);
        }

        const pcmBlob = createPCMBlob(float32Data);
        try {
          this.activeSession?.sendRealtimeInput({ audio: pcmBlob });
        } catch (err) {
          console.error("Error sending realtime audio chunk:", err);
        }
      };

      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: INPUT_SAMPLE_RATE,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      this.inputSource = this.inputAudioContext.createMediaStreamSource(
        this.mediaStream,
      );
      this.inputSource.connect(this.workletNode);
    } catch (error: any) {
      console.error("Failed to start audio session:", error);
      this.callbacks.onConectionStateChange(ConnectionState.ERROR);
      this.callbacks.onAgentStateChange(AgentState.ERROR);
      this.callbacks.onError(
        error?.message ||
          "Could not access microphone or connect to Gemini Live API.",
      );
      this.disconnect();
    } finally {
      this.isConnecting = false;
    }
  }

  private handleMessage(message: LiveServerMessage) {
    const serverContent = message.serverContent;

    if (serverContent?.inputTranscription?.text) {
      const delta = serverContent.inputTranscription.text;
      this.currentTranscription += delta;
      this.callbacks.onAgentStateChange(AgentState.TRANSCRIBING);
      this.callbacks.onTranscript("user", this.currentTranscription, true);
    }

    if (serverContent?.interimInputTranscription?.text) {
      const interim = serverContent.interimInputTranscription.text;
      this.callbacks.onAgentStateChange(AgentState.TRANSCRIBING);
      this.callbacks.onTranscript(
        "user",
        this.currentTranscription + interim,
        true,
      );
    }

    if (serverContent?.modelTurn?.parts) {
      for (const part of serverContent.modelTurn.parts) {
        if (part.text && !serverContent.inputTranscription) {
          this.currentTranscription += part.text;
          this.callbacks.onTranscript("user", this.currentTranscription, true);
        }
      }
    }

    if (serverContent?.turnComplete) {
      if (this.currentTranscription) {
        this.callbacks.onTranscript("user", this.currentTranscription, false);
      }
      this.callbacks.onAgentStateChange(AgentState.LISTENING);
    }
  }

  setMute(isMuted: boolean) {
    this.isMuted = isMuted;
    if (this.mediaStream) {
      this.mediaStream.getAudioTracks().forEach((track) => {
        track.enabled = !isMuted;
      });
    }
  }

  disconnect() {
    this.isConnecting = false;

    if (this.callbacks.onAudioLevel) {
      this.callbacks.onAudioLevel(0);
    }

    if (this.activeSession) {
      try {
        this.activeSession.close();
      } catch {}
      this.activeSession = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {}
      });
      this.mediaStream = null;
    }

    if (this.inputSource) {
      try {
        this.inputSource.disconnect();
      } catch {}
      this.inputSource = null;
    }

    if (this.workletNode) {
      try {
        this.workletNode.disconnect();
      } catch {}
      this.workletNode = null;
    }

    if (this.inputAudioContext) {
      try {
        if (this.inputAudioContext.state !== "closed") {
          this.inputAudioContext.close();
        }
      } catch {}
      this.inputAudioContext = null;
    }

    this.callbacks.onConectionStateChange(ConnectionState.DISCONNECTED);
    this.callbacks.onAgentStateChange(AgentState.IDLE);
  }
}
