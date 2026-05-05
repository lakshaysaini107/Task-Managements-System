import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import TaskCard from '../components/TaskCard';
import api from '../api/axios';

const TaskBoard = () => {
  const { user } = useContext(AuthContext);
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showMembersForm, setShowMembersForm] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'Medium',
    assignedTo: '',
  });
  const [newMemberEmail, setNewMemberEmail] = useState('');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      const [projectRes, tasksRes] = await Promise.all([
        api.get(`/projects/${projectId}`),
        api.get(`/tasks/${projectId}/tasks`),
      ]);
      setProject(projectRes.data.project);
      setTasks(tasksRes.data.tasks);
    } catch (err) {
      setError('Failed to fetch project or tasks');
    } finally {
      setLoading(false);
    }
  };

  const isAdmin = project?.admin_id === user?.id;

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/tasks/${projectId}/tasks`, newTask);
      setNewTask({
        title: '',
        description: '',
        dueDate: '',
        priority: 'Medium',
        assignedTo: '',
      });
      setShowCreateForm(false);
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await api.put(`/tasks/task/${taskId}`, { status: newStatus });
      fetchProjectAndTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await api.delete(`/tasks/task/${taskId}`);
      fetchProjectAndTasks();
    } catch (err) {
      setError('Failed to delete task');
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!newMemberEmail) return;
    
    try {
      await api.post(`/projects/${projectId}/members`, { email: newMemberEmail });
      setNewMemberEmail('');
      setError('');
      fetchProjectAndTasks();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add member');
    }
  };

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Remove this member?')) return;
    try {
      await api.delete(`/projects/${projectId}/members/${userId}`);
      fetchProjectAndTasks();
    } catch (err) {
      setError('Failed to remove member');
    }
  };

  if (loading) return <div style={styles.container}>Loading...</div>;
  if (error && !project) return <div style={styles.container}>{error}</div>;
  if (!project) return <div style={styles.container}>Project not found</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div>
          <button onClick={() => navigate('/projects')} style={styles.backButton}>
            ← Back to Projects
          </button>
          <h1 style={styles.title}>{project.name}</h1>
          {project.description && <p style={styles.description}>{project.description}</p>}
        </div>
        {isAdmin && (
          <div style={styles.adminActions}>
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              style={styles.createButton}
            >
              + New Task
            </button>
            <button
              onClick={() => setShowMembersForm(!showMembersForm)}
              style={styles.membersButton}
            >
              👥 Members
            </button>
          </div>
        )}
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {isAdmin && showCreateForm && (
        <div style={styles.form}>
          <h3>Create New Task</h3>
          <input
            type="text"
            placeholder="Task Title"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            style={styles.input}
            required
          />
          <textarea
            placeholder="Description"
            value={newTask.description}
            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            style={styles.textarea}
          />
          <input
            type="date"
            value={newTask.dueDate}
            onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
            style={styles.input}
          />
          <select
            value={newTask.priority}
            onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            style={styles.input}
          >
            <option value="Low">Low Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="High">High Priority</option>
          </select>
          <select
            value={newTask.assignedTo}
            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value ? parseInt(e.target.value) : '' })}
            style={styles.input}
          >
            <option value="">Assign to (optional)</option>
            {project.members.map((m) => (
              <option key={m.user.id} value={m.user.id}>
                {m.user.name}
              </option>
            ))}
          </select>
          <button onClick={handleCreateTask} style={styles.submitButton}>
            Create Task
          </button>
        </div>
      )}

      {isAdmin && showMembersForm && (
        <div style={styles.form}>
          <h3>Project Members</h3>
          <form onSubmit={handleAddMember} style={styles.addMemberForm}>
            <input
              type="email"
              placeholder="Member email"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              style={{ ...styles.input, marginBottom: 0 }}
            />
            <button type="submit" style={styles.submitButton}>
              Add Member
            </button>
          </form>
          <div style={styles.membersList}>
            {project.members.map((m) => (
              <div key={m.user.id} style={styles.memberItem}>
                <span>
                  {m.user.name} {m.user_id === project.admin_id && <span style={styles.adminBadge}>Admin</span>}
                </span>
                {isAdmin && m.user_id !== user.id && (
                  <button
                    onClick={() => handleRemoveMember(m.user.id)}
                    style={styles.removeButton}
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={styles.tasksContainer}>
        <div style={styles.column}>
          <h3 style={styles.columnTitle}>To Do ({tasks.filter(t => t.status === 'To Do').length})</h3>
          <div style={styles.tasks}>
            {tasks
              .filter((t) => t.status === 'To Do')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  isAdmin={isAdmin}
                  currentUserId={user?.id}
                />
              ))}
          </div>
        </div>

        <div style={styles.column}>
          <h3 style={styles.columnTitle}>In Progress ({tasks.filter(t => t.status === 'In Progress').length})</h3>
          <div style={styles.tasks}>
            {tasks
              .filter((t) => t.status === 'In Progress')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  isAdmin={isAdmin}
                  currentUserId={user?.id}
                />
              ))}
          </div>
        </div>

        <div style={styles.column}>
          <h3 style={styles.columnTitle}>Done ({tasks.filter(t => t.status === 'Done').length})</h3>
          <div style={styles.tasks}>
            {tasks
              .filter((t) => t.status === 'Done')
              .map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDeleteTask}
                  isAdmin={isAdmin}
                  currentUserId={user?.id}
                />
              ))}
          </div>
        </div>
      </div>

      {tasks.length === 0 && (
        <div style={styles.empty}>
          <p>No tasks yet. {isAdmin ? 'Create one to get started!' : 'Waiting for tasks...'}</p>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '2rem',
  },
  backButton: {
    padding: '0.5rem 1rem',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    marginBottom: '0.5rem',
  },
  title: {
    fontSize: '2rem',
    color: '#2c3e50',
    margin: '0.5rem 0 0 0',
  },
  description: {
    color: '#7f8c8d',
    marginTop: '0.5rem',
  },
  adminActions: {
    display: 'flex',
    gap: '1rem',
  },
  createButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  membersButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  error: {
    padding: '0.75rem',
    marginBottom: '1rem',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    borderRadius: '4px',
  },
  form: {
    padding: '1.5rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #ddd',
  },
  input: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
  },
  textarea: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    minHeight: '80px',
  },
  submitButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
  membersList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  addMemberForm: {
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '0.75rem',
    marginBottom: '1rem',
  },
  memberItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem',
    backgroundColor: 'white',
    borderRadius: '4px',
    borderLeft: '4px solid #3498db',
  },
  adminBadge: {
    marginLeft: '0.5rem',
    padding: '0.25rem 0.5rem',
    backgroundColor: '#f39c12',
    color: 'white',
    borderRadius: '3px',
    fontSize: '0.75rem',
  },
  removeButton: {
    padding: '0.25rem 0.75rem',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '3px',
    cursor: 'pointer',
    fontSize: '0.85rem',
  },
  tasksContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  column: {
    backgroundColor: '#ecf0f1',
    borderRadius: '8px',
    padding: '1rem',
    minHeight: '500px',
  },
  columnTitle: {
    fontSize: '1.1rem',
    color: '#2c3e50',
    marginBottom: '1rem',
    paddingBottom: '0.5rem',
    borderBottom: '2px solid #95a5a6',
  },
  tasks: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  empty: {
    textAlign: 'center',
    padding: '3rem 1rem',
    color: '#7f8c8d',
  },
};

export default TaskBoard;
