import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import SettingsSidebar from './SettingsSidebar';

export default function Navbar({
  activeTab,
  setActiveTab,
  planCount,
  currentUser,
  onLogout,
  onUpdateUser,
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const tabToPath = {
    home: '/',
    planner: '/planner',
    'my-workouts': '/my-workouts',
    schedule: '/schedule',
    exercises: '/exercises',
    contact: '/contact',
    'trainer-portal': '/trainer-portal',
    'admin-portal': '/admin-portal',
    login: '/login',
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'planner', label: 'Workout Planner' },
    { id: 'my-workouts', label: 'My Workouts', count: planCount },
    { id: 'schedule', label: 'Weekly Schedule' },
    { id: 'exercises', label: 'Exercise Database' },
    { id: 'contact', label: 'Contact a Trainer' },
  ];

  // Add role-specific nav items
  if (currentUser && currentUser.role === 'TRAINER') {
    navItems.push({ id: 'trainer-portal', label: 'Trainer Portal', highlight: true });
  }
  if (currentUser && currentUser.role === 'ADMIN') {
    navItems.push({ id: 'admin-portal', label: 'Admin Portal', highlight: true, adminHighlight: true });
  }

  const handleNavClick = (tabId) => {
    if (setActiveTab) setActiveTab(tabId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    const targetPath = tabToPath[tabId] || '/';
    navigate(targetPath);
  };

  const isCurrentActive = (itemId) => {
    if (activeTab === itemId) return true;
    const targetPath = tabToPath[itemId];
    if (targetPath && location.pathname === targetPath) return true;
    return false;
  };

  const roleLabel = currentUser
    ? currentUser.role === 'TRAINER' ? 'Certified Trainer'
    : currentUser.role === 'ADMIN' ? 'Administrator'
    : 'Member'
    : '';

  const roleBadgeClass = currentUser
    ? currentUser.role === 'TRAINER' ? 'badge-cyan'
    : currentUser.role === 'ADMIN' ? 'badge-amber'
    : 'badge-lime'
    : '';

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: '#ffffff',
      borderBottom: '1px solid var(--border-light)',
      padding: '0.85rem 0',
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
      width: '100%',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '1680px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
      }}>
        {/* Brand */}
        <div
          onClick={() => handleNavClick('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            cursor: 'pointer',
            userSelect: 'none',
            flexShrink: 0,
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '10px',
            backgroundColor: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
            </svg>
          </div>
          <span style={{ fontSize: '1.35rem', fontWeight: 800, letterSpacing: '-0.03em', color: '#0f172a' }}>
            Fit<span style={{ color: '#16a34a' }}>Schedule</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav style={{ display: 'none', gap: '0.35rem', alignItems: 'center' }} className="desktop-nav">
          {navItems.map((item) => {
            const isActive = isCurrentActive(item.id);
            const isHighlight = item.highlight;
            const isAdmin = item.adminHighlight;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  padding: '0.5rem 0.85rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive
                    ? isAdmin ? '#92400e' : isHighlight ? '#0369a1' : '#15803d'
                    : isAdmin ? '#b45309' : isHighlight ? '#0284c7' : '#475569',
                  backgroundColor: isActive
                    ? isAdmin ? '#fef3c7' : isHighlight ? '#e0f2fe' : '#dcfce7'
                    : 'transparent',
                  border: isActive
                    ? `1px solid ${isAdmin ? '#fcd34d' : isHighlight ? '#bae6fd' : '#bbf7d0'}`
                    : '1px solid transparent',
                  transition: 'all var(--transition-fast)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                {item.label}
                {item.count !== undefined && item.count > 0 && (
                  <span style={{
                    fontSize: '0.72rem',
                    padding: '0.1rem 0.45rem',
                    borderRadius: '10px',
                    backgroundColor: isActive ? '#16a34a' : '#e2e8f0',
                    color: isActive ? '#ffffff' : '#0f172a',
                    fontWeight: 700,
                  }}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User Auth Info / Login CTA */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.75rem' }} className="desktop-auth">
          {currentUser ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {/* User info */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                  {currentUser.fullName}
                </div>
                <span className={`badge ${roleBadgeClass}`} style={{ fontSize: '0.65rem' }}>
                  {roleLabel}
                </span>
              </div>

              {/* ⚙️ Settings button */}
              <button
                id="settings-btn"
                onClick={() => setIsSettingsOpen(true)}
                title="Account Settings"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #e2e8f0',
                  cursor: 'pointer',
                  color: '#475569',
                  transition: 'all 0.15s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#e2e8f0'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#f1f5f9'; }}
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
              </button>
            </div>
          ) : (
            <button
              className={`btn ${location.pathname === '/login' ? 'btn-secondary' : 'btn-primary'} btn-sm`}
              onClick={() => handleNavClick('login')}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              Login / Sign Up
            </button>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="mobile-hamburger-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0.5rem',
            color: '#0f172a',
            backgroundColor: '#f1f5f9',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-light)',
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {mobileMenuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid var(--border-light)',
          padding: '1rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.5rem',
        }}>
          {navItems.map((item) => {
            const isActive = isCurrentActive(item.id);
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                style={{
                  textAlign: 'left',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  color: isActive ? '#15803d' : '#0f172a',
                  backgroundColor: isActive ? '#dcfce7' : 'transparent',
                  fontWeight: isActive ? 700 : 500,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>{item.label}</span>
                {item.count !== undefined && item.count > 0 && (
                  <span className="badge badge-lime">{item.count}</span>
                )}
              </button>
            );
          })}

          <div style={{ borderTop: '1px solid var(--border-light)', paddingTop: '0.75rem', marginTop: '0.5rem' }}>
            {currentUser ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700 }}>{currentUser.fullName}</div>
                    <span className={`badge ${roleBadgeClass}`}>{roleLabel}</span>
                  </div>
                </div>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => { setMobileMenuOpen(false); setIsSettingsOpen(true); }}
                  style={{ width: '100%', fontSize: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                  </svg>
                  Account Settings
                </button>
              </div>
            ) : (
              <button
                className="btn btn-primary"
                onClick={() => handleNavClick('login')}
                style={{ width: '100%' }}
              >
                Login / Sign Up
              </button>
            )}
          </div>
        </div>
      )}

      {/* Settings Sidebar */}
      <SettingsSidebar
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentUser={currentUser}
        onUpdateUser={(updated) => {
          if (onUpdateUser) onUpdateUser(updated);
        }}
        onLogout={onLogout}
      />

      <style>{`
        @media (min-width: 960px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-hamburger-btn { display: none !important; }
        }
        .badge-amber {
          background-color: #fef3c7;
          color: #92400e;
          border: 1px solid #fcd34d;
          display: inline-flex;
          align-items: center;
          padding: 0.15rem 0.55rem;
          border-radius: 20px;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.03em;
        }
      `}</style>
    </header>
  );
}
