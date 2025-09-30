
import { Book, Home, PlusCircle, User, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ onNavigate, currentPage }) => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Book className="w-6 h-6" />
            <h1 className="text-xl font-bold">Exam Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={() => onNavigate('dashboard')}
              className={`flex items-center space-x-1 px-3 py-2 rounded hover:bg-indigo-700 transition ${
                currentPage === 'dashboard' ? 'bg-indigo-700' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            {user.role === 'admin' && (
              <button
                onClick={() => onNavigate('create-exam')}
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
        </div>
      </div>
    </nav>
  );
};

export default Navbar;