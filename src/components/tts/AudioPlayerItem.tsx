"use client";
import React, { useEffect, useRef, useState } from "react";
import { GeneratedAudioItem, useTtsStore } from "@/store/useTtsStore";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  Download,
  Pause,
  Play,
  Sparkles,
  Trash2,
  User,
} from "lucide-react";

interface AudioPlayerItemProps {
  item: GeneratedAudioItem;
}

export function AudioPlayerItem({ item }: AudioPlayerItemProps) {
  const { activePlayingId, setActivePlayingId, deleteAudio } = useTtsStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [copied, setCopied] = useState(false);

  const isCurrentActive = activePlayingId === item.id;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
    const handleLoadedMetadata = () => setDuration(audio.duration || 0);
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      setActivePlayingId(null);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [setActivePlayingId]);

  // Handle active playback coordination across items
  useEffect(() => {
    if (!isCurrentActive && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isCurrentActive, isPlaying]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setActivePlayingId(null);
    } else {
      setActivePlayingId(item.id);
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((e) => console.error(e));
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) return;
    const seekTime = parseFloat(e.target.value);
    audio.currentTime = seekTime;
    setCurrentTime(seekTime);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(item.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const formatTime = (secs: number) => {
    if (!secs || isNaN(secs)) return "0:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col gap-3 p-4 rounded-2xl border border-neutral-800/80 bg-neutral-900/50 hover:border-neutral-700/80 transition-all shadow-md">
      {/* Hidden native audio element */}
      <audio ref={audioRef} src={item.audioUrl} preload="metadata" />

      {/* Top Header: Voice & Model badges + Time */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-medium">
            <Sparkles className="h-3 w-3" />
            {item.model}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
            <User className="h-3 w-3" />
            Voice: {item.voice}
          </span>
        </div>
        <span className="text-[11px] font-mono text-neutral-400">
          {new Date(item.timestamp).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>

      {/* Prompt Text Preview */}
      <p className="text-sm text-neutral-200 leading-relaxed break-words line-clamp-3">
        &ldquo;{item.text}&rdquo;
      </p>

      {/* Audio Player Controls */}
      <div className="flex items-center gap-3 pt-2 border-t border-neutral-800/70">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          aria-label={isPlaying ? "Pause audio" : "Play audio"}
          className={`flex items-center justify-center h-10 w-10 rounded-full transition-all cursor-pointer shrink-0 shadow-md ${
            isPlaying
              ? "bg-blue-600 text-white shadow-blue-500/20 scale-105"
              : "bg-neutral-800 hover:bg-neutral-700 text-neutral-100"
          }`}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 fill-white text-white" />
          ) : (
            <Play className="h-4 w-4 fill-neutral-100 text-neutral-100 ml-0.5" />
          )}
        </button>

        {/* Progress Bar & Timing */}
        <div className="flex-1 flex flex-col justify-center gap-1">
          <div className="relative flex items-center h-4">
            <input
              type="range"
              min="0"
              max={duration || 100}
              step="0.1"
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500 hover:accent-blue-400 transition-all"
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-neutral-400">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* Action Buttons: Download, Copy, Delete */}
        <div className="flex items-center gap-1 shrink-0">
          {/* Download Button */}
          <a
            href={item.audioUrl}
            download={`gemini_tts_${item.voice.toLowerCase()}_${item.id.slice(0, 6)}.wav`}
            title="Download Audio (.wav)"
            className="flex items-center justify-center h-8 w-8 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <Download className="h-4 w-4" />
          </a>

          {/* Copy Prompt Text */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={handleCopy}
            title="Copy prompt text"
            className="h-8 w-8 text-neutral-400 hover:text-white"
          >
            {copied ? (
              <Check className="h-4 w-4 text-emerald-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>

          {/* Delete Audio */}
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => deleteAudio(item.id)}
            title="Delete audio"
            className="h-8 w-8 text-neutral-400 hover:text-red-400"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
