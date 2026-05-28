import { useState } from 'react';
import './ProfileForm.css';

const ProfileForm = ({ user, onSave, loading, error }) => {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });
  const [touched, setTouched] = useState({});
  const [localError, setLocalError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (touched[name]) validateField(name, value);
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, value);
  };

  const validateField = (name, value) => {
    if (name === 'name' && value.length < 6) {
      setLocalError('Name must be at least 6 characters.');
      return false;
    }
    if (name === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setLocalError('Please enter a valid email address.');
      return false;
    }
    setLocalError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate trước khi submit
    const isNameValid = validateField('name', formData.name);
    const isEmailValid = validateField('email', formData.email);
    
    if (!isNameValid || !isEmailValid) return;
    
    const success = await onSave(formData);
    if (success) {
      setTouched({});
    }
  };

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <div className="form-header">
        <h3>Basic Information</h3>
        <p className="form-subtitle">Update your personal details</p>
      </div>

      {/* Error Block - hiển thị trên cùng */}
      {(error || localError) && (
        <div className="error-block">
          <span>⚠ {error || localError}</span>
          <button type="button" className="error-close" onClick={() => {
            setLocalError('');
            if (error) window.dispatchEvent(new CustomEvent('clearProfileError'));
          }}>×</button>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Enter your full name"
          className={touched.name && formData.name.length < 6 ? 'error' : ''}
          required
          minLength={6}
        />
        {touched.name && formData.name.length < 6 && (
          <span className="field-error">Name must be at least 6 characters.</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="email">Email Address *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="your@email.com"
          className={touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'error' : ''}
          required
        />
        {touched.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
          <span className="field-error">Please enter a valid email address.</span>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-save" disabled={loading}>
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
        <span className="form-hint">Changes are saved immediately</span>
      </div>
    </form>
  );
};

export default ProfileForm;