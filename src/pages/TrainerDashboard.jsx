import React, { useState, useEffect } from 'react';
import { trainerApi } from '../services/api';

export default function TrainerDashboard({ currentUser }) {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  const loadInquiries = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await trainerApi.getAllInquiries();
      setInquiries(data || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch inquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInquiries();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await trainerApi.updateStatus(id, newStatus);
      setInquiries((prev) =>
        prev.map((inq) => (inq.id === id ? { ...inq, status: newStatus } : inq))
      );
    } catch (err) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const filteredInquiries = inquiries.filter((inq) => {
    if (filterStatus === 'ALL') return true;
    return inq.status === filterStatus;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <span className="badge badge-cyan" style={{ marginBottom: '0.45rem' }}>Staff Access Only</span>
          <h1 className="section-title">Trainer Inquiries Portal</h1>
          <p className="section-subtitle">
            Welcome, <strong>{currentUser?.fullName}</strong>. Review and answer questions submitted by fitness members.
          </p>
        </div>

        <button className="btn btn-secondary btn-sm" onClick={loadInquiries}>
          Sync Inquiries
        </button>
      </div>

      {/* Filter status buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem', flexWrap: 'wrap' }}>
        {['ALL', 'SUBMITTED', 'REVIEWED', 'ANSWERED'].map((st) => (
          <button
            key={st}
            type="button"
            onClick={() => setFilterStatus(st)}
            style={{
              padding: '0.45rem 0.95rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.85rem',
              fontWeight: filterStatus === st ? 700 : 500,
              backgroundColor: filterStatus === st ? '#16a34a' : '#ffffff',
              color: filterStatus === st ? '#ffffff' : '#0f172a',
              border: filterStatus === st ? '1px solid #16a34a' : '1px solid var(--border-light)',
              cursor: 'pointer',
            }}
          >
            {st === 'ALL' ? 'All Inquiries' : st}
          </button>
        ))}
      </div>

      {/* Loading & Error */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <span className="spinner" style={{ width: '2rem', height: '2rem', marginBottom: '1rem' }}></span>
          <p style={{ color: 'var(--text-muted)' }}>Loading inquiries from MySQL...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          <div>{error}</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredInquiries.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📬</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Inquiries Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            There are currently no inquiries matching the selected filter status.
          </p>
        </div>
      )}

      {/* Inquiries List */}
      {!loading && !error && filteredInquiries.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {filteredInquiries.map((inq) => {
            const isSubmitted = inq.status === 'SUBMITTED';
            const isReviewed = inq.status === 'REVIEWED';
            const isAnswered = inq.status === 'ANSWERED';

            return (
              <div
                key={inq.id}
                className="card"
                style={{
                  padding: '1.75rem',
                  backgroundColor: '#ffffff',
                  borderLeft: isSubmitted ? '4px solid #f59e0b' : isReviewed ? '4px solid #0284c7' : '4px solid #16a34a',
                }}
              >
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  marginBottom: '1rem',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        {inq.fullName}
                      </h3>
                      <span className="badge badge-muted" style={{ fontSize: '0.75rem' }}>
                        ID #{inq.id}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      Email: <a href={`mailto:${inq.email}`} style={{ color: '#0284c7', textDecoration: 'underline' }}>{inq.email}</a>
                      {inq.trainerName && (
                        <span> &bull; Assigned Trainer: <strong>{inq.trainerName}</strong></span>
                      )}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <span className={`badge ${isSubmitted ? 'badge-muted' : isReviewed ? 'badge-cyan' : 'badge-lime'}`}>
                      {inq.status}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {new Date(inq.submittedAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Topic / Goal */}
                <div style={{ marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700 }}>
                    Area of Interest:
                  </span>
                  <div style={{ fontWeight: 600, color: '#0f172a', fontSize: '0.95rem', marginTop: '0.15rem' }}>
                    {inq.fitnessGoal}
                  </div>
                </div>

                {/* Question Message */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid var(--border-light)',
                  padding: '1rem',
                  borderRadius: 'var(--radius-md)',
                  color: '#334155',
                  fontSize: '0.92rem',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}>
                  "{inq.message}"
                </div>

                {/* Status Toggle Buttons */}
                <div style={{ display: 'flex', gap: '0.65rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                  {isSubmitted && (
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleUpdateStatus(inq.id, 'REVIEWED')}
                    >
                      Mark as In Review
                    </button>
                  )}
                  {!isAnswered && (
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => handleUpdateStatus(inq.id, 'ANSWERED')}
                    >
                      Mark as Answered / Resolved
                    </button>
                  )}
                  {isAnswered && (
                    <span style={{ fontSize: '0.85rem', color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      ✓ Question resolved
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
