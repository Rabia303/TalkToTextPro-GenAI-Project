
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import robotImage from '../assets/1.png';
import '../styles/welcomepage.css';

const WelcomePage = () => {

const navigate = useNavigate();

  useEffect(() => {
    // Redirect to Home after 6 seconds
    const timer = setTimeout(() => {
      navigate('/home');
    }, 6000000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="landing-container">
      {/* Enhanced Animated Background Elements */}
      <div className="bg-circle bg-circle-1"></div>
      <div className="bg-circle bg-circle-2"></div>
      <div className="bg-circle bg-circle-3"></div>
      <div className="bg-circle bg-circle-4"></div>
      
      {/* Floating Bubbles */}
      <div className="bubbles">
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            className="bubble"
            initial={{ y: 0, opacity: 0 }}
            animate={{
              y: [0, -100, -200],
              opacity: [0, 0.6, 0],
              scale: [0, 1, 0.5]
            }}
            transition={{
              duration: 6 + Math.random() * 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              width: `${25 + Math.random() * 50}px`,
              height: `${25 + Math.random() * 50}px`,
              backgroundColor: i % 4 === 0 ? 'rgba(139, 132, 215, 0.2)' : 
                             i % 4 === 1 ? 'rgba(255, 110, 159, 0.2)' : 
                             i % 4 === 2 ? 'rgba(90, 111, 216, 0.2)' : 'rgba(255, 255, 255, 0.25)',
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <main className="landing-main">
        <div className="content-wrapper">
          {/* Text Content - Left Side */}
          <motion.div 
            className="text-content"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <motion.h1 
              className="hero-title"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Break Language Barriers with <span className="gradient-text">GeoSpeak</span>
            </motion.h1>
            
            <motion.p 
              className="hero-subtitle"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Your AI-powered companion for seamless multilingual dining experiences anywhere in the world
            </motion.p>

            <motion.div 
              className="feature-list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-language"></i>
                </div>
                <p>Real-time translation for menus and conversations</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-microphone"></i>
                </div>
                <p>Voice recognition and speech synthesis</p>
              </div>
              <div className="feature-item">
                <div className="feature-icon">
                  <i className="fas fa-camera"></i>
                </div>
                <p>Image translation for signs and labels</p>
              </div>
            </motion.div>

            <motion.div 
              className="cta-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 1 }}
            >
              <motion.button 
                className="get-started-btn"
                whileHover={{ 
                  scale: 1.05, 
                  boxShadow: "0 0 30px rgba(139, 132, 215, 0.7)" 
                }}
                whileTap={{ scale: 0.98 }}
              >
                <Link to="/login" style={{color: 'white', textDecoration: 'none'}}>
                  Start Your Journey
                </Link>
              </motion.button>
              <p className="cta-subtext">No credit card required • Setup in minutes</p>
            </motion.div>
          </motion.div>

          {/* Robot Container - Right Side */}
          <motion.div 
            className="robot-container"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {/* Robot Image with Enhanced Animation */}
            <motion.div 
              className="robot-image-container"
              animate={{
                y: [0, -15, 0],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <img 
                src={robotImage} 
                alt="Friendly translation assistant" 
                className="robot-image"
              />
              
              {/* Glow effect around robot */}
              <div className="robot-glow"></div>
              
              {/* Pulsating circles around robot */}
              <motion.div 
                className="pulse-circle pulse-1"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div 
                className="pulse-circle pulse-2"
                animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0, 0.3] }}
                transition={{ duration: 4, repeat: Infinity, delay: 1 }}
              />
            </motion.div>

            {/* Speech Bubble */}
            <motion.div 
              className="speech-bubble"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="typing-animation">
                <span>I can help you in any language!</span>
                <div className="typing-dots">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
              <div className="speech-bubble-tail"></div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default WelcomePage;