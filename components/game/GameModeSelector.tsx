"use client";

import { useState } from "react";

interface GameModeSelectorProps {
  onStartGame: (mode: "single" | "multiplayer", playerNames: string[]) => void;
}

export function GameModeSelector({ onStartGame }: GameModeSelectorProps) {
  const [selectedMode, setSelectedMode] = useState<"single" | "multiplayer" | null>(null);
  const [playerNames, setPlayerNames] = useState<string[]>([""]);
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);

  const handleModeSelect = (mode: "single" | "multiplayer") => {
    setSelectedMode(mode);
    if (mode === "single") {
      setPlayerNames(["Solo Player"]);
      setShowPlayerSetup(true);
    } else {
      setPlayerNames(["", ""]);
      setShowPlayerSetup(true);
    }
  };

  const addPlayer = () => {
    if (playerNames.length < 6) {
      setPlayerNames([...playerNames, ""]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 2 || (selectedMode === "single" && playerNames.length > 1)) {
      const newNames = playerNames.filter((_, i) => i !== index);
      setPlayerNames(newNames);
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const canStart = () => {
    if (selectedMode === "single") {
      return playerNames[0].trim() !== "";
    }
    return playerNames.length >= 2 && playerNames.every(name => name.trim() !== "");
  };

  const handleStart = () => {
    if (canStart() && selectedMode) {
      onStartGame(selectedMode, playerNames.map(name => name.trim()));
    }
  };

  if (!showPlayerSetup) {
    return (
      <div className="space-y-8">
        <h3 className="text-2xl font-bold text-white text-center mb-8">
          Choose game mode
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
          {/* Single Player */}
          <div className="group">
            <button
              onClick={() => handleModeSelect("single")}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-8 text-left hover:border-cyan-500 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-cyan-400 flex items-center justify-center mr-4">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                </div>
                <h4 className="text-xl font-bold text-white">Single Player</h4>
              </div>
              
              <p className="text-gray-400 mb-6">
                Play solo and chase a perfect score with timed rounds and streak bonuses.
              </p>
              
              <div className="bg-cyan-500 text-white px-6 py-3 rounded-lg font-medium inline-block">
                Play Solo
              </div>
            </button>
          </div>

          {/* Multiplayer */}
          <div className="group">
            <button
              onClick={() => handleModeSelect("multiplayer")}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg p-8 text-left hover:border-green-500 transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center mb-4">
                <div className="w-6 h-6 rounded-full border-2 border-green-400 flex items-center justify-center mr-4">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
                <h4 className="text-xl font-bold text-white">Multiplayer</h4>
              </div>
              
              <p className="text-gray-400 mb-6">
                Compete with friends in real-time lobbies. First to crack the prompt wins.
              </p>
              
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium inline-block">
                Host or Join
              </div>
            </button>
          </div>
        </div>

        {/* Pro Tip */}
        <div className="max-w-4xl mx-auto mt-12">
          <h4 className="text-white font-bold mb-4">Pro tip</h4>
          <p className="text-gray-400">
            Look for style tokens like camera model, lens, lighting, aspect ratio, or seed numbers. Tiny details matter.
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
        {selectedMode === "single" ? "Player Setup" : "Add Players"}
      </h3>

      <div className="space-y-4 mb-6">
        {playerNames.map((name, index) => (
          <div key={index} className="flex items-center space-x-3">
            <div className="flex-1">
              <input
                type="text"
                value={name}
                onChange={(e) => updatePlayerName(index, e.target.value)}
                placeholder={selectedMode === "single" ? "Your name" : `Player ${index + 1} name`}
                className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                maxLength={20}
              />
            </div>
            
            {selectedMode === "multiplayer" && playerNames.length > 2 && (
              <button
                onClick={() => removePlayer(index)}
                className="px-3 py-3 bg-red-900/50 text-red-400 border border-red-800 rounded-lg hover:bg-red-900/70 transition-colors"
              >
                ✕
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedMode === "multiplayer" && (
        <div className="flex justify-center mb-6">
          <button
            onClick={addPlayer}
            disabled={playerNames.length >= 6}
            className="px-6 py-2 bg-gray-800 text-gray-300 border border-gray-600 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Player ({playerNames.length}/6)
          </button>
        </div>
      )}

      <div className="flex space-x-4">
        <button
          onClick={() => {
            setShowPlayerSetup(false);
            setSelectedMode(null);
            setPlayerNames([""]);
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

      {selectedMode === "multiplayer" && (
        <p className="text-gray-400 text-sm text-center mt-4">
          Players will take turns guessing prompts. Each round lasts 60 seconds!
        </p>
      )}
    </div>
  );
}
