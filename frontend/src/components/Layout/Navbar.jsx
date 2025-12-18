import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.container}>
        <Link to="/" style={styles.logo}>
          🗂️ Task Manager
        </Link>
        
        <div style={styles.navLinks}>
          {isAuthenticated ? (
            <>
              <span style={styles.welcome}>
                Bienvenue, {user?.username}
              </span>
              <Link to="/dashboard" style={styles.link}>
                Dashboard
              </Link>
              <Link to="/profile" style={styles.link}>
                Profil
              </Link>
              <button onClick={handleLogout} style={styles.logoutBtn}>
                Déconnexion
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={styles.link}>
                Connexion
              </Link>
              <Link to="/register" style={styles.link}>
                Inscription
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    backgroundColor: '#007bff',
    color: 'white',
    padding: '15px 0',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white',
    textDecoration: 'none'
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '20px'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '16px',
    padding: '8px 12px',
    borderRadius: '5px',
    transition: 'background-color 0.3s'
  },
  welcome: {
    marginRight: '10px',
    fontSize: '14px'
  },
  logoutBtn: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  }
};

export default Navbar;