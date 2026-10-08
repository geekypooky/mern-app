import { useState } from 'react';
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
