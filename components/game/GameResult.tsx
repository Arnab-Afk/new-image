"use client";

import { Player } from "../GuessThePromptGame";

interface GameResultProps {
  players: Player[];
  onRestart: () => void;
}

export function GameResult({ players, onRestart }: GameResultProps) {
  // Sort players by score
  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
  const winner = sortedPlayers[0];
  const isMultiplayer = players.length > 1;

  const getPositionEmoji = (index: number) => {
    switch (index) {
      case 0: return "🥇";
      case 1: return "🥈";
      case 2: return "🥉";
      default: return "🏅";
    }
  };

  const getPositionText = (index: number) => {
    switch (index) {
      case 0: return "1st Place";
      case 1: return "2nd Place";
      case 2: return "3rd Place";
      default: return `${index + 1}th Place`;
    }
  };

  const getTotalGuesses = () => {
    return players.reduce((total, player) => total + player.guesses.length, 0);
  };

  const getAverageScore = () => {
    const totalScore = players.reduce((total, player) => total + player.score, 0);
    return Math.round(totalScore / players.length);
  };

  return (
    <div className="max-w-4xl w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-bold text-white mb-4">
          🎉 Game Over! 🎉
        </h1>
        {isMultiplayer ? (
          <div>
            <p className="text-2xl text-yellow-400 mb-2">
              Congratulations, {winner.name}!
            </p>
            <p className="text-lg text-gray-300">
              You are the ultimate prompt guesser! 🏆
            </p>
          </div>
        ) : (
          <div>
            <p className="text-2xl text-blue-400 mb-2">
              Final Score: {winner.score} points!
            </p>
            <p className="text-lg text-gray-300">
              {winner.score >= 400 ? "Amazing! You're a prompt master! 🧠" :
               winner.score >= 300 ? "Great job! You know AI art well! 🎨" :
               winner.score >= 200 ? "Good work! Keep practicing! 💪" :
               "Not bad! Try again to improve your score! 🚀"}
            </p>
          </div>
        )}
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Final Rankings */}
        <div className="lg:col-span-2">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-6 text-center">
              🏆 Final Rankings
            </h3>
            
            <div className="space-y-4">
              {sortedPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex items-center justify-between p-4 rounded-lg ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30' 
                      : index === 1
                      ? 'bg-gradient-to-r from-gray-400/20 to-gray-500/20 border border-gray-400/30'
                      : index === 2
                      ? 'bg-gradient-to-r from-orange-600/20 to-orange-700/20 border border-orange-400/30'
                      : 'bg-black/30 border border-gray-600/30'
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">
                      {getPositionEmoji(index)}
                    </div>
                    <div>
                      <div className="text-white font-bold text-lg">
                        {player.name}
                      </div>
                      <div className="text-gray-300 text-sm">
                        {getPositionText(index)} • {player.guesses.length} guesses
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
              ))}
            </div>
          </div>
        </div>

        {/* Game Statistics */}
        <div className="space-y-6">
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              📊 Game Stats
            </h3>
            
            <div className="space-y-3">
              <div className="flex justify-between text-gray-300">
                <span>Total Players:</span>
                <span className="text-white font-semibold">{players.length}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Total Guesses:</span>
                <span className="text-white font-semibold">{getTotalGuesses()}</span>
              </div>
              
              <div className="flex justify-between text-gray-300">
                <span>Highest Score:</span>
                <span className="text-yellow-400 font-semibold">{winner.score}</span>
              </div>
              
              {isMultiplayer && (
                <div className="flex justify-between text-gray-300">
                  <span>Average Score:</span>
                  <span className="text-white font-semibold">{getAverageScore()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Best Guesses */}
          <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 text-center">
              💡 Most Creative Guesses
            </h3>
            
            <div className="space-y-2">
              {players
                .flatMap(player => 
                  player.guesses.map(guess => ({ player: player.name, guess }))
                )
                .slice(0, 3)
                .map((item, index) => (
                  <div key={index} className="bg-black/30 rounded-lg p-3">
                    <div className="text-blue-400 text-xs font-semibold">
                      {item.player}:
                    </div>
                    <div className="text-white text-sm">
                      "{item.guess.substring(0, 60)}
                      {item.guess.length > 60 ? '...' : ''}"
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

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
                text: `I just scored ${winner.score} points in Guess the Prompt! Can you beat my score?`,
                url: window.location.href,
              });
            } else {
              // Fallback for browsers without native sharing
              navigator.clipboard.writeText(
                `I just scored ${winner.score} points in Guess the Prompt! Can you beat my score? ${window.location.href}`
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
