"use client";

import Image from "next/image";
import { GameImage } from "../GuessThePromptGame";

interface ImageDisplayProps {
  image: GameImage;
  showPrompt: boolean;
}

export function ImageDisplay({ image, showPrompt }: ImageDisplayProps) {
  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6 h-full">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">AI Generated Image</h3>
        <div className="flex justify-center items-center space-x-4 text-sm">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            image.difficulty === 'easy' ? 'bg-green-500/20 text-green-400' :
            image.difficulty === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
            'bg-red-500/20 text-red-400'
          }`}>
            {image.difficulty.toUpperCase()}
          </span>
          <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-xs font-semibold">
            {image.category.toUpperCase()}
          </span>
        </div>
      </div>

      <div className="relative aspect-video bg-gray-800 rounded-lg overflow-hidden mb-4">
        <Image
          src={image.url}
          alt="AI generated image to guess"
          fill
          className="object-cover transition-all duration-300"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
        
        {/* Overlay for loading state */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
      </div>

      {showPrompt && (
        <div className="bg-black/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-4 animate-fadeIn">
          <h4 className="text-green-400 font-semibold mb-2 text-center">
            🎯 Correct Prompt:
          </h4>
          <p className="text-white text-center text-lg">
            "{image.correctPrompt}"
          </p>
        </div>
      )}

      {!showPrompt && (
        <div className="text-center">
          <p className="text-gray-300 text-sm mb-2">
            💡 What prompt do you think generated this image?
          </p>
          <p className="text-gray-400 text-xs">
            Think about the style, objects, setting, and mood!
          </p>
        </div>
      )}
    </div>
  );
}
