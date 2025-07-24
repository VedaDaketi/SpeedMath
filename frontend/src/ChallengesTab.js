import React, { useState, useEffect } from 'react';
import {
  Trophy, Lock, CheckCircle, Play, Timer, ChevronLeft, RotateCcw,
  Award, Target, Clock, CheckCircle2, XCircle, AlertCircle
} from 'lucide-react';

export default function QuizInterface() {
  const [currentView, setCurrentView] = useState('challenges');
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [quizResults, setQuizResults] = useState(null);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/challenges", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        setQuizzes(data);
      } catch (error) {
        console.error("Failed to fetch challenges:", error);
      }
    };
    fetchQuizzes();
  }, []);

  useEffect(() => {
    let interval;
    if (currentView === 'quiz' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [currentView, timeRemaining]);

  const formatTime = (seconds) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startQuiz = async (quiz) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/quiz/${quiz.id}/questions`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setQuestions(data);
      setSelectedQuiz(quiz);
      setCurrentQuestionIndex(0);
      setAnswers({});
      setTimeRemaining(quiz.time_limit * 60 || quiz.timeLimit * 60 || 600); // default to 10 min
      setQuizStartTime(Date.now());
      setCurrentView('quiz');
    } catch (error) {
      console.error("Failed to fetch questions:", error);
    }
  };

  const handleAnswerSelect = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSaveAndNext = () => {
    // Save current answer if it exists
    const currentQuestion = questions[currentQuestionIndex];
    
    // For text input questions, get the value from the input field
    if (!Array.isArray(currentQuestion.options) || currentQuestion.options.length === 0) {
      const inputElement = document.querySelector('input[type="text"]');
      if (inputElement && inputElement.value.trim()) {
        handleAnswerSelect(currentQuestion.id, inputElement.value.trim());
      }
    }
    
    // Move to next question or submit if this is the last question
    if (currentQuestionIndex === questions.length - 1) {
      handleSubmitQuiz();
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmitQuiz = () => {
    const endTime = Date.now();
    const timeTaken = Math.floor((endTime - quizStartTime) / 1000);

    let correctAnswers = 0;
    const questionResults = questions.map(question => {
      const userAnswer = answers[question.id];
      const correct = String(userAnswer).trim().toLowerCase() === String(question.correct_answer).trim().toLowerCase();
      if (correct) correctAnswers++;
      return {
        ...question,
        userAnswer,
        isCorrect: correct
      };
    });

    const totalQuestions = questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);
    const isPassed = score >= selectedQuiz.passingScore;

    setQuizResults({
      score,
      correctAnswers,
      totalQuestions,
      timeTaken,
      isPassed,
      questionResults
    });

    setCurrentView('results');
  };

  const resetQuiz = () => {
    setCurrentView('challenges');
    setSelectedQuiz(null);
    setCurrentQuestionIndex(0);
    setAnswers({});
    setTimeRemaining(null);
    setQuizStartTime(null);
    setQuizResults(null);
    setQuestions([]);
  };

  if (currentView === 'challenges') {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800">Challenges</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quizzes.map((quiz) => (
            <div
              key={quiz.id}
              className={`bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 ${!quiz.isUnlocked ? 'opacity-60' : ''}`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${quiz.isUnlocked ? 'bg-orange-100' : 'bg-gray-100'}`}>
                    {quiz.isUnlocked ? (
                      <Trophy className="w-6 h-6 text-orange-600" />
                    ) : (
                      <Lock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                    quiz.difficulty === 'beginner'
                      ? 'bg-green-100 text-green-800'
                      : quiz.difficulty === 'intermediate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {quiz.difficulty}
                  </span>
                </div>
                {quiz.isCompleted && <CheckCircle className="w-6 h-6 text-green-500" />}
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-2">{quiz.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{quiz.description}</p>

              <div className="space-y-2 mb-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Participants</span>
                  <span className="font-medium">{quiz.participants.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time Limit</span>
                  <span className="font-medium">{Math.floor((quiz.time_limit || quiz.timeLimit || 600) / 60)} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">XP Reward</span>
                  <span className="font-medium text-orange-600">+{quiz.xpReward}</span>
                </div>
              </div>

              <button
                disabled={!quiz.isUnlocked}
                onClick={() => startQuiz(quiz)}
                className={`w-full py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2 ${
                  quiz.isUnlocked ? 'bg-orange-600 text-white hover:bg-orange-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {quiz.isUnlocked ? (
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

  if (currentView === 'quiz') {
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    const hasAnswer = answers[currentQuestion.id] !== undefined;

    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <button onClick={resetQuiz} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
              <ChevronLeft className="w-5 h-5" />
              <span>Back to Challenges</span>
            </button>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <Timer className="w-5 h-5" />
                <span className="font-mono text-lg">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">{selectedQuiz.title}</h1>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-orange-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">{currentQuestion.question}</h2>

          {/* Render MCQ or Input */}
          {Array.isArray(currentQuestion.options) && currentQuestion.options.length > 0 ? (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, option)}
                  className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                    answers[currentQuestion.id] === option
                      ? 'border-orange-500 bg-orange-50 text-orange-800'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full border-2 ${
                      answers[currentQuestion.id] === option
                        ? 'border-orange-500 bg-orange-500'
                        : 'border-gray-300'
                    }`}>
                      {answers[currentQuestion.id] === option && (
                        <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                      )}
                    </div>
                    <span>{option}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="mt-6">
              <input
                type="text"
                placeholder="Type your answer"
                className="px-4 py-3 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 text-lg"
                defaultValue={answers[currentQuestion.id] || ''}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveAndNext();
                  }
                }}
              />
            </div>
          )}

          <div className="flex justify-between items-center mt-8">
            <button
              onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
            >
              Previous
            </button>

            <button
              onClick={handleSaveAndNext}
              className="px-8 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
            >
              {currentQuestionIndex === questions.length - 1 ? 'Save & Submit' : 'Save & Next'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (currentView === 'results') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Results Summary */}
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            quizResults.isPassed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {quizResults.isPassed ? (
              <Award className="w-10 h-10 text-green-600" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-600" />
            )}
          </div>

          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {quizResults.isPassed ? 'Congratulations!' : 'Better Luck Next Time!'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            {quizResults.isPassed
              ? `You've successfully completed the ${selectedQuiz.title} challenge!`
              : `You didn't pass this time, but keep practicing!`}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-4">
              <Target className="w-5 h-5 text-orange-600 mx-auto mb-2" />
              <div className={`text-3xl font-bold ${quizResults.isPassed ? 'text-green-600' : 'text-red-600'}`}>
                {quizResults.score}%
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <CheckCircle2 className="w-5 h-5 text-green-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-green-600">
                {quizResults.correctAnswers}/{quizResults.totalQuestions}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <Clock className="w-5 h-5 text-blue-600 mx-auto mb-2" />
              <div className="text-3xl font-bold text-blue-600">{formatTime(quizResults.timeTaken)}</div>
            </div>
          </div>

          <div className="flex justify-center space-x-4">
            <button onClick={resetQuiz} className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
              Back to Challenges
            </button>
            <button onClick={() => startQuiz(selectedQuiz)} className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700">
              <RotateCcw className="w-4 h-4 mr-1" /> Retry Quiz
            </button>
          </div>
        </div>

        {/* Question Review */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Question Review</h2>
          
          <div className="space-y-6">
            {quizResults.questionResults.map((question, index) => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <span className="text-sm font-medium text-gray-500">Question {index + 1}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
                        question.isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {question.isCorrect ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        <span>{question.isCorrect ? 'Correct' : 'Incorrect'}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h3>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Your Answer */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-sm font-medium text-gray-600">Your Answer:</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded text-xs font-medium ${
                        question.isCorrect
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {question.isCorrect ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                      </div>
                    </div>
                    <p className="text-gray-800 font-medium">
                      {question.userAnswer || 'No answer provided'}
                    </p>
                  </div>

                  {/* Correct Answer (if different from user's answer) */}
                  {!question.isCorrect && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-green-700">Correct Answer:</span>
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      </div>
                      <p className="text-green-800 font-medium">{question.correct_answer}</p>
                    </div>
                  )}

                  {/* Explanation */}
                  {question.explanation && (
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-700">Explanation:</span>
                      </div>
                      <p className="text-blue-800 leading-relaxed">{question.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
}