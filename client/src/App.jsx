import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
