"use client";

import React, { useState } from "react";
import { useTranscribeStore } from "@/store/useTranscribeStore";
import { AVAILABLE_LANGUAGES, AVAILABLE_MODELS } from "@/lib/constants";
import { TranscriptionMode } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Check,
  Eye,
  EyeOff,
  Key,
  Languages,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";

export function SettingsDialog() {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    apiKey,
    setApiKey,
    selectedModel,
    setSelectedModel,
    selectedLanguage,
    setSelectedLanguage,
    transcriptionMode,
    setTranscriptionMode,
  } = useTranscribeStore();

  const [tempKey, setTempKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in-0 duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-950/95 p-6 shadow-2xl shadow-black/80 backdrop-blur-xl text-neutral-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <SlidersHorizontal className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Transcription Settings
              </h2>
              <p className="text-xs text-neutral-400">
                Configure Gemini Live API & audio recognition
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-5">
          {/* Gemini API Key */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
              <Key className="h-3.5 w-3.5 text-amber-400" />
              Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full h-10 px-3 pr-10 text-sm font-mono rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-100 placeholder:text-neutral-500 focus:border-blue-500 focus:outline-none transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="text-[11px] text-neutral-400">
              Stored safely in your browser. Get your key from{" "}
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:underline"
              >
                Google AI Studio
              </a>
              . Or set <code className="text-neutral-300">GEMINI_API_KEY</code> in <code className="text-neutral-300">.env.local</code>.
            </p>
          </div>

          {/* Model Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              Transcription Model
            </label>
            <div className="grid grid-cols-1 gap-2">
              {AVAILABLE_MODELS.map((model) => {
                const isSelected = selectedModel === model.id;
                return (
                  <div
                    key={model.id}
                    onClick={() => setSelectedModel(model.id)}
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
                            Requested
                          </span>
                        )}
                      </div>
                      {isSelected && <Check className="h-4 w-4 text-blue-400" />}
                    </div>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {model.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Language Selection */}
          <div className="space-y-2">
            <label className="flex items-center gap-1.5 text-xs font-medium text-neutral-300">
              <Languages className="h-3.5 w-3.5 text-emerald-400" />
              Spoken Language
            </label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="w-full h-10 px-3 text-sm rounded-lg border border-neutral-800 bg-neutral-900 text-neutral-100 focus:border-blue-500 focus:outline-none transition-colors"
            >
              {AVAILABLE_LANGUAGES.map((lang) => (
                <option key={lang.id} value={lang.code}>
                  {lang.flag} {lang.name} ({lang.region})
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selection */}
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
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    transcriptionMode === mode
                      ? "border-purple-500/60 bg-purple-950/20 text-white"
                      : "border-neutral-800 bg-neutral-900/40 text-neutral-400 hover:text-neutral-200"
                  }`}
                >
                  <div className="text-xs font-semibold">
                    {mode === "SMART" ? "Smart Format" : "Verbatim"}
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-0.5">
                    {mode === "SMART"
                      ? "Removes 'ums', auto-corrects"
                      : "Exact word-for-word"}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-800">
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
            className="bg-blue-600 hover:bg-blue-500 text-white"
          >
            {savedSuccess ? (
              <>
                <Check className="h-4 w-4 text-white" />
                Saved
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
