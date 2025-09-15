import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import OTPVerification from './pages/OTPVerification';
import AuthSuccess from './pages/AuthSuccess';
import ResetPassword from './pages/ResetPassword';
import SocialLogin from './pages/SocialLogin';
import Chatbot from './chatbot';
import History from './History';
import SubtitleGenerator from './SubtitleGenerator';
// import WelcomePage from './pages/WelcomePage';
import './App.css';
import WelcomePage from './pages/welcomepage';
import MeetingNotes from './pages/MeetingNotes';

function AppWrapper() {
  const location = useLocation();
  // Hide Navbar on splash page and auth pages
  const hideNavbar = ['/', '/login', '/signup', '/forgot-password', '/otp-verification', '/reset-password', '/auth/social', '/auth/success'].includes(location.pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Routes>
        {/* Splash page */}
        <Route path="/" element={<WelcomePage />} />

        {/* Main Home page */}
        <Route path="/home" element={<Home />} />

        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/otp-verification" element={<OTPVerification />} />
        <Route path="/sub" element={<SubtitleGenerator />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/social" element={<SocialLogin />} />
        <Route path="/chatbot" element={<Chatbot />} />
        <Route path="/link" element={<MeetingNotes />} />
        <Route path="/history" element={<History />} />
        <Route path="/auth/success" element={<AuthSuccess />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppWrapper />
      </Router>
    </AuthProvider>
  );
}

export default App;