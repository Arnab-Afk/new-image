"use client";

import { useState } from "react";
import { Player } from "../GuessThePromptGame";
import { Leaderboard } from "./Leaderboard";
import { submitScore, GameData } from "@/lib/gameApi";

interface GameResultProps {
  player: Player;
  onRestart: () => void;
}

export function GameResult({ player, onRestart }: GameResultProps) {
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [scoreSubmitted, setScoreSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const getPerformanceMessage = (score: number) => {
    if (score >= 400) return "Amazing! You're a prompt master! 🧠";
    if (score >= 300) return "Great job! You know AI art well! 🎨";
    if (score >= 200) return "Good work! Keep practicing! 💪";
    return "Not bad! Try again to improve your score! 🚀";
  };

  const getScoreGrade = (score: number) => {
    if (score >= 400) return { grade: "A+", color: "text-yellow-400", emoji: "🏆" };
    if (score >= 300) return { grade: "A", color: "text-green-400", emoji: "⭐" };
    if (score >= 200) return { grade: "B", color: "text-blue-400", emoji: "👍" };
    if (score >= 100) return { grade: "C", color: "text-orange-400", emoji: "📈" };
    return { grade: "D", color: "text-red-400", emoji: "🎯" };
  };

  const handleSubmitScore = async () => {
    if (scoreSubmitted || isSubmittingScore) return;

    setIsSubmittingScore(true);
    setSubmitError(null);

    try {
      const gameData: GameData = {
        playerName: player.name,
        correctGuesses: player.score,
        totalTime: player.guessTimes.reduce((sum, time) => sum + time, 0),
        guessTimes: player.guessTimes
      };

      await submitScore(gameData);
      setScoreSubmitted(true);
    } catch (error) {
      console.error('Error submitting score:', error);
      setSubmitError('Failed to submit score. Please try again.');
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const scoreGrade = getScoreGrade(player.score);

  return (
    <div className="max-w-4xl w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          🎉 Game Complete! 🎉
        </h1>
        <div>
          <p className="text-3xl mb-4">
            <span className={`${scoreGrade.color} font-bold`}>
              {scoreGrade.emoji} Grade: {scoreGrade.grade}
            </span>
          </p>
          <p className="text-2xl text-blue-400 mb-2">
            Final Score: {player.score} points!
          </p>
          <p className="text-lg text-gray-300">
            {getPerformanceMessage(player.score)}
          </p>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Player Stats */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-6 text-center">
            📊 Your Performance
          </h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
              <div className="flex items-center space-x-4">
                <div className="text-3xl">
                  {scoreGrade.emoji}
                </div>
                <div>
                  <div className="text-white font-bold text-lg">
                    {player.name}
                  </div>
                  <div className="text-gray-300 text-sm">
                    AI Prompt Guesser • {player.guesses.length} total guesses
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-white">
                  {player.score}
                </div>
                <div className="text-gray-400 text-sm">
                  points
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
          <h3 className="text-lg font-bold text-white mb-4 text-center">
            � Game Stats
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between text-gray-300">
              <span>Total Guesses:</span>
              <span className="text-white font-semibold">{player.guesses.length}</span>
            </div>
            
            <div className="flex justify-between text-gray-300">
              <span>Final Score:</span>
              <span className={`${scoreGrade.color} font-semibold`}>{player.score}</span>
            </div>
            
            <div className="flex justify-between text-gray-300">
              <span>Grade:</span>
              <span className={`${scoreGrade.color} font-semibold`}>{scoreGrade.grade}</span>
            </div>
            
            {player.guessTimes && player.guessTimes.length > 0 && (
              <>
                <div className="flex justify-between text-gray-300">
                  <span>Total Time:</span>
                  <span className="text-white font-semibold">
                    {player.guessTimes.reduce((sum, time) => sum + time, 0)}s
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Avg Time/Round:</span>
                  <span className="text-white font-semibold">
                    {Math.round(player.guessTimes.reduce((sum, time) => sum + time, 0) / player.guessTimes.length)}s
                  </span>
                </div>
                
                <div className="flex justify-between text-gray-300">
                  <span>Fastest Round:</span>
                  <span className="text-green-400 font-semibold">
                    {Math.min(...player.guessTimes)}s
                  </span>
                </div>
              </>
            )}
            
            {player.guesses.length > 0 && (
              <div className="flex justify-between text-gray-300">
                <span>Avg per Guess:</span>
                <span className="text-white font-semibold">
                  {Math.round(player.score / player.guesses.length)} pts
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Detailed Round Breakdown */}
      {player.detailedScores && player.detailedScores.length > 0 && (
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              📊 Round by Round Breakdown
            </h3>
            
            <div className="space-y-4">
              {player.detailedScores.map((roundData, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-blue-400 font-semibold">
                      Round {roundData.round}
                    </span>
                    <div className="flex items-center space-x-4">
                      {roundData.timeTaken !== undefined && (
                        <span className="text-yellow-400 font-medium">
                          ⏱️ {roundData.timeTaken}s
                        </span>
                      )}
                      <span className="text-green-400 font-bold">
                        {roundData.totalScore}/100 pts
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-gray-300 text-sm mb-2">
                    Prompt: &quot;{roundData.prompt.substring(0, 60)}
                    {roundData.prompt.length > 60 ? '...' : ''}&quot;
                  </div>
                  
                  {roundData.breakdown && roundData.breakdown.length > 0 && (
                    <div className="grid grid-cols-5 gap-2 mt-2">
                      {roundData.breakdown.map((result, imgIndex) => (
                        <div key={result.imageId} className="text-center">
                          <div className="text-xs text-gray-400">
                            Img {imgIndex + 1}
                          </div>
                          <div className={`text-sm font-bold ${
                            result.success ? 'text-white' : 'text-red-400'
                          }`}>
                            {result.success ? `${parseInt(result.score) || 0}` : 'Error'}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Best Guesses */}
      {player.guesses.length > 0 && (
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              💡 Your Guesses
            </h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {player.guesses.slice(-5).reverse().map((guess, index) => {
                const guessIndex = player.guesses.length - 1 - index;
                const timeTaken = player.guessTimes && player.guessTimes[guessIndex];
                
                return (
                  <div key={index} className="bg-black/30 rounded-lg p-3">
                    <div className="flex justify-between items-center mb-1">
                      <div className="text-blue-400 text-xs font-semibold">
                        Guess #{guessIndex + 1}:
                      </div>
                      {timeTaken !== undefined && (
                        <div className="text-yellow-400 text-xs">
                          ⏱️ {timeTaken}s
                        </div>
                      )}
                    </div>
                    <div className="text-white text-sm">
                      &quot;{guess ? guess.substring(0, 80) : '(timed out)'}
                      {guess && guess.length > 80 ? '...' : ''}&quot;
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold text-lg"
        >
          🔄 Play Again
        </button>
        
        <button
          onClick={handleSubmitScore}
          disabled={isSubmittingScore || scoreSubmitted}
          className={`px-8 py-4 rounded-lg transition-colors font-semibold text-lg ${
            scoreSubmitted
              ? 'bg-green-500 text-white cursor-default'
              : isSubmittingScore
              ? 'bg-gray-500 text-white cursor-not-allowed'
              : 'bg-purple-500 text-white hover:bg-purple-600'
          }`}
        >
          {isSubmittingScore ? (
            <>
              <span className="inline-block animate-spin mr-2">⏳</span>
              Submitting...
            </>
          ) : scoreSubmitted ? (
            <>
              ✅ Score Submitted!
            </>
          ) : (
            <>
              🏆 Submit to Leaderboard
            </>
          )}
        </button>

        <button
          onClick={() => setShowLeaderboard(true)}
          className="px-8 py-4 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold text-lg"
        >
          🏆 View Leaderboard
        </button>
        
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: "AI Playground: Guess the Prompt",
                text: `I just scored ${player.score} points (Grade ${scoreGrade.grade}) in Guess the Prompt! Can you beat my score?`,
                url: window.location.href,
              });
            } else {
              // Fallback for browsers without native sharing
              navigator.clipboard.writeText(
                `I just scored ${player.score} points (Grade ${scoreGrade.grade}) in Guess the Prompt! Can you beat my score? ${window.location.href}`
              );
              alert("Score copied to clipboard! Share it with your friends!");
            }
          }}
          className="px-8 py-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-semibold text-lg"
        >
          📤 Share Score
        </button>
      </div>

      {/* Error Message */}
      {submitError && (
        <div className="mt-4 text-center">
          <p className="text-red-400 bg-red-400/10 border border-red-400/30 rounded-lg p-3">
            {submitError}
          </p>
        </div>
      )}

      {/* Success Message */}
      {scoreSubmitted && (
        <div className="mt-4 text-center">
          <p className="text-green-400 bg-green-400/10 border border-green-400/30 rounded-lg p-3">
            🎉 Your score has been submitted to the global leaderboard!
          </p>
        </div>
      )}

      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          Thanks for playing! Think you can outsmart the AI better next time? 🤖
        </p>
      </div>

      {/* Leaderboard Modal */}
      <Leaderboard 
        isVisible={showLeaderboard} 
        onClose={() => setShowLeaderboard(false)} 
      />
    </div>
  );
}
