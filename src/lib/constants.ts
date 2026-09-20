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
