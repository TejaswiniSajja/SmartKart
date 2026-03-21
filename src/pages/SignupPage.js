import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import api from '../services/api';
import toast from 'react-hot-toast';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const { login, loading, setLoading } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email format';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (password !== confirm) errs.confirm = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const res = await api.signup(name, email, password);
      login(res.data);
      toast.success('Account created successfully!', {
        style: { background: '#1a2236', color: '#f1f5f9', border: '1px solid rgba(56,130,246,0.2)' },
        iconTheme: { primary: '#22c55e', secondary: '#f1f5f9' },
      });
      navigate('/');
    } catch (err) {
      toast.error('Signup failed. Please try again.', {
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
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent-violet/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent-blue/8 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-violet to-accent-blue flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-1">Create Account</h1>
              <p className="text-sm text-slate-500">Join SmartKart for secure shopping</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); if (errors.name) setErrors(p => ({...p, name: null})); }}
                  placeholder="John Doe"
                  className={inputClass('name')}
                />
                {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
              </div>
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
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">Confirm Password</label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => { setConfirm(e.target.value); if (errors.confirm) setErrors(p => ({...p, confirm: null})); }}
                  placeholder="Re-enter password"
                  className={inputClass('confirm')}
                />
                {errors.confirm && <p className="text-xs text-red-400 mt-1">{errors.confirm}</p>}
              </div>

              <Button type="submit" className="w-full" size="lg" loading={loading}>
                Create Account
              </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
              Already have an account?{' '}
              <Link to="/login" className="text-accent-blue hover:underline font-medium">Sign In</Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
