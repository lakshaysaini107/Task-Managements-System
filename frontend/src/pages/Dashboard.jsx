import React, { useEffect, useState } from 'react';
import api from '../api/axios';

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const { data } = await api.get('/dashboard');
      setDashboard(data);
    } catch (err) {
      setError('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error) return <div style={styles.container}>{error}</div>;
  if (!dashboard) return <div style={styles.container}>No data available</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboard.totalTasks}</div>
          <div style={styles.statLabel}>Total Tasks</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboard.tasksByStatus['To Do'] || 0}</div>
          <div style={styles.statLabel}>To Do</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboard.tasksByStatus['In Progress'] || 0}</div>
          <div style={styles.statLabel}>In Progress</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{dashboard.tasksByStatus.Done || 0}</div>
          <div style={styles.statLabel}>Done</div>
        </div>
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Tasks by Team Member</h2>
        {dashboard.tasksByUser.length === 0 ? (
          <p>No assigned tasks</p>
        ) : (
          <div style={styles.list}>
            {dashboard.tasksByUser.map((item) => (
              <div key={item.user.id} style={styles.listItem}>
                <span>{item.user.name}</span>
                <span style={styles.count}>{item.count} task{item.count !== 1 ? 's' : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={styles.section}>
        <h2 style={styles.sectionTitle}>Overdue Tasks</h2>
        {dashboard.overdueTasks.length === 0 ? (
          <p style={styles.success}>✓ No overdue tasks!</p>
        ) : (
          <div style={styles.list}>
            {dashboard.overdueTasks.map((task) => (
              <div key={task.id} style={styles.overdueItem}>
                <div>
                  <strong>{task.title}</strong>
                  <div style={styles.taskMeta}>
                    {task.assignee && `👤 ${task.assignee.name}`}
                    {' • '}
                    {new Date(task.dueDate).toLocaleDateString()}
                  </div>
                </div>
                <span style={styles.projectBadge}>{task.project.name}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    marginBottom: '2rem',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: '0.5rem',
  },
  statLabel: {
    color: '#7f8c8d',
    fontSize: '0.9rem',
  },
  section: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: '1.3rem',
    color: '#2c3e50',
    marginBottom: '1rem',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    fontSize: '0.9rem',
  },
  count: {
    backgroundColor: '#3498db',
    color: 'white',
    padding: '0.25rem 0.5rem',
    borderRadius: '3px',
    fontSize: '0.8rem',
  },
  overdueItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: '#fff3cd',
    borderLeft: '4px solid #f39c12',
    borderRadius: '4px',
    marginBottom: '0.5rem',
  },
  taskMeta: {
    fontSize: '0.8rem',
    color: '#666',
    marginTop: '0.25rem',
  },
  projectBadge: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#f39c12',
    color: 'white',
    borderRadius: '3px',
    fontSize: '0.8rem',
  },
  success: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
};

export default Dashboard;
