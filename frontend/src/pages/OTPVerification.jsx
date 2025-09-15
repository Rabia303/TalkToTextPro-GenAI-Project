// src/pages/OTPVerification.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function OTPVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { verifyOTP } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const email = location.state?.email || '';

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);
    
    // Focus next input
    if (element.nextSibling && element.value !== '') {
      element.nextSibling.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const otpValue = otp.join('');
    if (otpValue.length !== 6) {
      setError('Please enter the complete 6-digit code');
      setLoading(false);
      return;
    }

    try {
      await verifyOTP(email, otpValue);
      navigate('/chatbot');
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid verification code. Please try again.');
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
            <h1 className="auth-title">Verify your email</h1>
            <p className="auth-subtitle">
              We've sent a 6-digit code to <strong>{email}</strong>
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div className="form-group">
              <label className="form-label">Verification code</label>
              <div className="otp-container">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    className="otp-input"
                    value={data}
                    onChange={e => handleChange(e.target, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    onFocus={e => e.target.select()}
                  />
                ))}
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className={`btn btn-primary ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? 'Verifying...' : 'Verify and continue'}
              </button>
            </div>

            <div className="auth-footer">
              <p>Didn't receive the code? </p>
              <button
                type="button"
                className="auth-link"
                onClick={() => {
                  // Resend OTP logic would go here
                  alert('A new verification code has been sent to your email.');
                }}
                style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              >
                Resend code
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}