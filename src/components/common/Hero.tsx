import { Sparkles } from "lucide-react";

function Hero({ activeTab }: { activeTab: "stt" | "tts" }) {
  return (
    <div className="text-center space-y-3 pt-2">
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs font-medium backdrop-blur-md shadow-sm">
        <Sparkles className="h-3.5 w-3.5" />
        {activeTab === "stt"
          ? "Live Speech-to-Text with Gemini Transcribe"
          : "Natural Speech Synthesis with Gemini TTS"}
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white max-w-2xl mx-auto leading-tight">
        {activeTab === "stt" ? (
          <>
            Real-time Voice Dictation in Your{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent">
              Input Box
            </span>
          </>
        ) : (
          <>
            Transform Text into Natural{" "}
            <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-400 bg-clip-text text-transparent">
              Human Speech
            </span>
          </>
        )}
      </h1>

      <p className="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto leading-relaxed">
        {activeTab === "stt"
          ? "Tap the microphone to convert voice to text dynamically as you talk, powered by Gemini Live WebSocket streaming."
          : "Generate expressive audio with natural cadence, prebuilt voices, and emotional tags. Play and download standard WAV audio."}
      </p>
    </div>
  );
}

export default Hero;
