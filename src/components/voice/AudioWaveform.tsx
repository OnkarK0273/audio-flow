"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface AudioWaveformProps {
  isRecording: boolean;
  audioLevel: number; // 0 to 100
  className?: string;
}

export function AudioWaveform({
  isRecording,
  audioLevel,
  className,
}: AudioWaveformProps) {
  const [bars, setBars] = useState<number[]>(new Array(24).fill(4));
  const [duration, setDuration] = useState(0);

  // Timer while recording
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRecording) {
      setDuration(0);
      interval = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRecording]);

  // Reactive wave bar animation
  useEffect(() => {
    if (!isRecording) {
      setBars(new Array(24).fill(4));
      return;
    }

    // Generate bar heights dynamically centered around the audio level
    const baseHeight = Math.max(6, (audioLevel / 100) * 36);
    const newBars = Array.from({ length: 24 }, (_, i) => {
      // Bell curve factor
      const distFromCenter = Math.abs(i - 11.5) / 12;
      const bell = Math.cos(distFromCenter * (Math.PI / 2));
      const jitter = (Math.random() - 0.5) * 10;
      const h = Math.max(4, Math.min(40, baseHeight * bell + jitter));
      return Math.round(h);
    });

    setBars(newBars);
  }, [isRecording, audioLevel]);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className={cn(
        "flex items-center gap-3 px-3 py-1.5 rounded-full bg-neutral-900/80 border border-neutral-800 backdrop-blur-md transition-all duration-300",
        isRecording ? "opacity-100 ring-1 ring-red-500/30 shadow-lg shadow-red-500/10" : "opacity-0 pointer-events-none",
        className,
      )}
    >
      {/* Recording dot */}
      <div className="flex items-center gap-1.5">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
        </span>
        <span className="font-mono text-xs font-medium text-red-400">
          {formatDuration(duration)}
        </span>
      </div>

      {/* Wave bars */}
      <div className="flex items-center gap-[3px] h-6 px-1">
        {bars.map((height, idx) => (
          <div
            key={idx}
            className="w-[2.5px] rounded-full transition-all duration-75 bg-gradient-to-t from-red-500 via-pink-500 to-amber-400"
            style={{
              height: `${height}px`,
              opacity: Math.max(0.4, height / 35),
            }}
          />
        ))}
      </div>

      {/* Audio volume badge */}
      <div className="text-[10px] font-mono text-neutral-400 px-1.5 py-0.5 rounded bg-neutral-800/80">
        {audioLevel}%
      </div>
    </div>
  );
}
