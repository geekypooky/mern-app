import { useState, useEffect } from 'react';
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
