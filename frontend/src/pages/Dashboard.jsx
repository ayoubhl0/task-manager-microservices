import React, { useState, useEffect } from 'react';
import TaskList from '../components/Tasks/TaskList';
import { taskService } from '../services/taskService';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await taskService.getTaskStats(user.id);
      setStats(data);
    } catch (error) {
      console.error('Erreur stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loading}>
        Chargement du dashboard...
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.welcome}>
        <h1>Bonjour, {user?.username} 👋</h1>
        <p>Bienvenue sur votre dashboard de tâches</p>
      </div>

      {stats && (
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.total || 0}</h3>
            <p style={styles.statLabel}>Tâches totales</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.completed || 0}</h3>
            <p style={styles.statLabel}>Terminées</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.pending || 0}</h3>
            <p style={styles.statLabel}>En attente</p>
          </div>
          <div style={styles.statCard}>
            <h3 style={styles.statNumber}>{stats.in_progress || 0}</h3>
            <p style={styles.statLabel}>En cours</p>
          </div>
        </div>
      )}

      <TaskList />
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  welcome: {
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  },
  statCard: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '36px',
    color: '#007bff',
    marginBottom: '10px'
  },
  statLabel: {
    color: '#666',
    fontSize: '14px'
  },
  loading: {
    textAlign: 'center',
    padding: '50px',
    fontSize: '18px',
    color: '#666'
  }
};

export default Dashboard;