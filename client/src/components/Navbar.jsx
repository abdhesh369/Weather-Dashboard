import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cloud, LogOut, User, Keyboard } from 'lucide-react';
import UnitToggle from './UnitToggle';
import { motion, AnimatePresence } from 'framer-motion';

function ShortcutHint({ keys, desc }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <span className="text-[12px] text-white/50">{desc}</span>
      <div className="flex items-center gap-1">
        {keys.map((k, i) => (
          <kbd key={i}
            className="px-1.5 py-0.5 rounded text-[11px] font-bold font-mono"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.7)' }}>
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

export default function Navbar({ units, setUnits }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [scrolled,     setScrolled]     = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcutsRef = useRef(null);

  // Compact navbar on scroll
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close shortcut panel on outside click
  useEffect(() => {
    if (!showShortcuts) return;
    const handler = (e) => {
      if (shortcutsRef.current && !shortcutsRef.current.contains(e.target)) {
        setShowShortcuts(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [showShortcuts]);

  return (
    <div
      className="fixed left-0 right-0 z-50 flex justify-center px-4 md:px-6 pointer-events-none transition-all duration-500"
      style={{ top: scrolled ? '8px' : '20px' }}
    >
      <motion.nav
        layout
        className="flex items-center justify-between w-full max-w-[1100px] gap-4 md:gap-6 pointer-events-auto"
        style={{
          padding: scrolled ? '10px 20px' : '14px 24px',
          borderRadius: scrolled ? '28px' : '32px',
          background: scrolled ? 'rgba(8,12,30,0.80)' : 'rgba(15,23,42,0.45)',
          backdropFilter: 'blur(32px)',
          WebkitBackdropFilter: 'blur(32px)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: scrolled
            ? '0 8px 32px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)'
            : '0 24px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 no-underline shrink-0">
          <div
            className="rounded-[12px] flex items-center justify-center shrink-0 transition-all duration-300"
            style={{
              width: scrolled ? 32 : 36,
              height: scrolled ? 32 : 36,
              background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            }}
          >
            <Cloud size={scrolled ? 15 : 17} color="#fff" />
          </div>
          <span className="text-white font-bold tracking-tight hidden md:block transition-all duration-300"
            style={{ fontSize: scrolled ? 16 : 18 }}>
            SkyCast
          </span>
        </Link>

        {/* Center nav */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-full border border-white/5">
          {[
            { to: '/', label: 'Dashboard', end: true },
          ].map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className="no-underline">
              {({ isActive }) => (
                <span
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-bold cursor-pointer transition-all duration-300 whitespace-nowrap"
                  style={{
                    color:      isActive ? '#fff' : 'rgba(255,255,255,0.4)',
                    background: isActive ? 'var(--brand-primary)' : 'transparent',
                  }}
                >
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden sm:block">
            <UnitToggle units={units} setUnits={setUnits} />
          </div>

          {/* Keyboard shortcuts */}
          <div ref={shortcutsRef} className="relative hidden md:block">
            <motion.button
              onClick={() => setShowShortcuts(s => !s)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Keyboard shortcuts (?)"
              className="w-[34px] h-[34px] rounded-full flex items-center justify-center border-none cursor-pointer transition-all duration-200"
              style={{
                background: showShortcuts ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.06)',
                color: showShortcuts ? 'var(--brand-primary)' : 'rgba(255,255,255,0.4)',
              }}
            >
              <Keyboard size={14} />
            </motion.button>

            <AnimatePresence>
              {showShortcuts && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1 }}
                  exit={{  opacity: 0, y: -8, scale: 0.96 }}
                  className="absolute right-0 top-full mt-3 p-4 glass rounded-[20px] z-50 flex flex-col gap-3 min-w-[240px]"
                  style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider opacity-40 mb-1">Shortcuts</p>
                  <ShortcutHint keys={['/']}         desc="Focus search" />
                  <ShortcutHint keys={['G']}         desc="Use my location" />
                  <ShortcutHint keys={['U']}         desc="Toggle °C / °F" />
                  <ShortcutHint keys={['Esc']}       desc="Clear search" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <div
                className="rounded-full flex items-center justify-center font-bold cursor-pointer select-none border border-white/10"
                style={{
                  width: 34, height: 34, fontSize: 13,
                  background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
                }}
                title={user?.email}
              >
                {user?.email?.[0]?.toUpperCase() || <User size={14} />}
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[13px] font-bold transition-all duration-300 glass hover:bg-rose-500/10 hover:border-rose-500/20 text-rose-400 group shrink-0 cursor-pointer border-none"
              >
                <LogOut size={13} className="group-hover:rotate-12 transition-transform" />
                <span className="hidden md:block">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="no-underline">
                <span className="px-3.5 py-1.5 rounded-full text-[13px] font-bold text-white/50 hover:text-white transition-colors">
                  Log in
                </span>
              </NavLink>
              <NavLink to="/register" className="no-underline">
                <span
                  className="px-4 py-1.5 rounded-full text-[13px] font-bold text-white transition-all duration-300 shadow-lg shadow-brand-primary/20"
                  style={{ background: 'var(--brand-primary)' }}
                >
                  Sign up
                </span>
              </NavLink>
            </div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
