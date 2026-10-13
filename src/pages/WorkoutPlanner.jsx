import React, { useState, useEffect } from 'react';
import { workoutApi, exerciseApi } from '../services/api';

const ALL_WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const FITNESS_GOALS = [
  { id: 'Muscle gain', label: 'Muscle Gain', icon: '💪', desc: 'Hypertrophy focused' },
  { id: 'Fat loss', label: 'Fat Loss', icon: '🔥', desc: 'Caloric burn & density' },
  { id: 'Strength development', label: 'Strength Development', icon: '🏋️', desc: 'Heavy compounds & power' },
  { id: 'Endurance', label: 'Endurance', icon: '🏃', desc: 'High stamina & conditioning' },
  { id: 'General fitness', label: 'General Fitness', icon: '⚡', desc: 'Balanced health & longevity' },
];

const EXPERIENCE_LEVELS = [
  { id: 'Beginner', label: 'Beginner', desc: '0 – 1 year of consistent lifting' },
  { id: 'Intermediate', label: 'Intermediate', desc: '1 – 3 years of structured training' },
  { id: 'Advanced', label: 'Advanced', desc: '3+ years of progressive overload' },
];

const DURATIONS = [
  { value: 30, label: '30 Mins', desc: 'Quick & focused' },
  { value: 45, label: '45 Mins', desc: 'Time-efficient' },
  { value: 60, label: '60 Mins', desc: 'Standard session' },
  { value: 90, label: '90 Mins', desc: 'High volume' },
];

const EQUIPMENTS = [
  { id: 'Full gym', label: 'Full Gym', desc: 'Barbells, racks, cables & machines' },
  { id: 'Dumbbells', label: 'Dumbbells Only', desc: 'Adjustable or fixed dumbbells' },
  { id: 'Resistance bands', label: 'Resistance Bands', desc: 'Loop & tube bands' },
  { id: 'Bodyweight only', label: 'Bodyweight Only', desc: 'Calisthenics, no gear needed' },
  { id: 'Limited or custom equipment', label: 'Custom / Mixed', desc: 'Bands, dumbbells & bars' },
];

const SPLITS = [
  { id: 'Auto', label: 'Automatic Selection', desc: 'Recommended based on frequency' },
  { id: 'Full body', label: 'Full Body', desc: 'High frequency full-body stimulation' },
  { id: 'Upper/lower', label: 'Upper / Lower', desc: 'Balanced upper & lower body days' },
  { id: 'Push/pull/legs', label: 'Push / Pull / Legs', desc: 'Targeted mechanical movement planes' },
];

export default function WorkoutPlanner({ currentUser, onPlanSaved, setActiveTab }) {
  const [formData, setFormData] = useState({
    planTitle: '',
    fitnessGoal: 'Muscle gain',
    experienceLevel: 'Intermediate',
    workoutFrequency: 4,
    preferredDays: ['Monday', 'Tuesday', 'Thursday', 'Friday'],
    workoutDuration: 60,
    equipment: 'Full gym',
    trainingSplit: 'Auto',
    targetMuscleGroups: '',
    exercisesToAvoid: '',
    notes: '',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
  const [initialGeneratedPlan, setInitialGeneratedPlan] = useState(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [allExercises, setAllExercises] = useState([]);

  // Load complete exercise database for swapping
  useEffect(() => {
    async function loadAllExercises() {
      try {
        const data = await exerciseApi.getExercises();
        setAllExercises(data || []);
      } catch (err) {
        console.error('Failed to load exercises for swapping:', err);
      }
    }
    loadAllExercises();
  }, []);

  const getSubCategoryForName = (name) => {
    if (!name) return '';
    const match = allExercises.find((c) => c.name?.toLowerCase() === name.toLowerCase());
    return match?.subCategory || '';
  };

  // Filter exercises hitting the target muscle
  const getCandidatesForExercise = (ex, defaultName) => {
    if (!allExercises || allExercises.length === 0) return [];
    const targetMuscle = (ex.muscleGroup || '').toLowerCase();
    return allExercises.filter(
      (c) => c.muscleGroup?.toLowerCase() === targetMuscle && c.name !== defaultName
    );
  };

  // Swap exercise handler
  const handleSwapExercise = (activeDayIdx, exIdx, chosenName) => {
    if (!chosenName) return;
    const chosen = allExercises.find((c) => c.name === chosenName);
    if (!chosen) return;

    setGeneratedPlan((prev) => {
      let activeCount = 0;
      const newDays = prev.days.map((d) => {
        if (d.isRestDay) return d;
        const currentActiveIdx = activeCount++;
        if (currentActiveIdx !== activeDayIdx) return d;
        const newExercises = d.exercises.map((item, eIndex) => {
          if (eIndex !== exIdx) return item;
          const isCardio = chosen.muscleGroup?.toLowerCase() === 'cardio' || chosen.category?.toLowerCase() === 'cardio';
          return {
            ...item,
            exerciseId: chosen.id,
            exerciseName: chosen.name,
            muscleGroup: chosen.muscleGroup,
            subCategory: chosen.subCategory,
            sets: isCardio ? 1 : item.sets,
            reps: isCardio ? (chosen.defaultReps || '25-30 mins') : item.reps,
            restSeconds: isCardio ? 60 : item.restSeconds,
            notes: chosen.description,
          };
        });
        return { ...d, exercises: newExercises };
      });
      return { ...prev, days: newDays };
    });
  };

  // Reset single exercise to default
  const handleResetExerciseToDefault = (activeDayIdx, exIdx) => {
    if (!initialGeneratedPlan) return;
    const activeDays = initialGeneratedPlan.days.filter((d) => !d.isRestDay);
    const originalEx = activeDays[activeDayIdx]?.exercises?.[exIdx];
    if (!originalEx) return;

    setGeneratedPlan((prev) => {
      let activeCount = 0;
      const newDays = prev.days.map((d) => {
        if (d.isRestDay) return d;
        const currentActiveIdx = activeCount++;
        if (currentActiveIdx !== activeDayIdx) return d;
        const newExercises = d.exercises.map((item, eIndex) => {
          if (eIndex !== exIdx) return item;
          return { ...originalEx };
        });
        return { ...d, exercises: newExercises };
      });
      return { ...prev, days: newDays };
    });
  };

  // Reset entire generated plan back to initial defaults
  const handleResetFullPlanToDefault = () => {
    if (initialGeneratedPlan) {
      setGeneratedPlan(JSON.parse(JSON.stringify(initialGeneratedPlan)));
      setSaveSuccess(false);
    }
  };

  // Toggle days with validation
  const toggleDay = (day) => {
    let updated;
    if (formData.preferredDays.includes(day)) {
      updated = formData.preferredDays.filter((d) => d !== day);
    } else {
      if (formData.preferredDays.length >= formData.workoutFrequency) {
        setError(`You have already selected ${formData.workoutFrequency} days. Deselect a day first or increase your workout frequency.`);
        return;
      }
      updated = [...formData.preferredDays, day];
    }
    setError('');
    setFormData({ ...formData, preferredDays: updated });
  };

  const handleFrequencyChange = (freq) => {
    setError('');
    let days = [...formData.preferredDays];
    if (freq === 2) days = ['Tuesday', 'Thursday'];
    else if (freq === 3) days = ['Monday', 'Wednesday', 'Friday'];
    else if (freq === 4) days = ['Monday', 'Tuesday', 'Thursday', 'Friday'];
    else if (freq === 5) days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    else if (freq === 6) days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    setFormData({ ...formData, workoutFrequency: freq, preferredDays: days });
  };

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setSaveSuccess(false);

    if (!currentUser) {
      setError('You must be logged in to create a workout plan. Please sign in or register.');
      if (setActiveTab) setActiveTab('login');
      return;
    }

    if (formData.preferredDays.length !== formData.workoutFrequency) {
      setError(`Workout frequency is set to ${formData.workoutFrequency} days, but you have selected ${formData.preferredDays.length} day(s). Please select exactly ${formData.workoutFrequency} training days.`);
      return;
    }

    try {
      setIsGenerating(true);
      const plan = await workoutApi.generatePlan(formData);
      setGeneratedPlan(plan);
      setInitialGeneratedPlan(JSON.parse(JSON.stringify(plan)));
      setTimeout(() => {
        const previewEl = document.getElementById('generated-plan-preview');
        if (previewEl) previewEl.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(err.message || 'Failed to generate workout plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!currentUser?.email) {
      setError('You must be logged in to save a workout plan.');
      if (setActiveTab) setActiveTab('login');
      return;
    }
    if (!generatedPlan) return;
    setError('');
    try {
      setIsSaving(true);
      const planToSave = {
        ...generatedPlan,
        userEmail: currentUser.email,
      };
      const saved = await workoutApi.savePlan(planToSave);
      setSaveSuccess(true);
      if (onPlanSaved) {
        onPlanSaved(saved);
      }
    } catch (err) {
      setError(err.message || 'Failed to save workout plan to database.');
    } finally {
      setIsSaving(false);
    }
  };

  // If user is not logged in, show authentication required gate
  if (!currentUser) {
    return (
      <div className="container" style={{ paddingTop: '3.5rem', paddingBottom: '4rem', maxWidth: '640px' }}>
        <div
          className="card"
          style={{
            textAlign: 'center',
            padding: '3rem 2rem',
            backgroundColor: '#ffffff',
            borderRadius: 'var(--radius-lg)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
            border: '1px solid #e2e8f0',
          }}
        >
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.5rem auto',
            }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          <span className="badge badge-error" style={{ marginBottom: '0.75rem', fontSize: '0.8rem' }}>
            Account Required
          </span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
            Please Log In to Create a Workout Plan
          </h2>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '2rem', maxWidth: '480px', margin: '0 auto 2rem auto' }}>
            FitSchedule requires an active user account to build, customize, swap exercises, and save your personalized workout routines to your profile.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.85rem', justifyContent: 'center' }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => setActiveTab('login')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              Log In / Sign Up &rarr;
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => setActiveTab('home')}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <span className="badge badge-lime" style={{ marginBottom: '0.65rem' }}>Custom Plan Generator</span>
        <h1 className="section-title">Personalized Workout Planner</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Select your training preferences below. FitSchedule's backend rules engine will assemble an optimal, progressive weekly plan tailored to your available gear.
        </p>
      </div>

      {error && (
        <div className="alert alert-error" style={{ maxWidth: '880px', margin: '0 auto 1.5rem auto' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <div>{error}</div>
        </div>
      )}

      {saveSuccess && (
        <div className="alert alert-success" style={{ maxWidth: '880px', margin: '0 auto 1.5rem auto' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <span>Workout Plan successfully saved to MySQL database!</span>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setActiveTab('my-workouts')}
              style={{ marginLeft: '1rem' }}
            >
              Go to My Workouts &rarr;
            </button>
          </div>
        </div>
      )}

      {/* Generator Form */}
      <form onSubmit={handleGenerate} className="card" style={{ maxWidth: '880px', margin: '0 auto 3rem auto', padding: '2.5rem', backgroundColor: '#ffffff' }}>
        {/* Optional Custom Title */}
        <div className="form-group">
          <label className="form-label">Plan Title (Optional)</label>
          <input
            type="text"
            className="form-control"
            placeholder="e.g. 4-Day Hypertrophy & Strength Program"
            value={formData.planTitle}
            onChange={(e) => setFormData({ ...formData, planTitle: e.target.value })}
          />
        </div>

        {/* 1. Fitness Goal */}
        <div className="form-group">
          <label className="form-label">1. Primary Fitness Goal</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.65rem' }}>
            {FITNESS_GOALS.map((g) => {
              const active = formData.fitnessGoal === g.id;
              return (
                <div
                  key={g.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, fitnessGoal: g.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{g.icon}</div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: active ? '#15803d' : '#0f172a' }}>{g.label}</div>
                  <div style={{ fontSize: '0.75rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {g.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. Experience Level */}
        <div className="form-group">
          <label className="form-label">2. Experience Level</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {EXPERIENCE_LEVELS.map((lvl) => {
              const active = formData.experienceLevel === lvl.id;
              return (
                <div
                  key={lvl.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, experienceLevel: lvl.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.95rem', color: active ? '#15803d' : '#0f172a' }}>{lvl.label}</div>
                  <div style={{ fontSize: '0.78rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {lvl.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Workout Frequency */}
        <div className="form-group">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>3. Workout Frequency (Days per Week)</label>
            <span className="badge badge-lime">{formData.workoutFrequency} Days / Week</span>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {[2, 3, 4, 5, 6].map((num) => {
              const active = formData.workoutFrequency === num;
              return (
                <button
                  type="button"
                  key={num}
                  className={`weekday-pill ${active ? 'active' : ''}`}
                  onClick={() => handleFrequencyChange(num)}
                  style={{ flex: 1, padding: '0.75rem 0' }}
                >
                  {num} Days
                </button>
              );
            })}
          </div>

          {/* Preferred Training Days */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.45rem' }}>
            <label className="form-label" style={{ marginBottom: 0 }}>Select Training Days</label>
            <span style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: formData.preferredDays.length === formData.workoutFrequency ? '#15803d' : '#d97706',
            }}>
              {formData.preferredDays.length} of {formData.workoutFrequency} days selected
            </span>
          </div>
          <div className="weekday-selector">
            {ALL_WEEKDAYS.map((day) => {
              const active = formData.preferredDays.includes(day);
              return (
                <button
                  type="button"
                  key={day}
                  className={`weekday-pill ${active ? 'active' : ''}`}
                  onClick={() => toggleDay(day)}
                >
                  {day.slice(0, 3)}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Workout Duration */}
        <div className="form-group">
          <label className="form-label">4. Session Duration</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.65rem' }}>
            {DURATIONS.map((d) => {
              const active = formData.workoutDuration === d.value;
              return (
                <div
                  key={d.value}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, workoutDuration: d.value })}
                >
                  <div style={{ fontWeight: 700, color: active ? '#15803d' : '#0f172a' }}>{d.label}</div>
                  <div style={{ fontSize: '0.72rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.15rem' }}>
                    {d.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Available Equipment */}
        <div className="form-group">
          <label className="form-label">5. Available Equipment</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.65rem' }}>
            {EQUIPMENTS.map((eq) => {
              const active = formData.equipment === eq.id;
              return (
                <div
                  key={eq.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, equipment: eq.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: active ? '#15803d' : '#0f172a' }}>{eq.label}</div>
                  <div style={{ fontSize: '0.76rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {eq.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. Training Split */}
        <div className="form-group">
          <label className="form-label">6. Preferred Training Split</label>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.65rem' }}>
            {SPLITS.map((sp) => {
              const active = formData.trainingSplit === sp.id;
              return (
                <div
                  key={sp.id}
                  className={`option-btn ${active ? 'active' : ''}`}
                  onClick={() => setFormData({ ...formData, trainingSplit: sp.id })}
                  style={{ textAlign: 'left', padding: '0.85rem' }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', color: active ? '#15803d' : '#0f172a' }}>{sp.label}</div>
                  <div style={{ fontSize: '0.75rem', color: active ? '#166534' : 'var(--text-dim)', marginTop: '0.2rem' }}>
                    {sp.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 7. Optional Details */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div className="form-group">
            <label className="form-label">Target Muscle Groups (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Chest, Back, Delts"
              value={formData.targetMuscleGroups}
              onChange={(e) => setFormData({ ...formData, targetMuscleGroups: e.target.value })}
            />
            <div className="form-helper">Prioritizes movements for these muscle groups.</div>
          </div>

          <div className="form-group">
            <label className="form-label">Exercises to Avoid (Optional)</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Deadlift, Bench Press"
              value={formData.exercisesToAvoid}
              onChange={(e) => setFormData({ ...formData, exercisesToAvoid: e.target.value })}
            />
            <div className="form-helper">Filters out exercises matching these names.</div>
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ marginTop: '2rem', textAlign: 'center' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={isGenerating}
            style={{ width: '100%', maxWidth: '380px' }}
          >
            {isGenerating ? (
              <>
                <span className="spinner"></span>
                Generating Custom Plan...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                Generate Workout Plan
              </>
            )}
          </button>
        </div>
      </form>

      {/* Generated Plan Interactive Preview */}
      {generatedPlan && (
        <div id="generated-plan-preview" style={{ maxWidth: '960px', margin: '0 auto 4rem auto' }}>
          <div className="card" style={{ borderColor: '#bbf7d0', padding: '2.5rem', backgroundColor: '#ffffff' }}>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              gap: '1.25rem',
              marginBottom: '2rem',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '1.5rem',
            }}>
              <div>
                <span className="badge badge-lime" style={{ marginBottom: '0.5rem' }}>Generated Routine</span>
                <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>{generatedPlan.title}</h2>
                <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', marginTop: '0.65rem' }}>
                  <span className="badge badge-cyan">{generatedPlan.fitnessGoal}</span>
                  <span className="badge badge-muted">{generatedPlan.experienceLevel}</span>
                  <span className="badge badge-muted">{generatedPlan.trainingSplit}</span>
                  <span className="badge badge-muted">⏱ {generatedPlan.workoutDuration} min/day</span>
                  <span className="badge badge-muted">🏋️ {generatedPlan.equipment}</span>
                </div>
              </div>

              {/* Action Buttons: Save & Reset to Default */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', alignItems: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-primary btn-lg"
                  onClick={handleSavePlan}
                  disabled={isSaving || saveSuccess}
                >
                  {isSaving ? (
                    <>
                      <span className="spinner"></span>
                      Saving to Database...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Saved in MySQL!
                    </>
                  ) : (
                    <>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                        <polyline points="17 21 17 13 7 13 7 21" />
                        <polyline points="7 3 7 8 15 8" />
                      </svg>
                      Save Workout Plan
                    </>
                  )}
                </button>

                {/* Reset Full Workout Plan to Default Button beneath Save */}
                <button
                  type="button"
                  onClick={handleResetFullPlanToDefault}
                  className="btn btn-secondary btn-sm"
                  disabled={!initialGeneratedPlan}
                  style={{
                    fontSize: '0.82rem',
                    padding: '0.45rem 0.95rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#475569',
                    backgroundColor: '#f8fafc',
                  }}
                  title="Reset all swapped exercises back to original default plan"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                    <path d="M3 3v5h5" />
                  </svg>
                  Reset Full Workout Plan to Default
                </button>
              </div>
            </div>

            {/* Plan Training Days List (Rest days removed for all) */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {generatedPlan.days.filter((d) => !d.isRestDay).map((day, dIdx) => {
                const defaultDay = initialGeneratedPlan?.days?.filter((d) => !d.isRestDay)?.[dIdx];
                return (
                  <div
                    key={dIdx}
                    style={{
                      backgroundColor: '#ffffff',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid #bbf7d0',
                      padding: '1.25rem 1.5rem',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#15803d' }}>
                          {day.dayOfWeek}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: '#0f172a' }}>
                          – {day.title}
                        </span>
                      </div>
                      <span className="badge badge-lime">
                        {day.estimatedDuration} mins
                      </span>
                    </div>

                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      Focus: {day.focus}
                    </div>

                    {/* Exercises Table (Rest column removed) */}
                    {day.exercises && day.exercises.length > 0 && (
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid var(--border-medium)', color: '#475569', textAlign: 'left' }}>
                              <th style={{ padding: '0.5rem 0.6rem' }}>#</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Exercise</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Muscle / Subcategory</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Sets</th>
                              <th style={{ padding: '0.5rem 0.6rem' }}>Reps / Time</th>
                              <th style={{ padding: '0.5rem 0.6rem', minWidth: '320px' }}>Swap Exercise</th>
                            </tr>
                          </thead>
                          <tbody>
                            {day.exercises.map((ex, eIdx) => {
                              const defaultEx = defaultDay?.exercises?.[eIdx];
                              const defaultName = defaultEx?.exerciseName || ex.exerciseName;
                              const currentSubCat = ex.subCategory || getSubCategoryForName(ex.exerciseName) || ex.muscleGroup;
                              const defaultSubCat = defaultEx?.subCategory || getSubCategoryForName(defaultName) || currentSubCat;
                              const isDefault = ex.exerciseName === defaultName;

                              return (
                                <tr key={eIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                  <td style={{ padding: '0.65rem 0.6rem', color: '#64748b' }}>{eIdx + 1}</td>
                                  <td style={{ padding: '0.65rem 0.6rem', fontWeight: 600, color: '#0f172a' }}>
                                    {ex.exerciseName}
                                    {ex.notes && (
                                      <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 400, marginTop: '0.15rem' }}>
                                        {ex.notes}
                                      </div>
                                    )}
                                  </td>
                                  <td style={{ padding: '0.65rem 0.6rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                                      <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>{ex.muscleGroup}</span>
                                      <span className="badge badge-lime" style={{ fontSize: '0.72rem', fontWeight: 700 }}>
                                        {currentSubCat}
                                      </span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '0.65rem 0.6rem', fontWeight: 700, color: '#15803d' }}>{ex.sets}</td>
                                  <td style={{ padding: '0.65rem 0.6rem', color: '#0f172a', fontWeight: 600 }}>{ex.reps}</td>
                                  <td style={{ padding: '0.65rem 0.6rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                        <select
                                          className="form-control"
                                          value={ex.exerciseName}
                                          onChange={(e) => handleSwapExercise(dIdx, eIdx, e.target.value)}
                                          style={{
                                            padding: '0.35rem 0.5rem',
                                            fontSize: '0.8rem',
                                            borderRadius: 'var(--radius-sm)',
                                            backgroundColor: isDefault ? '#ffffff' : '#f0fdf4',
                                            border: isDefault ? '1px solid #cbd5e1' : '1px solid #16a34a',
                                            cursor: 'pointer',
                                            maxWidth: '240px',
                                            fontWeight: 500,
                                          }}
                                          title="Swap this exercise"
                                        >
                                          <option value={defaultName}>
                                            Default: {defaultName} {defaultSubCat ? `(${defaultSubCat})` : ''}
                                          </option>
                                          {getCandidatesForExercise(ex, defaultName).map((cand) => (
                                            <option key={cand.id || cand.name} value={cand.name}>
                                              {cand.name} {cand.subCategory ? `(${cand.subCategory})` : ''}
                                            </option>
                                          ))}
                                        </select>

                                        {/* Set to default option next to dropdown */}
                                        {!isDefault ? (
                                          <button
                                            type="button"
                                            onClick={() => handleResetExerciseToDefault(dIdx, eIdx)}
                                            style={{
                                              padding: '0.3rem 0.55rem',
                                              fontSize: '0.75rem',
                                              borderRadius: 'var(--radius-sm)',
                                              border: '1px solid #16a34a',
                                              backgroundColor: '#dcfce7',
                                              color: '#15803d',
                                              fontWeight: 700,
                                              cursor: 'pointer',
                                              whiteSpace: 'nowrap',
                                              display: 'inline-flex',
                                              alignItems: 'center',
                                              gap: '0.25rem',
                                            }}
                                            title="Set back to default exercise"
                                          >
                                            ↺ Set to Default
                                          </button>
                                        ) : (
                                          <span style={{
                                            fontSize: '0.72rem',
                                            color: '#16a34a',
                                            backgroundColor: '#f0fdf4',
                                            border: '1px solid #bbf7d0',
                                            padding: '0.25rem 0.45rem',
                                            borderRadius: 'var(--radius-sm)',
                                            fontWeight: 700,
                                            whiteSpace: 'nowrap',
                                          }}>
                                            ✓ Default
                                          </span>
                                        )}
                                      </div>

                                      {/* Subcategory visible when selected */}
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                                        <span style={{ color: '#64748b', fontWeight: 600 }}>Selected Subcategory:</span>
                                        <span style={{
                                          color: '#15803d',
                                          backgroundColor: '#f0fdf4',
                                          border: '1px solid #bbf7d0',
                                          padding: '0.1rem 0.45rem',
                                          borderRadius: '4px',
                                          fontWeight: 700,
                                          fontSize: '0.73rem',
                                        }}>
                                          {currentSubCat}
                                        </span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
