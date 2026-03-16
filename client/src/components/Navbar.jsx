import { useContext } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cloud, Map, Bell, LogOut, User } from 'lucide-react';
import UnitToggle from './UnitToggle';

export default function Navbar({ units, setUnits }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  return (
    <nav
      className="sticky top-0 z-50 flex items-center justify-center w-full px-5 md:px-10 py-5"
      style={{
        background: 'rgba(3, 7, 18, 0.65)',
        backdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <div className="flex items-center justify-between w-full max-w-[1100px] gap-6">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-3.5 no-underline shrink-0">
        <div
          className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <Cloud size={18} color="#fff" />
        </div>
        <span className="text-white font-bold text-[18px] tracking-tight hidden md:block">SkyCast</span>
      </Link>

      {/* Center nav pills */}
      <div className="flex items-center gap-2 bg-white/5 p-1 rounded-full border border-white/5">
        {[
          { to: '/', label: 'Dashboard', icon: null, end: true },
          { to: '/map', label: 'Map', icon: <Map size={13} /> },
          { to: '/alerts', label: 'Alerts', icon: <Bell size={13} /> },
        ].map(({ to, label, icon, end }) => (
          <NavLink key={to} to={to} end={end} className="no-underline">
            {({ isActive }) => (
              <span
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-300 whitespace-nowrap"
                style={{
                  color: isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                  background: isActive ? 'var(--brand-primary)' : 'transparent',
                }}
              >
                {icon}
                <span className={icon ? 'hidden lg:block' : ''}>{label}</span>
              </span>
            )}
          </NavLink>
        ))}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:block">
          <UnitToggle units={units} setUnits={setUnits} />
        </div>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <div
              className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-bold cursor-pointer select-none border border-white/10"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
              title={user?.email}
            >
              {user?.email?.[0]?.toUpperCase() || <User size={16} />}
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-[13px] font-bold transition-all duration-300 glass hover:bg-rose-500/10 hover:border-rose-500/20 text-rose-400 group shrink-0"
            >
              <LogOut size={14} className="group-hover:rotate-12 transition-transform" />
              <span className="hidden md:block">Sign out</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <NavLink to="/login" className="no-underline">
              <span className="px-4 py-2 rounded-full text-[13px] font-bold text-white/50 hover:text-white transition-colors">
                Log in
              </span>
            </NavLink>
            <NavLink to="/register" className="no-underline">
              <span
                className="px-5 py-2 rounded-full text-[13px] font-bold text-white transition-all duration-300 shadow-lg shadow-brand-primary/20"
                style={{ background: 'var(--brand-primary)' }}
              >
                Sign up
              </span>
            </NavLink>
          </div>
        )}
      </div>
      </div>
    </nav>
  );
}