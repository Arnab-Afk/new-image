"use client";

import Hyperspeed from "@/components/Hyperspeed/Hyperspeed";
import { hyperspeedPresets } from "@/components/Hyperspeed/HyperSpeedPresets";
import GuessThePromptGame from "@/components/GuessThePromptGame";
import { Header } from "@/components/game/Header";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0">
        <Hyperspeed effectOptions={hyperspeedPresets.one} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen">
        <Header className="absolute top-0 left-0 right-0 z-20" />
        <GuessThePromptGame />
      </div>
    </div>
  );
}
