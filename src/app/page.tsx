"use client";

import React from "react";
import { VoiceInputBox } from "@/components/voice/VoiceInputBox";
import { SettingsDialog } from "@/components/voice/SettingsDialog";
import { TranscriptionHistory } from "@/components/voice/TranscriptionHistory";
import { useTranscribeStore } from "@/store/useTranscribeStore";
import { Button } from "@/components/ui/button";
import {
  Activity,
  Cpu,
  Headphones,
  Mic,
  Radio,
  SlidersHorizontal,
  Sparkles,
  Zap,
} from "lucide-react";

export default function Home() {
  const { setIsSettingsOpen, selectedModel, setInputValue } =
    useTranscribeStore();

  const samplePrompts = [
    "Draft a quick summary of the product roadmap review meeting",
    "Send an update to the engineering team about the WebSocket integration",
    "List three key advantages of real-time streaming audio transcription",
  ];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decorative Mesh & Glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 -left-40 w-[450px] h-[450px] bg-purple-600/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 -right-40 w-[500px] h-[450px] bg-rose-600/10 blur-[140px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f0a_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f0a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center h-9 w-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 shadow-md shadow-blue-500/20 text-white">
                <Mic className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base tracking-tight text-white">
                    AudioScribe
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Live API
                  </span>
                </div>
              </div>
            </div>

            {/* Header Right Actions */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border border-neutral-800 bg-neutral-900/60 text-xs text-neutral-300">
                <Cpu className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-mono text-[11px] text-neutral-200">
                  {selectedModel}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsSettingsOpen(true)}
                className="rounded-full border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
                Config
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-10 space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-3 pt-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium backdrop-blur-md shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Next-Gen Speech-to-Text Input Experience
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
              Real-time Voice Dictation in Your{" "}
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
                Input Box
              </span>
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
              Tap the microphone to convert speech to text dynamically as you
              talk, powered by Gemini Live WebSocket streaming and AudioWorklet.
            </p>
          </div>

          {/* Core Voice Input Box */}
          <div className="space-y-4">
            <VoiceInputBox />

            {/* Sample Prompts */}
            <div className="max-w-3xl mx-auto flex items-center gap-2 flex-wrap text-xs text-neutral-400">
              <span className="text-neutral-400 font-medium">
                Try speaking:
              </span>
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputValue(prompt)}
                  className="px-2.5 py-1 rounded-lg border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-800 hover:text-neutral-200 text-neutral-300 transition-all text-left"
                >
                  &ldquo;{prompt}&rdquo;
                </button>
              ))}
            </div>
          </div>

          {/* Features Highlights Grid */}
          {/* <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 max-w-3xl mx-auto">
            <div className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 backdrop-blur-sm space-y-1.5">
              <div className="flex items-center gap-2 text-blue-400">
                <Radio className="h-4 w-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Live Audio Streaming
                </h4>
              </div>
              <p className="text-xs text-neutral-400">
                Raw 16kHz mono PCM frames streaming via AudioWorklet for low latency.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 backdrop-blur-sm space-y-1.5">
              <div className="flex items-center gap-2 text-indigo-400">
                <Zap className="h-4 w-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Gemini 3.5 Transcribe
                </h4>
              </div>
              <p className="text-xs text-neutral-400">
                Uses Google&apos;s speech recognition model with smart disfluency removal.
              </p>
            </div>

            <div className="p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/30 backdrop-blur-sm space-y-1.5">
              <div className="flex items-center gap-2 text-purple-400">
                <Activity className="h-4 w-4" />
                <h4 className="text-xs font-semibold uppercase tracking-wider">
                  Reactive Waveform
                </h4>
              </div>
              <p className="text-xs text-neutral-400">
                Real-time RMS volume audio wave bars mirroring ChatGPT and Gemini UI.
              </p>
            </div>
          </div> */}

          {/* Transcription History Section */}
          <div className="max-w-3xl mx-auto pt-6 border-t border-neutral-800/80">
            <TranscriptionHistory />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-400">
          <p>
            Built with Next.js App Router, @google/genai Live API, Zustand, and
            Shadcn UI.
          </p>
        </footer>
      </div>

      {/* Global Settings Dialog */}
      <SettingsDialog />
    </div>
  );
}
