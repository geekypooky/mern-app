const fs = require('fs');
const path = require('path');

const files = {
  'src/App.jsx': `import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/tasks/new" element={<CreateTask />} />
            <Route path="/tasks/edit/:id" element={<EditTask />} />
            <Route path="*" element={<div className="not-found"><h2>404 Page Not Found</h2><a href="/" className="btn">Return to Dashboard</a></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
`,
  'src/index.css': `:root {
  --bg-color: #f4f7f6;
  --text-main: #333;
  --text-light: #777;
  --primary: #4a90e2;
  --danger: #e74c3c;
  --success: #2ecc71;
  --card-bg: #fff;
  --border: #e0e0e0;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: var(--bg-color); color: var(--text-main); line-height: 1.6; }
.app-container { display: flex; flex-direction: column; min-height: 100vh; }
.navbar { background: var(--card-bg); padding: 1rem 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; justify-content: space-between; align-items: center; }
.navbar a { text-decoration: none; color: var(--text-main); font-weight: bold; margin-left: 1rem; }
.main-content { padding: 2rem; flex: 1; max-width: 1200px; margin: 0 auto; width: 100%; }
.card { background: var(--card-bg); padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); margin-bottom: 1rem; }
.btn { padding: 0.5rem 1rem; border: none; border-radius: 4px; cursor: pointer; color: #fff; background: var(--primary); text-decoration: none; display: inline-block; }
.btn-danger { background: var(--danger); }
.btn-success { background: var(--success); }
.stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { text-align: center; }
.stat-card h3 { color: var(--text-light); font-size: 1rem; }
.stat-card p { font-size: 2rem; font-weight: bold; }
.form-group { margin-bottom: 1rem; }
.form-group label { display: block; margin-bottom: 0.5rem; }
.form-group input, .form-group select, .form-group textarea { width: 100%; padding: 0.5rem; border: 1px solid var(--border); border-radius: 4px; }
.error { color: var(--danger); margin-bottom: 1rem; }
.loading { text-align: center; font-size: 1.2rem; margin: 2rem 0; }
.task-list { display: flex; flex-direction: column; gap: 1rem; }
.task-header { display: flex; justify-content: space-between; align-items: flex-start; }
.task-actions { display: flex; gap: 0.5rem; margin-top: 1rem; }
.filters { display: flex; gap: 1rem; margin-bottom: 1rem; flex-wrap: wrap; }
@media (max-width: 768px) {
  .app-container { flex-direction: column; }
  .stats-grid { grid-template-columns: 1fr 1fr; }
}
`,
  'src/components/Navbar.jsx': `import { Link } from 'react-router-dom';
export default function Navbar() {
  return (
    <nav className="navbar">
      <h2>StudyFlow</h2>
      <div>
        <Link to="/">Dashboard</Link>
        <Link to="/tasks">Tasks</Link>
      </div>
    </nav>
  );
}
`,
  'src/pages/Dashboard.jsx': `import { useState, useEffect } from 'react';
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
`,
  'src/components/StatCard.jsx': `export default function StatCard({ title, value }) {
  return (
    <div className="card stat-card">
      <h3>{title}</h3>
      <p>{value}</p>
    </div>
  );
}
`,
  'src/components/TaskCard.jsx': `import { useState } from 'react';
import { Link } from 'react-router-dom';
import { updateTaskStatus, deleteTask } from '../services/taskService';

export default function TaskCard({ task, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    try {
      setLoading(true);
      const newStatus = task.status === 'completed' ? 'pending' : 'completed';
      await updateTaskStatus(task._id, newStatus);
      onUpdate();
    } catch (err) {
      alert('Failed to update status');
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        setLoading(true);
        await deleteTask(task._id);
        onUpdate();
      } catch (err) {
        alert('Failed to delete task');
        setLoading(false);
      }
    }
  };

  return (
    <div className="card" style={{ opacity: task.status === 'completed' ? 0.7 : 1 }}>
      <div className="task-header">
        <h3 style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
          {task.title}
        </h3>
        <span style={{ fontWeight: 'bold', color: task.priority === 'high' ? 'red' : 'inherit' }}>
          {task.priority.toUpperCase()}
        </span>
      </div>
      <p>{task.description}</p>
      <div style={{ marginTop: '0.5rem', color: '#777', fontSize: '0.9rem' }}>
        <p>Category: {task.category}</p>
        {task.dueDate && <p>Due: {new Date(task.dueDate).toLocaleDateString()}</p>}
      </div>
      <div className="task-actions">
        <button className={\`btn \${task.status === 'completed' ? '' : 'btn-success'}\`} onClick={toggleStatus} disabled={loading}>
          {task.status === 'completed' ? 'Mark Pending' : 'Complete'}
        </button>
        <Link to={\`/tasks/edit/\${task._id}\`} className="btn">Edit</Link>
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>Delete</button>
      </div>
    </div>
  );
}
`,
  'src/pages/Tasks.jsx': `import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getTasks } from '../services/taskService';
import TaskCard from '../components/TaskCard';

export default function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [sort, setSort] = useState('Newest');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getTasks();
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  let filtered = tasks.filter(t => {
    if (filterStatus !== 'All' && t.status !== filterStatus.toLowerCase()) return false;
    if (filterPriority !== 'All' && t.priority !== filterPriority.toLowerCase()) return false;
    if (search) {
      const q = search.toLowerCase();
      return t.title.toLowerCase().includes(q) || 
             (t.description && t.description.toLowerCase().includes(q)) ||
             t.category.toLowerCase().includes(q);
    }
    return true;
  });

  filtered.sort((a, b) => {
    if (sort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (sort === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (sort === 'Due date') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate) - new Date(b.dueDate);
    }
    if (sort === 'Priority') {
      const p = { high: 3, medium: 2, low: 1 };
      return p[b.priority] - p[a.priority];
    }
    return 0;
  });

  if (loading) return <div className="loading">Loading tasks...</div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h1>All Tasks</h1>
        <Link to="/tasks/new" className="btn">+ Add Task</Link>
      </div>
      
      <div className="filters card">
        <input type="text" placeholder="Search tasks..." value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem', flex: 1 }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
          <option>All</option><option>Pending</option><option>Completed</option>
        </select>
        <select value={filterPriority} onChange={e => setFilterPriority(e.target.value)}>
          <option>All</option><option>Low</option><option>Medium</option><option>High</option>
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}>
          <option>Newest</option><option>Oldest</option><option>Due date</option><option>Priority</option>
        </select>
      </div>

      <div className="task-list">
        {filtered.length === 0 ? (
          <p>No matching tasks found.</p>
        ) : (
          filtered.map(task => <TaskCard key={task._id} task={task} onUpdate={fetchTasks} />)
        )}
      </div>
    </div>
  );
}
`,
  'src/pages/CreateTask.jsx': `import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTask } from '../services/taskService';

export default function CreateTask() {
  const [formData, setFormData] = useState({ title: '', description: '', category: '', priority: 'medium', dueDate: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.title.length < 3) {
      setError('Title must be at least 3 characters');
      return;
    }
    try {
      setLoading(true);
      await createTask(formData);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Failed to create task');
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Create Task</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input required minLength="3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea maxLength="500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Priority *</label>
          <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
        </div>
        <button type="submit" className="btn" disabled={loading}>{loading ? 'Saving...' : 'Save Task'}</button>
      </form>
    </div>
  );
}
`,
  'src/pages/EditTask.jsx': `import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getTask, updateTask } from '../services/taskService';

export default function EditTask() {
  const { id } = useParams();
  const [formData, setFormData] = useState({ title: '', description: '', category: '', priority: 'medium', dueDate: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await getTask(id);
        const t = res.data;
        setFormData({
          title: t.title,
          description: t.description || '',
          category: t.category,
          priority: t.priority,
          dueDate: t.dueDate ? t.dueDate.split('T')[0] : ''
        });
      } catch (err) {
        setError('Task not found');
      } finally {
        setLoading(false);
      }
    };
    fetchTask();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await updateTask(id, formData);
      navigate('/tasks');
    } catch (err) {
      setError(err.message || 'Failed to update task');
      setSaving(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="card" style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h2>Edit Task</h2>
      {error && <div className="error">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title *</label>
          <input required minLength="3" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Description</label>
          <textarea maxLength="500" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Category *</label>
          <input required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
        </div>
        <div className="form-group">
          <label>Priority *</label>
          <select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="date" value={formData.dueDate} onChange={e => setFormData({...formData, dueDate: e.target.value})} />
        </div>
        <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Update Task'}</button>
      </form>
    </div>
  );
}
`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content);
}
console.log('Frontend generated!');
