import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Play, Lock, ChevronDown, ChevronRight, CheckCircle, Circle } from 'lucide-react';

export default function LessonsTab({ units }) {
  const [expandedUnit, setExpandedUnit] = useState(null);

  const toggleUnit = (unitId) => {
    setExpandedUnit(expandedUnit === unitId ? null : unitId);
  };

  const getLessonsForUnit = (unitId) => {
  return units.find((u) => u.id === unitId)?.lessons || [];
};

const navigate = useNavigate(); 

const handleLessonClick = (unitId, lessonIndex) => {
  navigate(`/learner-dashboard/lesson/${unitId}/${lessonIndex}`);
};

const handleStartClick = (unitId) => {
  navigate(`/learner-dashboard/lesson/${unitId}/0`);
};


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

      {/* Units List */}
      <div className="space-y-4">
        {units.map(unit => (
          <div
            key={unit.id}
            className={`bg-white rounded-xl shadow-lg border border-gray-100 transition-all duration-300 ${
              !unit.isUnlocked ? 'opacity-60' : ''
            }`}
          >
            {/* Unit Header */}
            <div
              className={`p-6 cursor-pointer hover:bg-gray-50 transition-colors ${
                unit.isUnlocked ? '' : 'cursor-not-allowed'
              }`}
              onClick={() => unit.isUnlocked && toggleUnit(unit.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
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
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{unit.title}</h3>
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
                    <p className="text-gray-600 text-sm mb-3">{unit.description}</p>
                    
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">Progress:</span>
                        <span className="font-medium text-sm">
                          {unit.completedLessons}/{unit.totalLessons} lessons
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">+{unit.xpReward} XP</span>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
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
                </div>
                
                <div className="flex items-center space-x-4">
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
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartClick(unit.id);
                    }}
                  >
                    {unit.isUnlocked ? <Play className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    <span>{unit.isUnlocked ? 'Start' : 'Locked'}</span>
                  </button>
                  
                  {unit.isUnlocked && (
                    <div className="text-gray-400">
                      {expandedUnit === unit.id ? (
                        <ChevronDown className="w-5 h-5" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Expanded Lessons */}
            {expandedUnit === unit.id && unit.isUnlocked && (
              <div className="border-t border-gray-100 bg-gray-50">
                <div className="p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Lessons</h4>
                  <div className="space-y-3">
                    {getLessonsForUnit(unit.id).map((lesson, index) => (
                      <div
                        key={lesson.id}
                        className="bg-white rounded-lg p-4 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                        onClick={() => handleLessonClick(unit.id, index)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="flex-shrink-0">
                              {lesson.completed ? (
                                <CheckCircle className="w-5 h-5 text-green-500" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{lesson.title}</h5>
                              <p className="text-sm text-gray-500">{lesson.duration}</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {lesson.completed && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Completed
                              </span>
                            )}
                            <Play className="w-4 h-4 text-gray-400" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}