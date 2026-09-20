import { LanguageOption, ModelOption } from "@/types";

export const DEFAULT_MODEL = "gemini-3.5-transcribe-live";
export const INPUT_SAMPLE_RATE = 16000;

export const AVAILABLE_MODELS: ModelOption[] = [
  {
    id: "gemini-3.5-transcribe-live",
    name: "Gemini 3.5 Transcribe Live",
    description: "Sub-second streaming Live API audio transcription model",
    recommended: true,
  },
];

// Text-to-Speech (TTS) Models
export const DEFAULT_TTS_MODEL = "gemini-3.1-flash-tts-preview";

export const AVAILABLE_TTS_MODELS: ModelOption[] = [
  {
    id: "gemini-3.1-flash-tts-preview",
    name: "Gemini 3.1 Flash TTS",
    description:
      "Latest advanced speech generation model with expressive styling tags & natural tone",
    recommended: true,
  },
  {
    id: "gemini-2.5-flash-preview-tts",
    name: "Gemini 2.5 Flash TTS",
    description: "High-efficiency, low-latency speech synthesis engine",
  },
  {
    id: "gemini-2.5-pro-preview-tts",
    name: "Gemini 2.5 Pro TTS",
    description:
      "High-fidelity audio synthesis designed for long-form and expressive narratives",
  },
];

export interface TtsVoiceOption {
  id: string;
  name: string;
  gender: "Female" | "Male" | "Neutral";
  description: string;
}

export const DEFAULT_TTS_VOICE = "Kore";

export const AVAILABLE_TTS_VOICES: TtsVoiceOption[] = [
  {
    id: "Kore",
    name: "Kore",
    gender: "Female",
    description: "Firm, clear, professional tone",
  },
  {
    id: "Puck",
    name: "Puck",
    gender: "Male",
    description: "Upbeat, lively, energetic delivery",
  },
  {
    id: "Charon",
    name: "Charon",
    gender: "Male",
    description: "Informative, deep, calm narration",
  },
  {
    id: "Aoede",
    name: "Aoede",
    gender: "Female",
    description: "Confident, articulate, expressive",
  },
  {
    id: "Fenrir",
    name: "Fenrir",
    gender: "Male",
    description: "Excitable, punchy, dynamic",
  },
  {
    id: "Zephyr",
    name: "Zephyr",
    gender: "Neutral",
    description: "Smooth, gentle, soothing",
  },
  {
    id: "Leda",
    name: "Leda",
    gender: "Female",
    description: "Warm, conversational, approachable",
  },
  {
    id: "Orus",
    name: "Orus",
    gender: "Male",
    description: "Crisp, authoritative broadcast style",
  },
  {
    id: "Enceladus",
    name: "Enceladus",
    gender: "Male",
    description: "Resonant, story-teller voice",
  },
  {
    id: "Despina",
    name: "Despina",
    gender: "Female",
    description: "Friendly, casual, modern",
  },
];

export const AVAILABLE_LANGUAGES: LanguageOption[] = [
  {
    id: "auto",
    name: "Auto Detect",
    region: "All supported (85+)",
    code: "",
    flag: "🌐",
  },
  {
    id: "en-US",
    name: "English",
    region: "United States",
    code: "en-US",
    flag: "🇺🇸",
  },
  {
    id: "en-GB",
    name: "English",
    region: "United Kingdom",
    code: "en-GB",
    flag: "🇬🇧",
  },
  { id: "hi-IN", name: "Hindi", region: "India", code: "hi-IN", flag: "🇮🇳" },
  {
    id: "mr-IN",
    name: "Marathi",
    region: "India (Maharashtra)",
    code: "mr-IN",
    flag: "🇮🇳",
  },
  { id: "es-ES", name: "Spanish", region: "Spain", code: "es-ES", flag: "🇪🇸" },
  { id: "es-MX", name: "Spanish", region: "Mexico", code: "es-MX", flag: "🇲🇽" },
  { id: "fr-FR", name: "French", region: "France", code: "fr-FR", flag: "🇫🇷" },
  { id: "de-DE", name: "German", region: "Germany", code: "de-DE", flag: "🇩🇪" },
  { id: "ja-JP", name: "Japanese", region: "Japan", code: "ja-JP", flag: "🇯🇵" },
  {
    id: "ko-KR",
    name: "Korean",
    region: "South Korea",
    code: "ko-KR",
    flag: "🇰🇷",
  },
  {
    id: "zh-CN",
    name: "Chinese",
    region: "China (Mandarin)",
    code: "zh-CN",
    flag: "🇨🇳",
  },
  {
    id: "pt-BR",
    name: "Portuguese",
    region: "Brazil",
    code: "pt-BR",
    flag: "🇧🇷",
  },
  { id: "it-IT", name: "Italian", region: "Italy", code: "it-IT", flag: "🇮🇹" },
  { id: "ru-RU", name: "Russian", region: "Russia", code: "ru-RU", flag: "🇷🇺" },
  {
    id: "ar-SA",
    name: "Arabic",
    region: "Saudi Arabia",
    code: "ar-SA",
    flag: "🇸🇦",
  },
];
