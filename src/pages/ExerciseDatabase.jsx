import React, { useState, useEffect } from 'react';
import { exerciseApi } from '../services/api';

const MUSCLE_GROUPS = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Cardio'];
const EQUIPMENTS = ['All', 'Full gym', 'Dumbbells', 'Resistance bands', 'Bodyweight only'];

// Visual illustrations/icons per muscle group
const MUSCLE_ICONS = {
  Chest: '🏋️‍♂️',
  Back: '🧗',
  Legs: '🦵',
  Shoulders: '💪',
  Arms: '🦾',
  Core: '🧘',
  Cardio: '🏃',
  default: '⚡',
};

export default function ExerciseDatabase({ onSelectExerciseForPlanner, setActiveTab }) {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function loadExercises() {
      try {
        setLoading(true);
        setError('');
        const data = await exerciseApi.getExercises();
        setExercises(data || []);
      } catch (err) {
        setError(err.message || 'Failed to load exercises.');
      } finally {
        setLoading(false);
      }
    }
    loadExercises();
  }, []);

  // Filtered exercises
  const filteredExercises = exercises.filter((ex) => {
    const matchesMuscle = selectedMuscle === 'All' || ex.muscleGroup?.toLowerCase() === selectedMuscle.toLowerCase();
    const matchesEquipment = selectedEquipment === 'All' || ex.equipment?.toLowerCase() === selectedEquipment.toLowerCase();
    const matchesSearch = !searchQuery.trim() ||
      ex.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.muscleGroup?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ex.subCategory?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesMuscle && matchesEquipment && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-lime" style={{ marginBottom: '0.65rem' }}>Exercise Library</span>
        <h1 className="section-title">Exercise Database</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Explore our certified movements library. Filter by target muscle group, equipment type, or search for exercise form cues.
        </p>
      </div>

      {/* Filter Controls Card */}
      <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem', backgroundColor: '#ffffff' }}>
        {/* Search Input */}
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">Search Movement or Cue</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. Bench Press, Squat, Pull-Up, Dumbbell..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Muscle Group Filters */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Filter by Muscle Group</label>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {selectedMuscle === 'All' ? 'Showing all muscles' : `Targeting: ${selectedMuscle}`}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {MUSCLE_GROUPS.map((mg) => {
              const active = selectedMuscle === mg;
              return (
                <button
                  key={mg}
                  type="button"
                  onClick={() => setSelectedMuscle(mg)}
                  style={{
                    padding: '0.45rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.88rem',
                    fontWeight: active ? 700 : 500,
                    backgroundColor: active ? '#16a34a' : '#f8fafc',
                    color: active ? '#ffffff' : '#0f172a',
                    border: active ? '1px solid #16a34a' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  {mg !== 'All' && <span style={{ marginRight: '0.35rem' }}>{MUSCLE_ICONS[mg] || '⚡'}</span>}
                  {mg}
                </button>
              );
            })}
          </div>
        </div>

        {/* Equipment Filter */}
        <div>
          <label className="form-label" style={{ marginBottom: '0.5rem' }}>Filter by Equipment</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
            {EQUIPMENTS.map((eq) => {
              const active = selectedEquipment === eq;
              return (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setSelectedEquipment(eq)}
                  style={{
                    padding: '0.4rem 0.85rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.82rem',
                    fontWeight: active ? 700 : 500,
                    backgroundColor: active ? '#0284c7' : '#f8fafc',
                    color: active ? '#ffffff' : '#475569',
                    border: active ? '1px solid #0284c7' : '1px solid var(--border-light)',
                    cursor: 'pointer',
                  }}
                >
                  {eq}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <span style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>
          Showing <strong style={{ color: '#0f172a' }}>{filteredExercises.length}</strong> of {exercises.length} exercises
        </span>
        {(selectedMuscle !== 'All' || selectedEquipment !== 'All' || searchQuery) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => {
              setSelectedMuscle('All');
              setSelectedEquipment('All');
              setSearchQuery('');
            }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <span className="spinner" style={{ width: '2.5rem', height: '2.5rem', marginBottom: '1rem' }}></span>
          <p style={{ color: 'var(--text-muted)' }}>Loading exercise catalog...</p>
        </div>
      )}

      {error && !loading && (
        <div className="alert alert-error">
          <div>{error}</div>
        </div>
      )}

      {/* Exercises Grid */}
      {!loading && !error && filteredExercises.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 2rem', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#0f172a' }}>No Exercises Found</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No movements matched your combination of muscle group, equipment, and search query. Try broadening your filter.
          </p>
        </div>
      )}

      {!loading && !error && filteredExercises.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '1.5rem',
        }}>
          {filteredExercises.map((ex) => (
            <div
              key={ex.id}
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
                {/* Visual Icon Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    backgroundColor: '#dcfce7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.6rem',
                  }}>
                    {MUSCLE_ICONS[ex.muscleGroup] || '🏋️'}
                  </div>

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
                    <span className="badge badge-lime">{ex.muscleGroup}</span>
                    <span className="badge badge-cyan">{ex.equipment}</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.45rem', color: '#0f172a' }}>
                  {ex.name}
                </h3>

                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.85rem' }}>
                  {ex.subCategory && (
                    <span className="badge badge-lime" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                      Target: {ex.subCategory}
                    </span>
                  )}
                  <span className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                    {ex.category || 'Compound'}
                  </span>
                  <span className="badge badge-muted" style={{ fontSize: '0.7rem' }}>
                    Level: {ex.experienceLevel || 'All'}
                  </span>
                </div>

                <p style={{
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  lineHeight: 1.55,
                  marginBottom: '1.25rem',
                }}>
                  {ex.description}
                </p>
              </div>

              {/* Bottom Specs Strip */}
              <div style={{
                borderTop: '1px solid var(--border-light)',
                paddingTop: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '0.82rem',
              }}>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Default Scheme: </span>
                  <strong style={{ color: '#16a34a' }}>{ex.defaultSets} sets × {ex.defaultReps}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-dim)' }}>Rest: </span>
                  <strong style={{ color: '#0f172a' }}>{ex.defaultRestSeconds}s</strong>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
