import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ variant = 'dark' }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`navbar navbar--${variant}`}>
      <Link to={user ? '/dashboard' : '/'} className="navbar__brand">
        <span className="navbar__logo">◆</span>
        CareerPath AI
      </Link>
      <div className="navbar__links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile-setup">Profile</Link>
            <button type="button" className="btn btn--ghost btn--sm" onClick={handleLogout}>
              Log out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn--ghost btn--sm">
              Log in
            </Link>
            <Link to="/register" className="btn btn--primary btn--sm">
              Get Started
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
