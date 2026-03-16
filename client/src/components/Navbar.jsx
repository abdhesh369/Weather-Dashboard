import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cloud, Map, Bell, LogOut, User } from 'lucide-react';
import UnitToggle from './UnitToggle';

export default function Navbar({ units, setUnits }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-between px-6 h-[60px]"
      style={{
        background: 'rgba(10,15,30,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border-subtle)',
      }}
    >
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 no-underline">
        <div
          className="w-8 h-8 rounded-[10px] flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <Cloud size={16} color="#fff" />
        </div>
        <span className="text-white font-bold text-[17px] tracking-tight">SkyCast</span>
      </Link>

      {/* Center nav pills */}
      <div className="hidden sm:flex gap-1">
        {[
          { to: '/', label: 'Dashboard', icon: null, end: true },
          { to: '/map', label: 'Map', icon: <Map size={13} /> },
          { to: '/alerts', label: 'Alerts', icon: <Bell size={13} /> },
        ].map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end}>
            {({ isActive }) => (
              <span
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200"
                style={{
                  color: isActive ? '#fff' : 'var(--text-muted)',
                  background: isActive ? 'var(--brand-primary-soft)' : 'transparent',
                }}
              >
                {icon}
                {label}
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        <UnitToggle units={units} setUnits={setUnits} />

        {isAuthenticated ? (
          <div className="flex items-center gap-2">
            <div
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[12px] font-semibold cursor-pointer select-none"
              style={{ background: 'linear-gradient(135deg,#6366f1,#ec4899)' }}
              title={user?.email}
            >
              {user?.email?.[0]?.toUpperCase() || <User size={14} />}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-medium transition-all duration-200"
              style={{
                border: '1px solid var(--border-default)',
                background: 'var(--glass-bg)',
                color: 'var(--text-secondary)',
              }}
            >
              <LogOut size={12} />
              Sign out
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <NavLink to="/login">
              <span className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-white/70 hover:text-white transition-colors">
                Log in
              </span>
            </NavLink>
            <NavLink to="/register">
              <span
                className="px-3.5 py-1.5 rounded-full text-[13px] font-medium text-white transition-all duration-200"
                style={{ background: 'var(--brand-primary)' }}
              >
                Sign up
              </span>
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
}