import { Link } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-logo">
        PEER<span>SKILL</span>
        <span className="nav-dot" />
      </div>

      <div className="nav-links">
        <Link to="/explore">EXPLORE</Link>
        <Link to="/matches">MATCHES</Link>
        <Link to="/requests">REQUESTS</Link>
        <Link to="/chat">CHAT</Link>
      </div>

      <div className="nav-right">
        <span className="nav-tag">EST. 2025</span>
        <Link to="/register" className="nav-cta">JOIN FREE</Link>
      </div>
    </nav>
  );
}
