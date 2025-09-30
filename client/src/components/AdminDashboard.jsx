
import React, { useState, useEffect } from 'react';
import { FileText, CheckCircle, PlusCircle, Award, Trash2, AlertCircle } from 'lucide-react';
import { examAPI, resultAPI } from '../utils/api';

const AdminDashboard = ({ onNavigate }) => {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      setLoading(true);
      setError('');

      const [examsData, resultsData] = await Promise.all([
        examAPI.getAllExams(),
        resultAPI.getAllResults(),
      ]);

      setExams(examsData);
      setResults(resultsData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExam = async (examId) => {
    if (!window.confirm('Are you sure you want to delete this exam?')) {
      return;
    }

    try {
      await examAPI.deleteExam(examId);
      setExams(exams.filter((exam) => exam._id !== examId));
      alert('Exam deleted successfully');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete exam');
    }
  };

  const averageScore =
    results.length > 0
      ? Math.round(results.reduce((sum, r) => sum + r.percentage, 0) / results.length)
      : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage exams and view results</p>
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
                <p className="text-sm text-gray-600">Total Exams</p>
                <p className="text-3xl font-bold text-indigo-600">{exams.length}</p>
              </div>
              <FileText className="w-12 h-12 text-indigo-200" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Submissions</p>
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
          {/* Manage Exams */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">Manage Exams</h2>
              <button
                onClick={() => onNavigate('create-exam')}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center space-x-2 transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Exam</span>
              </button>
            </div>
            <div className="p-6">
              {exams.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No exams created yet</p>
              ) : (
                <div className="space-y-4">
                  {exams.map((exam) => (
                    <div key={exam._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-800">{exam.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {exam.questions?.length || 0} questions • {exam.totalMarks} marks
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Created: {new Date(exam.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteExam(exam._id)}
                          className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded transition"
                          title="Delete exam"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Recent Submissions */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">Recent Submissions</h2>
            </div>
            <div className="p-6">
              {results.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No submissions yet</p>
              ) : (
                <div className="space-y-4">
                  {results.slice(0, 10).map((result) => (
                    <div key={result._id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">{result.student?.name}</h3>
                          <p className="text-sm text-gray-600">{result.exam?.title}</p>
                        </div>
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
                      <div className="text-sm text-gray-600">
                        Score: {result.score}/{result.totalMarks}
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

export default AdminDashboard;