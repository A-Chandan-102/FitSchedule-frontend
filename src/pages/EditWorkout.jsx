import React, { useState } from 'react';
import { workoutApi } from '../services/api';

export default function EditWorkout({ plan, onCancel, onSaveSuccess }) {
  const [formData, setFormData] = useState(() => JSON.parse(JSON.stringify(plan)));
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const currentDay = formData.days && formData.days[selectedDayIdx];

  const handleDayFieldChange = (field, value) => {
    const updatedDays = [...formData.days];
    updatedDays[selectedDayIdx] = {
      ...updatedDays[selectedDayIdx],
      [field]: value,
    };
    setFormData({ ...formData, days: updatedDays });
  };

  const handleExerciseChange = (exIdx, field, value) => {
    const updatedDays = [...formData.days];
    const updatedExercises = [...updatedDays[selectedDayIdx].exercises];
    updatedExercises[exIdx] = {
      ...updatedExercises[exIdx],
      [field]: value,
    };
    updatedDays[selectedDayIdx].exercises = updatedExercises;
    setFormData({ ...formData, days: updatedDays });
  };

  const handleAddExercise = () => {
    const updatedDays = [...formData.days];
    const day = updatedDays[selectedDayIdx];
    const newExercise = {
      exerciseName: 'New Custom Exercise',
      muscleGroup: 'Full Body',
      sets: 3,
      reps: '10-12',
      restSeconds: 60,
      orderIndex: (day.exercises?.length || 0) + 1,
      notes: 'Focus on clean technique and full range of motion.',
    };
    day.exercises = [...(day.exercises || []), newExercise];
    setFormData({ ...formData, days: updatedDays });
  };

  const handleDeleteExercise = (exIdx) => {
    const updatedDays = [...formData.days];
    updatedDays[selectedDayIdx].exercises = updatedDays[selectedDayIdx].exercises.filter((_, i) => i !== exIdx);
    setFormData({ ...formData, days: updatedDays });
  };

  const handleToggleRestDay = () => {
    const updatedDays = [...formData.days];
    const current = updatedDays[selectedDayIdx];
    current.isRestDay = !current.isRestDay;
    if (current.isRestDay) {
      current.title = 'Rest & Active Recovery';
      current.focus = 'Restoration, mobility, and hydration';
    } else {
      current.title = 'Custom Training Day';
      current.focus = 'General conditioning';
    }
    setFormData({ ...formData, days: updatedDays });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      setIsSaving(true);
      const updated = await workoutApi.updatePlan(formData.id, formData);
      if (onSaveSuccess) {
        onSaveSuccess(updated);
      }
    } catch (err) {
      setError(err.message || 'Failed to update workout plan.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <span className="badge badge-lime" style={{ marginBottom: '0.45rem' }}>Edit Mode</span>
          <h1 className="section-title">Edit Workout Plan</h1>
          <p className="section-subtitle">
            Fine-tune exercises, adjust sets and repetitions, or modify daily focuses directly in MySQL.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-secondary" onClick={onCancel} disabled={isSaving}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSubmit} disabled={isSaving}>
            {isSaving ? (
              <>
                <span className="spinner"></span>
                Saving Changes...
              </>
            ) : (
              'Save Changes'
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-error">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {/* Plan General Settings */}
      <div className="card" style={{ marginBottom: '2rem', padding: '2rem', backgroundColor: '#ffffff' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1.25rem', color: '#0f172a' }}>Plan Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Plan Title</label>
            <input
              type="text"
              className="form-control"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Fitness Goal</label>
            <input
              type="text"
              className="form-control"
              value={formData.fitnessGoal}
              onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Session Duration (minutes)</label>
            <input
              type="number"
              className="form-control"
              value={formData.workoutDuration}
              onChange={(e) => setFormData({ ...formData, workoutDuration: parseInt(e.target.value) || 0 })}
            />
          </div>
        </div>

        <div className="form-group" style={{ marginBottom: 0 }}>
          <label className="form-label">Notes & Instructions</label>
          <textarea
            className="form-control"
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ minHeight: '80px' }}
          />
        </div>
      </div>

      {/* Day Selector */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Edit Days & Exercises</h3>
        <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {formData.days && formData.days.map((day, idx) => {
            const isSelected = selectedDayIdx === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedDayIdx(idx)}
                style={{
                  flex: '1 0 110px',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: isSelected ? '#dcfce7' : '#ffffff',
                  border: isSelected ? '1px solid #16a34a' : '1px solid var(--border-light)',
                  color: isSelected ? '#15803d' : '#0f172a',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <div style={{ fontSize: '0.8rem', fontWeight: 600 }}>{day.dayOfWeek}</div>
                <div style={{ fontSize: '0.82rem', color: isSelected ? '#15803d' : 'var(--text-dim)', marginTop: '0.15rem' }}>
                  {day.isRestDay ? 'Rest' : `${day.exercises?.length || 0} exercises`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Day Details Editing */}
      {currentDay && (
        <div className="card" style={{ padding: '2rem', backgroundColor: '#ffffff' }}>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            marginBottom: '1.5rem',
            borderBottom: '1px solid var(--border-light)',
            paddingBottom: '1.25rem',
          }}>
            <div>
              <span className="badge badge-lime">{currentDay.dayOfWeek}</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '0.25rem', color: '#0f172a' }}>
                Editing {currentDay.dayOfWeek}
              </h2>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${currentDay.isRestDay ? 'btn-primary' : 'btn-secondary'}`}
                onClick={handleToggleRestDay}
              >
                {currentDay.isRestDay ? 'Convert to Training Day' : 'Mark as Rest Day'}
              </button>
              {!currentDay.isRestDay && (
                <button
                  type="button"
                  className="btn btn-outline-lime btn-sm"
                  onClick={handleAddExercise}
                >
                  + Add Exercise
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Day Focus Title</label>
              <input
                type="text"
                className="form-control"
                value={currentDay.title}
                onChange={(e) => handleDayFieldChange('title', e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Focus Summary</label>
              <input
                type="text"
                className="form-control"
                value={currentDay.focus}
                onChange={(e) => handleDayFieldChange('focus', e.target.value)}
              />
            </div>
          </div>

          {currentDay.isRestDay ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              This day is set as an Active Recovery Day. Click "Convert to Training Day" above to add exercises.
            </div>
          ) : (
            <div>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '1rem', color: '#0f172a' }}>Exercises in Session</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                {currentDay.exercises && currentDay.exercises.map((ex, exIdx) => (
                  <div
                    key={exIdx}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr)) 40px',
                      gap: '0.75rem',
                      alignItems: 'center',
                      backgroundColor: '#f8fafc',
                      padding: '0.85rem 1rem',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-light)',
                    }}
                  >
                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Exercise Name</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                        value={ex.exerciseName}
                        onChange={(e) => handleExerciseChange(exIdx, 'exerciseName', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Muscle</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                        value={ex.muscleGroup}
                        onChange={(e) => handleExerciseChange(exIdx, 'muscleGroup', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Sets</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                        value={ex.sets}
                        onChange={(e) => handleExerciseChange(exIdx, 'sets', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Reps</label>
                      <input
                        type="text"
                        className="form-control"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                        value={ex.reps}
                        onChange={(e) => handleExerciseChange(exIdx, 'reps', e.target.value)}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-dim)', display: 'block' }}>Rest (sec)</label>
                      <input
                        type="number"
                        className="form-control"
                        style={{ padding: '0.45rem 0.65rem', fontSize: '0.85rem' }}
                        value={ex.restSeconds}
                        onChange={(e) => handleExerciseChange(exIdx, 'restSeconds', parseInt(e.target.value) || 0)}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteExercise(exIdx)}
                      title="Remove Exercise"
                      style={{
                        color: 'var(--accent-rose)',
                        fontSize: '1.2rem',
                        height: '34px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: '1rem',
                        cursor: 'pointer',
                      }}
                    >
                      &times;
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
