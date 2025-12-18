import React from 'react';

const TaskFilter = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: 'all', label: 'Toutes', emoji: '📋' },
    { id: 'pending', label: 'En attente', emoji: '⏳' },
    { id: 'in-progress', label: 'En cours', emoji: '🔄' },
    { id: 'completed', label: 'Terminées', emoji: '✅' }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.filterList}>
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            style={{
              ...styles.filterButton,
              ...(activeFilter === filter.id ? styles.activeFilter : {})
            }}
          >
            <span style={styles.emoji}>{filter.emoji}</span>
            <span style={styles.label}>{filter.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: '20px'
  },
  filterList: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },
  filterButton: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '10px 16px',
    border: '1px solid #ddd',
    backgroundColor: 'white',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'all 0.3s'
  },
  activeFilter: {
    backgroundColor: '#007bff',
    color: 'white',
    borderColor: '#007bff'
  },
  emoji: {
    fontSize: '16px'
  },
  label: {
    fontWeight: '500'
  }
};

export default TaskFilter;