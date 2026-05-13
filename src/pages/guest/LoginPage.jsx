// src/pages/LoginPage.jsx
import { useState } from 'react';
import { useNavigate, Link, useLocation} from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Login } from '../../services/AuthService';

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  // lấy action từ store
  const login = useAuthStore((state) => state.login);
  
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState('');

  // Redirect sau login
  const from = location.state?.from?.pathname || '/dashboard';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error khi user gõ lại
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverError) setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError('');
    setErrors({});

    try {
      // ✅ Gọi API qua Service, không gọi api.post trực tiếp
      const { responseData } = await Login.post(formData.email, formData.password);
      
      // Cập nhật auth state qua store
      login(responseData.user, responseData.token);
      localStorage.setItem('user', JSON.stringify(responseData.user)); // Để persist
      
      // Redirect về trang đích hoặc dashboard theo role
      const redirectPath = responseData.user.role === 'attendee' 
        ? '/' 
        : '/organizer/dashboard';
      
      navigate(from || redirectPath, { replace: true });
      
    } catch (err) {
      if (err.response?.status === 422) {
        // Validation errors từ Laravel
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        setServerError('Email hoặc mật khẩu không chính xác');
      } else {
        setServerError('Đã xảy ra lỗi. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
              tạo tài khoản mới
            </Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Server Error */}
          {serverError && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {serverError}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm 
                ${errors.email ? 'border-red-300' : 'border-gray-300'}
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={formData.password}
              onChange={handleChange}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm 
                ${errors.password ? 'border-red-300' : 'border-gray-300'}
                focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-2 px-4 border border-transparent 
              rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
              hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 
              focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;