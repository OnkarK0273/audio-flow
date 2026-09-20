import { base64PcmToWavBlob } from "@/lib/audioUtils";
import { DEFAULT_TTS_MODEL, DEFAULT_TTS_VOICE } from "@/lib/constants";
import { create } from "zustand";

export interface GeneratedAudioItem {
  id: string;
  text: string;
  audioUrl: string;
  base64Pcm: string;
  sampleRate: number;
  model: string;
  voice: string;
  timestamp: number;
  duration?: number;
}

interface StoredAudioMeta {
  id: string;
  text: string;
  base64Pcm: string;
  sampleRate: number;
  model: string;
  voice: string;
  timestamp: number;
}

interface TtsState {
  inputText: string;
  selectedModel: string;
  selectedVoice: string;
  isGenerating: boolean;
  error: string | null;
  generatedAudios: GeneratedAudioItem[];
  activePlayingId: string | null;

  setInputText: (text: string) => void;
  setSelectedModel: (model: string) => void;
  setSelectedVoice: (voice: string) => void;
  setActivePlayingId: (id: string | null) => void;
  generateSpeech: (clientApiKey?: string) => Promise<void>;
  deleteAudio: (id: string) => void;
  clearAllAudios: () => void;
}

const STORAGE_TTS_KEY = "voise_tts_audios";

function loadStoredAudios(): GeneratedAudioItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_TTS_KEY);
    if (!raw) return [];
    const metaList: StoredAudioMeta[] = JSON.parse(raw);
    return metaList.map((meta) => {
      const blob = base64PcmToWavBlob(meta.base64Pcm, meta.sampleRate || 24000);
      return {
        ...meta,
        audioUrl: URL.createObjectURL(blob),
      };
    });
  } catch {
    return [];
  }
}

function persistAudios(items: GeneratedAudioItem[]) {
  if (typeof window === "undefined") return;
  try {
    const metaList: StoredAudioMeta[] = items.slice(0, 25).map((item) => ({
      id: item.id,
      text: item.text,
      base64Pcm: item.base64Pcm,
      sampleRate: item.sampleRate,
      model: item.model,
      voice: item.voice,
      timestamp: item.timestamp,
    }));
    localStorage.setItem(STORAGE_TTS_KEY, JSON.stringify(metaList));
  } catch {}
}

export const useTtsStore = create<TtsState>((set, get) => ({
  inputText: "",
  selectedModel: DEFAULT_TTS_MODEL,
  selectedVoice: DEFAULT_TTS_VOICE,
  isGenerating: false,
  error: null,
  generatedAudios: loadStoredAudios(),
  activePlayingId: null,

  setInputText: (inputText) => set({ inputText }),
  setSelectedModel: (selectedModel) => set({ selectedModel }),
  setSelectedVoice: (selectedVoice) => set({ selectedVoice }),
  setActivePlayingId: (activePlayingId) => set({ activePlayingId }),

  generateSpeech: async (clientApiKey?: string) => {
    const { inputText, selectedModel, selectedVoice, isGenerating } = get();

    if (!inputText.trim() || isGenerating) return;

    set({ isGenerating: true, error: null });

    try {
      const res = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText.trim(),
          model: selectedModel,
          voiceName: selectedVoice,
          clientApiKey: clientApiKey || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate speech");
      }

      const sampleRate = data.sampleRate || 24000;
      const wavBlob = base64PcmToWavBlob(data.audioBase64, sampleRate);
      const audioUrl = URL.createObjectURL(wavBlob);

      const newItem: GeneratedAudioItem = {
        id: window.crypto.randomUUID(),
        text: inputText.trim(),
        audioUrl,
        base64Pcm: data.audioBase64,
        sampleRate,
        model: selectedModel,
        voice: selectedVoice,
        timestamp: Date.now(),
      };

      const updatedList = [newItem, ...get().generatedAudios];
      persistAudios(updatedList);

      set({
        generatedAudios: updatedList,
        isGenerating: false,
        error: null,
        activePlayingId: newItem.id,
      });
    } catch (err: any) {
      console.error("TTS generation error:", err);
      set({
        error: err?.message || "Failed to generate speech audio.",
        isGenerating: false,
      });
    }
  },

  deleteAudio: (id: string) => {
    const list = get().generatedAudios;
    const target = list.find((i) => i.id === id);
    if (target?.audioUrl) {
      try {
        URL.revokeObjectURL(target.audioUrl);
      } catch {}
    }
    const updated = list.filter((i) => i.id !== id);
    persistAudios(updated);
    set({
      generatedAudios: updated,
      activePlayingId: get().activePlayingId === id ? null : get().activePlayingId,
    });
  },

  clearAllAudios: () => {
    get().generatedAudios.forEach((item) => {
      try {
        URL.revokeObjectURL(item.audioUrl);
      } catch {}
    });
    if (typeof window !== "undefined") {
      try {
        localStorage.removeItem(STORAGE_TTS_KEY);
      } catch {}
    }
    set({ generatedAudios: [], activePlayingId: null });
  },
}));
