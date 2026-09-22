import { cleanText } from "@/lib/utils";
import { DEFAULT_MODEL } from "@/lib/constants";
import { AudioService } from "@/service/AudioService";
import { AgentState, ConnectionState, TranscriptionMode } from "@/types";
import { create } from "zustand";

export interface HistoryItem {
  id: string;
  text: string;
  timestamp: number;
  model: string;
  language: string;
}

interface TranscribeState {
  // Connection & audio state
  connectionState: ConnectionState;
  agentState: AgentState;
  audioServiceInstance: AudioService | null;
  audioLevel: number;
  error: string | null;

  // Text state
  inputValue: string;
  interimText: string;

  // Configuration
  selectedModel: string;
  selectedLanguage: string;
  transcriptionMode: TranscriptionMode;
  apiKey: string;
  isSettingsOpen: boolean;

  // History
  history: HistoryItem[];

  // Actions
  setInputValue: (val: string) => void;
  clearInput: () => void;
  setSelectedModel: (model: string) => void;
  setSelectedLanguage: (code: string) => void;
  setTranscriptionMode: (mode: TranscriptionMode) => void;
  setApiKey: (key: string) => void;
  setIsSettingsOpen: (open: boolean) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => Promise<void>;
  cancelRecording: () => Promise<void>;
  deleteHistoryItem: (id: string) => void;
  clearHistory: () => void;
}

const STORAGE_API_KEY = "voise_gemini_api_key";
const STORAGE_HISTORY_KEY = "voise_history";

function getStoredApiKey(): string {
  if (typeof window === "undefined") return "";
  try {
    return localStorage.getItem(STORAGE_API_KEY) || "";
  } catch {
    return "";
  }
}

function getStoredHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export const useTranscribeStore = create<TranscribeState>((set, get) => ({
  connectionState: ConnectionState.DISCONNECTED,
  agentState: AgentState.IDLE,
  audioServiceInstance: null,
  audioLevel: 0,
  error: null,

  inputValue: "",
  interimText: "",

  selectedModel: DEFAULT_MODEL,
  selectedLanguage: "en-US",
  transcriptionMode: "SMART",
  apiKey: getStoredApiKey(),
  isSettingsOpen: false,

  history: getStoredHistory(),

  setInputValue: (val: string) => set({ inputValue: val }),
  clearInput: () => set({ inputValue: "", interimText: "" }),

  setSelectedModel: (selectedModel: string) => set({ selectedModel }),
  setSelectedLanguage: (selectedLanguage: string) => set({ selectedLanguage }),
  setTranscriptionMode: (transcriptionMode: TranscriptionMode) =>
    set({ transcriptionMode }),

  setApiKey: (apiKey: string) => {
    if (typeof window !== "undefined") {
      try {
        if (apiKey) {
          localStorage.setItem(STORAGE_API_KEY, apiKey);
        } else {
          localStorage.removeItem(STORAGE_API_KEY);
        }
      } catch {}
    }
    set({ apiKey, error: null });
  },

  setIsSettingsOpen: (isSettingsOpen: boolean) => set({ isSettingsOpen }),

  startRecording: async () => {
    const state = get();

    // Guard against simultaneous clicks
    if (
      state.connectionState === ConnectionState.CONNECTING ||
      state.connectionState === ConnectionState.CONNECTED
    ) {
      return;
    }

    if (typeof window === "undefined") return;

    set({
      connectionState: ConnectionState.CONNECTING,
      error: null,
      interimText: "",
    });

    try {
      // 1. Check microphone permission early
      await navigator.mediaDevices.getUserMedia({ audio: true });

      // 2. Resolve credentials (client stored key OR server minted token)
      let credential = state.apiKey.trim();

      if (!credential) {
        try {
          const res = await fetch("/api/token");
          const data = await res.json();
          if (data.token?.name) {
            credential = data.token.name;
          } else if (!data.hasServerKey) {
            // Need API key from user
            set({
              connectionState: ConnectionState.DISCONNECTED,
              error:
                "Please provide a Gemini API Key in Settings to start transcribing.",
              isSettingsOpen: true,
            });
            return;
          }
        } catch (fetchErr) {
          console.warn("Could not fetch server token:", fetchErr);
        }
      }

      if (!credential) {
        set({
          connectionState: ConnectionState.DISCONNECTED,
          error:
            "Gemini API Key is required. Please open Settings and enter your key.",
          isSettingsOpen: true,
        });
        return;
      }

      // 3. Initialize AudioService
      let service = state.audioServiceInstance;
      if (service) {
        service.disconnect();
      }

      service = new AudioService(
        {
          onConectionStateChange: (connState) => {
            set({ connectionState: connState });
          },
          onAgentStateChange: (agentState) => {
            set({ agentState });
          },
          onError: (errorMessage) => {
            set({
              error: errorMessage,
              connectionState: ConnectionState.ERROR,
              audioLevel: 0,
            });
          },
          onAudioLevel: (level) => {
            set({ audioLevel: level });
          },
          onTranscript: (sender, text, isPartial) => {
            const cleaned = cleanText(text);
            if (isPartial) {
              set({ interimText: cleaned });
            } else {
              // Final turn completed
              const currentInput = get().inputValue;
              const separator =
                currentInput && !currentInput.endsWith(" ") ? " " : "";
              const updatedInput = cleaned
                ? `${currentInput}${separator}${cleaned}`.trim()
                : currentInput;
              set({
                inputValue: updatedInput,
                interimText: "",
              });
            }
          },
        },
        credential,
      );

      set({ audioServiceInstance: service });

      // 4. Start session

      await service.startSession({
        model: state.selectedModel,
        languageCode: state.selectedLanguage,
        mode: state.transcriptionMode,
      });
    } catch (err: any) {
      console.error("Recording error:", err);
      set({
        error:
          err?.name === "NotAllowedError"
            ? "Microphone access was denied. Please allow microphone permissions in your browser."
            : err?.message || "Failed to initialize microphone or connection.",
        connectionState: ConnectionState.DISCONNECTED,
        agentState: AgentState.IDLE,
        audioLevel: 0,
      });
    }
  },

  stopRecording: async () => {
    const {
      audioServiceInstance,
      interimText,
      inputValue,
      selectedModel,
      selectedLanguage,
    } = get();

    if (audioServiceInstance) {
      audioServiceInstance.disconnect();
    }

    let finalInput = inputValue;
    if (interimText.trim()) {
      const separator = finalInput && !finalInput.endsWith(" ") ? " " : "";
      finalInput = `${finalInput}${separator}${interimText.trim()}`.trim();
    }

    // Save to history if we have content
    if (finalInput.trim()) {
      const newHistoryItem: HistoryItem = {
        id: window.crypto.randomUUID(),
        text: finalInput.trim(),
        timestamp: Date.now(),
        model: selectedModel,
        language: selectedLanguage,
      };

      set((s) => {
        const nextHistory = [newHistoryItem, ...s.history].slice(0, 50);
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(
              STORAGE_HISTORY_KEY,
              JSON.stringify(nextHistory),
            );
          } catch {}
        }
        return {
          inputValue: finalInput,
          interimText: "",
          audioLevel: 0,
          audioServiceInstance: null,
          connectionState: ConnectionState.DISCONNECTED,
          agentState: AgentState.IDLE,
          history: nextHistory,
        };
      });
    } else {
      set({
        interimText: "",
        audioLevel: 0,
        audioServiceInstance: null,
        connectionState: ConnectionState.DISCONNECTED,
        agentState: AgentState.IDLE,
      });
    }
  },

  cancelRecording: async () => {
    const { audioServiceInstance } = get();
    if (audioServiceInstance) {
      audioServiceInstance.disconnect();
    }

    set({
      interimText: "",
      audioLevel: 0,
      audioServiceInstance: null,
      connectionState: ConnectionState.DISCONNECTED,
      agentState: AgentState.IDLE,
    });
  },

  deleteHistoryItem: (id: string) => {
    set((state) => {
      const nextHistory = state.history.filter((h) => h.id !== id);
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(
            STORAGE_HISTORY_KEY,
            JSON.stringify(nextHistory),
          );
        } catch {}
      }
      return { history: nextHistory };
    });
  },

  clearHistory: () => {
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_HISTORY_KEY);
      } catch {}
    }
    set({ history: [] });
  },
}));
