// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate, Link} from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { Login } from "../../services/AuthService";
import "./Login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const login = useAuthStore((state) => state.login);

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // const from = location.state?.from?.pathname || "/dashboard";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setServerError("");
    setErrors({});

    try {
      const responseData = await Login(formData.email, formData.password);
      login(responseData.user, responseData.token);
      localStorage.setItem("user", JSON.stringify(responseData.user));

      const redirectPath =
        responseData.user.role === "attendee"
          ? "/attendee"
          : "/organizer/home";

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 100);

      
    } catch (err) {
      if (err.response?.status === 422) {
        setErrors(err.response.data.errors || {});
      } else if (err.response?.status === 401) {
        setServerError("Email hoặc mật khẩu không chính xác");
      } else {
        setServerError("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h2 className="login-title">Đăng nhập</h2>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Server Error */}
          {serverError && (
            <div className="alert alert--error">{serverError}</div>
          )}

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">
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
              className={`form-input ${errors.email ? "form-input--error" : ""}`}
              placeholder="your@email.com"
            />
            {errors.email && (
              <p className="form-error-message">{errors.email[0]}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">
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
              className={`form-input ${errors.password ? "form-input--error" : ""}`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="form-error-message">{errors.password[0]}</p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`login-submit-btn ${loading ? "login-submit-btn--loading" : ""}`}
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>

          <p className="login-register-prompt">
            Hoặc{" "}
            <Link to="/register" className="login-register-link">
              tạo tài khoản mới
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
