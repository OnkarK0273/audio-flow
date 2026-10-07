"use client";

import { sendGAEvent } from "@next/third-parties/google";

/**
 * Standardized GA4 event sender wrapper around @next/third-parties/google.
 * Uses the exact syntax requested: sendGAEvent('event', eventName, parameters)
 */
export function trackEvent(
  eventName: string,
  parameters: Record<string, string | number | boolean | null | undefined> = {},
) {
  if (typeof window === "undefined") return;

  try {
    sendGAEvent("event", eventName, parameters);
  } catch (error) {
    console.debug(`[GA4] Failed to send event "${eventName}":`, error);
  }
}

// -----------------------------------------------------------------------------
// NAVIGATION & GENERAL EVENTS
// -----------------------------------------------------------------------------

export function trackTabSwitch(tabName: "stt" | "tts", fromTab: string) {
  trackEvent("tab_switched", {
    tab_name: tabName,
    from_tab: fromTab,
  });
}

export function trackExternalLink(destination: string, placement: string) {
  trackEvent("external_link_clicked", {
    destination,
    placement,
  });
}

export function trackSettingsOpen(source: string) {
  trackEvent("settings_opened", {
    trigger_source: source,
  });
}

export function trackSettingsTabSwitch(tab: "stt" | "tts") {
  trackEvent("settings_tab_switched", {
    active_tab: tab,
  });
}

export function trackSettingsSaved(params: {
  hasApiKey: boolean;
  sttModel: string;
  sttLanguage: string;
  sttMode: string;
  ttsModel: string;
  ttsVoice: string;
}) {
  trackEvent("settings_saved", {
    has_api_key: params.hasApiKey,
    stt_model: params.sttModel,
    stt_language: params.sttLanguage,
    stt_mode: params.sttMode,
    tts_model: params.ttsModel,
    tts_voice: params.ttsVoice,
  });
}

export function trackSettingsClosed() {
  trackEvent("settings_closed", {});
}

// -----------------------------------------------------------------------------
// VOICE TO TEXT (STT) EVENTS
// -----------------------------------------------------------------------------

export function trackSttRecordStart(params: {
  model: string;
  language: string;
  mode: string;
  hasApiKey: boolean;
}) {
  trackEvent("stt_recording_started", {
    model: params.model,
    language: params.language,
    mode: params.mode,
    has_api_key: params.hasApiKey,
  });
}

export function trackSttRecordStop(params: {
  durationSeconds?: number;
  wordCount: number;
  charCount: number;
  model: string;
  language: string;
}) {
  trackEvent("stt_recording_stopped", {
    duration_seconds: params.durationSeconds || 0,
    word_count: params.wordCount,
    char_count: params.charCount,
    model: params.model,
    language: params.language,
  });
}

export function trackSttRecordCancel(hasInterimText: boolean) {
  trackEvent("stt_recording_cancelled", {
    had_interim_text: hasInterimText,
  });
}

export function trackSttSamplePrompt(prompt: string, index: number) {
  trackEvent("stt_sample_prompt_clicked", {
    prompt_text: prompt.slice(0, 80),
    prompt_index: index,
  });
}

export function trackSttTextCopy(wordCount: number, charCount: number) {
  trackEvent("stt_text_copied", {
    word_count: wordCount,
    char_count: charCount,
  });
}

export function trackSttTextClear(wordCount: number, charCount: number) {
  trackEvent("stt_text_cleared", {
    previous_word_count: wordCount,
    previous_char_count: charCount,
  });
}

export function trackSttError(errorType: string, errorMessage: string) {
  trackEvent("stt_error_occurred", {
    error_type: errorType,
    error_message: errorMessage.slice(0, 100),
  });
}

export function trackSttHistoryAction(
  action: "copy" | "insert" | "delete" | "clear_all",
  extra: Record<string, string | number> = {},
) {
  trackEvent(`stt_history_${action}`, extra);
}

// -----------------------------------------------------------------------------
// TEXT TO SPEECH (TTS) EVENTS
// -----------------------------------------------------------------------------

export function trackTtsGenerateClick(params: {
  model: string;
  voice: string;
  charCount: number;
  wordCount: number;
  hasExpressiveTags: boolean;
}) {
  trackEvent("tts_generation_started", {
    model: params.model,
    voice: params.voice,
    char_count: params.charCount,
    word_count: params.wordCount,
    has_expressive_tags: params.hasExpressiveTags,
  });
}

export function trackTtsGenerateSuccess(params: {
  model: string;
  voice: string;
  latencyMs: number;
  sampleRate: number;
}) {
  trackEvent("tts_generation_completed", {
    model: params.model,
    voice: params.voice,
    latency_ms: params.latencyMs,
    sample_rate: params.sampleRate,
  });
}

export function trackTtsGenerateError(params: {
  model: string;
  voice: string;
  errorMessage: string;
}) {
  trackEvent("tts_generation_failed", {
    model: params.model,
    voice: params.voice,
    error_message: params.errorMessage.slice(0, 100),
  });
}

export function trackTtsExpressiveTag(tag: string) {
  trackEvent("tts_expressive_tag_inserted", {
    tag_name: tag,
  });
}

export function trackTtsSamplePrompt(prompt: string, index: number) {
  trackEvent("tts_sample_prompt_clicked", {
    prompt_preview: prompt.slice(0, 80),
    prompt_index: index,
  });
}

export function trackTtsInputClear(charCount: number) {
  trackEvent("tts_input_cleared", {
    previous_char_count: charCount,
  });
}

export function trackTtsAudioPlay(params: {
  audioId: string;
  model: string;
  voice: string;
  duration?: number;
}) {
  trackEvent("tts_audio_played", {
    audio_id: params.audioId,
    model: params.model,
    voice: params.voice,
    duration_seconds: params.duration ? Math.round(params.duration) : 0,
  });
}

export function trackTtsAudioPause(params: {
  audioId: string;
  currentTime: number;
}) {
  trackEvent("tts_audio_paused", {
    audio_id: params.audioId,
    current_time_seconds: Math.round(params.currentTime),
  });
}

export function trackTtsAudioDownload(params: {
  audioId: string;
  model: string;
  voice: string;
}) {
  trackEvent("tts_audio_downloaded", {
    audio_id: params.audioId,
    model: params.model,
    voice: params.voice,
    format: "wav",
  });
}

export function trackTtsAudioCopy(audioId: string) {
  trackEvent("tts_prompt_copied", {
    audio_id: audioId,
  });
}

export function trackTtsAudioDelete(audioId: string) {
  trackEvent("tts_audio_deleted", {
    audio_id: audioId,
  });
}

export function trackTtsHistoryClearAll(totalItems: number) {
  trackEvent("tts_history_cleared_all", {
    total_items_cleared: totalItems,
  });
}
