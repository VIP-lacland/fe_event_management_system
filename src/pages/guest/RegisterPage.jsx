// src/pages/guest/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import AuthService from '../../services/AuthService';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [apiError, setApiError] = useState('');
  const [showVerificationHint, setShowVerificationHint] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error khi user nhập lại
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    setApiError('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    setSuccessMessage('');
    setShowVerificationHint(false);

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const registerData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        role: formData.role
      };

      const response = await AuthService.register(registerData);

      if (response.success) {
        setSuccessMessage(response.message);
        setShowVerificationHint(true);
        
        // Clear form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'attendee'
        });

        // Tự động chuyển đến login sau 5 giây
        setTimeout(() => {
          navigate('/login', { 
            state: { message: 'Please verify your email before logging in' } 
          });
        }, 5000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response?.data?.errors) {
        // Handle validation errors từ Laravel
        const validationErrors = {};
        Object.keys(error.response.data.errors).forEach(key => {
          validationErrors[key] = error.response.data.errors[key][0];
        });
        setErrors(validationErrors);
      } else if (error.response?.data?.message) {
        setApiError(error.response.data.message);
      } else {
        setApiError('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!formData.email) {
      setApiError('Please enter your email first');
      return;
    }

    try {
      const response = await AuthService.resendVerification(formData.email);
      if (response.success) {
        setSuccessMessage(response.message);
        setApiError('');
      }
    } catch (error) {
      setApiError(error.response?.data?.message || 'Failed to resend verification email');
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <h1>Create Account</h1>
          <p>Join us today and start your journey!</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="alert alert-success">
            {successMessage}
            {showVerificationHint && (
              <div className="verification-hint">
                <p>📧 Check your inbox (and spam folder) for the verification email.</p>
                <button 
                  type="button" 
                  className="btn-resend"
                  onClick={handleResendVerification}
                >
                  Resend Verification Email
                </button>
              </div>
            )}
          </div>
        )}

        {/* API Error */}
        {apiError && (
          <div className="alert alert-error">
            {apiError}
          </div>
        )}

        {/* Register Form */}
        <form onSubmit={handleSubmit} className="register-form">
          
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="name">FULL NAME <span className="required">*</span></label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={errors.name ? 'error' : ''}
              disabled={isLoading || successMessage}
            />
            {errors.name && <span className="error-message">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">EMAIL ADDRESS <span className="required">*</span></label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={errors.email ? 'error' : ''}
              disabled={isLoading || successMessage}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">PASSWORD <span className="required">*</span></label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.password ? 'error' : ''}
              disabled={isLoading || successMessage}
            />
            <small className="form-hint">Must be at least 8 characters</small>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label htmlFor="confirmPassword">CONFIRM PASSWORD <span className="required">*</span></label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              className={errors.confirmPassword ? 'error' : ''}
              disabled={isLoading || successMessage}
            />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>

          {/* Role */}
          <div className="form-group">
            <label htmlFor="role">REGISTER AS <span className="required">*</span></label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              className={errors.role ? 'error' : ''}
              disabled={isLoading || successMessage}
            >
              <option value="attendee">Attendee (Participant)</option>
              <option value="organizer">Organizer</option>
            </select>
            {errors.role && <span className="error-message">{errors.role}</span>}
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            className="btn-register"
            disabled={isLoading || successMessage}
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        {/* Footer */}
        <div className="register-footer">
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;