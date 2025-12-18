// src/services/authService.js
const API_URL = 'http://localhost:3001';

// Récupérer le token du localStorage
const getToken = () => {
  return localStorage.getItem('token');
};

// Récupérer les infos utilisateur du localStorage
const getUserFromStorage = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const authService = {
  async register(userData) {
    const response = await fetch(`${API_URL}/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  async login(credentials) {
    const response = await fetch(`${API_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    const data = await response.json();
    
    if (response.ok && data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    
    return data;
  },

  // Fonction qui manquait
  getCurrentUser() {
    return getUserFromStorage();
  },

  // Fonction pour vérifier si l'utilisateur est connecté
  isAuthenticated() {
    const token = getToken();
    const user = getUserFromStorage();
    return !!(token && user);
  },

  // Déconnexion
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Vérifier le token côté serveur
  async verifyToken() {
    const token = getToken();
    if (!token) return null;

    try {
      const response = await fetch(`${API_URL}/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Token verification failed:', error);
      return null;
    }
  }
};