"use client";

import React, { useState } from "react";
import { HistoryItem, useTranscribeStore } from "@/store/useTranscribeStore";
import { Button } from "@/components/ui/button";
import {
  Check,
  Copy,
  CornerDownLeft,
  History,
  Sparkles,
  Trash2,
} from "lucide-react";

export function TranscriptionHistory() {
  const { history, deleteHistoryItem, clearHistory, setInputValue, inputValue } =
    useTranscribeStore();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (item: HistoryItem) => {
    navigator.clipboard.writeText(item.text);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  const handleInsert = (item: HistoryItem) => {
    const separator = inputValue && !inputValue.endsWith(" ") ? " " : "";
    setInputValue(`${inputValue}${separator}${item.text}`.trim());
  };

  const formatTimestamp = (ts: number) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(ts).toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
    });
  };

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-neutral-800/80 bg-neutral-900/20 text-center">
        <div className="p-3 rounded-full bg-neutral-800/50 text-neutral-400 mb-3">
          <History className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-medium text-neutral-300">
          No Transcriptions Yet
        </h4>
        <p className="text-xs text-neutral-400 max-w-xs mt-1">
          Click the microphone button and speak. Your real-time transcription history will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-200">
            Recent Transcriptions ({history.length})
          </h3>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearHistory}
          className="text-xs text-neutral-400 hover:text-red-400 h-7 px-2"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Clear All
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
        {history.map((item) => (
          <div
            key={item.id}
            className="group relative flex flex-col gap-2 p-3.5 rounded-xl border border-neutral-800/80 bg-neutral-900/40 hover:bg-neutral-900/80 hover:border-neutral-700 transition-all shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm text-neutral-200 leading-relaxed break-words line-clamp-3">
                {item.text}
              </p>
            </div>

            <div className="flex items-center justify-between pt-1 border-t border-neutral-800/60 text-[11px] text-neutral-400">
              <div className="flex items-center gap-2">
                <span className="font-mono text-neutral-400">
                  {formatTimestamp(item.timestamp)}
                </span>
                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[10px]">
                  <Sparkles className="h-2.5 w-2.5" />
                  {item.model.replace("gemini-", "")}
                </span>
              </div>

              <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleInsert(item)}
                  title="Insert into input box"
                  className="h-7 w-7 text-neutral-400 hover:text-white"
                >
                  <CornerDownLeft className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => handleCopy(item)}
                  title="Copy text"
                  className="h-7 w-7 text-neutral-400 hover:text-white"
                >
                  {copiedId === item.id ? (
                    <Check className="h-3.5 w-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => deleteHistoryItem(item.id)}
                  title="Delete from history"
                  className="h-7 w-7 text-neutral-400 hover:text-red-400"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
