
import React, { useState, useEffect } from 'react';
import { Clock, AlertCircle } from 'lucide-react';
import { examAPI, resultAPI } from '../utils/api';

const TakeExam = ({ examId, onNavigate }) => {
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExam();
  }, [examId]);

  useEffect(() => {
    if (timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleSubmit(true); 
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const fetchExam = async () => {
    try {
      setLoading(true);
      const data = await examAPI.getExamById(examId);
      setExam(data);
      setTimeLeft(data.duration * 60); // Convert minutes to seconds
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load exam');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleSubmit = async (autoSubmit = false) => {
    const answeredCount = Object.keys(answers).length;
    
    if (!autoSubmit) {
      const confirmMessage = `You have answered ${answeredCount}/${exam.questions.length} questions. Submit exam?`;
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }

    setSubmitting(true);

    try {
      // Format answers for API
      const formattedAnswers = Object.keys(answers).map((questionId) => ({
        questionId,
        selectedAnswer: answers[questionId],
      }));

      await resultAPI.submitExam(exam._id, formattedAnswers);
      
      alert(autoSubmit 
        ? 'Time\'s up! Your exam has been submitted automatically.' 
        : 'Exam submitted successfully!');
      
      onNavigate('dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit exam');
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading exam...</p>
        </div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 text-center mb-2">Error Loading Exam</h2>
          <p className="text-gray-600 text-center mb-4">{error}</p>
          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!exam) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const currentQuestion = exam.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / exam.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg">
          {/* Header */}
          <div className="p-6 border-b bg-indigo-600 text-white rounded-t-lg">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold">{exam.title}</h1>
                <p className="text-indigo-100">
                  Question {currentQuestionIndex + 1} of {exam.questions.length}
                </p>
              </div>
              <div className="text-right">
                <div
                  className={`flex items-center space-x-2 px-4 py-2 rounded ${
                    timeLeft < 300 ? 'bg-red-600' : 'bg-indigo-700'
                  }`}
                >
                  <Clock className="w-5 h-5" />
                  <span className="text-xl font-bold">
                    {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                  </span>
                </div>
                <p className="text-sm text-indigo-100 mt-1">Time Remaining</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>
                {Object.keys(answers).length}/{exam.questions.length} answered
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
              <div
                className="bg-indigo-600 h-2 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="px-6 pb-6">
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold text-gray-800">{currentQuestion.question}</h2>
                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap ml-4">
                  {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                </span>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion._id, index)}
                    disabled={submitting}
                    className={`w-full text-left p-4 border-2 rounded-lg transition ${
                      answers[currentQuestion._id] === index
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                    } ${submitting ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-6 h-6 rounded-full border-2 mr-3 flex items-center justify-center flex-shrink-0 ${
                          answers[currentQuestion._id] === index
                            ? 'border-indigo-600 bg-indigo-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {answers[currentQuestion._id] === index && (
                          <div className="w-3 h-3 bg-white rounded-full" />
                        )}
                      </div>
                      <span className="text-gray-800">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center pt-6 border-t">
              <button
                onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))}
                disabled={currentQuestionIndex === 0 || submitting}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                Previous
              </button>

              {/* Question Numbers */}
              <div className="flex space-x-2 overflow-x-auto">
                {exam.questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentQuestionIndex(idx)}
                    disabled={submitting}
                    className={`w-10 h-10 rounded flex-shrink-0 font-medium transition ${
                      idx === currentQuestionIndex
                        ? 'bg-indigo-600 text-white'
                        : answers[exam.questions[idx]._id] !== undefined
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                    } ${submitting ? 'cursor-not-allowed' : ''}`}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>

              {/* Next/Submit Button */}
              {currentQuestionIndex === exam.questions.length - 1 ? (
                <button
                  onClick={() => handleSubmit(false)}
                  disabled={submitting}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  {submitting ? 'Submitting...' : 'Submit Exam'}
                </button>
              ) : (
                <button
                  onClick={() =>
                    setCurrentQuestionIndex(Math.min(exam.questions.length - 1, currentQuestionIndex + 1))
                  }
                  disabled={submitting}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Warning for low time */}
        {timeLeft < 300 && timeLeft > 0 && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <span className="text-sm">
              Less than 5 minutes remaining! Please complete your exam soon.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExam;