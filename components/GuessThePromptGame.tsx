"use client";

import { useState, useEffect } from "react";
import { GameModeSelector } from "./game/GameModeSelector";
import { ImageDisplay } from "./game/ImageDisplay";
import { GuessInput } from "./game/GuessInput";
import { ScoreBoard } from "./game/ScoreBoard";
import { GameResult } from "./game/GameResult";
import { gameImages } from "./game/gameData";
import { 
  startImageEvaluation, 
  waitForAllEvaluations, 
  PendingEvaluation, 
  ScoreResponse
} from "@/lib/gameApi";

export interface GameImage {
  id: number;
  url: string;
  correctPrompt: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
}

export interface Player {
  name: string;
  score: number;
  guesses: string[];
  detailedScores: {
    round: number;
    prompt: string;
    totalScore: number;
    breakdown: ScoreResponse[];
  }[];
}

export interface GameState {
  currentImageIndex: number;
  round: number;
  maxRounds: number;
  player: Player;
  gameStarted: boolean;
  gameEnded: boolean;
  showResult: boolean;
  timeRemaining: number;
  isTimerActive: boolean;
  pendingEvaluations: PendingEvaluation[];
  isCalculatingFinalScore: boolean;
}

const ROUND_TIME = 60; // 1 minute per round (faster flow)
const MAX_ROUNDS = 5; // One round for each image

export default function GuessThePromptGame() {
  const [gameState, setGameState] = useState<GameState>({
    currentImageIndex: 0,
    round: 1,
    maxRounds: MAX_ROUNDS,
    player: {
      name: "",
      score: 0,
      guesses: [],
      detailedScores: []
    },
    gameStarted: false,
    gameEnded: false,
    showResult: false,
    timeRemaining: ROUND_TIME,
    isTimerActive: false,
    pendingEvaluations: [],
    isCalculatingFinalScore: false,
  });

  // Timer effect and time up handler
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
      // Handle time up inline
      setGameState(prev => ({
        ...prev,
        showResult: true,
        isTimerActive: false
      }));

      setTimeout(() => {
        const isLastRound = gameState.round === gameState.maxRounds;

        if (isLastRound) {
          setGameState(prev => ({
            ...prev,
            gameEnded: true,
            showResult: false,
            isTimerActive: false
          }));
        } else {
          setGameState(prev => ({
            ...prev,
            round: prev.round + 1,
            currentImageIndex: prev.round,
            showResult: false,
            timeRemaining: ROUND_TIME,
            isTimerActive: true
          }));
        }
      }, 2000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [gameState.isTimerActive, gameState.timeRemaining, gameState.round, gameState.maxRounds]);

  const startGame = (playerName: string) => {
    const player: Player = {
      name: playerName,
      score: 0,
      guesses: [],
      detailedScores: []
    };

    setGameState({
      ...gameState,
      player,
      gameStarted: true,
      currentImageIndex: 0, // Start with first image
      timeRemaining: ROUND_TIME,
      isTimerActive: true,
    });
  };

  const handleGuess = (guess: string) => {
    const currentImage = gameImages[gameState.currentImageIndex];
    
    // Start evaluation for current image (non-blocking)
    const evaluation = startImageEvaluation(guess, currentImage.url, currentImage.id);
    
    // Add the pending evaluation to our list
    const updatedPendingEvaluations = [...gameState.pendingEvaluations, evaluation];
    
    // Update player data and add guess
    const updatedPlayer = {
      ...gameState.player,
      guesses: [...gameState.player.guesses, guess]
    };

    setGameState(prev => ({
      ...prev,
      player: updatedPlayer,
      pendingEvaluations: updatedPendingEvaluations,
      showResult: true,
      isTimerActive: false
    }));

    // Move to next turn after a short delay
    setTimeout(() => {
      nextTurn();
    }, 2000);
  };

  const calculateFinalScores = async () => {
    // Get the most current state to avoid stale closure issues
    setGameState(prev => {
      const currentPendingEvaluations = prev.pendingEvaluations;
      const currentPlayerGuesses = prev.player.guesses;
      
      console.log(`🎯 Starting final score calculation with ${currentPendingEvaluations.length} pending evaluations`);
      console.log('📊 Player guesses:', currentPlayerGuesses);
      console.log('📋 Pending evaluations:', currentPendingEvaluations.map(p => ({ imageId: p.imageId, prompt: p.prompt })));
      
      // Start async calculation
      (async () => {
        try {
          // Wait for all pending evaluations to complete
          const allResults = await waitForAllEvaluations(currentPendingEvaluations);
          
          console.log(`✅ Received ${allResults.length} results from evaluations`);
          
          // Calculate detailed scores for each round
          const detailedScores = currentPlayerGuesses.map((guess, index) => {
            const roundResults = allResults.filter(result => {
              const evaluation = currentPendingEvaluations.find(p => p.imageId === result.imageId);
              return evaluation?.prompt === guess;
            });
            
            const totalScore = roundResults.length > 0 
              ? Math.round(roundResults.reduce((sum, r) => sum + (parseInt(r.score) || 0), 0) / roundResults.length)
              : 0;

            console.log(`📈 Round ${index + 1} (${guess}): ${roundResults.length} results, score: ${totalScore}`);

            return {
              round: index + 1,
              prompt: guess,
              totalScore,
              breakdown: roundResults
            };
          });

          // Calculate final total score
          const finalScore = detailedScores.reduce((sum, round) => sum + round.totalScore, 0);

          console.log(`🏆 Final calculation complete. Total score: ${finalScore}`);
          console.log(`📊 Detailed scores:`, detailedScores);

          // Update player with final results
          const finalPlayer = {
            ...prev.player,
            score: finalScore,
            detailedScores
          };

          setGameState(latest => ({
            ...latest,
            player: finalPlayer,
            gameEnded: true,
            showResult: false,
            isCalculatingFinalScore: false
          }));

        } catch (error) {
          console.error('💥 Error calculating final scores:', error);
          
          // Fallback: end game with current state
          setGameState(latest => ({
            ...latest,
            gameEnded: true,
            showResult: false,
            isCalculatingFinalScore: false
          }));
        }
      })();

      return {
        ...prev,
        isCalculatingFinalScore: true
      };
    });
  };

  const nextTurn = () => {
    const isLastRound = gameState.round === gameState.maxRounds;

    if (isLastRound) {
      // Game over - calculate final scores
      // Use a small delay to ensure state updates from handleGuess have taken effect
      setTimeout(() => {
        calculateFinalScores();
      }, 100);
    } else {
      // Next round - move to next image
      setGameState(prev => ({
        ...prev,
        round: prev.round + 1,
        currentImageIndex: prev.round, // Use round number as index (0-4)
        showResult: false,
        timeRemaining: ROUND_TIME,
        isTimerActive: true
      }));
    }
  };

  const resetGame = () => {
    setGameState({
      currentImageIndex: 0,
      round: 1,
      maxRounds: MAX_ROUNDS,
      player: {
        name: "",
        score: 0,
        guesses: [],
        detailedScores: []
      },
      gameStarted: false,
      gameEnded: false,
      showResult: false,
      timeRemaining: ROUND_TIME,
      isTimerActive: false,
      pendingEvaluations: [],
      isCalculatingFinalScore: false,
    });
  };

  const currentImage = gameImages[gameState.currentImageIndex];

  if (!gameState.gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        {/* Header Section */}
        <div className="text-center mb-12 max-w-4xl">
          <div className="text-gray-400 text-sm font-medium mb-12 tracking-wider uppercase">
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Reverse engineer AI.{" "}
            <span className="text-cyan-500">
              Guess the prompt
            </span>
          </h1>

          <p className="text-lg text-gray-300 max-w-3xl mb-8 leading-relaxed text-center">
            We show you 5 stunning images, one at a time. Your job is to create prompts that would generate similar images. Your prompts are instantly evaluated against ALL images by real AI!
          </p>

          {/* Example Challenge */}
          {/* <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
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
          </div> */}
        </div>
        
        <GameModeSelector onStartGame={startGame} />
      </div>
    );
  }

  if (gameState.gameEnded) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <GameResult player={gameState.player} onRestart={resetGame} />
      </div>
    );
  }

  if (gameState.isCalculatingFinalScore) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-8">
            <h2 className="text-3xl font-bold text-white mb-6">🎮 Game Complete!</h2>
            <div className="mb-6">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-400 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold text-white mb-4">
                🤖 Calculating Final Score...
              </h3>
              <p className="text-gray-300 mb-4">
                Your AI is analyzing all {gameState.pendingEvaluations.length} prompt evaluations
              </p>
              <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full animate-pulse" style={{ width: '80%' }}></div>
              </div>
              <p className="text-blue-400 text-sm">
                This may take a moment...
              </p>
            </div>
          </div>
        </div>
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
            <p className="text-sm text-gray-300">Player</p>
            <p className="font-semibold">{gameState.player.name}</p>
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
            isEvaluating={false}
            roundNumber={gameState.round}
            totalRounds={gameState.maxRounds}
          />
        </div>

        {/* Right Side - Game Controls */}
        <div className="lg:w-1/2 flex flex-col">
          {/* Score Board */}
          <div className="mb-6">
            <ScoreBoard
              player={gameState.player}
              round={gameState.round}
              maxRounds={gameState.maxRounds}
            />
          </div>

          {/* Guess Input */}
          <div className="flex-1">
            {gameState.isCalculatingFinalScore ? (
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">🤖 Calculating Final Score...</h3>
                <p className="text-gray-300 mb-4">
                  Processing all your prompts against the 5 images
                </p>
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div 
                    className="bg-blue-500 h-3 rounded-full transition-all duration-1000 animate-pulse"
                    style={{ width: '75%' }}
                  ></div>
                </div>
                <p className="text-blue-400 text-sm">
                  {gameState.pendingEvaluations.length} evaluations pending...
                </p>
              </div>
            ) : gameState.showResult ? (
              <div className="bg-black/50 backdrop-blur-sm rounded-lg p-6 text-center">
                <h3 className="text-xl font-bold text-white mb-4">✅ Prompt Submitted!</h3>
                
                <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-4 mb-4">
                  <p className="text-green-400 font-bold text-lg mb-2">
                    Evaluation Started in Background
                  </p>
                  <p className="text-gray-300 text-sm">
                    Your prompt is being scored against all 5 images
                  </p>
                </div>
                
                <div className="text-left space-y-2 mb-4">
                  <p className="text-gray-300 text-sm">Current Progress:</p>
                  <div className="bg-gray-800/50 rounded px-3 py-2">
                    <span className="text-blue-400 text-sm">
                      Round {gameState.round} of {gameState.maxRounds} completed
                    </span>
                  </div>
                  <div className="bg-gray-800/50 rounded px-3 py-2">
                    <span className="text-yellow-400 text-sm">
                      {gameState.pendingEvaluations.length} evaluations running...
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-400 text-sm mt-4">
                  {gameState.round === gameState.maxRounds 
                    ? 'Preparing final results...' 
                    : 'Moving to next image...'}
                </p>
              </div>
            ) : (
              <GuessInput
                onSubmitGuess={handleGuess}
                disabled={!gameState.isTimerActive}
                currentPlayer={gameState.player.name}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
