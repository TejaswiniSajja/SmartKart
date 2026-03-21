import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, loading, setLoading, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const validate = () => {
    const errs = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.login(email, password);
      login(res.data);
      toast.success('Welcome back!', {
        style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(56,130,246,0.2)' },
        iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' },
      });
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid credentials');
      toast.error('Login failed. Check your credentials.', {
        style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(239,68,68,0.2)' },
      });
    }
  };

  const inputClass = (field) =>
    `w-full bg-dark-800 border ${errors[field] ? 'border-red-500/50' : 'border-blue-500/15'} rounded-xl px-4 py-3 text-sm text-slate-200 placeholder-slate-500 transition-all`;

  return (
    <div className="min-h-screen pt-24 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-dark-700 rounded-2xl border border-blue-500/15 p-8 shadow-card relative overflow-hidden">
          {/* Decorative glow */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-blue/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-violet/8 rounded-full blur-3xl" />

          <div className="relative z-10">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-blue to-accent-cyan flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-1">Welcome Back</h1>
              <p className="text-sm text-slate-500">Sign in to your SmartKart account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors(p => ({...p, email: null})); }}
                  placeholder="you@example.com"
                  className={inputClass('email')}
                />
                {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors(p => ({...p, password: null})); }}
                  placeholder="Min. 6 characters"
                  className={inputClass('password')}
                />
                {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Sign In
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent-blue hover:underline font-medium">Create one</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
