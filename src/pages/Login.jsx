import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function Login({ currentUser, onAuthSuccess, onLogout, setActiveTab }) {
  const navigate = useNavigate();
  const [mode, setMode] = useState('member-login'); // 'member-login', 'trainer-login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      const res = await authApi.login({ email, password });
      onAuthSuccess(res);
      if (res.role === 'TRAINER') {
        if (setActiveTab) setActiveTab('trainer-portal');
        navigate('/trainer-portal');
      } else if (res.role === 'ADMIN') {
        if (setActiveTab) setActiveTab('admin-portal');
        navigate('/admin-portal');
      } else {
        if (setActiveTab) setActiveTab('my-workouts');
        navigate('/my-workouts');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      const res = await authApi.register({
        fullName,
        email,
        password,
        role: 'MEMBER',
      });
      onAuthSuccess(res);
      if (setActiveTab) setActiveTab('planner');
      navigate('/planner');
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If user is already authenticated
  if (currentUser) {
    return (
      <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem', maxWidth: '560px' }}>
        <div className="card" style={{ textAlign: 'center', padding: '2.5rem 2rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: currentUser.role === 'TRAINER' ? '#e0f2fe' : currentUser.role === 'ADMIN' ? '#fef3c7' : '#dcfce7',
            color: currentUser.role === 'TRAINER' ? '#0369a1' : currentUser.role === 'ADMIN' ? '#92400e' : '#15803d',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem auto',
            fontSize: '1.5rem',
            fontWeight: 800,
          }}>
            {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
          </div>

          <span className={`badge ${currentUser.role === 'TRAINER' ? 'badge-cyan' : currentUser.role === 'ADMIN' ? 'badge-amber' : 'badge-lime'}`} style={{ marginBottom: '0.65rem' }}>
            {currentUser.role === 'TRAINER' ? 'Coach Account' : currentUser.role === 'ADMIN' ? 'Administrator' : 'Member Account'}
          </span>

          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
            {currentUser.fullName}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
            {currentUser.email}
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {currentUser.role === 'TRAINER' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (setActiveTab) setActiveTab('trainer-portal');
                  navigate('/trainer-portal');
                }}
              >
                Go to Trainer Portal
              </button>
            ) : currentUser.role === 'ADMIN' ? (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (setActiveTab) setActiveTab('admin-portal');
                  navigate('/admin-portal');
                }}
              >
                Go to Admin Portal
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => {
                  if (setActiveTab) setActiveTab('my-workouts');
                  navigate('/my-workouts');
                }}
              >
                View My Workouts
              </button>
            )}

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                if (setActiveTab) setActiveTab('planner');
                navigate('/planner');
              }}
            >
              Generate New Workout
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={onLogout}
              style={{ color: '#ef4444', borderColor: '#fecaca', marginTop: '0.5rem' }}
            >
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem', maxWidth: '520px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <span className="badge badge-lime" style={{ marginBottom: '0.6rem' }}>Account Access</span>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          {mode === 'register' ? 'Join FitSchedule' : mode === 'trainer-login' ? 'Coach & Trainer Login' : 'Member Sign In'}
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 auto' }}>
          {mode === 'register'
            ? 'Create your free member account to generate personalized routines and track workout plans.'
            : mode === 'trainer-login'
            ? 'Sign in to access your coaching inquiries and client messages.'
            : 'Access your private customized workout routines and weekly schedule.'}
        </p>
      </div>

      <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-md)', backgroundColor: '#ffffff' }}>
        {/* Tab switchers */}
        <div style={{
          display: 'flex',
          gap: '0.35rem',
          marginBottom: '1.75rem',
          backgroundColor: '#f1f5f9',
          padding: '0.35rem',
          borderRadius: 'var(--radius-md)'
        }}>
          <button
            type="button"
            onClick={() => { setMode('member-login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: mode === 'member-login' ? 700 : 500,
              backgroundColor: mode === 'member-login' ? '#ffffff' : 'transparent',
              color: mode === 'member-login' ? '#16a34a' : '#475569',
              boxShadow: mode === 'member-login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Member
          </button>
          <button
            type="button"
            onClick={() => { setMode('trainer-login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: mode === 'trainer-login' ? 700 : 500,
              backgroundColor: mode === 'trainer-login' ? '#ffffff' : 'transparent',
              color: mode === 'trainer-login' ? '#0284c7' : '#475569',
              boxShadow: mode === 'trainer-login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Trainer
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.6rem 0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: mode === 'register' ? 700 : 500,
              backgroundColor: mode === 'register' ? '#ffffff' : 'transparent',
              color: mode === 'register' ? '#7c3aed' : '#475569',
              boxShadow: mode === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <div>{error}</div>
          </div>
        )}

        {/* Login Form (Member or Trainer) */}
        {mode !== 'register' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder={mode === 'trainer-login' ? 'trainer@example.com' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label">Password</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ fontSize: '0.78rem', color: '#64748b', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : mode === 'trainer-login' ? (
                'Sign In to Trainer Portal'
              ) : (
                'Sign In to FitSchedule'
              )}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('register'); setError(''); }}
                style={{ color: '#16a34a', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Create member account
              </button>
            </div>
          </form>
        ) : (
          /* Registration Form – Members only */
          <form onSubmit={handleRegister}>
            {/* Info banner */}
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.5rem',
              backgroundColor: '#fffbeb',
              border: '1px solid #fcd34d',
              borderRadius: 'var(--radius-md)',
              padding: '0.65rem 0.85rem',
              marginBottom: '1.5rem',
              fontSize: '0.82rem',
              color: '#92400e',
            }}>
              <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '1px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <span>Trainer accounts are added to the database by an administrator. Only <strong>Member</strong> accounts can be created here.</span>
            </div>

            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Jordan Miller"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder="jordan.miller@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password (min 6 characters)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.75rem', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Member Account'
              )}
            </button>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('member-login'); setError(''); }}
                style={{ color: '#16a34a', fontWeight: 600, cursor: 'pointer', background: 'none', border: 'none' }}
              >
                Sign in here
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
