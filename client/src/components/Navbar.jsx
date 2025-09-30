
import React, { useState } from 'react';
import { Book, Home, PlusCircle, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    onNavigate('login');
  };

  const handleNavigation = (page) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        {/* Desktop and Mobile Header */}
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Book className="w-6 h-6" />
            <h1 className="text-xl font-bold">Exam Portal</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-indigo-700 transition ${
                currentPage === 'dashboard' ? 'bg-indigo-700' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => handleNavigation('create-exam')}
                className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-indigo-700 transition ${
                  currentPage === 'create-exam' ? 'bg-indigo-700' : ''
                }`}
              >
                <PlusCircle className="w-4 h-4" />
                <span>Create Exam</span>
              </button>
            )}

            <div className="flex items-center space-x-2 border-l border-indigo-500 pl-4">
              <User className="w-4 h-4" />
              <span className="text-sm">{user.name}</span>
              <span className="text-xs bg-indigo-800 px-2 py-1 rounded">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 px-3 py-2 rounded bg-red-500 hover:bg-red-600 transition"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded hover:bg-indigo-700 transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-2 border-t border-indigo-500 pt-4">
            {/* User Info */}
            <div className="flex items-center space-x-2 px-3 py-2 bg-indigo-700 rounded">
              <User className="w-4 h-4" />
              <span className="text-sm font-medium">{user.name}</span>
              <span className="text-xs bg-indigo-800 px-2 py-1 rounded ml-auto">
                {user.role}
              </span>
            </div>

            {/* Navigation Links */}
            <button
              onClick={() => handleNavigation('dashboard')}
              className={`w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-indigo-700 transition ${
                currentPage === 'dashboard' ? 'bg-indigo-700' : ''
              }`}
            >
              <Home className="w-5 h-5" />
              <span>Dashboard</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => handleNavigation('create-exam')}
                className={`w-full flex items-center space-x-2 px-3 py-2 rounded hover:bg-indigo-700 transition ${
                  currentPage === 'create-exam' ? 'bg-indigo-700' : ''
                }`}
              >
                <PlusCircle className="w-5 h-5" />
                <span>Create Exam</span>
              </button>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-2 px-3 py-2 rounded bg-red-500 hover:bg-red-600 transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;