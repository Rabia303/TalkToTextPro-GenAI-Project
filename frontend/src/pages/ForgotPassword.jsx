// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { requestPasswordReset } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await requestPasswordReset(email);
      setMessage('If the email exists, a reset link has been sent');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <div className="auth-header">
            <div className="auth-logo">TalkToText Pro</div>
            <h2 className="auth-title">Reset your password</h2>
            <p className="auth-subtitle">
              Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            {message && (
              <div className="success-message">
                {message}
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email-address" className="form-label">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </button>
            
            <div className="auth-footer">
              <Link to="/login" className="auth-link">
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}