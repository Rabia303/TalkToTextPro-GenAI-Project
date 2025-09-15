// src/pages/Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import SocialLogin from '../components/SocialLogin';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');
  
  try {
    await login(email, password);
    navigate('/chatbot');
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to login';
    setError(message);
    
    // If user needs to verify email, redirect to OTP page
    if (message.includes('verify your email')) {
      navigate('/otp-verification', { state: { email } });
    }
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <div className="auth-header">
            <br /><br />
            <div className="auth-logo">TalktoTextPro</div>
            <h1 className="auth-title">Welcome back</h1>
            <p className="auth-subtitle">Sign in to your account to continue</p>
          </div>

          <SocialLogin />

          <div className="divider">
            <span className="divider-text">Or continue with email</span>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className={`form-input ${error ? 'form-input-error' : ''}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className={`form-input ${error ? 'form-input-error' : ''}`}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="auth-footer">
              <Link to="/forgot-password" className="auth-link">
                Forgot your password?
              </Link>
              <p style={{ marginTop: '10px' }}>
                Don't have an account?{' '}
                <Link to="/signup" className="auth-link">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}