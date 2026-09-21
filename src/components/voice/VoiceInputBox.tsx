"use client";

import React, { useRef, useEffect, useState } from "react";
import { useTranscribeStore } from "@/store/useTranscribeStore";
import { ConnectionState, AgentState } from "@/types";
import { AVAILABLE_LANGUAGES, AVAILABLE_MODELS } from "@/lib/constants";
import { AudioWaveform } from "./AudioWaveform";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  ArrowUp,
  Check,
  Copy,
  Languages,
  Loader2,
  Mic,
  MicOff,
  SlidersHorizontal,
  Sparkles,
  Square,
  Trash2,
  Volume2,
  X,
} from "lucide-react";

export function VoiceInputBox() {
  const {
    connectionState,
    agentState,
    audioLevel,
    error,
    inputValue,
    interimText,
    selectedModel,
    selectedLanguage,
    transcriptionMode,
    setInputValue,
    clearInput,
    startRecording,
    stopRecording,
    cancelRecording,
    setIsSettingsOpen,
  } = useTranscribeStore();

  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isRecording = connectionState === ConnectionState.CONNECTED;
  const isConnecting = connectionState === ConnectionState.CONNECTING;

  // Auto-resize textarea as text grows
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(
        260,
        Math.max(100, textareaRef.current.scrollHeight),
      )}px`;
    }
  }, [inputValue, interimText]);

  // Handle Voice Button Click (ChatGPT / Gemini style toggle)
  const handleVoiceToggle = () => {
    if (isRecording) {
      stopRecording();
    } else if (!isConnecting) {
      startRecording();
    }
  };

  const handleCopy = () => {
    const textToCopy = inputValue + (interimText ? ` ${interimText}` : "");
    if (!textToCopy.trim()) return;
    navigator.clipboard.writeText(textToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleSend = () => {
    if (isRecording) {
      stopRecording();
    } else if (inputValue.trim()) {
      // Formally triggers stop / save to history
      stopRecording();
    }
  };

  // Find model & language display names
  const currentModelObj = AVAILABLE_MODELS.find((m) => m.id === selectedModel);
  const currentLangObj = AVAILABLE_LANGUAGES.find(
    (l) => l.code === selectedLanguage,
  );

  // Compute live combined display text
  const displayText = inputValue;
  const wordCount = (inputValue + (interimText ? ` ${interimText}` : ""))
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const charCount = (inputValue + (interimText ? ` ${interimText}` : ""))
    .length;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-3">
      {/* Configuration Header Badges */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Model Badge */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 text-neutral-300 transition-all cursor-pointer"
            title="Click to switch model"
          >
            <Sparkles className="h-3.5 w-3.5 text-blue-400 group-hover:text-blue-300" />
            <span className="font-medium text-neutral-200">
              {currentModelObj?.name || selectedModel}
            </span>
          </button>

          {/* Language Badge */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 text-neutral-300 transition-all cursor-pointer"
            title="Click to switch language"
          >
            <Languages className="h-3 w-3 text-emerald-400" />
            <span>
              {currentLangObj?.flag} {currentLangObj?.name || "Auto"}
            </span>
          </button>

          {/* Mode Badge */}
          <span className="px-2 py-1 rounded-full border border-neutral-800/80 bg-neutral-900/40 text-neutral-400 text-[11px]">
            {transcriptionMode === "SMART" ? "✨ Smart Mode" : "Verbatim"}
          </span>
        </div>

        {/* Settings button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="h-7 px-2.5 text-neutral-400  hover:text-black rounded-full"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
          Settings
        </Button>
      </div>

      {/* Main Input Box Container */}
      <div
        className={`relative rounded-2xl border transition-all duration-300 bg-neutral-950/80 backdrop-blur-xl shadow-2xl ${
          isRecording
            ? "border-red-500/50 shadow-red-500/10 ring-2 ring-red-500/20"
            : isConnecting
              ? "border-blue-500/50 ring-2 ring-blue-500/20 shadow-blue-500/10"
              : "border-neutral-800 hover:border-neutral-700/80 focus-within:border-neutral-600 shadow-black/40"
        }`}
      >
        {/* Textarea for Transcribed & Typed Text */}
        <div className="relative p-4 pb-14 min-h-[140px]">
          <textarea
            ref={textareaRef}
            value={displayText}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={
              isRecording
                ? "Listening... Speak naturally in your microphone..."
                : "Type here or tap the microphone button to dictate in real-time..."
            }
            className="w-full resize-none bg-transparent text-base md:text-lg text-neutral-100 placeholder:text-neutral-500 focus:outline-none leading-relaxed transition-all"
            rows={3}
          />

          {/* Live Interim Ghost Transcription (Streaming in real-time) */}
          {interimText && (
            <div className="mt-1 flex items-start gap-1.5 text-blue-400/90 text-base md:text-lg italic animate-pulse">
              <span className="inline-block w-1.5 h-4 mt-1 rounded-sm bg-blue-400 animate-ping" />
              <span>{interimText}</span>
            </div>
          )}

          {/* Status Overlay while Connecting */}
          {isConnecting && (
            <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs animate-pulse">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Connecting to Gemini Live...
            </div>
          )}
        </div>

        {/* Bottom Control Bar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-auto">
          {/* Left: Waveform or Word counts */}
          <div className="flex items-center gap-2">
            {isRecording ? (
              <div className="flex items-center gap-2">
                <AudioWaveform
                  isRecording={isRecording}
                  audioLevel={audioLevel}
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={cancelRecording}
                  title="Cancel and discard voice input"
                  className="h-7 w-7 text-neutral-400 hover:text-red-400 hover:bg-neutral-800 rounded-full"
                >
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-3 text-xs text-neutral-400 pl-1">
                <span>{wordCount} words</span>
                <span>•</span>
                <span>{charCount} chars</span>
              </div>
            )}
          </div>

          {/* Right: Action Buttons & Live Mic Button */}
          <div className="flex items-center gap-2">
            {/* Copy Button */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={handleCopy}
              disabled={!displayText.trim() && !interimText.trim()}
              title="Copy to clipboard"
              className="h-8 w-8 text-neutral-400 hover:text-white rounded-full"
            >
              {copied ? (
                <Check className="h-4 w-4 text-emerald-400" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>

            {/* Clear Button */}
            {displayText.trim() && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={clearInput}
                title="Clear input"
                className="h-8 w-8 text-neutral-400 hover:text-red-400 rounded-full"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            {/* THE LIVE VOICE BUTTON (Gemini / ChatGPT Style) */}
            <button
              type="button"
              onClick={handleVoiceToggle}
              disabled={isConnecting}
              aria-label={
                isRecording ? "Stop recording" : "Start voice recording"
              }
              className={`relative flex items-center justify-center h-10 px-3.5 rounded-full font-medium text-sm transition-all duration-300 cursor-pointer shadow-lg active:scale-95 ${
                isRecording
                  ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/30 ring-4 ring-red-500/20"
                  : isConnecting
                    ? "bg-blue-600/80 text-white opacity-80 cursor-wait"
                    : "bg-white hover:bg-neutral-200 text-neutral-900 dark:bg-neutral-100 dark:hover:bg-white dark:text-neutral-950 shadow-white/10"
              }`}
            >
              {isRecording ? (
                <div className="flex items-center gap-2">
                  <Square className="h-4 w-4 fill-white text-white animate-pulse" />
                  <span className="text-xs font-semibold tracking-wide uppercase">
                    Stop
                  </span>
                </div>
              ) : isConnecting ? (
                <Loader2 className="h-4 w-4 animate-spin text-white" />
              ) : (
                <div className="flex items-center gap-1.5">
                  <Mic className="h-4 w-4 text-neutral-900" />
                  <span className="hidden sm:inline text-xs font-semibold">
                    Dictate
                  </span>
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Error Alert Bar */}
      {error && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-200 text-xs backdrop-blur-md animate-in fade-in-0 duration-200">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSettingsOpen(true)}
            className="h-6 px-2 text-xs text-red-300 hover:text-white hover:bg-red-900/40 ml-2"
          >
            Open Settings
          </Button>
        </div>
      )}
    </div>
  );
}
