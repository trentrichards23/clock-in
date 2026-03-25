import { NavLink } from 'react-router-dom';

export default function Nav() {
  return (
    <header className="app-header">
      <div className="app-header-inner">
        <NavLink to="/" className="logo">
          <span className="logo-c">c</span>
          <span className="logo-lock">Lock</span>
          <span className="logo-in">In</span>
        </NavLink>
        <nav className="app-nav">
          <NavLink
            to="/"
            end
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            Clock In
          </NavLink>
          <NavLink
            to="/stats"
            className={({ isActive }) => `nav-link${isActive ? ' nav-link--active' : ''}`}
          >
            Stats
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
