import { useTranscribeStore } from "@/store/useTranscribeStore";
import { TtsTool } from "../tts/TtsTool";
import { TranscriptionHistory } from "../voice/TranscriptionHistory";
import { VoiceInputBox } from "../voice/VoiceInputBox";

function TabBody({ activeTab }: { activeTab: "stt" | "tts" }) {
  const { setInputValue } = useTranscribeStore();
  const sampleSttPrompts = [
    "Draft a quick summary of the product roadmap review meeting",
    "Send an update to the engineering team about the WebSocket integration",
    "List three key advantages of real-time streaming audio transcription",
  ];
  return (
    <>
      {/* Tab 1: Voice to Text (STT) */}
      {activeTab === "stt" && (
        <div className="space-y-10 animate-in fade-in-0 duration-200">
          <div className="space-y-4">
            <VoiceInputBox />

            {/* Sample STT Prompts */}
            <div className="max-w-3xl mx-auto flex items-center gap-2 flex-wrap text-xs text-neutral-400">
              <span className="text-neutral-400 font-medium">
                Try speaking:
              </span>
              {sampleSttPrompts.map((prompt, idx) => (
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

          {/* Transcription History Section */}
          <div className="max-w-3xl mx-auto pt-6 border-t border-neutral-800/80">
            <TranscriptionHistory />
          </div>
        </div>
      )}

      {/* Tab 2: Text to Speech (TTS) */}
      {activeTab === "tts" && (
        <div className="space-y-10 animate-in fade-in-0 duration-200">
          <TtsTool />
        </div>
      )}
    </>
  );
}

export default TabBody;
