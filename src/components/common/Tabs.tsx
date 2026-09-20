import { Mic, Volume2 } from "lucide-react";

function TabSection({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tab: "stt" | "tts") => void;
}) {
  return (
    <div className="flex items-center justify-center">
      <div className="inline-flex p-1.5 rounded-2xl bg-neutral-900/90 border border-neutral-800/90 backdrop-blur-xl shadow-xl">
        <button
          type="button"
          onClick={() => setActiveTab("stt")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === "stt"
              ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Mic className="h-4 w-4" />
          <span>Voice to Text (STT)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("tts")}
          className={`flex items-center gap-2 px-5 py-2 rounded-xl font-medium text-sm transition-all duration-200 cursor-pointer ${
            activeTab === "tts"
              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-purple-500/25"
              : "text-neutral-400 hover:text-white"
          }`}
        >
          <Volume2 className="h-4 w-4" />
          <span>Text to Speech (TTS)</span>
        </button>
      </div>
    </div>
  );
}

export default TabSection;
