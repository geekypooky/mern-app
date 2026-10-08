import { useState } from 'react';
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
        <button className={`btn ${task.status === 'completed' ? '' : 'btn-success'}`} onClick={toggleStatus} disabled={loading}>
          {task.status === 'completed' ? 'Mark Pending' : 'Complete'}
        </button>
        <Link to={`/tasks/edit/${task._id}`} className="btn">Edit</Link>
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>Delete</button>
      </div>
    </div>
  );
}
