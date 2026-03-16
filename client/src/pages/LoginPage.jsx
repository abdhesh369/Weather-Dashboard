import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Cloud } from 'lucide-react';
import api from '../lib/api';
import { AuthContext } from '../context/AuthContext';

function InputField({ type, id, name, placeholder, value, onChange, icon: Icon, showToggle, onToggle, showPass }) {
  return (
    <div className="relative">
      <Icon size={16} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'rgba(255,255,255,0.35)' }} />
      <input
        type={showToggle ? (showPass ? 'text' : 'password') : type}
        id={id} name={name} placeholder={placeholder} value={value} onChange={onChange} required
        className="w-full py-4 pl-12 pr-4 rounded-[18px] text-[15px] text-white outline-none transition-all duration-300 glass border-white/5 focus:border-brand-primary/50 focus:bg-white/10"
        onFocus={e => { e.target.style.boxShadow = '0 0 0 4px rgba(99,102,241,0.15)'; }}
        onBlur={e => { e.target.style.boxShadow = 'none'; }}
      />
      {showToggle && (
        <button type="button" onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 border-none bg-transparent cursor-pointer p-0"
          style={{ color: 'rgba(255,255,255,0.35)' }}>
          {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      )}
    </div>
  );
}

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    setError(''); setLoading(true);
    try {
      const res = await api.post('/api/auth/login', form);
      if (res.data.user) { login(res.data.user); navigate('/'); }
    } catch (err) {
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-[calc(100vh-60px)] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[420px]"
      >
        {/* Card */}
        <div className="glass p-10 rounded-[32px] relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-primary/20 blur-[80px] rounded-full" />

          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-[18px] flex items-center justify-center mx-auto mb-4"
              style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}>
              <Cloud size={26} color="#fff" />
            </div>
            <h1 className="text-[28px] font-bold text-white tracking-tight mb-1">Welcome back</h1>
            <p className="text-[14px]" style={{ color: 'rgba(255,255,255,0.45)' }}>Sign in to SkyCast</p>
          </div>

          {/* Error */}
          {error && (
            <div className="px-4 py-3 rounded-[12px] mb-5 text-[13px] text-center"
              style={{ background: 'rgba(239,68,68,0.10)', border: '1px solid rgba(239,68,68,0.20)', color: '#f87171' }}>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={onSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-semibold mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Email address
              </label>
              <InputField type="email" id="email" name="email" placeholder="you@example.com"
                value={form.email} onChange={onChange} icon={Mail} />
            </div>

            <div>
              <label className="block text-[12px] font-semibold mb-2 ml-1" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Password
              </label>
              <InputField type="password" id="password" name="password" placeholder="••••••••"
                value={form.password} onChange={onChange} icon={Lock}
                showToggle onToggle={() => setShowPass(p => !p)} showPass={showPass} />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 rounded-[14px] text-[15px] font-semibold text-white mt-2 cursor-pointer border-none transition-all"
              style={{ background: loading ? 'rgba(99,102,241,0.5)' : 'var(--brand-primary)', opacity: loading ? 0.7 : 1 }}
            >
              {loading ? 'Signing in…' : 'Continue'}
            </motion.button>
          </form>

          {/* Footer */}
          <p className="text-center text-[13px] mt-6" style={{ color: 'rgba(255,255,255,0.38)' }}>
            No account?{' '}
            <Link to="/register" className="font-semibold" style={{ color: 'var(--brand-primary)', textDecoration: 'none' }}>
              Sign up free
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
