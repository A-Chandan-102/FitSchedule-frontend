import React from 'react';
import InteractiveBackground from '../components/InteractiveBackground';

export default function Home({ setActiveTab, onSelectPlan, plans = [], currentUser }) {
  // Demo schedule days for the landing page preview
  const demoSchedule = [
    { day: 'Mon', type: 'training', title: 'Upper Body Power', focus: 'Chest & Back', sets: '16 sets', duration: '60 min' },
    { day: 'Tue', type: 'training', title: 'Lower Body Strength', focus: 'Quads & Glutes', sets: '15 sets', duration: '60 min' },
    { day: 'Wed', type: 'rest', title: 'Active Recovery', focus: 'Mobility & Stretching', sets: '-', duration: 'Rest' },
    { day: 'Thu', type: 'training', title: 'Upper Hypertrophy', focus: 'Shoulders & Arms', sets: '18 sets', duration: '60 min' },
    { day: 'Fri', type: 'training', title: 'Lower & Core', focus: 'Hamstrings & Abs', sets: '15 sets', duration: '60 min' },
    { day: 'Sat', type: 'rest', title: 'Cardio & Walk', focus: 'Zone 2 / Rest', sets: '-', duration: 'Rest' },
    { day: 'Sun', type: 'rest', title: 'Full Rest', focus: 'Full Restoration', sets: '-', duration: 'Rest' },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '5rem 0 4rem 0',
        textAlign: 'center',
        position: 'relative',
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
      }}>
        {/* Living interactive light-themed canvas */}
        <InteractiveBackground />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          {/* Tagline Badge */}
          <div style={{ display: 'inline-flex', marginBottom: '1.5rem' }}>
            <span className="badge badge-lime" style={{ padding: '0.45rem 1rem', fontSize: '0.85rem' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#16a34a', display: 'inline-block' }}></span>
              Personalized Workout Planning & Scheduling
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
            fontWeight: 800,
            letterSpacing: '-0.03em',
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto',
            lineHeight: 1.15,
            color: '#0f172a',
          }}>
            Your Goals. Your Training.{' '}
            <span style={{ color: '#16a34a' }}>Your Schedule.</span>
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-muted)',
            maxWidth: '680px',
            margin: '0 auto 2.5rem auto',
            lineHeight: 1.6,
          }}>
            FitSchedule builds intelligent, rule-based training plans tailored precisely to your fitness goals, experience level, available equipment, and preferred weekly days.
          </p>

          {/* Action Buttons */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '1rem',
            marginBottom: '3.5rem',
          }}>
            <button
              className="btn btn-primary btn-lg"
              onClick={() => {
                if (!currentUser) {
                  setActiveTab('login');
                } else {
                  setActiveTab('planner');
                }
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Build My Workout Plan
            </button>

            <button
              className="btn btn-secondary btn-lg"
              onClick={() => {
                const target = document.getElementById('features-section');
                if (target) target.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Explore Features
            </button>
          </div>

          {/* Key Metric Highlights */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1rem',
            maxWidth: '820px',
            margin: '0 auto',
          }}>
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#16a34a' }}>2 – 6 Days</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Flexible Weekly Splits</div>
            </div>
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7' }}>4 Expert Coaches</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Certified Trainer Inquiries</div>
            </div>
            <div className="card" style={{ padding: '1.25rem', backgroundColor: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706' }}>80+ Exercises</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Targeted Muscle Library</div>
            </div>
          </div>
        </div>
      </section>

      {/* Weekly Schedule Interactive Demo Preview */}
      <section style={{ padding: '3.5rem 0', backgroundColor: '#f1f5f9' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <span className="badge badge-cyan" style={{ marginBottom: '0.75rem' }}>Live Preview</span>
            <h2 className="section-title">Interactive Weekly Schedule Preview</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              See how FitSchedule maps your selected training days and automatically balances muscle recovery throughout the week.
            </p>
          </div>

          {/* Schedule Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '0.85rem',
            marginBottom: '1.75rem',
          }}>
            {demoSchedule.map((item, index) => {
              const isTraining = item.type === 'training';
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '1.15rem 0.95rem',
                    textAlign: 'left',
                    borderColor: isTraining ? '#bbf7d0' : '#e2e8f0',
                    backgroundColor: isTraining ? '#ffffff' : '#f8fafc',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {isTraining && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '3px',
                      backgroundColor: '#16a34a',
                    }}></div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{item.day}</span>
                    <span className={`badge ${isTraining ? 'badge-lime' : 'badge-muted'}`} style={{ fontSize: '0.68rem' }}>
                      {item.duration}
                    </span>
                  </div>

                  <h4 style={{
                    fontSize: '0.92rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    color: isTraining ? '#0f172a' : '#64748b',
                  }}>
                    {item.title}
                  </h4>

                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.65rem' }}>
                    {item.focus}
                  </div>

                  {isTraining ? (
                    <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>
                      ⚡ {item.sets} planned
                    </div>
                  ) : (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      💤 Rest & recovery
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="btn btn-outline-lime"
              onClick={() => setActiveTab('schedule')}
            >
              Open Full Weekly Schedule View &rarr;
            </button>
          </div>
        </div>
      </section>

      {/* Feature Sections */}
      <section id="features-section" style={{ padding: '5rem 0', backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <span className="badge badge-lime" style={{ marginBottom: '0.75rem' }}>Core Capabilities</span>
            <h2 className="section-title">Engineered for Results & Real Schedules</h2>
            <p className="section-subtitle" style={{ margin: '0 auto' }}>
              Everything you need to structure your weekly fitness journey without guesswork or rigid templates.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.75rem',
          }}>
            {/* Feature 1 */}
            <div className="card card-hover">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Personalized Plan Generation</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Rule-based algorithmic exercise pairing based on muscle synergy, fatigue management, and your chosen fitness goal (Muscle gain, Fat loss, Strength, Endurance).
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card card-hover">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Flexible Weekly Scheduling</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Train on your terms. Select exactly which days of the week you can train (from 2 up to 6 days). FitSchedule balances training days with crucial recovery periods.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card card-hover">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 5v14M18 5v14M2 9v6M22 9v6M6 12h12" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Equipment-Based Customization</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Whether you have a commercial gym, a pair of dumbbells at home, resistance bands, or only bodyweight, the system filters out impossible movements automatically.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card card-hover">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#ede9fe',
                color: '#7c3aed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Saved Workout Plans & Full CRUD</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Persist multiple training routines in MySQL. Inspect exercise details, edit target sets/reps, customize day structures, or remove obsolete programs at any time.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card card-hover">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#fee2e2',
                color: '#dc2626',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Direct Trainer Inquiries</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Need expert advice on lifting form, split selection, or progressive overload? Submit your questions to certified trainers with real database tracking.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card card-hover">
              <div style={{
                width: '46px',
                height: '46px',
                borderRadius: '12px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.65rem' }}>Session Duration Optimization</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: 1.6 }}>
                Choose between 30, 45, 60, or 90 minutes. Exercise counts and rest intervals are scaled accurately so you finish your session within your actual time budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section style={{ padding: '3.5rem 0 5rem 0' }}>
        <div className="container">
          <div className="card" style={{
            backgroundColor: '#ffffff',
            borderColor: '#bbf7d0',
            borderRadius: 'var(--radius-xl)',
            padding: '3.5rem 2.5rem',
            textAlign: 'center',
            boxShadow: 'var(--shadow-md)',
          }}>
            <h2 style={{ fontSize: '2.3rem', marginBottom: '1rem', fontWeight: 800, color: '#0f172a' }}>
              Ready to Transform Your Workout Routine?
            </h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 2rem auto', fontSize: '1.05rem' }}>
              Generate your personalized training plan in seconds. No credit cards or complicated setup required.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setActiveTab('planner')}
              >
                Build My Workout Plan Now &rarr;
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => setActiveTab('contact')}
              >
                Ask a Trainer
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
