import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, model, voiceName, clientApiKey } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Text prompt is required for speech generation." },
        { status: 400 },
      );
    }

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Gemini API key is required. Please provide an API key in Settings or configure GEMINI_API_KEY in .env.",
        },
        { status: 401 },
      );
    }

    const selectedModel = model || "gemini-3.1-flash-tts-preview";
    const selectedVoice = voiceName || "Kore";

    const ai = new GoogleGenAI({ apiKey });

    // Request audio generation with speech configuration
    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: text.trim(),
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: {
              voiceName: selectedVoice,
            },
          },
        },
      },
    });

    const candidates = response.candidates;
    if (!candidates || candidates.length === 0) {
      return NextResponse.json(
        { error: "Model returned no speech output candidates." },
        { status: 502 },
      );
    }

    const parts = candidates[0].content?.parts || [];
    let audioData: string | null = null;
    let mimeType = "audio/pcm;rate=24000";

    for (const part of parts) {
      if (part.inlineData?.data) {
        audioData = part.inlineData.data;
        if (part.inlineData.mimeType) {
          mimeType = part.inlineData.mimeType;
        }
        break;
      }
    }

    if (!audioData) {
      return NextResponse.json(
        { error: "No audio data received in the model response." },
        { status: 502 },
      );
    }

    // Extract sample rate from mimeType if specified (e.g. "audio/pcm;rate=24000")
    let sampleRate = 24000;
    const rateMatch = mimeType.match(/rate=(\d+)/i);
    if (rateMatch && rateMatch[1]) {
      sampleRate = parseInt(rateMatch[1], 10);
    }

    return NextResponse.json({
      audioBase64: audioData,
      mimeType,
      sampleRate,
      model: selectedModel,
      voice: selectedVoice,
    });
  } catch (error: any) {
    console.error("Gemini TTS API Error:", error);
    return NextResponse.json(
      {
        error:
          error?.message ||
          "Failed to generate speech with the requested model. Please verify your API key and model availability.",
      },
      { status: 500 },
    );
  }
}
