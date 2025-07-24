import { useState, useEffect } from 'react';
import { X, Clock, Check, X as XIcon } from 'react-feather';

export default function QuickDrillModal({ onClose }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes in seconds
  const [answers, setAnswers] = useState([]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    // Fetch questions from backend
    fetch('http://localhost:5000/api/exercises/random', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  useEffect(() => {
    if (timeLeft > 0 && !isFinished) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      setIsFinished(true);
    }
  }, [timeLeft, isFinished]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const isCorrect = answer === questions[currentQuestion].correct_answer;
    setAnswers([...answers, { question: questions[currentQuestion], answer, isCorrect }]);
    setAnswer('');
    setCurrentQuestion(prev => prev + 1);
  };

  const getScore = () => {
    const correct = answers.filter(a => a.isCorrect).length;
    return {
      total: answers.length,
      correct,
      percentage: Math.round((correct / answers.length) * 100)
    };
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Quick Drill</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        {!isFinished ? (
          <>
            <div className="mb-4 flex justify-between items-center">
              <div className="flex items-center space-x-2 text-gray-600">
                <Clock className="w-5 h-5" />
                <span>{Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}</span>
              </div>
              <div className="text-sm font-medium text-gray-600">
                Question {currentQuestion + 1}
              </div>
            </div>

            {questions[currentQuestion] && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="text-lg font-medium text-gray-800">
                  {questions[currentQuestion].question}
                </div>
                <input
                  type="text"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your answer"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
                >
                  Submit Answer
                </button>
              </form>
            )}
          </>
        ) : (
          <div className="text-center">
            <h4 className="text-xl font-bold mb-4">Time's Up!</h4>
            <div className="space-y-4">
              <div className="text-4xl font-bold text-blue-600">{getScore().percentage}%</div>
              <div className="flex justify-center space-x-8">
                <div>
                  <div className="text-2xl font-bold text-green-600">{getScore().correct}</div>
                  <div className="text-sm text-gray-600">Correct</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600">{getScore().total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}