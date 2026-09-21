"use client";
import { useState } from "react";
import { SettingsDialog } from "@/components/voice/SettingsDialog";
import Hero from "@/components/common/Hero";
import TabSection from "@/components/common/Tabs";
import TabBody from "@/components/common/TabBody";
import Navigation from "@/components/common/Navigation";
import BgDecorative from "@/components/common/BgDecorative";
import Footer from "@/components/common/Footer";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"stt" | "tts">("stt");

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 selection:bg-blue-500/30 selection:text-blue-200">
      {/* Background Decorative Mesh & Glows */}
      <BgDecorative />

      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Navigation Bar */}
        <Navigation />

        {/* Main Content Area */}
        <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8 space-y-10">
          {/* Hero Section */}
          <Hero activeTab={activeTab} />

          {/* Primary Tool Tab Selector */}
          <TabSection activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Tab Body */}
          <TabBody activeTab={activeTab} />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Global Settings Dialog */}
      <SettingsDialog activeTool={activeTab} />
    </div>
  );
}
