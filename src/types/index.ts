export enum ConnectionState {
  DISCONNECTED = "disconnected",
  CONNECTING = "connecting",
  CONNECTED = "connected",
  ERROR = "error",
}

export enum AgentState {
  IDLE = "idle",
  LISTENING = "listening",
  TRANSCRIBING = "transcribing",
  ERROR = "error",
}

export type TranscriptionMode = "SMART" | "VERBATIM";

export interface TranscriptItem {
  id: string;
  sender: "user" | "model";
  text: string;
  isPartial: boolean;
  timestamp: number;
}

export interface ConnectConfig {
  model?: string;
  languageCode?: string;
  mode?: TranscriptionMode;
  apiKey?: string;
}

export interface LiveManagerCallbacks {
  onConectionStateChange: (state: ConnectionState) => void;
  onAgentStateChange: (state: AgentState) => void;
  onError: (error: string) => void;
  onAudioLevel?: (level: number) => void;
  onTranscript: (sender: "user" | "model", text: string, isPartial: boolean) => void;
}

export interface LanguageOption {
  id: string;
  name: string;
  region: string;
  code: string;
  flag?: string;
}

export interface ModelOption {
  id: string;
  name: string;
  description: string;
  recommended?: boolean;
}
