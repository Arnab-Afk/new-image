"use client";

import { Player } from "../GuessThePromptGame";

interface ScoreBoardProps {
  players: Player[];
  currentPlayerIndex: number;
}

export function ScoreBoard({ players, currentPlayerIndex }: ScoreBoardProps) {
  // Sort players by score for ranking
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
      <h3 className="text-xl font-bold text-white text-center mb-4">
        🏆 Scoreboard
      </h3>

      <div className="space-y-3">
        {sortedPlayers.map((player, index) => {
          const isCurrentPlayer = players.findIndex(p => p.id === player.id) === currentPlayerIndex;
          const isLeader = index === 0 && player.score > 0;

          return (
            <div
              key={player.id}
              className={`flex items-center justify-between p-3 rounded-lg transition-all duration-300 ${
                isCurrentPlayer 
                  ? 'bg-blue-500/30 border border-blue-400/50 ring-2 ring-blue-400/30' 
                  : 'bg-black/30 hover:bg-black/40'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isLeader 
                    ? 'bg-yellow-500 text-black' 
                    : isCurrentPlayer
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-500 text-white'
                }`}>
                  {isLeader ? '👑' : index + 1}
                </div>
                
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-semibold">
                      {player.name}
                    </span>
                    {isCurrentPlayer && (
                      <span className="text-blue-400 text-xs animate-pulse">
                        • PLAYING
                      </span>
                    )}
                  </div>
                  
                  {player.guesses.length > 0 && (
                    <div className="text-gray-400 text-xs mt-1">
                      Last guess: "{player.guesses[player.guesses.length - 1].substring(0, 30)}
                      {player.guesses[player.guesses.length - 1].length > 30 ? '...' : ''}"
                    </div>
                  )}
                </div>
              </div>

              <div className="text-right">
                <div className={`text-lg font-bold ${
                  isLeader ? 'text-yellow-400' : 'text-white'
                }`}>
                  {player.score}
                </div>
                <div className="text-gray-400 text-xs">
                  {player.guesses.length} guess{player.guesses.length !== 1 ? 'es' : ''}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {players.length > 1 && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex justify-between text-sm text-gray-300">
            <span>Total Players:</span>
            <span>{players.length}</span>
          </div>
          <div className="flex justify-between text-sm text-gray-300">
            <span>Highest Score:</span>
            <span>{Math.max(...players.map(p => p.score))}</span>
          </div>
        </div>
      )}
    </div>
  );
}
