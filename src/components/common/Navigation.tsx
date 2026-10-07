"use client";

import { SlidersHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { useTranscribeStore } from "@/store/useTranscribeStore";
import { sendGAEvent } from "@next/third-parties/google";
import Image from "next/image";

function Navigation() {
  const { setIsSettingsOpen } = useTranscribeStore();

  const handleConfigClick = () => {
    sendGAEvent("event", "settings_opened", { trigger: "nav_header_config" });
    setIsSettingsOpen(true);
  };

  const handleGithubClick = (placement: "header_desktop" | "header_mobile") => {
    sendGAEvent("event", "github_link_clicked", { placement });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-800/80 bg-neutral-950/70 backdrop-blur-md">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center rounded-xl text-white">
            <Image src={"/logo.png"} alt="logo" width={20} height={20} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">
                AudioFlow
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleConfigClick}
            className="rounded-full border-neutral-800 bg-neutral-900/80 hover:bg-neutral-800 text-neutral-300 hover:text-white"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-neutral-400" />
            Config
          </Button>
          <a
            href="https://github.com/OnkarK0273/audio-flow"
            target="_blank"
            rel="noreferrer"
            onClick={() => handleGithubClick("header_mobile")}
          >
            <Image
              src={"/github-dark.svg"}
              alt="github"
              width={20}
              height={20}
              className="md:hidden"
            />
          </a>
        </div>
      </div>
      <a
        href="https://github.com/OnkarK0273/audio-flow"
        target="_blank"
        rel="noreferrer"
        onClick={() => handleGithubClick("header_desktop")}
      >
        <Image
          src={"/github-dark.svg"}
          alt="github"
          width={20}
          height={20}
          className="hidden md:block absolute right-4 top-5"
        />
      </a>
    </header>
  );
}

export default Navigation;
