import React, { useState, useEffect, useRef } from 'react';
import { authApi } from '../services/api';

export default function SettingsSidebar({ isOpen, onClose, currentUser, onUpdateUser, onLogout }) {
  const [activeSection, setActiveSection] = useState(null); // 'username' | 'email' | null
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const sidebarRef = useRef(null);

  useEffect(() => {
    if (isOpen && currentUser) {
      setNewUsername(currentUser.fullName || '');
      setNewEmail(currentUser.email || '');
      setError('');
      setSuccessMsg('');
      setActiveSection(null);
    }
  }, [isOpen, currentUser]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [isOpen, onClose]);

  if (!isOpen || !currentUser) return null;

  const handleUsernameSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newUsername.trim();
    if (!trimmed || trimmed.length < 2) { setError('Username must be at least 2 characters.'); return; }
    if (trimmed === currentUser.fullName) { setError('Please choose a different username.'); return; }
    try {
      setIsSubmitting(true); setError(''); setSuccessMsg('');
      const updated = await authApi.updateUsername(currentUser.email, trimmed);
      onUpdateUser(updated);
      setSuccessMsg('Username updated successfully!');
      setActiveSection(null);
    } catch (err) {
      setError(err.message || 'Failed to update username.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const trimmed = newEmail.trim().toLowerCase();
    if (!trimmed) { setError('Email cannot be empty.'); return; }
    if (trimmed === currentUser.email.toLowerCase()) { setError('Please enter a different email address.'); return; }
    try {
      setIsSubmitting(true); setError(''); setSuccessMsg('');
      const updated = await authApi.updateEmail(currentUser.email, trimmed);
      onUpdateUser(updated);
      setSuccessMsg('Email updated successfully!');
      setActiveSection(null);
    } catch (err) {
      setError(err.message || 'Failed to update email.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const roleLabel = currentUser.role === 'TRAINER' ? 'Certified Trainer'
    : currentUser.role === 'ADMIN' ? 'Administrator'
    : 'Member';

  const roleBadgeColor = currentUser.role === 'TRAINER' ? { bg: '#e0f2fe', color: '#0369a1' }
    : currentUser.role === 'ADMIN' ? { bg: '#fef3c7', color: '#92400e' }
    : { bg: '#dcfce7', color: '#15803d' };

  return (
    <>
      {/* Overlay */}
      <div style={{
        position: 'fixed', inset: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.35)',
        backdropFilter: 'blur(2px)',
        zIndex: 200,
      }} />

      {/* Sidebar panel */}
      <aside
        ref={sidebarRef}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100%',
          width: '100%',
          maxWidth: '360px',
          backgroundColor: '#ffffff',
          zIndex: 201,
          boxShadow: '-4px 0 24px rgba(0,0,0,0.12)',
          display: 'flex',
          flexDirection: 'column',
          animation: 'slideInRight 0.22s ease',
        }}
      >
        <style>{`
          @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to   { transform: translateX(0);    opacity: 1; }
          }
        `}</style>

        {/* Header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
          flexShrink: 0,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              backgroundColor: '#f1f5f9',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>Account Settings</span>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#94a3b8', padding: '0.25rem', display: 'flex',
          }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem' }}>

          {/* User profile pill */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: '0.85rem',
            backgroundColor: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}>
            <div style={{
              width: '44px', height: '44px', borderRadius: '50%',
              backgroundColor: roleBadgeColor.bg,
              color: roleBadgeColor.color,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', fontWeight: 800, flexShrink: 0,
            }}>
              {currentUser.fullName ? currentUser.fullName.charAt(0).toUpperCase() : 'U'}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.fullName}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser.email}
              </div>
              <div style={{
                display: 'inline-block', marginTop: '0.25rem',
                backgroundColor: roleBadgeColor.bg, color: roleBadgeColor.color,
                fontSize: '0.68rem', fontWeight: 700, padding: '0.1rem 0.45rem',
                borderRadius: '10px', letterSpacing: '0.03em',
              }}>
                {roleLabel}
              </div>
            </div>
          </div>

          {/* Success / Error alerts */}
          {successMsg && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: '#dcfce7', border: '1px solid #bbf7d0',
              borderRadius: '8px', padding: '0.65rem 0.85rem',
              color: '#15803d', fontSize: '0.85rem', marginBottom: '1rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {successMsg}
            </div>
          )}
          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.5rem',
              backgroundColor: '#fee2e2', border: '1px solid #fecaca',
              borderRadius: '8px', padding: '0.65rem 0.85rem',
              color: '#dc2626', fontSize: '0.85rem', marginBottom: '1rem',
            }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {error}
            </div>
          )}

          {/* ── Section: Change Username ── */}
          <div style={{ marginBottom: '0.75rem' }}>
            <button
              onClick={() => { setActiveSection(activeSection === 'username' ? null : 'username'); setError(''); setSuccessMsg(''); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: activeSection === 'username' ? '#f0fdf4' : '#f8fafc',
                border: activeSection === 'username' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>Change Username</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Update your display name</div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: activeSection === 'username' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {activeSection === 'username' && (
              <form onSubmit={handleUsernameSubmit} style={{ padding: '1rem', border: '1px solid #bbf7d0', borderTop: 'none', borderRadius: '0 0 10px 10px', backgroundColor: '#f0fdf4' }}>
                <input
                  type="text"
                  className="form-control"
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  placeholder="e.g. Alex Henderson"
                  maxLength={100}
                  autoFocus
                  style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveSection(null)} disabled={isSubmitting}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? <><span className="spinner" style={{ width: '12px', height: '12px' }}></span> Saving...</> : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* ── Section: Change Email ── */}
          <div style={{ marginBottom: '0.75rem' }}>
            <button
              onClick={() => { setActiveSection(activeSection === 'email' ? null : 'email'); setError(''); setSuccessMsg(''); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '0.85rem 1rem',
                backgroundColor: activeSection === 'email' ? '#eff6ff' : '#f8fafc',
                border: activeSection === 'email' ? '1px solid #bfdbfe' : '1px solid #e2e8f0',
                borderRadius: '10px',
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                  </svg>
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#0f172a' }}>Change Gmail</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Update your login email address</div>
                </div>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                style={{ transform: activeSection === 'email' ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {activeSection === 'email' && (
              <form onSubmit={handleEmailSubmit} style={{ padding: '1rem', border: '1px solid #bfdbfe', borderTop: 'none', borderRadius: '0 0 10px 10px', backgroundColor: '#eff6ff' }}>
                <input
                  type="email"
                  className="form-control"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="new@gmail.com"
                  autoFocus
                  style={{ marginBottom: '0.75rem', fontSize: '0.9rem' }}
                />
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" className="btn btn-secondary btn-sm" onClick={() => setActiveSection(null)} disabled={isSubmitting}>Cancel</button>
                  <button type="submit" className="btn btn-primary btn-sm" disabled={isSubmitting}>
                    {isSubmitting ? <><span className="spinner" style={{ width: '12px', height: '12px' }}></span> Saving...</> : 'Save'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer: Logout */}
        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #e2e8f0', flexShrink: 0 }}>
          <button
            onClick={() => { onClose(); onLogout(); }}
            style={{
              width: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#fff1f2',
              border: '1px solid #fecdd3',
              borderRadius: '10px',
              color: '#dc2626',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: 'pointer',
              transition: 'background 0.15s',
            }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
