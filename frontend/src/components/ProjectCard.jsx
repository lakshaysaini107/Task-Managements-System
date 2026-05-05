import React from 'react';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, isAdmin }) => {
  const memberCount = project.members?.length || 0;
  const taskCount = project.tasks?.length || 0;

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h3 style={styles.title}>{project.name}</h3>
        {isAdmin && <span style={styles.badge}>Admin</span>}
      </div>
      {project.description && (
        <p style={styles.description}>{project.description}</p>
      )}
      <div style={styles.stats}>
        <span>👥 {memberCount} members</span>
        <span>📋 {taskCount} tasks</span>
      </div>
      <Link to={`/projects/${project.id}`} style={styles.viewButton}>
        View Project
      </Link>
    </div>
  );
};

const styles = {
  card: {
    padding: '1.5rem',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#f9f9f9',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  title: {
    margin: 0,
    fontSize: '1.2rem',
    color: '#2c3e50',
  },
  badge: {
    display: 'inline-block',
    padding: '0.25rem 0.75rem',
    backgroundColor: '#3498db',
    color: 'white',
    borderRadius: '4px',
    fontSize: '0.75rem',
    fontWeight: 'bold',
  },
  description: {
    margin: '0.5rem 0 1rem',
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  stats: {
    display: 'flex',
    gap: '1.5rem',
    marginBottom: '1rem',
    fontSize: '0.9rem',
    color: '#95a5a6',
  },
  viewButton: {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    backgroundColor: '#3498db',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.9rem',
    transition: 'background-color 0.3s',
  },
};

export default ProjectCard;
