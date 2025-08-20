import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { currentUser, logout, isAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Get role badge color
  const getRoleBadgeColor = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-danger';
      case 'organizer':
        return 'bg-success';
      case 'volunteer':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <nav className={`navbar navbar-expand-lg navbar-dark ${scrolled ? 'bg-dark shadow' : 'bg-primary'} fixed-top transition-navbar`}>
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">
          <i className="bi bi-calendar-event me-2"></i>
          Campus Events
        </Link>
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/' ? 'active fw-bold' : ''}`} 
                to="/"
              >
                <i className="bi bi-house-door me-1"></i> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${location.pathname === '/events' ? 'active fw-bold' : ''}`} 
                to="/events"
              >
                <i className="bi bi-calendar3 me-1"></i> Events
              </Link>
            </li>
            {isAuthenticated && (
              <>
                {(currentUser.role === 'admin' || currentUser.role === 'organizer') && (
                  <li className="nav-item">
                    <Link 
                      className={`nav-link ${location.pathname === '/events/create' ? 'active fw-bold' : ''}`} 
                      to="/events/create"
                    >
                      <i className="bi bi-plus-circle me-1"></i> Create Event
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/dashboard' ? 'active fw-bold' : ''}`} 
                    to="/dashboard"
                  >
                    <i className="bi bi-speedometer2 me-1"></i> Dashboard
                  </Link>
                </li>
              </>
            )}
          </ul>
          <ul className="navbar-nav">
            {isAuthenticated ? (
              <>
                <li className="nav-item dropdown">
                  <a 
                    className="nav-link dropdown-toggle" 
                    href="#" 
                    id="navbarDropdown" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {currentUser.name}
                    <span className={`badge ${getRoleBadgeColor(currentUser.role)} ms-2`}>
                      {currentUser.role}
                    </span>
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                    <li>
                      <Link className="dropdown-item" to="/dashboard">
                        <i className="bi bi-speedometer2 me-2"></i> Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/profile">
                        <i className="bi bi-person me-2"></i> Profile
                      </Link>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger" 
                        onClick={handleLogout}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i> Logout
                      </button>
                    </li>
                  </ul>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link 
                    className={`nav-link ${location.pathname === '/login' ? 'active fw-bold' : ''}`} 
                    to="/login"
                  >
                    <i className="bi bi-box-arrow-in-right me-1"></i> Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link 
                    className="btn btn-light ms-2" 
                    to="/register"
                  >
                    <i className="bi bi-person-plus me-1"></i> Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
      
      {/* Add custom CSS for navbar transition */}
      <style jsx="true">{`
        .transition-navbar {
          transition: background-color 0.3s ease, box-shadow 0.3s ease;
        }
        body {
          padding-top: 70px;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;