import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, BookOpen, Play, CheckCircle, Circle,
  ArrowLeft, Home, Trophy, Clock, Target
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';

export default function VedicLessonPage() {
  const { unitId, lessonIndex } = useParams();
  const navigate = useNavigate();

  const [unit, setUnit] = useState(null);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(parseInt(lessonIndex));
  const [completedExercises, setCompletedExercises] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState({});
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const [currentExercise, setCurrentExercise] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const fetchUnit = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:5000/api/units`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const allUnits = await res.json();
        const foundUnit = allUnits.find((u) => u.id.toString() === unitId);
        setUnit(foundUnit);
      } catch (error) {
        console.error('Error fetching unit:', error);
      }
    };

    fetchUnit();
  }, [unitId]);

  // Add loading check and validation
  if (!unit) return <div className="p-10 text-center text-gray-500">Loading lesson...</div>;
  
  if (!unit.lessons || unit.lessons.length === 0) {
    return <div className="p-10 text-center text-gray-500">No lessons available for this unit.</div>;
  }

  if (currentLessonIndex >= unit.lessons.length) {
    return <div className="p-10 text-center text-gray-500">Lesson not found.</div>;
  }

  const currentLesson = unit.lessons[currentLessonIndex];
  const totalLessons = unit.lessons.length;

  // Add validation for current lesson structure
  if (!currentLesson) {
    return <div className="p-10 text-center text-gray-500">Lesson data not available.</div>;
  }

  const handleAnswerSubmit = (answer) => {
    if (!currentLesson.exercises || !currentLesson.exercises[currentExercise]) {
      console.error('Exercise data not available');
      return;
    }

    const numericAnswer = parseInt(answer);
    const isCorrect = numericAnswer === currentLesson.exercises[currentExercise].answer;

    setUserAnswers(prev => ({
      ...prev,
      [`${currentLesson.id}-${currentExercise}`]: numericAnswer
    }));

    setShowResults(prev => ({
      ...prev,
      [`${currentLesson.id}-${currentExercise}`]: isCorrect
    }));

    if (isCorrect && !completedExercises.includes(`${currentLesson.id}-${currentExercise}`)) {
      setCompletedExercises(prev => [...prev, `${currentLesson.id}-${currentExercise}`]);
    }

    setShowExplanation(true);
  };

  const handleNextExercise = () => {
    const exercisesLength = currentLesson.exercises ? currentLesson.exercises.length : 0;
    if (currentExercise < exercisesLength - 1) {
      setCurrentExercise(currentExercise + 1);
      setShowExplanation(false);
    } else {
      setExerciseStarted(false);
      setCurrentExercise(0);
      setShowExplanation(false);
    }
  };

  const startExercises = () => {
    setExerciseStarted(true);
    setCurrentExercise(0);
    setShowExplanation(false);
  };

  const goToNextLesson = () => {
    if (currentLessonIndex < totalLessons - 1) {
      setCurrentLessonIndex(currentLessonIndex + 1);
      setExerciseStarted(false);
      setCurrentExercise(0);
      setShowExplanation(false);
    }
  };

  const goToPreviousLesson = () => {
    if (currentLessonIndex > 0) {
      setCurrentLessonIndex(currentLessonIndex - 1);
      setExerciseStarted(false);
      setCurrentExercise(0);
      setShowExplanation(false);
    }
  };

  const getCompletedExercisesCount = () => {
    if (!currentLesson.exercises) return 0;
    return currentLesson.exercises.filter((_, index) =>
      completedExercises.includes(`${currentLesson.id}-${index}`)
    ).length;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Safe access to lesson data with defaults
  const exercisesCount = currentLesson.exercises ? currentLesson.exercises.length : 0;
  const sections = currentLesson.contentJson?.sections || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button onClick={() => navigate('/learner-dashboard/lessons')} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 transition-colors">
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Lessons</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div className="flex items-center space-x-2">
                <Home className="w-4 h-4 text-gray-400" />
                <span className="text-gray-400">/</span>
                <span className="text-gray-600">{unit.title}</span>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-800">{currentLesson.title}</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Lesson {currentLessonIndex + 1} of {totalLessons}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              {/* Lesson Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold mb-2">{currentLesson.title}</h1>
                    <div className="flex items-center space-x-4 text-blue-100">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm">{currentLesson.duration || 'N/A'}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(currentLesson.difficulty)}`}>
                        {currentLesson.difficulty || 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Lesson Content */}
              <div className="p-6">
                <div className="prose max-w-none">
                  {/* Lesson Description */}
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-8">
                    <p className="text-gray-700 text-lg">{currentLesson.description || 'No description available'}</p>
                  </div>

                  {/* Sections (Topics) */}
                  {sections.length > 0 ? (
                    sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="mb-10">
                        {/* Topic Name (Heading) */}
                        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b-2 border-blue-200 pb-2">
                          {section.topic}
                        </h2>

                        {/* Methods */}
                        <div className="space-y-8">
                          {(section.methods || []).map((method, methodIndex) => (
                            <div key={methodIndex} className="bg-gray-50 rounded-lg p-6">
                              {/* Method Heading (Numbered) */}
                              <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center space-x-2">
                                <span className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full font-medium">
                                  {methodIndex + 1}
                                </span>
                                <span>{method.name}</span>
                              </h3>

                              {/* Method Description */}
                              <p className="text-gray-700 mb-4 italic">{method.description}</p>

                              {/* Steps (Ordered List) */}
                              {method.steps && method.steps.length > 0 && (
                                <>
                                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Steps:</h4>
                                  <ol className="space-y-2 mb-6 ml-4">
                                    {method.steps.map((step, stepIndex) => (
                                      <li key={stepIndex} className="flex items-start space-x-2">
                                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-medium min-w-[24px] text-center">
                                          {stepIndex + 1}
                                        </span>
                                        <span className="text-gray-700">{step}</span>
                                      </li>
                                    ))}
                                  </ol>
                                </>
                              )}

                              {/* Examples */}
                              {method.examples && method.examples.length > 0 && (
                                <>
                                  <h4 className="text-lg font-semibold text-gray-800 mb-4">Examples:</h4>
                                  <div className="space-y-4">
                                    {method.examples.map((example, exampleIndex) => (
                                      <div key={exampleIndex} className="bg-white rounded-lg p-4 border border-gray-200">
                                        <div className="font-bold text-lg text-gray-800 mb-3">
                                          Problem: {example.problem}
                                        </div>
                                        
                                        {/* Steps in Example (Ordered) */}
                                        {example.steps && example.steps.length > 0 && (
                                          <div className="mb-4">
                                            <h5 className="font-medium text-gray-700 mb-2">Solution Steps:</h5>
                                            <ol className="space-y-2 ml-4">
                                              {example.steps.map((step, stepIndex) => (
                                                <li key={stepIndex} className="flex items-start space-x-2">
                                                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full font-medium min-w-[24px] text-center">
                                                    {stepIndex + 1}
                                                  </span>
                                                  <span className="text-gray-700">{step}</span>
                                                </li>
                                              ))}
                                            </ol>
                                          </div>
                                        )}
                                        
                                        <div className="p-3 bg-green-50 border border-green-200 rounded">
                                          <span className="font-bold text-green-800">Answer: {example.answer}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <p>No content sections available for this lesson.</p>
                    </div>
                  )}

                  {/* Practice Exercises Section */}
                  {exercisesCount > 0 && (
                    <div className="mt-12 border-t-2 border-gray-200 pt-8">
                      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center space-x-2">
                        <Target className="w-6 h-6 text-blue-600" />
                        <span>Practice Exercises</span>
                      </h2>

                      {!exerciseStarted ? (
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
                          <div className="mb-6">
                            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-gray-800 mb-2">Ready to Practice?</h3>
                            <p className="text-gray-600">
                              Test your understanding with {exercisesCount} practice problems. 
                              Each question will be presented one at a time with detailed explanations.
                            </p>
                          </div>
                          <div className="flex items-center justify-center space-x-4 mb-6">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">{exercisesCount}</div>
                              <div className="text-sm text-gray-500">Questions</div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">{getCompletedExercisesCount()}</div>
                              <div className="text-sm text-gray-500">Completed</div>
                            </div>
                          </div>
                          <button
                            onClick={startExercises}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 mx-auto"
                          >
                            <Play className="w-5 h-5" />
                            <span>Start Practice</span>
                          </button>
                        </div>
                      ) : (
                        <div className="bg-white rounded-xl border border-gray-200 p-6">
                          <div className="flex items-center justify-between mb-6">
                            <h3 className="text-lg font-bold text-gray-800">
                              Question {currentExercise + 1} of {exercisesCount}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                  style={{ width: `${((currentExercise + 1) / exercisesCount) * 100}%` }}
                                />
                              </div>
                              <span className="text-sm text-gray-500">
                                {Math.round(((currentExercise + 1) / exercisesCount) * 100)}%
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-50 rounded-lg p-6">
                            <div className="text-center mb-6">
                              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                                {currentLesson.exercises[currentExercise].problem}
                              </h4>
                              <p className="text-gray-600">Enter your answer below</p>
                            </div>

                            {!showExplanation ? (
                              <div className="flex items-center justify-center space-x-4">
                                <input
                                  type="number"
                                  placeholder="Your answer"
                                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-center w-40"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAnswerSubmit(e.target.value);
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = e.target.parentElement.querySelector('input');
                                    handleAnswerSubmit(input.value);
                                  }}
                                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                                >
                                  Submit Answer
                                </button>
                              </div>
                            ) : (
                              <div className="space-y-4">
                                <div className={`p-4 rounded-lg border ${
                                  showResults[`${currentLesson.id}-${currentExercise}`]
                                    ? 'bg-green-50 border-green-200'
                                    : 'bg-red-50 border-red-200'
                                }`}>
                                  <div className="flex items-center space-x-2 mb-2">
                                    {showResults[`${currentLesson.id}-${currentExercise}`] ? (
                                      <CheckCircle className="w-5 h-5 text-green-600" />
                                    ) : (
                                      <Circle className="w-5 h-5 text-red-600" />
                                    )}
                                    <span className={`font-bold ${
                                      showResults[`${currentLesson.id}-${currentExercise}`]
                                        ? 'text-green-800'
                                        : 'text-red-800'
                                    }`}>
                                      {showResults[`${currentLesson.id}-${currentExercise}`] ? 'Correct!' : 'Incorrect'}
                                    </span>
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    Your answer: {userAnswers[`${currentLesson.id}-${currentExercise}`]}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    Correct answer: {currentLesson.exercises[currentExercise].answer}
                                  </p>
                                </div>

                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                  <h5 className="font-bold text-blue-800 mb-2">Explanation:</h5>
                                  <p className="text-blue-700">{currentLesson.exercises[currentExercise].explanation}</p>
                                </div>

                                <div className="flex justify-center">
                                  {currentExercise < exercisesCount - 1 ? (
                                    <button
                                      onClick={handleNextExercise}
                                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                                    >
                                      <span>Next Question</span>
                                      <ChevronRight className="w-5 h-5" />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={handleNextExercise}
                                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
                                    >
                                      <Trophy className="w-5 h-5" />
                                      <span>Complete Practice</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-8">
              <h3 className="text-lg font-bold text-gray-800 mb-4">All Lessons</h3>
              <div className="space-y-2">
                {unit.lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg cursor-pointer transition-colors ${
                      index === currentLessonIndex
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setCurrentLessonIndex(index)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${
                          index === currentLessonIndex ? 'bg-blue-500' : 'bg-gray-300'
                        }`} />
                        <span className={`text-sm ${
                          index === currentLessonIndex ? 'text-blue-700 font-medium' : 'text-gray-600'
                        }`}>
                          {lesson.title}
                        </span>
                      </div>
                      {index === currentLessonIndex && (
                        <span className="text-xs text-blue-500 font-medium">Current</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <button
              onClick={goToPreviousLesson}
              disabled={currentLessonIndex === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentLessonIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
              <span>Previous Lesson</span>
            </button>

            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">
                Lesson {currentLessonIndex + 1} of {totalLessons}
              </span>
            </div>

            <button
              onClick={goToNextLesson}
              disabled={currentLessonIndex === totalLessons - 1}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${
                currentLessonIndex === totalLessons - 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <span>Next Lesson</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}