import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, CloudSun, CheckCircle2, Circle, ArrowRight, Sparkles, Map, BellRing, Activity } from 'lucide-react';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';
import './RegisterPage.css';

/* ── Floating orb background ─────────────────────── */
function FloatingOrbs() {
  return (
    <div className="login-orbs-container">
      <div className="login-orb login-orb-1" style={{ animationDelay: '-8s', background: 'var(--brand-pink)' }} />
      <div className="login-orb login-orb-2" style={{ animationDelay: '-3s', background: 'var(--brand-purple)' }} />
      <div className="login-orb login-orb-3" style={{ animationDelay: '-14s', background: 'var(--brand-primary)' }} />
      <div className="login-orb login-orb-4" style={{ animationDelay: '-2s', background: 'var(--brand-cyan)' }} />
    </div>
  );
}

/* ── Password Strength Logic ─────────────────────── */
function strengthScore(pw) {
  let s = 0;
  if (pw.length >= 8)          s++;
  if (/[A-Z]/.test(pw))        s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s; // 0-4
}

const STRENGTH = [
  { label: 'Weak',      color: '#f87171' },
  { label: 'Weak',      color: '#f87171' },
  { label: 'Fair',      color: '#fbbf24' },
  { label: 'Good',      color: '#60a5fa' },
  { label: 'Strong',    color: '#4ade80' },
];

const RULES = [
  { test: pw => pw.length >= 8,   text: 'At least 8 characters' },
  { test: pw => /[A-Z]/.test(pw), text: 'One uppercase letter'  },
  { test: pw => /[0-9]/.test(pw), text: 'One number'            },
];

/* ── Form Input Component ────────────────────────── */
function InputField({ type, id, name, placeholder, label, value, onChange, icon: Icon, showToggle, onToggle, showPass, delay = 0, onFocusExtra }) {
  const [focused, setFocused] = useState(false);
  const filled = value.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="register-field-group"
    >
      <label htmlFor={id} className="register-label">{label}</label>
      <div className={`register-input-wrapper ${focused ? 'register-input-focused' : ''} ${filled ? 'register-input-filled' : ''}`}>
        <span className="register-input-icon">
          <Icon size={18} />
        </span>
        <input
          type={showToggle ? (showPass ? 'text' : 'password') : type}
          id={id} name={name} placeholder={placeholder}
          value={value} onChange={onChange} required
          onFocus={() => { setFocused(true); onFocusExtra?.(); }}
          onBlur={() => setFocused(false)}
          className="register-input"
          autoComplete={type === 'password' ? 'new-password' : 'email'}
        />
        {showToggle && (
          <button type="button" onClick={onToggle} className="register-toggle-btn" tabIndex={-1}>
            {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [touched, setTouched] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const score = strengthScore(form.password);
  const strength = STRENGTH[score];

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/register', form);
      setSuccess('Account created! Redirecting…');
      if (res.data.user) login(res.data.user);
      setTimeout(() => navigate('/'), 1200);
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally { setLoading(false); }
  };

  return (
    <div className="register-page">
      <FloatingOrbs />

      {/* ── Left: Interactive Form Panel ─────────── */}
      <motion.div
        className="register-form-panel"
        initial={{ opacity: 0, x: -40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="register-form-container">
          
          <motion.div
            className="register-weather-icon"
            initial={{ rotate: 10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <div className="register-icon-ring">
              <div className="register-icon-ring-inner">
                <CloudSun size={32} strokeWidth={1.8} />
              </div>
            </div>
            <motion.div
              className="register-icon-sparkle"
              animate={{ rotate: 360, scale: [1, 1.2, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <Sparkles size={14} />
            </motion.div>
          </motion.div>

          <motion.div
            className="register-header"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <h1 className="register-title">Create account</h1>
            <p className="register-subtitle">Join SkyCast — it's free forever</p>
          </motion.div>

          {/* Alerts */}
          <AnimatePresence>
            {error && (
              <motion.div
                className="register-alert register-alert-error"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
              >
                <span className="register-alert-icon error-icon">!</span>
                {error}
              </motion.div>
            )}
            {success && (
              <motion.div
                className="register-alert register-alert-success"
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: 'auto' }}
                exit={{ opacity: 0, y: -10, height: 0 }}
              >
                <span className="register-alert-icon success-icon">✓</span>
                {success}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form */}
          <form onSubmit={onSubmit} className="register-form">
            <InputField
              type="email" id="reg-email" name="email" label="Email address"
              placeholder="you@example.com"
              value={form.email} onChange={onChange} icon={Mail} delay={0.3}
            />
            
            <div className="relative">
              <InputField
                type="password" id="reg-password" name="password" label="Password"
                placeholder="Choose a strong password"
                value={form.password} onChange={onChange} icon={Lock} delay={0.4}
                showToggle onToggle={() => setShowPass(p => !p)} showPass={showPass}
                onFocusExtra={() => setTouched(true)}
              />

              {/* Password Strength Meter */}
              <AnimatePresence>
                {touched && (
                  <motion.div
                    className="register-strength-meter"
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  >
                    <div className="register-strength-header">
                      <span>Password strength</span>
                      <motion.span
                        key={strength.label}
                        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
                        style={{ color: strength.color }}
                      >
                        {form.password.length === 0 ? 'None' : strength.label}
                      </motion.span>
                    </div>

                    <div className="register-strength-bars">
                      {[1, 2, 3, 4].map((level) => (
                        <div
                          key={level}
                          className="register-strength-bar"
                          style={{
                            background: level <= score && form.password.length > 0 
                              ? strength.color 
                              : 'rgba(255, 255, 255, 0.1)'
                          }}
                        />
                      ))}
                    </div>

                    <div className="register-rules-list">
                      {RULES.map(rule => {
                        const passed = rule.test(form.password);
                        return (
                          <div key={rule.text} className="register-rule" style={{ color: passed ? '#4ade80' : 'var(--text-muted)' }}>
                            {passed ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                            {rule.text}
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className={`register-submit-btn ${loading ? 'register-submit-loading' : ''}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.4 }}
              whileHover={{ scale: 1.015, boxShadow: '0 0 30px rgba(167,139,250,0.35)' }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="register-btn-text">
                {loading ? 'Creating account…' : 'Create Account'}
              </span>
              {!loading && <ArrowRight size={18} className="register-btn-arrow" />}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div className="register-divider" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <span className="register-divider-line" />
          </motion.div>

          <motion.p className="register-footer" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
            Already have an account?{' '}
            <Link to="/login" className="register-login-link">
              Sign in Instead
              <span className="register-link-underline" />
            </Link>
          </motion.p>
        </div>
      </motion.div>

      {/* ── Right: Feature/Branding Panel ──────────── */}
      <motion.div
        className="register-brand-panel"
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="register-brand-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.5 }}>
            <h2 className="register-brand-title">
              Join <span className="register-brand-gradient">SkyCast</span>
            </h2>
            <p className="register-brand-tagline">
              Unlock the full potential of personalized weather tracking. Set alerts, save locations, and tailor the dashboard entirely to your habits.
            </p>
          </motion.div>

          <motion.div className="register-brand-features" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }}>
            <div className="register-feature-card">
              <div className="register-feature-icon"><Map size={20} /></div>
              <div className="register-feature-title">Saved Locations</div>
              <div className="register-feature-desc">Track conditions instantly across the globe.</div>
            </div>
            <div className="register-feature-card">
              <div className="register-feature-icon" style={{ color: 'var(--brand-pink)' }}><BellRing size={20} /></div>
              <div className="register-feature-title">Custom Alerts</div>
              <div className="register-feature-desc">Never get caught in the rain unawares.</div>
            </div>
            <div className="register-feature-card" style={{ gridColumn: 'span 2' }}>
              <div className="register-feature-icon" style={{ color: 'var(--brand-cyan)' }}><Activity size={20} /></div>
              <div className="register-feature-title">Air Quality & UV Index</div>
              <div className="register-feature-desc">Deep-dive into health-impacting metrics and interactive forecast charts.</div>
            </div>
          </motion.div>
        </div>
        <div className="register-brand-mesh" />
      </motion.div>

    </div>
  );
}
