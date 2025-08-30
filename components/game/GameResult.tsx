"use client";

import { Player } from "../GuessThePromptGame";

interface GameResultProps {
  player: Player;
  onRestart: () => void;
}

export function GameResult({ player, onRestart }: GameResultProps) {
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

      {/* Best Guesses */}
      {player.guesses.length > 0 && (
        <div className="mb-8">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              💡 Your Guesses
            </h3>
            
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {player.guesses.slice(-5).reverse().map((guess, index) => (
                <div key={index} className="bg-black/30 rounded-lg p-3">
                  <div className="text-blue-400 text-xs font-semibold">
                    Guess #{player.guesses.length - index}:
                  </div>
                  <div className="text-white text-sm">
                    "{guess.substring(0, 80)}
                    {guess.length > 80 ? '...' : ''}"
                  </div>
                </div>
              ))}
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

      <div className="text-center mt-8">
        <p className="text-gray-400 text-sm">
          Thanks for playing! Think you can outsmart the AI better next time? 🤖
        </p>
      </div>
    </div>
  );
}
