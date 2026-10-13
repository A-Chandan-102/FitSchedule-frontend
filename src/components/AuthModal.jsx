import React, { useState } from 'react';
import { authApi } from '../services/api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess }) {
  const [activeTab, setActiveTab] = useState('member-login'); // 'member-login', 'trainer-login', 'register'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('MEMBER');
  const [specialization, setSpecialization] = useState('Strength & Conditioning');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;


  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsSubmitting(true);
      const res = await authApi.login({ email, password });
      onAuthSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Login failed.');
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
        role,
        specialization: role === 'TRAINER' ? specialization : null,
      });
      onAuthSuccess(res);
      onClose();
    } catch (err) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '480px', padding: '2rem', backgroundColor: '#ffffff' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
            {activeTab === 'register' ? 'Create Account' : activeTab === 'trainer-login' ? 'Trainer Portal Login' : 'Member Login'}
          </h2>
          <button
            onClick={onClose}
            style={{ fontSize: '1.5rem', color: '#64748b', cursor: 'pointer', lineHeight: 1 }}
          >
            &times;
          </button>
        </div>

        {/* Tab switchers */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', backgroundColor: '#f1f5f9', padding: '0.3rem', borderRadius: 'var(--radius-md)' }}>
          <button
            type="button"
            onClick={() => { setActiveTab('member-login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'member-login' ? 700 : 500,
              backgroundColor: activeTab === 'member-login' ? '#ffffff' : 'transparent',
              color: activeTab === 'member-login' ? '#16a34a' : '#475569',
              boxShadow: activeTab === 'member-login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            Member Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('trainer-login'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'trainer-login' ? 700 : 500,
              backgroundColor: activeTab === 'trainer-login' ? '#ffffff' : 'transparent',
              color: activeTab === 'trainer-login' ? '#0284c7' : '#475569',
              boxShadow: activeTab === 'trainer-login' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            Trainer Login
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('register'); setError(''); }}
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: activeTab === 'register' ? 700 : 500,
              backgroundColor: activeTab === 'register' ? '#ffffff' : 'transparent',
              color: activeTab === 'register' ? '#7c3aed' : '#475569',
              boxShadow: activeTab === 'register' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              cursor: 'pointer',
            }}
          >
            Sign Up
          </button>
        </div>

        {error && (
          <div className="alert alert-error" style={{ marginBottom: '1.25rem' }}>
            <div>{error}</div>
          </div>
        )}


        {/* Login Forms */}
        {activeTab !== 'register' ? (
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                className="form-control"
                placeholder={activeTab === 'trainer-login' ? 'trainer@example.com' : 'user@example.com'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Signing In...
                </>
              ) : activeTab === 'trainer-login' ? (
                'Sign In to Trainer Portal'
              ) : (
                'Sign In to FitSchedule'
              )}
            </button>
          </form>
        ) : (
          /* Registration Form */
          <form onSubmit={handleRegister}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Alex Morgan"
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
                placeholder="alex.morgan@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Account Role</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('MEMBER')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'MEMBER' ? '1px solid #16a34a' : '1px solid var(--border-light)',
                    backgroundColor: role === 'MEMBER' ? '#dcfce7' : '#ffffff',
                    color: role === 'MEMBER' ? '#15803d' : '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Fitness Member
                </button>
                <button
                  type="button"
                  onClick={() => setRole('TRAINER')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: 'var(--radius-md)',
                    border: role === 'TRAINER' ? '1px solid #0284c7' : '1px solid var(--border-light)',
                    backgroundColor: role === 'TRAINER' ? '#e0f2fe' : '#ffffff',
                    color: role === 'TRAINER' ? '#0369a1' : '#475569',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Certified Trainer
                </button>
              </div>
            </div>

            {role === 'TRAINER' && (
              <div className="form-group">
                <label className="form-label">Trainer Specialization</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Hypertrophy, Mobility, Powerlifting"
                  value={specialization}
                  onChange={(e) => setSpecialization(e.target.value)}
                />
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Password (min 6 chars)</label>
              <input
                type="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', marginTop: '0.5rem', padding: '0.8rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
