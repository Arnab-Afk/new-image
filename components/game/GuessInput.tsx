"use client";

import { useState, useRef, useEffect } from "react";

interface GuessInputProps {
  onSubmitGuess: (guess: string) => void;
  disabled: boolean;
  currentPlayer: string;
}

export function GuessInput({ onSubmitGuess, disabled, currentPlayer }: GuessInputProps) {
  const [guess, setGuess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (guess.trim() && !disabled && !isSubmitting) {
      setIsSubmitting(true);
      onSubmitGuess(guess.trim());
      setGuess("");
      
      // Reset submitting state after a delay
      setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
      <div className="text-center mb-4">
        <h3 className="text-xl font-bold text-white mb-2">
          {currentPlayer}'s Turn
        </h3>
        <p className="text-gray-300 text-sm">
          What prompt do you think created this image?
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <textarea
            ref={inputRef}
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your guess here... (e.g., 'A robot playing guitar in space')"
            disabled={disabled || isSubmitting}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none h-24 disabled:opacity-50"
            maxLength={200}
          />
          <div className="flex justify-between items-center mt-2">
            <span className="text-gray-400 text-xs">
              {guess.length}/200 characters
            </span>
            <span className="text-gray-400 text-xs">
              Press Enter to submit, Shift+Enter for new line
            </span>
          </div>
        </div>

        <button
          type="submit"
          disabled={!guess.trim() || disabled || isSubmitting}
          className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold text-lg"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "Submit Guess! 🎯"
          )}
        </button>
      </form>

      {disabled && !isSubmitting && (
        <div className="text-center mt-4">
          <p className="text-gray-400 text-sm">
            ⏰ Time's up! Waiting for next turn...
          </p>
        </div>
      )}

      <div className="mt-6 text-center">
        <h4 className="text-white font-semibold mb-3">💡 Tips for Better Guesses:</h4>
        <div className="grid grid-cols-2 gap-3 text-sm text-gray-300">
          <div className="bg-black/30 rounded-lg p-3">
            <span className="text-blue-400">🎨 Style:</span>
            <br />
            Realistic, cartoon, abstract?
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <span className="text-green-400">🏞️ Setting:</span>
            <br />
            Where does this take place?
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <span className="text-yellow-400">🎭 Mood:</span>
            <br />
            Happy, mysterious, dramatic?
          </div>
          <div className="bg-black/30 rounded-lg p-3">
            <span className="text-purple-400">📝 Details:</span>
            <br />
            Colors, objects, actions?
          </div>
        </div>
      </div>
    </div>
  );
}
