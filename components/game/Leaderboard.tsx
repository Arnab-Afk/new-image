"use client";

import { useState, useEffect } from "react";
import { getLeaderboard, LeaderboardEntry, LeaderboardResponse } from "@/lib/gameApi";

interface LeaderboardProps {
  isVisible: boolean;
  onClose: () => void;
}

export function Leaderboard({ isVisible, onClose }: LeaderboardProps) {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isVisible) {
      fetchLeaderboard();
    }
  }, [isVisible]);

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getLeaderboard();
      setLeaderboardData(data);
    } catch (err) {
      setError('Failed to load leaderboard');
      console.error('Error fetching leaderboard:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    return `${seconds.toFixed(1)}s`;
  };

  const getRankEmoji = (rank: number) => {
    switch (rank) {
      case 1: return "🥇";
      case 2: return "🥈";
      case 3: return "🥉";
      default: return "🏅";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 400) return "text-yellow-400";
    if (score >= 300) return "text-green-400";
    if (score >= 200) return "text-blue-400";
    if (score >= 100) return "text-orange-400";
    return "text-red-400";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-white/20">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            🏆 Global Leaderboard
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors text-2xl"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mb-4"></div>
              <p className="text-gray-300">Loading leaderboard...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-400 mb-4">{error}</p>
              <button
                onClick={fetchLeaderboard}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {leaderboardData && !isLoading && !error && (
            <>
              {/* Stats Summary */}
              <div className="mb-6 text-center">
                <p className="text-gray-300">
                  Showing top {leaderboardData.leaderboard.length} of {leaderboardData.total_entries} players
                </p>
                <p className="text-gray-400 text-sm">
                  Sorted by {leaderboardData.sorted_by} ({leaderboardData.order})
                </p>
              </div>

              {/* Leaderboard Table */}
              <div className="space-y-3">
                {leaderboardData.leaderboard.map((entry: LeaderboardEntry) => (
                  <div
                    key={entry.id}
                    className={`bg-black/30 border border-white/10 rounded-lg p-4 hover:bg-black/40 transition-colors ${
                      entry.rank <= 3 ? 'border-yellow-400/30 bg-yellow-400/5' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      {/* Left side - Rank and Name */}
                      <div className="flex items-center space-x-4">
                        <div className="text-2xl font-bold flex items-center">
                          <span className="mr-2">{getRankEmoji(entry.rank)}</span>
                          <span className="text-white">#{entry.rank}</span>
                        </div>
                        
                        <div>
                          <div className="text-lg font-semibold text-white">
                            {entry.name}
                          </div>
                          <div className="text-sm text-gray-400">
                            {new Date(entry.submitted_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Right side - Score and Stats */}
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${getScoreColor(entry.score)}`}>
                          {entry.score}
                        </div>
                        <div className="text-sm text-gray-400">
                          points
                        </div>
                      </div>
                    </div>

                    {/* Stats Row */}
                    <div className="mt-3 flex justify-between text-sm">
                      <div className="flex space-x-6">
                        <div>
                          <span className="text-gray-400">Total Time:</span>
                          <span className="text-white ml-1">{formatTime(entry.total_time)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Avg Time:</span>
                          <span className="text-white ml-1">{formatTime(entry.average_time)}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Fastest:</span>
                          <span className="text-green-400 ml-1">{formatTime(entry.fastest_guess)}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* No entries message */}
              {leaderboardData.leaderboard.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-300 text-lg mb-2">No scores yet!</p>
                  <p className="text-gray-400">Be the first to submit a score to the leaderboard.</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-white/20 text-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
