// DashboardTab.js
import React from 'react';
import { BookOpen, Trophy, Target, Clock, Flame, Star, Play, Medal, Zap, Brain, TrendingUp } from 'lucide-react';

export default function DashboardTab({ user, units, stats, setActiveTab }) {
  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue', trend }) => (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`p-3 rounded-lg ${color === 'blue' ? 'bg-blue-100' : color === 'green' ? 'bg-green-100' : color === 'yellow' ? 'bg-yellow-100' : 'bg-purple-100'}`}>
            <Icon className={`w-6 h-6 ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`} />
          </div>
          <div>
            <p className="text-gray-600 text-sm font-medium">{title}</p>
            <p className={`text-2xl font-bold ${color === 'blue' ? 'text-blue-600' : color === 'green' ? 'text-green-600' : color === 'yellow' ? 'text-yellow-600' : 'text-purple-600'}`}>{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          </div>
        </div>
        {trend && (
          <div className="flex items-center space-x-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">+{trend}%</span>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-2">Welcome back, {user?.username}!</h2>
            <p className="text-blue-100 text-lg">Ready to continue your math journey?</p>
            <div className="flex items-center space-x-6 mt-4">
              <div className="flex items-center space-x-2">
                <Flame className="w-5 h-5 text-orange-300" />
                <span className="font-semibold">{user?.streak} day streak</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-300" />
                <span className="font-semibold">Level {user?.level}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="bg-white/20 rounded-lg p-4">
              <p className="text-sm text-blue-100">XP Progress</p>
              <p className="text-2xl font-bold">{user?.xp}</p>
              <div className="w-32 bg-white/30 rounded-full h-2 mt-2">
                <div
                  className="bg-white h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(user?.xp / (user?.xp + user?.xpToNextLevel)) * 100}%` }}
                />
              </div>
              <p className="text-xs text-blue-100 mt-1">{user?.xpToNextLevel} XP to next level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={BookOpen} title="Lessons Completed" value={user?.totalLessonsCompleted} color="blue" trend={12} />
        <StatCard icon={Trophy} title="Challenges Won" value={user?.totalChallengesCompleted} color="yellow" trend={8} />
        <StatCard icon={Target} title="Average Score" value={`${stats.averageScore}%`} color="green" trend={5} />
        <StatCard icon={Clock} title="Time Spent" value={`${Math.floor(stats.totalTimeSpent / 60)}h ${stats.totalTimeSpent % 60}m`} color="purple" trend={15} />
      </div>

      {/* Continue Learning */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Continue Learning</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {units.filter(unit => unit.isUnlocked && unit.progress < 100).map(unit => (
            <div key={unit.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${unit.colorTheme === 'blue' ? 'bg-blue-100' : unit.colorTheme === 'green' ? 'bg-green-100' : 'bg-purple-100'}`}>
                  <BookOpen className={`w-5 h-5 ${unit.colorTheme === 'blue' ? 'text-blue-600' : unit.colorTheme === 'green' ? 'text-green-600' : 'text-purple-600'}`} />
                </div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  unit.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                  unit.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {unit.difficulty}
                </span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">{unit.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{unit.description}</p>
              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Progress</span>
                  <span className="font-medium">{unit.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${unit.colorTheme === 'blue' ? 'bg-blue-500' : unit.colorTheme === 'green' ? 'bg-green-500' : 'bg-purple-500'}`}
                    style={{ width: `${unit.progress}%` }}
                  />
                </div>
              </div>
              <button
                onClick={() => setActiveTab('lessons')}
                className={`w-full text-white py-2 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  unit.colorTheme === 'blue' ? 'bg-blue-600 hover:bg-blue-700' :
                  unit.colorTheme === 'green' ? 'bg-green-600 hover:bg-green-700' :
                  'bg-purple-600 hover:bg-purple-700'
                }`}
              >
                <Play className="w-4 h-4" />
                <span>Continue</span>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Practice & Achievements */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Quick Practice</h3>
          <div className="space-y-3">
            <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center space-x-2">
              <Zap className="w-5 h-5" />
              <span>5-Minute Drill</span>
            </button>
            <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 flex items-center justify-center space-x-2">
              <Brain className="w-5 h-5" />
              <span>Mixed Practice</span>
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Achievements</h3>
          <div className="space-y-3">
            {user?.achievements?.slice(0, 2).map(achievement => (
              <div key={achievement.id} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Medal className="w-4 h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
