// ChallengesTab.js
import React from 'react';
import { Trophy, Lock, CheckCircle, Play, Timer } from 'lucide-react';

export default function ChallengesTab({ challenges }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Challenges</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500">
            <option>All Difficulties</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>
      </div>

      {/* Active Challenge */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold mb-2">Daily Challenge</h3>
            <p className="text-orange-100">Complete today's challenge to maintain your streak!</p>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-3">
              <Timer className="w-6 h-6 mx-auto mb-1" />
              <p className="text-sm">23:45:12</p>
              <p className="text-xs">remaining</p>
            </div>
          </div>
        </div>
      </div>

      {/* Challenges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <div
            key={challenge.id}
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 ${
              !challenge.isUnlocked ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className={`p-3 rounded-lg ${challenge.isUnlocked ? 'bg-orange-100' : 'bg-gray-100'}`}>
                  {challenge.isUnlocked ? (
                    <Trophy className="w-6 h-6 text-orange-600" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                <span
                  className={`text-xs font-medium px-2 py-1 rounded-full ${
                    challenge.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : challenge.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {challenge.difficulty}
                </span>
              </div>
              {challenge.isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{challenge.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{challenge.description}</p>

            <div className="space-y-2 mb-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Participants</span>
                <span className="font-medium">{challenge.participants.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Time Limit</span>
                <span className="font-medium">{Math.floor(challenge.timeLimit / 60)} minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">XP Reward</span>
                <span className="font-medium text-orange-600">+{challenge.xpReward}</span>
              </div>
            </div>

            <button
              disabled={!challenge.isUnlocked}
              className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                challenge.isUnlocked
                  ? 'bg-orange-600 text-white hover:bg-orange-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {challenge.isUnlocked ? (
                <>
                  <Play className="w-4 h-4" />
                  <span>Start Challenge</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Locked</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
