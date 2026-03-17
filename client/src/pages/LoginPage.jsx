import { useState, useContext, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CloudSun, ArrowRight, Sparkles } from 'lucide-react';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import './LoginPage.css';

/* ── Floating orb background ─────────────────────── */
function FloatingOrbs() {
  return (
    <div className="login-orbs-container">
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <div className="login-orb login-orb-3" />
      <div className="login-orb login-orb-4" />
    </div>
  );
}

/* ── Animated weather icon ───────────────────────── */
function WeatherIcon() {
  return (
    <motion.div
      className="login-weather-icon"
      initial={{ rotate: -10, scale: 0.8 }}
      animate={{ rotate: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
    >
      <div className="login-icon-ring">
        <div className="login-icon-ring-inner">
          <CloudSun size={32} strokeWidth={1.8} />
        </div>
      </div>
      <motion.div
        className="login-icon-sparkle"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
      >
        <Sparkles size={14} />
      </motion.div>
    </motion.div>
  );
}

/* ── Styled input ────────────────────────────────── */
function InputField({ type, id, name, placeholder, label, value, onChange, icon: Icon, showToggle, onToggle, showPass, delay = 0 }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="login-field-group"
    >
      <label htmlFor={id} className="login-label">{label}</label>
      <div className={`login-input-wrapper ${focused ? 'login-input-focused' : ''} ${filled ? 'login-input-filled' : ''}`}>
        <span className="login-input-icon">
          <Icon size={18} />
        </span>
        <input
          type={showToggle ? (showPass ? 'text' : 'password') : type}
          id={id} name={name} placeholder={placeholder}
          value={value} onChange={onChange} required
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="login-input"
          autoComplete={type === 'password' ? 'current-password' : 'email'}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="login-toggle-btn" tabIndex={-1}>
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
        <div className="login-input-glow" />
      </div>
    </motion.div>
  );
}

/* ── Main LoginPage ──────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const { isAuthenticated: loggedIn } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  useEffect(() => {
    if (loggedIn) navigate('/');
  }, [loggedIn, navigate]);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    console.log('[Login] Attempting submission...', form.email);
    setError(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      console.log('[Login] Success');
      if (res.data.user) { login(res.data.user); navigate('/'); }
    } catch (err) {
      console.error('[Login] Error:', err.response?.data?.message || err.message);
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally { setLoading(false); }
  };

  return (
    <div className="login-page">
      <FloatingOrbs />

      {/* ── Left: Branding panel ──────────────── */}
      <motion.div
        className="login-brand-panel"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="login-brand-content">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <h2 className="login-brand-title">
              <span className="login-brand-gradient">SkyCast</span>
            </h2>
            <p className="login-brand-tagline">
              Premium weather intelligence at your fingertips. Real-time forecasts, beautiful visualizations, and actionable insights.
            </p>
          </motion.div>

          <motion.div
            className="login-brand-features"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {['Live radar & alerts', '7-day detailed forecast', 'Air quality index'].map((feature, i) => (
              <div key={i} className="login-feature-item">
                <div className="login-feature-dot" />
                <span>{feature}</span>
              </div>
            ))}
          </motion.div>
        </div>
        <div className="login-brand-mesh" />
      </motion.div>

      {/* ── Right: Login form ─────────────────── */}
      <motion.div
        className="login-form-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="login-form-container">
          <WeatherIcon />

          <motion.div
            className="login-header"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="login-title">Welcome back</h1>
            <p className="login-subtitle">Sign in to continue to your dashboard</p>
          </motion.div>

          {/* Error */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="login-error"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <span className="login-error-icon">!</span>
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={onSubmit} className="login-form">
            <InputField
              type="email" id="login-email" name="email" label="Email address"
              placeholder="you@example.com"
              value={form.email} onChange={onChange} icon={Mail} delay={0.3}
            />
            <InputField
              type="password" id="login-password" name="password" label="Password"
              placeholder="Enter your password"
              value={form.password} onChange={onChange} icon={Lock}
              showToggle onToggle={() => setShowPass(p => !p)} showPass={showPass} delay={0.4}
            />

            <motion.button
              type="submit"
              disabled={loading}
              className={`login-submit-btn ${loading ? 'login-submit-loading' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.015, boxShadow: '0 0 30px rgba(129,140,248,0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="login-btn-text">
                {loading ? 'Signing in…' : 'Continue'}
              </span>
              {!loading && <ArrowRight size={18} className="login-btn-arrow" />}
              {loading && <span className="login-spinner" />}
              <div className="login-btn-shine" />
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            className="login-divider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <span className="login-divider-line" />
          </motion.div>

          {/* Footer */}
          <motion.p
            className="login-footer"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            Don't have an account?{' '}
            <Link to="/register" className="login-signup-link">
              Create one free
              <span className="login-link-underline" />
            </Link>
          </motion.p>
        </div>
      </motion.div>
    </div>
  );
}
