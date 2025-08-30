"use client";

import { useState, useEffect } from "react";
import { GameModeSelector } from "./game/GameModeSelector";
import { ImageDisplay } from "./game/ImageDisplay";
import { GuessInput } from "./game/GuessInput";
import { ScoreBoard } from "./game/ScoreBoard";
import { GameResult } from "./game/GameResult";
import { gameImages } from "./game/gameData";

export interface GameImage {
  id: number;
  url: string;
  correctPrompt: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface Player {
  id: string;
  name: string;
  score: number;
  guesses: string[];
}

export interface GameState {
  mode: "single" | "multiplayer" | null;
  currentImageIndex: number;
  round: number;
  maxRounds: number;
  players: Player[];
  currentPlayerIndex: number;
  gameStarted: boolean;
  gameEnded: boolean;
  showResult: boolean;
  timeRemaining: number;
  isTimerActive: boolean;
}

const ROUND_TIME = 60; // seconds per round
const MAX_ROUNDS = 5;

export default function GuessThePromptGame() {
  const [gameState, setGameState] = useState<GameState>({
    mode: null,
    currentImageIndex: 0,
    round: 1,
    maxRounds: MAX_ROUNDS,
    players: [],
    currentPlayerIndex: 0,
    gameStarted: false,
    gameEnded: false,
    showResult: false,
    timeRemaining: ROUND_TIME,
    isTimerActive: false,
  });

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (gameState.isTimerActive && gameState.timeRemaining > 0) {
      interval = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeRemaining: prev.timeRemaining - 1
        }));
      }, 1000);
    } else if (gameState.timeRemaining === 0 && gameState.isTimerActive) {
      handleTimeUp();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isTimerActive, gameState.timeRemaining]);

  const startGame = (mode: "single" | "multiplayer", playerNames: string[]) => {
    const players: Player[] = playerNames.map((name, index) => ({
      id: `player-${index}`,
      name,
      score: 0,
      guesses: []
    }));

    setGameState({
      ...gameState,
      mode,
      players,
      gameStarted: true,
      currentImageIndex: Math.floor(Math.random() * gameImages.length),
      timeRemaining: ROUND_TIME,
      isTimerActive: true,
    });
  };

  const handleGuess = (guess: string) => {
    const currentImage = gameImages[gameState.currentImageIndex];
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    // Add guess to player's guesses
    const updatedPlayers = [...gameState.players];
    updatedPlayers[gameState.currentPlayerIndex] = {
      ...currentPlayer,
      guesses: [...currentPlayer.guesses, guess]
    };

    // Calculate score based on similarity to correct prompt
    const score = calculateScore(guess, currentImage.correctPrompt);
    if (score > 0) {
      updatedPlayers[gameState.currentPlayerIndex].score += score;
    }

    setGameState(prev => ({
      ...prev,
      players: updatedPlayers,
      showResult: true,
      isTimerActive: false
    }));

    // Show result for 3 seconds, then continue
    setTimeout(() => {
      nextTurn();
    }, 3000);
  };

  const calculateScore = (guess: string, correctPrompt: string): number => {
    const guessWords = guess.toLowerCase().split(' ').filter(word => word.length > 2);
    const correctWords = correctPrompt.toLowerCase().split(' ').filter(word => word.length > 2);
    
    let matches = 0;
    guessWords.forEach(word => {
      if (correctWords.some(correctWord => 
        correctWord.includes(word) || word.includes(correctWord)
      )) {
        matches++;
      }
    });

    // Bonus points for exact matches
    if (guess.toLowerCase().trim() === correctPrompt.toLowerCase().trim()) {
      return 100;
    }

    // Score based on word matches (max 80 points)
    const wordScore = Math.min(80, (matches / correctWords.length) * 80);
    
    // Bonus for creativity/humor (random factor)
    const creativityBonus = Math.random() > 0.7 ? 10 : 0;
    
    return Math.floor(wordScore + creativityBonus);
  };

  const handleTimeUp = () => {
    setGameState(prev => ({
      ...prev,
      showResult: true,
      isTimerActive: false
    }));

    setTimeout(() => {
      nextTurn();
    }, 2000);
  };

  const nextTurn = () => {
    const isLastPlayer = gameState.currentPlayerIndex === gameState.players.length - 1;
    const isLastRound = gameState.round === gameState.maxRounds;

    if (isLastPlayer && isLastRound) {
      // Game over
      setGameState(prev => ({
        ...prev,
        gameEnded: true,
        showResult: false,
        isTimerActive: false
      }));
    } else if (isLastPlayer) {
      // Next round
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
        currentPlayerIndex: 0,
        currentImageIndex: Math.floor(Math.random() * gameImages.length),
        showResult: false,
        timeRemaining: ROUND_TIME,
        isTimerActive: true
      }));
    } else {
      // Next player
      setGameState(prev => ({
        ...prev,
        currentPlayerIndex: prev.currentPlayerIndex + 1,
        currentImageIndex: Math.floor(Math.random() * gameImages.length),
        showResult: false,
        timeRemaining: ROUND_TIME,
        isTimerActive: true
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      mode: null,
      currentImageIndex: 0,
      round: 1,
      maxRounds: MAX_ROUNDS,
      players: [],
      currentPlayerIndex: 0,
      gameStarted: false,
      gameEnded: false,
      showResult: false,
      timeRemaining: ROUND_TIME,
      isTimerActive: false,
    });
  };

  const currentImage = gameImages[gameState.currentImageIndex];
  const currentPlayer = gameState.players[gameState.currentPlayerIndex];

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="text-gray-400 text-sm font-medium mb-4 tracking-wider uppercase">
            GUESS THE PROMPT
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Outsmart the model.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Modern dark edition
            </span>
          </h1>
          
          <p className="text-lg text-gray-300 max-w-3xl mb-8 leading-relaxed">
            We show you stunning AI outputs—your job is to reverse-engineer the exact prompt. Clean, fast, and addictive.
          </p>

          {/* Example Challenge */}
          <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center mb-3">
              <div className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></div>
              <span className="text-gray-400 text-sm font-medium">Example challenge</span>
            </div>
            <p className="font-mono text-sm text-gray-200 leading-relaxed">
              "A cinematic macro photo of a beetle in the rain, 85mm, f/1.4, rim lighting, ultra-detailed, 3:2"
            </p>
            <div className="mt-4 text-sm text-green-400">
              Goal: match at least 90% of tokens
            </div>
          </div>
        </div>
        
        <GameModeSelector onStartGame={startGame} />
      </div>
    );
  }

  if (gameState.gameEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <GameResult players={gameState.players} onRestart={resetGame} />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="text-white">
          <h1 className="text-2xl font-bold">🎨 Guess the Prompt</h1>
          <p className="text-gray-300">
            Round {gameState.round} of {gameState.maxRounds}
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="text-white text-right">
            <p className="text-sm text-gray-300">Current Player</p>
            <p className="font-semibold">{currentPlayer?.name}</p>
          </div>
          
          <div className="text-white text-center">
            <p className="text-sm text-gray-300">Time Left</p>
            <p className={`text-2xl font-bold ${
              gameState.timeRemaining <= 10 ? 'text-red-400 animate-pulse' : 'text-blue-400'
            }`}>
              {gameState.timeRemaining}s
            </p>
          </div>
        </div>
      </div>

      {/* Main Game Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        {/* Left Side - Image */}
        <div className="lg:w-1/2">
          <ImageDisplay
            image={currentImage}
            showPrompt={gameState.showResult}
          />
        </div>

        {/* Right Side - Game Controls */}
        <div className="lg:w-1/2 flex flex-col">
          {/* Score Board */}
          <div className="mb-6">
            <ScoreBoard
              players={gameState.players}
              currentPlayerIndex={gameState.currentPlayerIndex}
            />
          </div>

          {/* Guess Input */}
          <div className="flex-1">
            {gameState.showResult ? (
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">Result</h3>
                <p className="text-gray-300 mb-2">
                  Last guess: "{currentPlayer?.guesses[currentPlayer.guesses.length - 1] || 'No guess'}"
                </p>
                <p className="text-blue-400 text-lg font-semibold">
                  {gameState.timeRemaining === 0 ? "Time's up!" : "Points earned!"}
                </p>
                <p className="text-gray-400 text-sm mt-4">
                  Next {gameState.currentPlayerIndex === gameState.players.length - 1 ? 'round' : 'player'} starting soon...
                </p>
              </div>
            ) : (
              <GuessInput
                onSubmitGuess={handleGuess}
                disabled={!gameState.isTimerActive}
                currentPlayer={currentPlayer?.name || ''}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
