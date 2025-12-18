import React, { useState, useEffect } from 'react';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { taskService } from '../../services/taskService';
import { useAuth } from '../../context/AuthContext';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filter, setFilter] = useState('all');
  
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTasks(user.id);
      setTasks(data);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des tâches');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData) => {
    try {
      const newTask = await taskService.createTask({
        ...taskData,
        user_id: user.id
      });
      setTasks([newTask, ...tasks]);
      setShowForm(false);
    } catch (err) {
      setError('Erreur lors de la création de la tâche');
    }
  };

  const handleUpdateTask = async (id, updates) => {
    try {
      const updatedTask = await taskService.updateTask(id, {
        ...updates,
        user_id: user.id
      });
      setTasks(tasks.map(task => 
        task.id === id ? updatedTask : task
      ));
      setEditingTask(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour de la tâche');
    }
  };

  const handleDeleteTask = async (id) => {
    if (window.confirm('Supprimer cette tâche ?')) {
      try {
        await taskService.deleteTask(id, user.id);
        setTasks(tasks.filter(task => task.id !== id));
      } catch (err) {
        setError('Erreur lors de la suppression de la tâche');
      }
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'completed') return task.status === 'completed';
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'in-progress') return task.status === 'in-progress';
    return true;
  });

  if (loading) {
    return (
      <div style={styles.loading}>
        <div style={styles.spinner}></div>
        <p>Chargement des tâches...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Mes Tâches</h2>
        <button 
          onClick={() => setShowForm(true)}
          style={styles.addButton}
        >
          + Nouvelle Tâche
        </button>
      </div>

      {error && (
        <div style={styles.error}>
          {error}
        </div>
      )}

      <div style={styles.filters}>
        <button 
          onClick={() => setFilter('all')}
          style={filter === 'all' ? styles.activeFilter : styles.filterBtn}
        >
          Toutes ({tasks.length})
        </button>
        <button 
          onClick={() => setFilter('pending')}
          style={filter === 'pending' ? styles.activeFilter : styles.filterBtn}
        >
          En attente ({tasks.filter(t => t.status === 'pending').length})
        </button>
        <button 
          onClick={() => setFilter('in-progress')}
          style={filter === 'in-progress' ? styles.activeFilter : styles.filterBtn}
        >
          En cours ({tasks.filter(t => t.status === 'in-progress').length})
        </button>
        <button 
          onClick={() => setFilter('completed')}
          style={filter === 'completed' ? styles.activeFilter : styles.filterBtn}
        >
          Terminées ({tasks.filter(t => t.status === 'completed').length})
        </button>
      </div>

      {showForm && (
        <TaskForm
          onSubmit={handleCreateTask}
          onCancel={() => setShowForm(false)}
        />
      )}

      {editingTask && (
        <TaskForm
          task={editingTask}
          onSubmit={(data) => handleUpdateTask(editingTask.id, data)}
          onCancel={() => setEditingTask(null)}
        />
      )}

      {filteredTasks.length === 0 ? (
        <div style={styles.empty}>
          <p>Aucune tâche {filter !== 'all' ? `avec le filtre "${filter}"` : ''}</p>
        </div>
      ) : (
        <div style={styles.taskList}>
          {filteredTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={() => setEditingTask(task)}
              onDelete={() => handleDeleteTask(task.id)}
              onUpdate={(updates) => handleUpdateTask(task.id, updates)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// CORRECTION : Déclarer styles correctement
const styles = {
  container: {
    padding: '20px'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px'
  },
  addButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  filters: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  },
  filterBtn: {
    padding: '8px 16px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  activeFilter: {
    padding: '8px 16px',
    border: '1px solid #007bff',
    backgroundColor: '#007bff',
    color: 'white',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  taskList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  loading: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '50px'
  },
  spinner: {
    border: '3px solid #f3f3f3',
    borderTop: '3px solid #007bff',
    borderRadius: '50%',
    width: '30px',
    height: '30px',
    animation: 'spin 1s linear infinite',
    marginBottom: '10px'
  },
  error: {
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '10px',
    borderRadius: '5px',
    marginBottom: '20px'
  },
  empty: {
    textAlign: 'center',
    padding: '50px',
    color: '#666',
    backgroundColor: 'white',
    borderRadius: '10px'
  }
};

// Ajouter l'animation CSS
if (typeof document !== 'undefined') {
  const styleSheet = document.styleSheets[0];
  if (styleSheet) {
    styleSheet.insertRule(`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `, styleSheet.cssRules.length);
  }
}

export default TaskList;