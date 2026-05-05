import React from 'react';

const TaskCard = ({ task, onStatusChange, onDelete, isAdmin, currentUserId }) => {
  const isAssignedToMe = task.assignedTo === currentUserId;
  const canUpdateStatus = isAssignedToMe || isAdmin;

  const priorityColor = {
    High: '#e74c3c',
    Medium: '#f39c12',
    Low: '#27ae60',
  };

  const statusColor = {
    'To Do': '#95a5a6',
    'In Progress': '#3498db',
    Done: '#27ae60',
  };

  const isOverdue =
    task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'Done';

  return (
    <div style={{ ...styles.card, borderLeft: `4px solid ${priorityColor[task.priority]}` }}>
      <div style={styles.header}>
        <h4 style={styles.title}>{task.title}</h4>
        {isOverdue && <span style={styles.overdue}>Overdue</span>}
      </div>

      {task.description && (
        <p style={styles.description}>{task.description}</p>
      )}

      <div style={styles.details}>
        <span style={styles.priority}>
          Priority: <strong>{task.priority}</strong>
        </span>
        {task.dueDate && (
          <span style={styles.dueDate}>
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>

      {task.assignee && (
        <p style={styles.assignee}>
          👤 {task.assignee.name}
        </p>
      )}

      <div style={styles.actions}>
        {canUpdateStatus && (
          <select
            value={task.status}
            onChange={(e) => onStatusChange(task.id, e.target.value)}
            style={styles.statusSelect}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        )}
        <span style={{ ...styles.status, backgroundColor: statusColor[task.status] }}>
          {task.status}
        </span>
        {isAdmin && (
          <button
            onClick={() => onDelete(task.id)}
            style={styles.deleteButton}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  card: {
    padding: '1rem',
    border: '1px solid #ddd',
    borderRadius: '6px',
    backgroundColor: '#fff',
    marginBottom: '1rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1rem',
    color: '#2c3e50',
  },
  overdue: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    borderRadius: '3px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  description: {
    margin: '0.5rem 0',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  details: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '0.5rem',
    fontSize: '0.85rem',
    color: '#95a5a6',
  },
  priority: {
    display: 'inline-block',
  },
  dueDate: {
    display: 'inline-block',
  },
  assignee: {
    margin: '0.5rem 0',
    fontSize: '0.9rem',
    color: '#34495e',
  },
  actions: {
    display: 'flex',
    gap: '0.5rem',
    alignItems: 'center',
    marginTop: '0.5rem',
  },
  statusSelect: {
    padding: '0.25rem 0.5rem',
    borderRadius: '4px',
    border: '1px solid #ddd',
    fontSize: '0.85rem',
    cursor: 'pointer',
  },
  status: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.8rem',
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: '0.25rem 0.5rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    marginLeft: 'auto',
  },
};

export default TaskCard;
