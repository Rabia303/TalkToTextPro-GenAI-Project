import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

// Import your logo (adjust the path as needed)
import logo from '../assets/1.png';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Get user initial safely
  const getUserInitial = () => {
    return currentUser?.name ? currentUser.name.charAt(0).toUpperCase() : 'U';
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Add scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check if current path is active
  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav
      style={{
        ...styles.nav,
        background: isScrolled
          ? 'rgba(15, 12, 41, 0.98)'
          : 'rgba(15, 12, 41, 0.95)',
        backdropFilter: 'blur(14px)',
        boxShadow: isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.2)' : 'none',
        borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
      }}
    >
      <div style={styles.navContainer}>
        <div style={styles.logoContainer}>
          <Link to="/home" style={styles.logoLink}>
            <div style={styles.logoWrapper}>
              <img src={logo} alt="TalkToText Pro Logo" style={styles.logoImage} />
              <span style={styles.logoText}>TalkToText Pro</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div style={styles.desktopLinks}>
          <Link 
            to="/home" 
            style={{
              ...styles.link,
              ...(isActiveLink('/home') ? styles.activeLink : {})
            }} 
            className="nav-link"
          >
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.linkIcon}>
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
              {isActiveLink('/home') && <div style={styles.activeDot}></div>}
            </div>
          </Link>
          
          <Link 
            to="/chatbot" 
            style={{
              ...styles.link,
              ...(isActiveLink('/chatbot') ? styles.activeLink : {})
            }} 
            className="nav-link"
          >
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.linkIcon}>
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Transcribe
              {isActiveLink('/chatbot') && <div style={styles.activeDot}></div>}
            </div>
          </Link>
          
          <Link 
            to="/sub" 
            style={{
              ...styles.link,
              ...(isActiveLink('/sub') ? styles.activeLink : {})
            }} 
            className="nav-link"
          >
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.linkIcon}>
                <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              SubtitleGen
              {isActiveLink('/sub') && <div style={styles.activeDot}></div>}
            </div>
          </Link>
          
          <Link 
            to="/history" 
            style={{
              ...styles.link,
              ...(isActiveLink('/history') ? styles.activeLink : {})
            }} 
            className="nav-link"
          >
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.linkIcon}>
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              History
              {isActiveLink('/history') && <div style={styles.activeDot}></div>}
            </div>
          </Link>
           <Link 
            to="/link"
            style={{
              ...styles.link,
              ...(isActiveLink('/link') ? styles.activeLink : {})
            }}
            className="nav-link"
          >
            <div style={styles.linkContent}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={styles.linkIcon}>
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Meeting Notes
              {isActiveLink('/link') && <div style={styles.activeDot}></div>}
            </div>
          </Link>
          
          {currentUser ? (
            <div style={styles.userContainer} ref={dropdownRef}>
              <div
                style={{
                  ...styles.userInfo,
                  ...(dropdownOpen ? styles.userInfoActive : {})
                }}
                className="user-info"
                onClick={toggleDropdown}
              >
                <div style={styles.avatar}>
                  {getUserInitial()}
                </div>
                <span style={styles.userName}>{currentUser.name || 'User'}</span>
                <svg
                  style={{
                    ...styles.dropdownArrow,
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0)',
                  }}
                  width="12"
                  height="7"
                  viewBox="0 0 12 7"
                  fill="none"
                >
                  <path
                    d="M1 1L6 6L11 1"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div
                style={{
                  ...styles.dropdown,
                  opacity: dropdownOpen ? 1 : 0,
                  visibility: dropdownOpen ? 'visible' : 'hidden',
                  transform: dropdownOpen
                    ? 'translateY(0) scale(1)'
                    : 'translateY(-10px) scale(0.95)',
                }}
              >
                <div style={styles.dropdownHeader}>
                  <div style={styles.dropdownAvatar}>
                    {getUserInitial()}
                  </div>
                  <div style={styles.dropdownUserInfo}>
                    <div style={styles.dropdownName}>{currentUser.name || 'User'}</div>
                    <div style={styles.dropdownEmail}>{currentUser.email || ''}</div>
                  </div>
                </div>
                <div style={styles.dropdownDivider}></div>
               
          
                <div style={styles.dropdownDivider}></div>
                <button onClick={handleLogout} style={styles.dropdownItem}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link 
              to="/signup" 
              style={{
                ...styles.link,
                ...(isActiveLink('/signup') ? styles.activeLink : {}),
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                color: 'white',
                marginLeft: '0.5rem'
              }} 
              className="nav-link"
            >
              <div style={styles.linkContent}>
                Register
                {isActiveLink('/signup') && <div style={styles.activeDot}></div>}
              </div>
            </Link>
          )}
        </div>

        {/* Mobile Navigation */}
        <div style={styles.mobileMenuButton} onClick={toggleMobileMenu}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            {isMobileMenuOpen ? (
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            ) : (
              <path d="M3 12H21M3 6H21M3 18H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            )}
          </svg>
        </div>

        <div
          style={{
            ...styles.mobileMenu,
            opacity: isMobileMenuOpen ? 1 : 0,
            visibility: isMobileMenuOpen ? 'visible' : 'hidden',
            transform: isMobileMenuOpen
              ? 'translateY(0) scale(1)'
              : 'translateY(-20px) scale(0.95)',
          }}
        >
          <Link 
            to="/home" 
            style={styles.mobileLink}
            onClick={toggleMobileMenu}
          >
            <div style={styles.mobileLinkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Home
              {isActiveLink('/home') && <div style={styles.mobileActiveDot}></div>}
            </div>
          </Link>

                
          <Link 
            to="/link" 
            style={styles.mobileLink}
            onClick={toggleMobileMenu}
          >
            <div style={styles.mobileLinkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Link
              {isActiveLink('/') && <div style={styles.mobileActiveDot}></div>}
            </div>
          </Link>
          
          
          <Link 
            to="/chatbot" 
            style={styles.mobileLink}
            onClick={toggleMobileMenu}
          >
            <div style={styles.mobileLinkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Transcribe
              {isActiveLink('/chatbot') && <div style={styles.mobileActiveDot}></div>}
            </div>
          </Link>

             <Link 
            to="/link" 
            style={styles.mobileLink}
            onClick={toggleMobileMenu}
          >
            <div style={styles.mobileLinkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Meeting Notes
              {isActiveLink('/link') && <div style={styles.mobileActiveDot}></div>}
            </div>
          </Link>
          
          
          
          <Link 
            to="/sub" 
            style={styles.mobileLink}
            onClick={toggleMobileMenu}
          >
            <div style={styles.mobileLinkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                <path d="M9 12H15M9 16H15M9 8H15M5 21H19C20.1046 21 21 20.1046 21 19V5C21 3.89543 20.1046 3 19 3H5C3.89543 3 3 3.89543 3 5V19C3 20.1046 3.89543 21 5 21Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              SubtitleGen
              {isActiveLink('/sub') && <div style={styles.mobileActiveDot}></div>}
            </div>
          </Link>
          
          <Link 
            to="/history" 
            style={styles.mobileLink}
            onClick={toggleMobileMenu}
          >
            <div style={styles.mobileLinkContent}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                <path d="M12 8V12L15 15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              History
              {isActiveLink('/history') && <div style={styles.mobileActiveDot}></div>}
            </div>
          </Link>
          
          {currentUser ? (
            <>
              <div style={styles.mobileDivider}></div>
              <div style={styles.mobileUserInfo}>
                <div style={styles.mobileAvatar}>
                  {getUserInitial()}
                </div>
                <div style={styles.mobileUserDetails}>
                  <div style={styles.mobileUserName}>{currentUser.name || 'User'}</div>
                  <div style={styles.mobileUserEmail}>{currentUser.email || ''}</div>
                </div>
              </div>
      
              <div style={styles.mobileDivider}></div>
              <button onClick={() => { handleLogout(); toggleMobileMenu(); }} style={styles.mobileLink}>
                <div style={styles.mobileLinkContent}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={styles.mobileLinkIcon}>
                    <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap='round' strokeLinejoin='round'/>
                    <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap='round' strokeLinejoin='round'/>
                    <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap='round' strokeLinejoin='round'/>
                  </svg>
                  Logout
                </div>
              </button>
            </>
          ) : (
            <Link 
              to="/signup" 
              style={{
                ...styles.mobileLink,
                background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
                color: 'white',
                marginTop: '0.5rem'
              }}
              onClick={toggleMobileMenu}
            >
              <div style={styles.mobileLinkContent}>
                Register
              </div>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    padding: '0.5rem 0',
    transition: 'all 0.3s ease',
  },
  navContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  logoLink: {
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  logoWrapper: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  logoImage: {
    height: '36px',
    width: 'auto',
  },
  logoText: {
    color: '#ffffff',
    fontSize: '1.5rem',
    fontWeight: '700',
    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  desktopLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    '@media (max-width: 768px)': {
      display: 'none',
    },
  },
  link: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeLink: {
    color: '#ffffff',
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
  },
  linkContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    position: 'relative',
  },
  linkIcon: {
    flexShrink: 0,
  },
  activeDot: {
    position: 'absolute',
    top: '-4px',
    right: '-8px',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    boxShadow: '0 0 0 2px rgba(15, 12, 41, 0.95)',
  },
  userContainer: {
    position: 'relative',
    marginLeft: '0.5rem',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem 1rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  userInfoActive: {
    background: 'rgba(139, 92, 246, 0.15)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
  },
  avatar: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.875rem',
  },
  userName: {
    color: '#ffffff',
    fontSize: '0.9rem',
    fontWeight: '500',
  },
  dropdownArrow: {
    transition: 'transform 0.2s ease',
    color: 'rgba(255, 255, 255, 0.7)',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: '0.5rem',
    width: '280px',
    background: 'rgba(23, 20, 49, 0.98)',
    backdropFilter: 'blur(14px)',
    borderRadius: '0.75rem',
    padding: '0.75rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.2s ease',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-10px) scale(0.95)',
    zIndex: 1001,
  },
  dropdownHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.5rem',
    marginBottom: '0.5rem',
  },
  dropdownAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '1rem',
  },
  dropdownUserInfo: {
    display: 'flex',
    flexDirection: 'column',
  },
  dropdownName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  dropdownEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
    marginTop: '0.1rem',
  },
  dropdownDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '0.5rem 0',
  },
  dropdownItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '0.75rem',
    color: 'rgba(255, 255, 255, 0.8)',
    textDecoration: 'none',
    borderRadius: '0.5rem',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    background: 'transparent',
    border: 'none',
    width: '100%',
    textAlign: 'left',
    cursor: 'pointer',
  },
  mobileMenuButton: {
    display: 'none',
    color: '#ffffff',
    padding: '0.5rem',
    borderRadius: '0.5rem',
    cursor: 'pointer',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    '@media (max-width: 768px)': {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
  },
  mobileMenu: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'rgba(23, 20, 49, 0.98)',
    backdropFilter: 'blur(14px)',
    padding: '1rem 1.5rem',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    opacity: 0,
    visibility: 'hidden',
    transform: 'translateY(-20px) scale(0.95)',
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
    '@media (min-width: 769px)': {
      display: 'none',
    },
  },
  mobileLink: {
    color: 'rgba(255, 255, 255, 0.7)',
    textDecoration: 'none',
    padding: '0.75rem 1rem',
    borderRadius: '0.5rem',
    fontSize: '0.95rem',
    fontWeight: '500',
    transition: 'all 0.2s ease',
    background: 'transparent',
    border: 'none',
    textAlign: 'left',
    cursor: 'pointer',
  },
  mobileLinkContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    position: 'relative',
  },
  mobileLinkIcon: {
    flexShrink: 0,
  },
  mobileActiveDot: {
    position: 'absolute',
    top: '50%',
    right: '0',
    transform: 'translateY(-50%)',
    width: '8px',
    height: '8px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
  },
  mobileDivider: {
    height: '1px',
    background: 'rgba(255, 255, 255, 0.1)',
    margin: '0.5rem 0',
  },
  mobileUserInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
    padding: '1rem',
    margin: '0.5rem 0',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '0.5rem',
  },
  mobileAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(90deg, #8B5CF6, #EC4899)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: '600',
    fontSize: '1rem',
  },
  mobileUserDetails: {
    display: 'flex',
    flexDirection: 'column',
  },
  mobileUserName: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: '0.95rem',
  },
  mobileUserEmail: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '0.8rem',
    marginTop: '0.1rem',
  },
};

export default Navbar;