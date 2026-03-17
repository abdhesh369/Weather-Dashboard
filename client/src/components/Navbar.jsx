import { useContext, useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Cloud, LogOut, User, Keyboard } from 'lucide-react';
import UnitToggle from './UnitToggle';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';

function ShortcutHint({ keys, desc }) {
  return (
    <div className="navbar-shortcut-row">
      <span className="navbar-shortcut-desc">{desc}</span>
      <div className="navbar-shortcut-keys-wrapper">
        {keys.map((k, i) => (
          <kbd key={i} className="navbar-shortcut-key">
            {k}
          </kbd>
        ))}
      </div>
    </div>
  );
}

export default function Navbar({ units, setUnits }) {
  const { isAuthenticated, user, logout } = useContext(AuthContext);
  const [scrolled, setScrolled] = useState(false);
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
    <div className={`navbar-wrapper ${scrolled ? 'navbar-scrolled' : ''}`}>
      <motion.nav
        layout
        className="navbar-container"
      >
        {/* ── Brand ── */}
        <Link to="/" className="navbar-brand">
          <div className="navbar-brand-icon">
            <Cloud size={scrolled ? 18 : 20} strokeWidth={2.5} />
          </div>
          <span className="navbar-brand-text">SkyCast</span>
        </Link>

        {/* ── Center Nav Links ── */}
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => `navbar-link ${isActive ? 'active' : ''}`}>
            Dashboard
          </NavLink>
          {/* Add more links here if needed */}
        </div>

        {/* ── Right side ── */}
        <div className="navbar-actions">
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
              className={`navbar-shortcut-btn ${showShortcuts ? 'active' : ''}`}
            >
              <Keyboard size={16} />
            </motion.button>

            <AnimatePresence>
              {showShortcuts && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0,  scale: 1 }}
                  exit={{  opacity: 0, y: -10, scale: 0.96 }}
                  transition={{ duration: 0.2 }}
                  className="navbar-shortcut-panel"
                >
                  <p className="navbar-shortcut-header">Shortcuts</p>
                  <ShortcutHint keys={['/']}         desc="Focus search" />
                  <ShortcutHint keys={['G']}         desc="Use my location" />
                  <ShortcutHint keys={['U']}         desc="Toggle °C / °F" />
                  <ShortcutHint keys={['Esc']}       desc="Clear search" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {isAuthenticated ? (
            <div className="navbar-auth-group">
              <div className="navbar-profile" title={user?.email}>
                {user?.email?.[0]?.toUpperCase() || <User size={15} />}
              </div>
              <button onClick={logout} className="navbar-btn-logout">
                <LogOut size={14} strokeWidth={2.5} className="navbar-btn-logout-icon" />
                <span className="navbar-btn-logout-text">Sign out</span>
              </button>
            </div>
          ) : (
            <div className="navbar-auth-group">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/login" className="navbar-btn-login">Log in</Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link to="/register" className="navbar-btn-signup">Sign up</Link>
              </motion.div>
            </div>
          )}
        </div>
      </motion.nav>
    </div>
  );
}
