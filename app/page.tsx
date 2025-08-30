"use client";

import Hyperspeed from "@/components/Hyperspeed/Hyperspeed";
import { hyperspeedPresets } from "@/components/Hyperspeed/HyperSpeedPresets";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Hyperspeed Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <Hyperspeed effectOptions={hyperspeedPresets.one} />
      </div>

      {/* Main Content */}
      <div className="relative z-10 p-8 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-4xl font-bold text-white text-center">Welcome to the Hyperspeed Experience</h1>
        <p className="mt-4 text-lg text-gray-300 text-center max-w-2xl">
          Immerse yourself in a world of ultra-fast visuals and stunning effects.
        </p>
      </div>
    </div>
  );
}
