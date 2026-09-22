"use client";

import React, { useEffect, useRef } from "react";
import { useTtsStore } from "@/store/useTtsStore";
import { useTranscribeStore } from "@/store/useTranscribeStore";
import { AVAILABLE_TTS_MODELS, AVAILABLE_TTS_VOICES } from "@/lib/constants";
import { AudioPlayerItem } from "./AudioPlayerItem";
import { Button } from "@/components/ui/button";
import {
  AlertCircle,
  Headphones,
  Loader2,
  Mic,
  Music,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Volume2,
  Wand2,
} from "lucide-react";
import VoiseHistory from "./VoiseHistory";
import { Confetti, ConfettiRef } from "../ui/confetti";

export function TtsTool() {
  const confettiRef = useRef<ConfettiRef>(null);
  const {
    inputText,
    setInputText,
    selectedModel,

    selectedVoice,

    isGenerating,
    error,

    generateSpeech,
  } = useTtsStore();

  const { apiKey, setIsSettingsOpen } = useTranscribeStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const expressiveTags = [
    { tag: "[whispers]", label: "Whisper" },
    { tag: "[cheerfully]", label: "Cheerful" },
    { tag: "[excited]", label: "Excited" },
    { tag: "[calm]", label: "Calm" },
    { tag: "[dramatically]", label: "Dramatic" },
    { tag: "[seriously]", label: "Serious" },
  ];

  const sampleTtsPrompts = [
    "Welcome to Voise Transcribe! [cheerfully] Converting text to ultra-realistic speech has never been easier.",
    "[whispers] Here is a secret: Gemini 3.1 Flash TTS generates natural emotional cadence seamlessly.",
    "Good morning everyone! [excited] The new AI speech synthesis engine is officially ready to deploy.",
  ];

  const handleInsertTag = (tag: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      setInputText(`${inputText} ${tag} `);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const current = inputText;
    const updated =
      current.substring(0, start) + `${tag} ` + current.substring(end);
    setInputText(updated);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + tag.length + 1,
        start + tag.length + 1,
      );
    }, 0);
  };

  const handleGenerate = () => {
    if (!inputText.trim() || isGenerating) return;
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }
    generateSpeech(apiKey);
  };

  const currentModelObj = AVAILABLE_TTS_MODELS.find(
    (m) => m.id === selectedModel,
  );
  const currentVoiceObj = AVAILABLE_TTS_VOICES.find(
    (v) => v.id === selectedVoice,
  );

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      {/* Model & Voice Header Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs">
        <div className="flex items-center gap-2 flex-wrap">
          {/* Model Selector */}

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

          {/* Voice Selector */}

          <button
            onClick={() => setIsSettingsOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 hover:border-neutral-700 text-neutral-300 transition-all cursor-pointer"
            title="Click to switch language"
          >
            <Volume2 className="h-3 w-3 text-emerald-400" />
            <span>
              {currentVoiceObj?.gender} {currentVoiceObj?.name || "Auto"}
            </span>
          </button>
        </div>

        {/* Settings button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsSettingsOpen(true)}
          className="h-7 px-2.5 text-neutral-400 hover:text-black  rounded-full"
        >
          <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />
          Settings
        </Button>
      </div>

      {/* Main Text Input Box for TTS */}
      <div className="relative rounded-2xl border border-neutral-800 bg-neutral-950/80 backdrop-blur-xl shadow-2xl p-4 space-y-3">
        {/* Expressive tags toolbar */}
        <div className="flex items-center gap-1.5 flex-wrap pb-1 border-b border-neutral-800/60 text-[11px]">
          <span className="text-neutral-400 flex items-center gap-1 font-medium pr-1">
            <Wand2 className="h-3 w-3 text-amber-400" />
            Expressive Tags:
          </span>
          {expressiveTags.map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => handleInsertTag(item.tag)}
              title={`Insert ${item.tag} into text`}
              className="px-2 py-0.5 rounded-md border border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 hover:border-neutral-700 text-neutral-300 font-mono text-[10px] transition-colors"
            >
              {item.tag}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text to synthesize into speech. You can use natural language instructions or emotional tags like [cheerfully] or [whispers] to guide delivery..."
          className="w-full min-h-[120px] max-h-[260px] resize-y bg-transparent text-base text-neutral-100 placeholder:text-neutral-500 focus:outline-none leading-relaxed scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent"
          rows={4}
        />

        {/* Bottom Bar: Character count & Generate Button */}
        <div className="flex items-center justify-between pt-2 border-t border-neutral-800/60">
          <div className="text-xs text-neutral-400">
            <span>
              {inputText.trim().split(/\s+/).filter(Boolean).length} words
            </span>
            <span className="mx-2">•</span>
            <span>{inputText.length} characters</span>
          </div>

          <div className="flex items-center gap-2">
            {inputText.trim() && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setInputText("")}
                disabled={isGenerating}
                className="h-9 px-2.5 text-xs text-neutral-400 hover:text-red-400"
              >
                Clear
              </Button>
            )}

            <Button
              variant="default"
              size="default"
              onClick={handleGenerate}
              disabled={!inputText.trim() || isGenerating}
              className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:opacity-90 text-white shadow-lg shadow-blue-500/20 rounded-xl font-medium text-sm"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                  Generating Audio...
                </>
              ) : (
                <>
                  <Volume2 className="h-4 w-4 mr-1.5" />
                  Generate Speech
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Sample TTS Prompt Presets */}
      <div className="flex items-center gap-2 flex-wrap text-xs text-neutral-400">
        <span className="font-medium text-neutral-400">Try sample prompt:</span>
        {sampleTtsPrompts.map((prompt, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setInputText(prompt)}
            className="px-2.5 py-1 rounded-lg border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-800 hover:text-neutral-200 text-neutral-300 transition-all text-left"
          >
            &ldquo;{prompt.slice(0, 48)}...&rdquo;
          </button>
        ))}
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

      {/* Generated Speech Output List */}
      <VoiseHistory />
    </div>
  );
}
