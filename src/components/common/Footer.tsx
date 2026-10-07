"use client";

import { sendGAEvent } from "@next/third-parties/google";

function Footer() {
  const handleAuthorClick = () => {
    sendGAEvent("event", "author_link_clicked", {
      destination: "onkar_linktree",
    });
  };

  return (
    <footer className="border-t border-neutral-800/80 py-6 text-center text-xs text-neutral-400">
      <p className="mb-1">
        AudioFlow By
        <a
          href="https://linktr.ee/onkar.k"
          target="_blank"
          rel="noreferrer"
          className="text-white hover:underline ml-1"
          onClick={handleAuthorClick}
        >
          Onkar.K
        </a>
      </p>
    </footer>
  );
}

export default Footer;
