"use client";

import { useState } from "react";
import { EvervaultCard } from "@/components/ui/evervault-card";

interface GameModeSelectorProps {
  onStartGame: (playerName: string) => void;
}

export function GameModeSelector({ onStartGame }: GameModeSelectorProps) {
  const [playerName, setPlayerName] = useState<string>("");
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);

  const canStart = () => {
    return playerName.trim() !== "";
  };

  const handleStart = () => {
    if (canStart()) {
      onStartGame(playerName.trim());
    }
  };

  const handleGetStarted = () => {
    setShowPlayerSetup(true);
  };

  if (!showPlayerSetup) {
    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Ready to test your AI prompt skills?
        </h3>
        
        <div className="flex justify-center max-w-2xl mx-auto">
          {/* Single Player Game */}
          <div className="relative h-60 w-full max-w-md">
            <EvervaultCard 
              text="🎯" 
              className="h-full w-full cursor-pointer"
            />
            <div 
              onClick={handleGetStarted}
              className="absolute inset-0 flex flex-col justify-center items-center text-center p-6 z-30 cursor-pointer group"
            >
              <div className="bg-black/80 backdrop-blur-sm rounded-lg p-6 transform group-hover:scale-105 transition-transform duration-300 border border-white/20">
                <h4 className="text-xl font-bold text-white mb-2">AI Prompt Guesser</h4>
                <p className="text-gray-300 text-sm mb-4">
                  View stunning AI-generated images and guess the exact prompts used to create them.
                </p>
                <div className="bg-cyan-500 text-white px-4 py-2 rounded-lg font-medium text-sm">
                  Start Playing
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Features */}
        <div className="max-w-4xl mx-auto mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl mb-3">�️</div>
            <h4 className="text-white font-bold mb-2">AI-Generated Images</h4>
            <p className="text-gray-400 text-sm">
              Each image was created using AI with specific prompts
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">⏱️</div>
            <h4 className="text-white font-bold mb-2">Timed Challenges</h4>
            <p className="text-gray-400 text-sm">
              60 seconds per round to guess the prompt
            </p>
          </div>
          <div className="text-center">
            <div className="text-3xl mb-3">🏆</div>
            <h4 className="text-white font-bold mb-2">Score System</h4>
            <p className="text-gray-400 text-sm">
              Points based on accuracy and keyword matches
            </p>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="max-w-4xl mx-auto mt-12">
          <h4 className="text-white font-bold mb-4">Pro tip</h4>
          <p className="text-gray-400">
            Look for style tokens like camera model, lens, lighting, aspect ratio, or artistic style. Every detail in the prompt matters!
          </p>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="text-gray-500 text-sm">
            © 2025 AI Playground • Built for fun
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-8 max-w-2xl w-full">
      <h3 className="text-2xl font-bold text-white text-center mb-6">
        Enter Your Name
      </h3>

      <div className="space-y-4 mb-6">
        <div className="flex items-center space-x-3">
          <div className="flex-1">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
              maxLength={20}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && canStart()) {
                  handleStart();
                }
              }}
            />
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => {
            setShowPlayerSetup(false);
            setPlayerName("");
          }}
          className="flex-1 px-6 py-3 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Back
        </button>
        
        <button
          onClick={handleStart}
          disabled={!canStart()}
          className="flex-1 px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
        >
          Start Game! 🚀
        </button>
      </div>

      <p className="text-gray-400 text-sm text-center mt-4">
        Challenge yourself to guess AI image prompts. Each round lasts 60 seconds!
      </p>
    </div>
  );
}
