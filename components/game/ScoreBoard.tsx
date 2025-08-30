"use client";

import { Player } from "../GuessThePromptGame";

interface ScoreBoardProps {
  player: Player;
  round: number;
  maxRounds: number;
}

export function ScoreBoard({ player, round, maxRounds }: ScoreBoardProps) {
  const getScoreStatus = (score: number) => {
    if (score >= 400) return { status: "Excellent!", color: "text-yellow-400", emoji: "🏆" };
    if (score >= 300) return { status: "Great!", color: "text-green-400", emoji: "⭐" };
    if (score >= 200) return { status: "Good", color: "text-blue-400", emoji: "👍" };
    if (score >= 100) return { status: "Fair", color: "text-orange-400", emoji: "📈" };
    return { status: "Keep trying!", color: "text-gray-400", emoji: "🎯" };
  };

  const scoreStatus = getScoreStatus(player.score);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white text-center mb-4">
        � Progress
      </h3>

      <div className="space-y-4">
        {/* Player Info */}
        <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-400/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold">
              {player.name.charAt(0).toUpperCase()}
            </div>
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-white font-semibold">
                  {player.name}
                </span>
                <span className="text-blue-400 text-xs animate-pulse">
                  • PLAYING
                </span>
              </div>
              
              {player.guesses.length > 0 && (
                <div className="text-gray-400 text-xs mt-1">
                  Last guess: "{player.guesses[player.guesses.length - 1].substring(0, 25)}
                  {player.guesses[player.guesses.length - 1].length > 25 ? '...' : ''}"
                </div>
              )}
            </div>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-white">
              {player.score}
            </div>
            <div className="text-gray-400 text-xs">
              points
            </div>
          </div>
        </div>

        {/* Game Progress */}
        <div className="space-y-3">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Round Progress:</span>
            <span className="text-white font-semibold">{round} / {maxRounds}</span>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(round / maxRounds) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex justify-between text-sm text-gray-300">
            <span>Performance:</span>
            <span className={`${scoreStatus.color} font-semibold`}>
              {scoreStatus.emoji} {scoreStatus.status}
            </span>
          </div>
          
          <div className="flex justify-between text-sm text-gray-300">
            <span>Total Guesses:</span>
            <span className="text-white font-semibold">
              {player.guesses.length}
            </span>
          </div>
          
          {player.guesses.length > 0 && (
            <div className="flex justify-between text-sm text-gray-300">
              <span>Avg per Guess:</span>
              <span className="text-white font-semibold">
                {Math.round(player.score / player.guesses.length)} pts
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
