import { useTtsStore } from "@/store/useTtsStore";
import { Headphones, Music, Trash2 } from "lucide-react";
import { Button } from "../ui/button";
import { AudioPlayerItem } from "./AudioPlayerItem";

function VoiseHistory() {
  const { generatedAudios, clearAllAudios } = useTtsStore();
  return (
    <div className="space-y-3 pt-4 border-t border-neutral-800/80 scrollbar-thin scrollbar-thumb-neutral-700 scrollbar-track-transparent ">
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <Headphones className="h-4 w-4 text-neutral-400" />
          <h3 className="text-sm font-semibold text-neutral-200">
            Generated Audio Outputs ({generatedAudios.length})
          </h3>
        </div>
        {generatedAudios.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllAudios}
            className="text-xs text-neutral-400 hover:text-red-400 h-7 px-2"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1" />
            Clear Audios
          </Button>
        )}
      </div>

      {generatedAudios.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-2xl border border-neutral-800/80 bg-neutral-900/20 text-center">
          <div className="p-3 rounded-full bg-neutral-800/50 text-neutral-400 mb-3">
            <Music className="h-6 w-6" />
          </div>
          <h4 className="text-sm font-medium text-neutral-300">
            No Generated Audios Yet
          </h4>
          <p className="text-xs text-neutral-400 max-w-xs mt-1">
            Enter text above and click &ldquo;Generate Speech&rdquo;. Your
            generated speech outputs with playback and download buttons will
            appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 max-h-[500px] overflow-y-auto pr-1">
          {generatedAudios.map((item) => (
            <AudioPlayerItem key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

export default VoiseHistory;
