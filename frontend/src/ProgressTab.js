// ProgressTab.js
import React from 'react';
import { Flame, Target, TrendingUp, Medal } from 'lucide-react';

export default function ProgressTab({ user, stats }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Progress</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Level</span>
              <span className="font-bold text-purple-600">{user?.level}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total XP</span>
              <span className="font-bold">{user?.xp}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Rank</span>
              <span className="font-bold text-yellow-600">{user?.rank}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Study Streak</h3>
            <Flame className="w-5 h-5 text-orange-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Current Streak</span>
              <span className="font-bold text-orange-600">{stats.currentStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Longest Streak</span>
              <span className="font-bold">{stats.longestStreak} days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">This Week</span>
              <span className="font-bold text-green-600">7/7 days</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Performance</h3>
            <Target className="w-5 h-5 text-blue-500" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Average Score</span>
              <span className="font-bold text-blue-600">{stats.averageScore}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Problems Solved</span>
              <span className="font-bold">{stats.problemsSolved}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Accuracy</span>
              <span className="font-bold text-green-600">92%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Weekly Activity</h3>
        <div className="flex items-end space-x-2 h-40">
          {stats.weeklyProgress?.map((score, index) => (
            <div key={index} className="flex-1 flex flex-col items-center">
              <div
                className="w-full bg-purple-500 rounded-t-lg transition-all duration-300 hover:bg-purple-600"
                style={{ height: `${(score / 100) * 120}px` }}
              />
              <span className="text-xs text-gray-600 mt-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Achievement Timeline */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Achievements</h3>
        <div className="space-y-4">
          {user?.achievements?.map((achievement) => (
            <div key={achievement.id} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Medal className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                <p className="text-sm text-gray-600">{achievement.description}</p>
                <p className="text-xs text-gray-500 mt-1">{achievement.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
