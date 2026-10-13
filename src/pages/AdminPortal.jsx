import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../services/api';

export default function AdminPortal({ currentUser }) {
  const navigate = useNavigate();
  const [trainers, setTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [removing, setRemoving] = useState(null);
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [form, setForm] = useState({
    name: '',
    email: '',
    specialization: '',
    experienceYears: '',
    bio: '',
    password: '',
    avatarUrl: '',
  });

  // Guard: only ADMIN can view this page
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    if (currentUser.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchTrainers();
  }, [currentUser]);

  const fetchTrainers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await authApi.getAdminTrainers(currentUser.email);
      setTrainers(data || []);
    } catch (err) {
      setError(err.message || 'Failed to load trainers.');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (trainer) => {
    if (!window.confirm(`Remove trainer "${trainer.name}"? Their user account will also be deleted.`)) return;
    try {
      setRemoving(trainer.id);
      await authApi.removeTrainer(currentUser.email, trainer.id);
      setTrainers((prev) => prev.filter((t) => t.id !== trainer.id));
    } catch (err) {
      setError(err.message || 'Failed to remove trainer.');
    } finally {
      setRemoving(null);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setAddError('');
    setAddSuccess('');
    try {
      setIsAdding(true);
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        specialization: form.specialization.trim(),
        experienceYears: form.experienceYears ? parseInt(form.experienceYears, 10) : 1,
        bio: form.bio.trim() || undefined,
        password: form.password,
        avatarUrl: form.avatarUrl.trim() || undefined,
      };
      const newTrainer = await authApi.addTrainer(currentUser.email, payload);
      setTrainers((prev) => [...prev, newTrainer]);
      setAddSuccess(`Trainer "${newTrainer.name}" added successfully!`);
      setForm({ name: '', email: '', specialization: '', experienceYears: '', bio: '', password: '', avatarUrl: '' });
      setShowAddForm(false);
    } catch (err) {
      setAddError(err.message || 'Failed to add trainer.');
    } finally {
      setIsAdding(false);
    }
  };

  const fieldStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    marginBottom: '1rem',
  };

  if (!currentUser || currentUser.role !== 'ADMIN') return null;

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem', maxWidth: '920px' }}>

      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <div style={{
            width: '42px', height: '42px', borderRadius: '10px',
            backgroundColor: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#92400e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Admin Portal</h1>
            <p style={{ color: '#64748b', margin: 0, fontSize: '0.88rem' }}>Manage certified trainers · {currentUser.email}</p>
          </div>
        </div>
      </div>

      {/* Global messages */}
      {addSuccess && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: '#dcfce7', border: '1px solid #bbf7d0',
          borderRadius: '10px', padding: '0.75rem 1rem',
          color: '#15803d', fontSize: '0.88rem', marginBottom: '1.25rem',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
          {addSuccess}
        </div>
      )}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          backgroundColor: '#fee2e2', border: '1px solid #fecaca',
          borderRadius: '10px', padding: '0.75rem 1rem',
          color: '#dc2626', fontSize: '0.88rem', marginBottom: '1.25rem',
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
          {error}
        </div>
      )}

      {/* Trainer List */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid #e2e8f0',
        }}>
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', margin: 0 }}>Certified Trainers</h2>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: 0 }}>{trainers.length} trainer{trainers.length !== 1 ? 's' : ''} registered</p>
          </div>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => { setShowAddForm(!showAddForm); setAddError(''); setAddSuccess(''); }}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Trainer
          </button>
        </div>

        {/* Add Trainer Form */}
        {showAddForm && (
          <div style={{ padding: '1.5rem', borderBottom: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a', marginBottom: '1.25rem', marginTop: 0 }}>
              Add New Trainer
            </h3>

            {addError && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                backgroundColor: '#fee2e2', border: '1px solid #fecaca',
                borderRadius: '8px', padding: '0.65rem 0.85rem',
                color: '#dc2626', fontSize: '0.83rem', marginBottom: '1rem',
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
                {addError}
              </div>
            )}

            <form onSubmit={handleAdd}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <div style={fieldStyle}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Full Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="form-control" type="text" placeholder="e.g. Jordan Miles" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required maxLength={100} />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Email Address <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="form-control" type="email" placeholder="jordan@fitschedule.com" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })} required />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Expertise / Specialization <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="form-control" type="text" placeholder="e.g. Strength & Conditioning" value={form.specialization}
                    onChange={(e) => setForm({ ...form, specialization: e.target.value })} required maxLength={120} />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Years of Experience</label>
                  <input className="form-control" type="number" placeholder="e.g. 5" value={form.experienceYears}
                    onChange={(e) => setForm({ ...form, experienceYears: e.target.value })} min={0} max={50} />
                </div>
                <div style={{ ...fieldStyle, gridColumn: '1 / -1' }}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Bio / Description</label>
                  <textarea className="form-control" rows={2} placeholder="Brief professional bio..."
                    value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                    style={{ resize: 'vertical', minHeight: '60px' }} />
                </div>
                <div style={fieldStyle}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Login Password <span style={{ color: '#ef4444' }}>*</span></label>
                  <input className="form-control" type="text" placeholder="Placeholder password (min 6 chars)" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })} required minLength={6} />
                  <span style={{ fontSize: '0.72rem', color: '#64748b' }}>This will be the trainer's login password.</span>
                </div>
                <div style={fieldStyle}>
                  <label className="form-label" style={{ fontSize: '0.82rem' }}>Avatar URL (optional)</label>
                  <input className="form-control" type="url" placeholder="https://images.unsplash.com/..." value={form.avatarUrl}
                    onChange={(e) => setForm({ ...form, avatarUrl: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                <button type="button" className="btn btn-secondary btn-sm"
                  onClick={() => { setShowAddForm(false); setAddError(''); }} disabled={isAdding}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary btn-sm" disabled={isAdding}>
                  {isAdding
                    ? <><span className="spinner" style={{ width: '13px', height: '13px' }}></span> Adding...</>
                    : 'Add Trainer'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Trainer table */}
        {loading ? (
          <div style={{ padding: '2.5rem', textAlign: 'center', color: '#64748b' }}>
            <span className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px', display: 'inline-block' }}></span>
            <p style={{ marginTop: '0.75rem' }}>Loading trainers...</p>
          </div>
        ) : trainers.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#94a3b8' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '0.75rem', opacity: 0.5 }}>
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <p style={{ fontWeight: 600 }}>No trainers yet</p>
            <p style={{ fontSize: '0.85rem' }}>Click "Add Trainer" to add the first certified trainer.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  {['Trainer', 'Email', 'Expertise', 'Exp. (yrs)', 'Password', 'Rating', 'Actions'].map((h) => (
                    <th key={h} style={{ padding: '0.75rem 1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer, idx) => (
                  <tr key={trainer.id} style={{ borderBottom: idx < trainers.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {trainer.avatarUrl ? (
                          <img src={trainer.avatarUrl} alt={trainer.name}
                            style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
                        ) : (
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                            {trainer.name.charAt(0)}
                          </div>
                        )}
                        <span style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.88rem' }}>{trainer.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.83rem', color: '#475569' }}>{trainer.email}</td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.78rem', backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.2rem 0.55rem', borderRadius: '20px', fontWeight: 600 }}>
                        {trainer.specialization}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.83rem', color: '#475569', textAlign: 'center' }}>
                      {trainer.experienceYears ?? '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <span style={{ fontSize: '0.78rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.55rem', borderRadius: '6px', fontFamily: 'monospace' }}>
                        {trainer.password || '—'}
                      </span>
                    </td>
                    <td style={{ padding: '0.85rem 1rem', fontSize: '0.83rem', color: '#475569' }}>
                      {trainer.rating != null ? `⭐ ${trainer.rating}` : '—'}
                    </td>
                    <td style={{ padding: '0.85rem 1rem' }}>
                      <button
                        onClick={() => handleRemove(trainer)}
                        disabled={removing === trainer.id}
                        style={{
                          display: 'flex', alignItems: 'center', gap: '0.3rem',
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          backgroundColor: '#fff1f2',
                          border: '1px solid #fecdd3',
                          color: '#dc2626',
                          fontSize: '0.78rem', fontWeight: 600,
                          cursor: removing === trainer.id ? 'not-allowed' : 'pointer',
                          opacity: removing === trainer.id ? 0.5 : 1,
                        }}
                      >
                        {removing === trainer.id ? (
                          <span className="spinner" style={{ width: '12px', height: '12px', borderColor: '#dc2626', borderTopColor: 'transparent' }}></span>
                        ) : (
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                            <path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4h6v2" />
                          </svg>
                        )}
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Info box */}
      <div style={{
        backgroundColor: '#fffbeb', border: '1px solid #fcd34d',
        borderRadius: '10px', padding: '1rem 1.25rem',
        fontSize: '0.83rem', color: '#92400e',
        display: 'flex', gap: '0.65rem', alignItems: 'flex-start',
      }}>
        <svg width="16" height="16" style={{ flexShrink: 0, marginTop: '1px' }} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <div>
          <strong>Admin Notes:</strong> Trainers added here are immediately added to both the <em>trainers</em> directory (visible to members on Contact page) and the <em>users</em> table (so they can log in). Removing a trainer deletes both records. Only administrators can access this portal.
        </div>
      </div>
    </div>
  );
}
