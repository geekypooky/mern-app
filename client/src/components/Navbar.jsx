import { Link } from 'react-router-dom';
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
