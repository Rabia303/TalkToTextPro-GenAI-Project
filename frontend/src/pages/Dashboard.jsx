// src/pages/Dashboard.jsx
import { useAuth } from '../hooks/useAuth';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();

  return (
    <div style={{ minHeight: '100vh', background: '#f7fafc' }}>
      <header className="dashboard-header">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="auth-logo">TalkToText Pro</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <span style={{ color: '#4a5568' }}>Welcome, {currentUser?.name}</span>
              <button
                onClick={logout}
                className="btn btn-primary"
                style={{ width: 'auto', padding: '8px 16px' }}
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="dashboard-content">
        <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#2d3748', marginBottom: '10px' }}>
              Dashboard
            </h1>
            <p style={{ color: '#718096', fontSize: '1.1rem' }}>
              Manage your account and security settings
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            <div className="feature-card">
              <div className="feature-icon">👤</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Profile Information
              </h3>
              <div style={{ color: '#718096', marginBottom: '20px' }}>
                <p><strong>Name:</strong> {currentUser?.name}</p>
                <p><strong>Email:</strong> {currentUser?.email}</p>
                <p><strong>Status:</strong> <span style={{ color: '#38a169' }}>Verified</span></p>
              </div>
              <button className="btn btn-primary" style={{ width: 'auto' }}>
                Edit Profile
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🔐</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Security Settings
              </h3>
              <div style={{ color: '#718096', marginBottom: '20px' }}>
                <p>• Two-factor authentication: <span style={{ color: '#e53e3e' }}>Disabled</span></p>
                <p>• Login activity: All secure</p>
                <p>• Connected devices: 1 device</p>
              </div>
              <button className="btn btn-primary" style={{ width: 'auto' }}>
                Enhance Security
              </button>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌐</div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '12px', color: '#2d3748' }}>
                Connected Accounts
              </h3>
              <div style={{ color: '#718096', marginBottom: '20px' }}>
                <p>• Google: Not connected</p>
                <p>• GitHub: Not connected</p>
                <p>• Facebook: Not connected</p>
              </div>
              <button className="btn btn-primary" style={{ width: 'auto' }}>
                Manage Connections
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}