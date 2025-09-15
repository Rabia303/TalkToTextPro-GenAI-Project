// src/pages/AuthSuccess.jsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function AuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAuthToken, setUser } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const userData = searchParams.get('user');

    if (token && userData) {
      try {
        // Set the token in auth context
        setAuthToken(token);
        
        // Parse user data
        const user = JSON.parse(decodeURIComponent(userData));
        
        // Set the user in auth context
        setUser(user);
        
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(user));

        // Redirect to chatbot
        navigate('/chatbot');
      } catch (error) {
        console.error('Error processing auth success:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuthToken, setUser]); // Add all dependencies

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-content">
          <div className="auth-header">
            <div className="auth-logo">TalktoTextPro</div>
            <h1 className="auth-title">Authentication Successful</h1>
            <p className="auth-subtitle">Redirecting to dashboard...</p>
          </div>
        </div>
      </div>
    </div>
  );
}