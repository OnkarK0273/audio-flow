"use client";

import React, { useEffect, useState } from "react";
import { useTranscribeStore } from "@/store/useTranscribeStore";
import { useTtsStore } from "@/store/useTtsStore";
import {
  AVAILABLE_LANGUAGES,
  AVAILABLE_MODELS,
  AVAILABLE_TTS_MODELS,
  AVAILABLE_TTS_VOICES,
} from "@/lib/constants";
import { TranscriptionMode } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  EyeOff,
  Key,
  Languages,
  Mic,
  SlidersHorizontal,
  Sparkles,
  User,
  Volume2,
  Wand2,
  X,
} from "lucide-react";

interface SettingsDialogProps {
  activeTool?: "stt" | "tts";
}

export function SettingsDialog({ activeTool = "stt" }: SettingsDialogProps) {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    apiKey,
    setApiKey,
    selectedModel: sttModel,
    setSelectedModel: setSttModel,
    selectedLanguage,
    setSelectedLanguage,
    transcriptionMode,
    setTranscriptionMode,
  } = useTranscribeStore();

  const {
    selectedModel: ttsModel,
    setSelectedModel: setTtsModel,
    selectedVoice,
    setSelectedVoice,
  } = useTtsStore();

  const [dialogTab, setDialogTab] = useState<"stt" | "tts">(activeTool);
  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync dialog tab with current tool whenever dialog is opened
  useEffect(() => {
    if (isSettingsOpen) {
      setDialogTab(activeTool);
      setTempKey(apiKey);
    }
  }, [isSettingsOpen, activeTool, apiKey]);

  if (!isSettingsOpen) return null;

  const handleSave = () => {
    setApiKey(tempKey.trim());
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        className="relative w-full max-w-xl max-h-[90vh] flex flex-col rounded-2xl border border-neutral-800 bg-neutral-950/95 shadow-2xl shadow-black/80 backdrop-blur-xl text-neutral-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 pb-4 border-b border-neutral-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white">
                Application Settings
              </h2>
              <p className="text-xs text-neutral-400">
                Configure credentials and model preferences for STT & TTS
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content Area */}
        <div className="p-5 overflow-y-auto space-y-6 flex-1">
          {/* Shared Gemini API Key Section */}
          <div className="p-3.5 rounded-xl border border-neutral-800/90 bg-neutral-900/40 space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-200">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                Gemini API Key (Shared)
              </label>
              <span className="text-[10px] text-neutral-400 font-mono">
                Powers both STT & TTS
              </span>
            </div>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-9 px-3 pr-10 text-sm font-mono rounded-lg border border-neutral-800 bg-neutral-950 text-neutral-100 placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white cursor-pointer"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400 leading-normal">
              Stored safely in your browser. Get your key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline font-medium"
              >
                Google AI Studio
              </a>
              , or specify <code className="text-neutral-300">GEMINI_API_KEY</code> in <code className="text-neutral-300">.env</code>.
            </p>
          </div>

          {/* Tool-Specific Settings Tabs */}
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-1 border-b border-neutral-800/80">
              <div className="flex items-center gap-1 p-1 rounded-xl bg-neutral-900 border border-neutral-800 text-xs">
                <button
                  type="button"
                  onClick={() => setDialogTab("stt")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    dialogTab === "stt"
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Mic className="h-3.5 w-3.5" />
                  Voice to Text (STT)
                </button>
                <button
                  type="button"
                  onClick={() => setDialogTab("tts")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                    dialogTab === "tts"
                      ? "bg-purple-600 text-white shadow-sm"
                      : "text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <Volume2 className="h-3.5 w-3.5" />
                  Text to Speech (TTS)
                </button>
              </div>
              <span className="text-[11px] text-neutral-400">
                {dialogTab === "stt" ? "STT Parameters" : "TTS Parameters"}
              </span>
            </div>

            {/* TAB 1: Voice to Text (STT) Settings */}
            {dialogTab === "stt" && (
              <div className="space-y-4 animate-in fade-in-0 duration-150">
                {/* STT Model Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                    <Sparkles className="h-3.5 w-3.5 text-blue-400" />
                    Transcription Model
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {AVAILABLE_MODELS.map((model) => {
                      const isSelected = sttModel === model.id;
                      return (
                        <div
                          key={model.id}
                          onClick={() => setSttModel(model.id)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all ${
                            isSelected
                              ? "border-blue-500/60 bg-blue-950/20 shadow-sm shadow-blue-500/10"
                              : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-neutral-200">
                                {model.name}
                              </span>
                              {model.recommended && (
                                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                                  Default
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-blue-400" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {model.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Spoken Language */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                    <Languages className="h-3.5 w-3.5 text-emerald-400" />
                    Spoken Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    className="w-full h-10 px-3 text-sm rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-100 focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                  >
                    {AVAILABLE_LANGUAGES.map((lang) => (
                      <option key={lang.id} value={lang.code} className="bg-neutral-900">
                        {lang.flag} {lang.name} ({lang.region})
                      </option>
                    ))}
                  </select>
                </div>

                {/* STT Formatting Mode */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-neutral-300">
                    Formatting Mode
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(["SMART", "VERBATIM"] as TranscriptionMode[]).map((mode) => (
                      <button
                        key={mode}
                        type="button"
                        onClick={() => setTranscriptionMode(mode)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                          transcriptionMode === mode
                            ? "border-blue-500/60 bg-blue-950/20 text-white"
                            : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200"
                        }`}
                      >
                        <div className="text-xs font-semibold">
                          {mode === "SMART" ? "Smart Format" : "Verbatim"}
                        </div>
                        <div className="text-[11px] text-neutral-400 mt-0.5">
                          {mode === "SMART"
                            ? "Removes filler words & auto-corrects"
                            : "Exact word-for-word transcript"}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Text to Speech (TTS) Settings */}
            {dialogTab === "tts" && (
              <div className="space-y-4 animate-in fade-in-0 duration-150">
                {/* TTS Model Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                    <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                    Speech Generation Model
                  </label>
                  <div className="grid grid-cols-1 gap-2">
                    {AVAILABLE_TTS_MODELS.map((model) => {
                      const isSelected = ttsModel === model.id;
                      return (
                        <div
                          key={model.id}
                          onClick={() => setTtsModel(model.id)}
                          className={`cursor-pointer p-3 rounded-xl border transition-all ${
                            isSelected
                              ? "border-purple-500/60 bg-purple-950/20 shadow-sm shadow-purple-500/10"
                              : "border-neutral-800 bg-neutral-900/40 hover:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-neutral-200">
                                {model.name}
                              </span>
                              {model.recommended && (
                                <span className="text-[10px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  Recommended
                                </span>
                              )}
                            </div>
                            {isSelected && (
                              <Check className="h-4 w-4 text-purple-400" />
                            )}
                          </div>
                          <p className="text-xs text-neutral-400 mt-0.5">
                            {model.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Prebuilt Voice Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
                    <User className="h-3.5 w-3.5 text-pink-400" />
                    Default Voice Persona
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {AVAILABLE_TTS_VOICES.map((voice) => {
                      const isSelected = selectedVoice === voice.id;
                      return (
                        <button
                          key={voice.id}
                          type="button"
                          onClick={() => setSelectedVoice(voice.id)}
                          className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                            isSelected
                              ? "border-purple-500/70 bg-purple-950/30 text-white shadow-sm"
                              : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200 hover:border-neutral-700"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-neutral-200">
                              {voice.name}
                            </span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300">
                              {voice.gender}
                            </span>
                          </div>
                          <p className="text-[11px] text-neutral-400 mt-1 line-clamp-1">
                            {voice.description}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-neutral-800/80 bg-neutral-900/30 text-xs text-neutral-400 flex items-start gap-2">
                  <Wand2 className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <p>
                    Gemini TTS models act as voice performers! You can use emotional style tags like <code className="text-neutral-200">[whispers]</code> or <code className="text-neutral-200">[cheerfully]</code> in your text to guide delivery.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-neutral-800 shrink-0 bg-neutral-950">
          <span className="text-xs text-neutral-400">
            {dialogTab === "stt" ? "Configuring Voice to Text" : "Configuring Text to Speech"}
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSettingsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-95 text-white"
            >
              {savedSuccess ? (
                <>
                  <Check className="h-4 w-4 text-white mr-1.5" />
                  Saved!
                </>
              ) : (
                "Save Preferences"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
