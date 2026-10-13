import React, { useState } from 'react';

export default function WorkoutDetails({ plan, onBack, onEdit, onViewSchedule }) {
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);

  if (!plan) return null;

  const currentDay = plan.days && plan.days[selectedDayIdx];

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      {/* Top Navigation Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <button className="btn btn-secondary btn-sm" onClick={onBack}>
          &larr; Back to My Workouts
        </button>

        <div style={{ display: 'flex', gap: '0.65rem' }}>
          <button className="btn btn-outline-lime btn-sm" onClick={() => onViewSchedule(plan)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            Weekly Schedule
          </button>
          <button className="btn btn-primary btn-sm" onClick={() => onEdit(plan)}>
            ✏️ Edit Plan
          </button>
        </div>
      </div>

      {/* Plan Header Card */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2.5rem', backgroundColor: '#ffffff' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', marginBottom: '0.75rem' }}>
          <span className="badge badge-lime">{plan.fitnessGoal}</span>
          <span className="badge badge-cyan">{plan.trainingSplit}</span>
          <span className="badge badge-muted">{plan.experienceLevel}</span>
          <span className="badge badge-muted">⏱ {plan.workoutDuration} mins</span>
          <span className="badge badge-muted">🏋️ {plan.equipment}</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.85rem', color: '#0f172a' }}>
          {plan.title}
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', lineHeight: 1.6, maxWidth: '800px', marginBottom: '1.5rem' }}>
          {plan.notes || 'No custom notes provided for this routine.'}
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          padding: '1.25rem',
          backgroundColor: '#f8fafc',
          border: '1px solid var(--border-light)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.88rem',
        }}>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Training Days / Week</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', marginTop: '0.2rem' }}>
              {plan.workoutFrequency} Days
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Target Muscles</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', marginTop: '0.2rem' }}>
              {plan.targetMuscleGroups || 'Balanced Distribution'}
            </div>
          </div>
          <div>
            <div style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Excluded Movements</div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: '#0f172a', marginTop: '0.2rem' }}>
              {plan.exercisesToAvoid || 'None'}
            </div>
          </div>
        </div>
      </div>

      {/* Weekday Switcher Tabs */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Training Week Schedule</h3>
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
        }}>
          {plan.days && plan.days.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            const isRest = day.isRestDay;
            return (
              <button
                key={idx}
                onClick={() => setSelectedDayIdx(idx)}
                style={{
                  flex: '1 0 120px',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected
                    ? '#dcfce7'
                    : isRest
                    ? '#f8fafc'
                    : '#ffffff',
                  border: isSelected
                    ? '1px solid #16a34a'
                    : '1px solid var(--border-light)',
                  color: isSelected
                    ? '#15803d'
                    : isRest
                    ? 'var(--text-dim)'
                    : '#0f172a',
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all var(--transition-fast)',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{day.dayOfWeek}</div>
                <div style={{
                  fontSize: '0.88rem',
                  fontWeight: 700,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  marginTop: '0.2rem',
                }}>
                  {isRest ? 'Rest' : day.title}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day Content */}
      {currentDay && (
        <div className="card" style={{ padding: '2rem', marginBottom: '3rem', backgroundColor: '#ffffff' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '1rem',
          }}>
            <div>
              <span className="badge badge-lime" style={{ marginBottom: '0.45rem' }}>{currentDay.dayOfWeek}</span>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>{currentDay.title}</h2>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginTop: '0.25rem' }}>
                Focus: {currentDay.focus}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span className={`badge ${currentDay.isRestDay ? 'badge-muted' : 'badge-lime'}`} style={{ fontSize: '0.85rem' }}>
                {currentDay.isRestDay ? 'Rest Day' : `${currentDay.estimatedDuration} minutes`}
              </span>
            </div>
          </div>

          {currentDay.isRestDay ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.85rem' }}>💤</div>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', color: '#0f172a' }}>Active Recovery Day</h3>
              <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto', lineHeight: 1.6 }}>
                Muscles adapt and grow during rest periods. Focus on sleep quality, clean hydration, light 20-30 minute walks, or mobility stretches to prepare for your next training session.
              </p>
            </div>
          ) : currentDay.exercises && currentDay.exercises.length > 0 ? (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '0.5rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-medium)', color: '#475569', textAlign: 'left', fontSize: '0.88rem' }}>
                    <th style={{ padding: '0.75rem 0.6rem' }}>#</th>
                    <th style={{ padding: '0.75rem 0.6rem' }}>Exercise</th>
                    <th style={{ padding: '0.75rem 0.6rem' }}>Muscle Group</th>
                    <th style={{ padding: '0.75rem 0.6rem' }}>Target Sets</th>
                    <th style={{ padding: '0.75rem 0.6rem' }}>Target Reps</th>
                    <th style={{ padding: '0.75rem 0.6rem' }}>Rest</th>
                  </tr>
                </thead>
                <tbody>
                  {currentDay.exercises.map((ex, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.85rem 0.6rem', color: '#64748b', fontWeight: 600 }}>{idx + 1}</td>
                      <td style={{ padding: '0.85rem 0.6rem' }}>
                        <div style={{ fontWeight: 700, color: '#0f172a', fontSize: '0.95rem' }}>
                          {ex.exerciseName}
                        </div>
                        {ex.notes && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem', lineHeight: 1.4 }}>
                            {ex.notes}
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '0.85rem 0.6rem' }}>
                        <span className="badge badge-cyan">{ex.muscleGroup}</span>
                      </td>
                      <td style={{ padding: '0.85rem 0.6rem', fontWeight: 800, color: '#15803d', fontSize: '1rem' }}>
                        {ex.sets}
                      </td>
                      <td style={{ padding: '0.85rem 0.6rem', fontWeight: 600, color: '#0f172a' }}>
                        {ex.reps}
                      </td>
                      <td style={{ padding: '0.85rem 0.6rem', color: 'var(--text-muted)' }}>
                        {ex.restSeconds}s
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-dim)' }}>
              No exercises assigned to this day.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
