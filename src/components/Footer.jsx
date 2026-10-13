import React from 'react';

export default function Footer({ setActiveTab }) {
  return (
    <footer style={{
      backgroundColor: '#ffffff',
      borderTop: '1px solid var(--border-light)',
      padding: '3rem 0 2rem 0',
      color: 'var(--text-muted)',
      fontSize: '0.9rem',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Brand Info */}
          <div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.85rem',
            }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                Fit<span style={{ color: '#16a34a' }}>Schedule</span>
              </span>
            </div>
            <p style={{ lineHeight: 1.6, color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Your Goals. Your Training. Your Schedule. A rule-based custom workout planner engineered for balanced progression and real-life adherence.
            </p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <span className="badge badge-lime">Spring Boot 4</span>
              <span className="badge badge-cyan">React 19</span>
              <span className="badge badge-muted">MySQL 8.0</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1rem' }}>Platform</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button onClick={() => { setActiveTab('home'); window.scrollTo(0,0); }} style={{ color: 'var(--text-muted)' }}>
                  Home & Overview
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('planner'); window.scrollTo(0,0); }} style={{ color: 'var(--text-muted)' }}>
                  Workout Planner
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('my-workouts'); window.scrollTo(0,0); }} style={{ color: 'var(--text-muted)' }}>
                  My Saved Workouts
                </button>
              </li>
              <li>
                <button onClick={() => { setActiveTab('schedule'); window.scrollTo(0,0); }} style={{ color: 'var(--text-muted)' }}>
                  Weekly Schedule
                </button>
              </li>
            </ul>
          </div>

          {/* Support & Coaching */}
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1rem' }}>Support & Trainers</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <li>
                <button onClick={() => { setActiveTab('contact'); window.scrollTo(0,0); }} style={{ color: 'var(--text-muted)' }}>
                  Contact a Trainer
                </button>
              </li>
              <li>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  Response turnaround: within 24-48 business hours.
                </span>
              </li>
              <li>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  Database-backed inquiry management.
                </span>
              </li>
            </ul>
          </div>

          {/* Architecture */}
          <div>
            <h4 style={{ color: '#0f172a', marginBottom: '1rem', fontSize: '1rem' }}>Architecture</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
              Engineered with clean RESTful architecture, relational JPA persistence, and rule-based scheduling logic for fitness progression.
            </p>
          </div>
        </div>

        {/* Bottom copyright */}
        <div style={{
          borderTop: '1px solid var(--border-light)',
          paddingTop: '1.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.82rem',
          color: 'var(--text-dim)',
        }}>
          <div>
            &copy; {new Date().getFullYear()} FitSchedule System. All rights reserved.
          </div>
          <div>
            Personalized Workout Planning & Scheduling
          </div>
        </div>
      </div>
    </footer>
  );
}
