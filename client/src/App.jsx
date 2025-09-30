
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import CreateExam from './components/CreateExam';
import TakeExam from './components/TakeExam';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('login');
  const [selectedExamId, setSelectedExamId] = useState(null);

  const navigate = (page, examId = null) => {
    setCurrentPage(page);
    setSelectedExamId(examId);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated and trying to access protected pages
  if (!user && currentPage !== 'login' && currentPage !== 'register') {
    setCurrentPage('login');
  }

  // Redirect to dashboard if authenticated and on login/register page
  if (user && (currentPage === 'login' || currentPage === 'register')) {
    setCurrentPage('dashboard');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Show Navbar only for authenticated users and not on login/register pages */}
      {user && currentPage !== 'login' && currentPage !== 'register' && (
        <Navbar onNavigate={navigate} currentPage={currentPage} />
      )}

      {/* Page Rendering */}
      {currentPage === 'login' && <Login onNavigate={navigate} />}
      {currentPage === 'register' && <Register onNavigate={navigate} />}
      {currentPage === 'dashboard' && user && <Dashboard onNavigate={navigate} />}
      {currentPage === 'create-exam' && user && <CreateExam onNavigate={navigate} />}
      {currentPage === 'take-exam' && user && selectedExamId && (
        <TakeExam examId={selectedExamId} onNavigate={navigate} />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;