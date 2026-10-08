import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/taskService';
import StatCard from '../components/StatCard';
import TaskCard from '../components/TaskCard';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      setError('Unable to load tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error) return <div className="error">{error}</div>;

  const total = tasks.length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === 'high').length;
  
  const today = new Date().toISOString().split('T')[0];
  const dueToday = tasks.filter(t => t.dueDate && t.dueDate.split('T')[0] === today).length;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h1>Dashboard</h1>
        <Link to="/tasks/new" className="btn">+ Create Task</Link>
      </div>
      
      <div className="stats-grid">
        <StatCard title="Total Tasks" value={total} />
        <StatCard title="Completed" value={completed} />
        <StatCard title="Pending" value={pending} />
        <StatCard title="High Priority" value={highPriority} />
        <StatCard title="Due Today" value={dueToday} />
      </div>

      <h2>Recent Tasks</h2>
      <div className="task-list">
        {tasks.slice(0, 5).map(task => (
          <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />
        ))}
        {tasks.length === 0 && <p>No tasks yet. Create your first task to get started.</p>}
      </div>
    </div>
  );
}
