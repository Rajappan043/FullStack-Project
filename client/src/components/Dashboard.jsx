
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, Clock, Award, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { examAPI, resultAPI } from '../utils/api';
import AdminDashboard from './AdminDashboard';

const Dashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch exams
      const examsData = await examAPI.getAllExams();
      setExams(examsData);

      // Fetch results for students
      if (user?.role === 'student') {
        const resultsData = await resultAPI.getMyResults();
        setResults(resultsData);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Show admin dashboard for admin users
  if (user?.role === 'admin') {
    return <AdminDashboard onNavigate={onNavigate} />;
  }

  // Calculate average score
  const averageScore = results.length > 0
    ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Student Dashboard</h1>
          <p className="text-gray-600">Welcome back, {user?.name}!</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 flex items-center">
            <AlertCircle className="w-5 h-5 mr-2" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Exams</p>
                <p className="text-3xl font-bold text-indigo-600">{exams.length}</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{results.length}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average Score</p>
                <p className="text-3xl font-bold text-purple-600">{averageScore}%</p>
              </div>
              <Award className="w-12 h-12 text-purple-200" />
            </div>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Available Exams */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Available Exams</h2>
            </div>
            <div className="p-6">
              {exams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No exams available at the moment</p>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam._id} className="border rounded-lg p-4 hover:shadow-md transition">
                      <h3 className="font-bold text-lg text-gray-800">{exam.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{exam.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {exam.duration} min
                          </span>
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {exam.questions?.length || 0} questions
                          </span>
                          <span className="font-medium">{exam.totalMarks} marks</span>
                        </div>
                        <button
                          onClick={() => onNavigate('take-exam', exam._id)}
                          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm transition"
                        >
                          Start Exam
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Results */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Recent Results</h2>
            </div>
            <div className="p-6">
              {results.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No results yet. Start taking exams!</p>
              ) : (
                <div className="space-y-4">
                  {results.map((result) => (
                    <div key={result._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-gray-800">{result.exam?.title}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            result.percentage >= 70
                              ? 'bg-green-100 text-green-700'
                              : result.percentage >= 50
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {result.percentage?.toFixed(0)}%
                        </span>
                      </div>
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>
                          Score: {result.score}/{result.totalMarks}
                        </span>
                        <span>{new Date(result.submittedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;