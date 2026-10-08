import { useState, useEffect } from 'react';
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
