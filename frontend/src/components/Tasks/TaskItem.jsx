import React, { useState } from 'react';

const TaskItem = ({ task, onEdit, onDelete, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description);
  const [editedStatus, setEditedStatus] = useState(task.status);

  const handleSave = () => {
    onUpdate({
      title: editedTitle,
      description: editedDescription,
      status: editedStatus
    });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus) => {
    onUpdate({ status: newStatus });
  };

  const statusColors = {
    'pending': '#ffc107',
    'in-progress': '#17a2b8',
    'completed': '#28a745'
  };

  const statusLabels = {
    'pending': 'En attente',
    'in-progress': 'En cours',
    'completed': 'Terminée'
  };

  if (isEditing) {
    return (
      <div style={styles.taskCard}>
        <div style={styles.form}>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            style={styles.input}
            placeholder="Titre"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            style={styles.textarea}
            placeholder="Description"
          />
          <select
            value={editedStatus}
            onChange={(e) => setEditedStatus(e.target.value)}
            style={styles.select}
          >
            <option value="pending">En attente</option>
            <option value="in-progress">En cours</option>
            <option value="completed">Terminée</option>
          </select>
          <div style={styles.editActions}>
            <button onClick={handleSave} style={styles.saveBtn}>
              Enregistrer
            </button>
            <button onClick={() => setIsEditing(false)} style={styles.cancelBtn}>
              Annuler
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.taskCard}>
      <div style={styles.taskHeader}>
        <h4 style={styles.taskTitle}>{task.title}</h4>
        <div style={styles.taskActions}>
          <button onClick={() => setIsEditing(true)} style={styles.actionBtn}>
            ✏️
          </button>
          <button onClick={onDelete} style={styles.actionBtn}>
            🗑️
          </button>
        </div>
      </div>
      
      {task.description && (
        <p style={styles.taskDescription}>{task.description}</p>
      )}
      
      <div style={styles.taskFooter}>
        <div style={styles.statusSection}>
          <span 
            style={{
              ...styles.statusBadge,
              backgroundColor: statusColors[task.status] || '#6c757d'
            }}
          >
            {statusLabels[task.status] || task.status}
          </span>
          
          <div style={styles.statusButtons}>
            {task.status !== 'pending' && (
              <button 
                onClick={() => handleStatusChange('pending')}
                style={styles.statusBtn}
              >
                ⏳
              </button>
            )}
            {task.status !== 'in-progress' && (
              <button 
                onClick={() => handleStatusChange('in-progress')}
                style={styles.statusBtn}
              >
                🔄
              </button>
            )}
            {task.status !== 'completed' && (
              <button 
                onClick={() => handleStatusChange('completed')}
                style={styles.statusBtn}
              >
                ✅
              </button>
            )}
          </div>
        </div>
        
        <div style={styles.taskMeta}>
          <span style={styles.taskDate}>
            Créée le: {new Date(task.created_at).toLocaleDateString()}
          </span>
          {task.priority && (
            <span style={{
              ...styles.priorityBadge,
              backgroundColor: task.priority === 'high' ? '#dc3545' : 
                              task.priority === 'medium' ? '#ffc107' : '#28a745'
            }}>
              {task.priority === 'high' ? 'Haute' : 
               task.priority === 'medium' ? 'Moyenne' : 'Basse'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const styles = {
  taskCard: {
    backgroundColor: 'white',
    borderRadius: '10px',
    padding: '20px',
    marginBottom: '15px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    borderLeft: '4px solid #007bff'
  },
  taskHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '10px'
  },
  taskTitle: {
    margin: 0,
    fontSize: '18px',
    color: '#333',
    flex: 1
  },
  taskActions: {
    display: 'flex',
    gap: '10px'
  },
  actionBtn: {
    background: 'none',
    border: 'none',
    fontSize: '18px',
    cursor: 'pointer',
    padding: '5px',
    borderRadius: '5px'
  },
  taskDescription: {
    margin: '10px 0',
    color: '#666',
    fontSize: '14px',
    lineHeight: '1.5'
  },
  taskFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '15px',
    paddingTop: '15px',
    borderTop: '1px solid #eee'
  },
  statusSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  statusBadge: {
    padding: '5px 12px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: '600',
    color: 'white'
  },
  statusButtons: {
    display: 'flex',
    gap: '5px'
  },
  statusBtn: {
    background: 'none',
    border: '1px solid #ddd',
    borderRadius: '5px',
    padding: '5px 8px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  taskMeta: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '5px'
  },
  taskDate: {
    fontSize: '12px',
    color: '#999'
  },
  priorityBadge: {
    padding: '3px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    color: 'white',
    fontWeight: '500'
  },
  // Styles pour l'édition
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  input: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '16px'
  },
  textarea: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px',
    minHeight: '60px',
    resize: 'vertical'
  },
  select: {
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  editActions: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px'
  },
  saveBtn: {
    padding: '10px 20px',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  },
  cancelBtn: {
    padding: '10px 20px',
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    flex: 1
  }
};

export default TaskItem;