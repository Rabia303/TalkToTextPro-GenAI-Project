// src/pages/Home.jsx
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
// import '../styles/home.css';

export default function Home() {
  const { currentUser } = useAuth();

  return (
    <div className="home-container bg-gradient-to-br from-purple-500 via-pink-400 to-blue-500 min-h-screen text-white flex flex-col">

      {/* Navbar */}
      <nav className="navbar fixed top-0 left-0 w-full flex justify-between items-center px-8 py-4 bg-white/10 backdrop-blur-md shadow-lg z-50">
        <div className="logo text-2xl font-extrabold text-yellow-300 drop-shadow">
          TalkToText Pro
        </div>
        
      </nav>

      <main className="main-content w-full max-w-6xl px-6 py-24 md:py-32 mx-auto text-center">
        {/* Hero Section */}
        <section className="hero-section mb-20">
          <div className="hero-content animate-fade-in">
            <h2 className="hero-subtitle text-lg tracking-widest uppercase text-pink-200 drop-shadow-md">
              Welcome to
            </h2>
            <h1 className="hero-title text-5xl md:text-6xl font-extrabold mb-6 drop-shadow-lg">
              TalkToText <span className="text-yellow-300">Pro</span>
            </h1>
            <p className="hero-description text-lg md:text-xl max-w-3xl mx-auto mb-8 text-pink-100">
              AI-powered meeting transcription & summarization. Capture every discussion, 
              decision, and action item effortlessly — with speed, accuracy, and clarity.
            </p>
            <div className="hero-cta flex flex-wrap gap-6 justify-center">
              {!currentUser ? (
                <>
                  <Link
                    to="/signup"
                    className="btn-primary"
                  >
                     Get Started
                  </Link>
                  <Link
                   
                  >
                    
                  </Link>
                </>
              ) : (
                <Link
                  to="/chatbot"
                  className="btn-primary"
                >
                   Go to Chatbot
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="features-section">
          <h2 className="section-title text-4xl font-bold mb-12 drop-shadow-md">
            Core <span className="text-yellow-300">Features</span>
          </h2>
          <div className="features-grid grid md:grid-cols-3 gap-10">
            
            <div className="glass-card">
              <div className="feature-icon text-5xl mb-4 text-yellow-300">
                <i className="fas fa-microphone-alt"></i>
              </div>
              <h3 className="feature-title text-2xl font-semibold mb-3">AI Speech-to-Text</h3>
              <p className="feature-description" style={{ color: '#ffff' ,textAlign: 'center'}}>
                Convert meeting audio into precise transcripts with state-of-the-art AI.
              </p>
            </div>

            <div  className="glass-card">
              <div className="feature-icon text-5xl mb-4 text-green-300">
                <i className="fas fa-language"></i>
              </div>
              <h3 className="feature-title text-2xl font-semibold mb-3">Automatic Translation</h3>
              
              <p className="feature-description" style={{ color: '#ffff' ,textAlign: 'center'}}>
                Multilingual support — instantly translate transcripts into English.
              </p>
            </div>

            <div className="glass-card">
              <div className="feature-icon text-5xl mb-4 text-blue-300">
                <i className="fas fa-file-alt"></i>
              </div>
              <h3 className="feature-title text-2xl font-semibold mb-3">Smart Summarization</h3>
              <p className="feature-description" style={{ color: '#ffff' ,textAlign: 'center'}}>
                Generate structured meeting notes with summaries, action items & insights.
              </p>
            </div>

          </div>
        </section>
      </main>
    </div>
  );
}
