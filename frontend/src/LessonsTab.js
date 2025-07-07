// LessonsTab.js
import React from 'react';
import { BookOpen, Play, Lock } from 'lucide-react';

export default function LessonsTab({ units }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Lessons</h2>
        <div className="flex space-x-2">
          <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
            <option>All Units</option>
            {units.map(unit => (
              <option key={unit.id} value={unit.id}>{unit.title}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map(unit => (
          <div
            key={unit.id}
            className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 ${
              !unit.isUnlocked ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`p-3 rounded-lg ${
                  unit.colorTheme === 'blue'
                    ? 'bg-blue-100'
                    : unit.colorTheme === 'green'
                    ? 'bg-green-100'
                    : 'bg-purple-100'
                }`}
              >
                {unit.isUnlocked ? (
                  <BookOpen
                    className={`w-6 h-6 ${
                      unit.colorTheme === 'blue'
                        ? 'text-blue-600'
                        : unit.colorTheme === 'green'
                        ? 'text-green-600'
                        : 'text-purple-600'
                    }`}
                  />
                ) : (
                  <Lock className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  unit.difficulty === 'beginner'
                    ? 'bg-green-100 text-green-800'
                    : unit.difficulty === 'intermediate'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {unit.difficulty}
              </span>
            </div>

            <h3 className="text-lg font-bold text-gray-900 mb-2">{unit.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{unit.description}</p>

            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Progress</span>
                <span className="font-medium">
                  {unit.completedLessons}/{unit.lessons} lessons
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${
                    unit.colorTheme === 'blue'
                      ? 'bg-blue-500'
                      : unit.colorTheme === 'green'
                      ? 'bg-green-500'
                      : 'bg-purple-500'
                  }`}
                  style={{ width: `${unit.progress}%` }}
                />
              </div>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">+{unit.xpReward} XP</span>
              <button
                disabled={!unit.isUnlocked}
                className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                  unit.isUnlocked
                    ? `${
                        unit.colorTheme === 'blue'
                          ? 'bg-blue-600 hover:bg-blue-700'
                          : unit.colorTheme === 'green'
                          ? 'bg-green-600 hover:bg-green-700'
                          : 'bg-purple-600 hover:bg-purple-700'
                      } text-white`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {unit.isUnlocked ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                <span>{unit.isUnlocked ? 'Start' : 'Locked'}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
