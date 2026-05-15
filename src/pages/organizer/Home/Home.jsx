import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const HomePage = () => {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <h1 className="text-3xl font-bold mb-8">🎪 Event Management</h1>
      
      {user ? (
        // Đã login
        <div className="text-center space-y-4">
          <p className="text-lg">Xin chào, <strong>{user.name}</strong>!</p>
          <p className="text-gray-600">Role: {user.role}</p>
          <div className="space-x-4">
            <Link 
              to="/dashboard" 
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Vào Dashboard
            </Link>
            <button 
              onClick={logout}
              className="px-6 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      ) : (
        // Chưa login
        <div className="text-center space-y-4">
          <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
          <div className="space-x-4">
            <Link 
              to="/login" 
              className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Đăng nhập
            </Link>
            <Link 
              to="/register" 
              className="px-6 py-2 bg-white border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50"
            >
              Đăng ký
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;