import React, { useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

export default function MyWorkouts({
  plans,
  loading,
  error,
  onRefresh,
  onDeletePlan,
  onViewDetails,
  onEditPlan,
  onViewSchedule,
  setActiveTab,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [planToDelete, setPlanToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredPlans = plans.filter((p) => {
    const term = searchTerm.toLowerCase();
    return (
      p.title?.toLowerCase().includes(term) ||
      p.fitnessGoal?.toLowerCase().includes(term) ||
      p.trainingSplit?.toLowerCase().includes(term) ||
      p.equipment?.toLowerCase().includes(term)
    );
  });

  const handleConfirmDelete = async () => {
    if (!planToDelete) return;
    try {
      setIsDeleting(true);
      await onDeletePlan(planToDelete.id);
      setPlanToDelete(null);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
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
          <span className="badge badge-lime" style={{ marginBottom: '0.45rem' }}>Database Persisted Plans</span>
          <h1 className="section-title">My Workout Plans</h1>
          <p className="section-subtitle">
            Manage your saved workout routines, customize sets and reps, or open your active weekly schedule.
          </p>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => setActiveTab('planner')}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create New Plan
        </button>
      </div>

      {/* Search & Stats Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div style={{ maxWidth: '380px', width: '100%' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search plans by goal, split, or equipment..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Total Plans: <strong style={{ color: '#16a34a' }}>{plans.length}</strong>
          </span>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onRefresh}
            title="Refresh from MySQL"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Sync
          </button>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <span className="spinner" style={{ width: '2.5rem', height: '2.5rem', marginBottom: '1rem' }}></span>
          <p style={{ color: 'var(--text-muted)' }}>Loading saved plans from MySQL...</p>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="alert alert-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && plans.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '2rem auto' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#dcfce7',
            color: '#16a34a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem auto',
          }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h3 style={{ fontSize: '1.4rem', marginBottom: '0.75rem', color: '#0f172a' }}>No Workout Plans Saved Yet</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Use the Workout Planner to configure your frequency, goals, and equipment. Your customized schedule will appear here.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => setActiveTab('planner')}
          >
            Build My Workout Plan &rarr;
          </button>
        </div>
      )}

      {/* Plans Grid */}
      {!loading && !error && plans.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredPlans.map((plan) => {
            const totalExercises = plan.days
              ? plan.days.reduce((acc, d) => acc + (d.exercises ? d.exercises.length : 0), 0)
              : 0;

            return (
              <div
                key={plan.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: '1.75rem',
                  backgroundColor: '#ffffff',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                    <span className="badge badge-lime">{plan.fitnessGoal}</span>
                    <span className="badge badge-muted">{plan.experienceLevel}</span>
                  </div>

                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.65rem', color: '#0f172a' }}>
                    {plan.title}
                  </h3>

                  <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.88rem',
                    marginBottom: '1.25rem',
                    lineHeight: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {plan.notes || 'Customized routine configured with optimal rest distribution.'}
                  </p>

                  {/* Highlights Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: '0.65rem',
                    padding: '0.9rem',
                    backgroundColor: '#f8fafc',
                    border: '1px solid var(--border-light)',
                    borderRadius: 'var(--radius-md)',
                    marginBottom: '1.5rem',
                    fontSize: '0.82rem',
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Frequency: </span>
                      <strong style={{ color: '#0f172a' }}>{plan.workoutFrequency} Days/wk</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Split: </span>
                      <strong style={{ color: '#0f172a' }}>{plan.trainingSplit}</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Duration: </span>
                      <strong style={{ color: '#0f172a' }}>{plan.workoutDuration} Mins</strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-dim)' }}>Exercises: </span>
                      <strong style={{ color: '#16a34a' }}>{totalExercises} total</strong>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.5rem',
                  borderTop: '1px solid var(--border-light)',
                  paddingTop: '1.2rem',
                }}>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onViewDetails(plan)}
                    style={{ flex: 1 }}
                  >
                    Details
                  </button>
                  <button
                    className="btn btn-outline-lime btn-sm"
                    onClick={() => onViewSchedule(plan)}
                    style={{ flex: 1 }}
                  >
                    Schedule
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => onEditPlan(plan)}
                    title="Edit Plan"
                  >
                    ✏️ Edit
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => setPlanToDelete(plan)}
                    title="Delete Plan"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(planToDelete)}
        title="Delete Workout Plan"
        message={`Are you sure you want to delete "${planToDelete?.title}"? All scheduled days and assigned exercises will be permanently removed from MySQL.`}
        confirmText={isDeleting ? 'Deleting...' : 'Yes, Delete Plan'}
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPlanToDelete(null)}
      />
    </div>
  );
}
