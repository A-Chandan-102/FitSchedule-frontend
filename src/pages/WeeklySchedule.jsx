import React, { useState } from 'react';

export default function WeeklySchedule({ plans, activePlan, onSelectPlan, onEditPlan, setActiveTab }) {
  const [selectedDayModal, setSelectedDayModal] = useState(null);

  const currentPlan = activePlan || (plans.length > 0 ? plans[0] : null);

  const handleDownloadTimetable = () => {
    if (!currentPlan) return;
    const fileName = `${currentPlan.title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Weekly_Timetable.html`;

    const daysHtml = (currentPlan.days || []).map((day) => {
      const isRest = day.isRestDay;
      const exercisesRows = (day.exercises || []).map((ex, i) => `
        <tr>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; color: #0f172a;">${i + 1}. ${ex.exerciseName}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #0284c7; font-weight: 600;">${ex.subCategory || ex.muscleGroup || '-'}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 700; color: #16a34a; text-align: center;">${ex.sets}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-weight: 600; text-align: center;">${ex.reps}</td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; color: #64748b; font-size: 0.85em;">${ex.notes || 'Strict execution and progressive overload'}</td>
        </tr>
      `).join('');

      return `
        <div style="margin-bottom: 24px; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background: #ffffff; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
          <div style="background: ${isRest ? '#f8fafc' : '#dcfce7'}; padding: 14px 20px; border-bottom: 1px solid #cbd5e1; display: flex; justify-content: space-between; align-items: center;">
            <div>
              <h3 style="margin: 0; color: ${isRest ? '#64748b' : '#15803d'}; font-size: 1.2rem; font-weight: 800;">${day.dayOfWeek} &bull; ${day.title}</h3>
              <p style="margin: 4px 0 0 0; color: #64748b; font-size: 0.9rem;">Focus: ${day.focus}</p>
            </div>
            <span style="background: ${isRest ? '#e2e8f0' : '#16a34a'}; color: ${isRest ? '#475569' : '#ffffff'}; padding: 4px 12px; border-radius: 6px; font-weight: 700; font-size: 0.85rem;">
              ${isRest ? 'Rest' : day.estimatedDuration + ' mins'}
            </span>
          </div>
          ${!isRest && day.exercises && day.exercises.length > 0 ? `
            <table style="width: 100%; border-collapse: collapse; font-size: 0.92rem; text-align: left;">
              <thead>
                <tr style="background: #f8fafc; color: #475569; border-bottom: 2px solid #e2e8f0;">
                  <th style="padding: 10px 14px;">Movement</th>
                  <th style="padding: 10px 14px;">Target Muscle</th>
                  <th style="padding: 10px 14px; text-align: center;">Sets</th>
                  <th style="padding: 10px 14px; text-align: center;">Reps / Time</th>
                  <th style="padding: 10px 14px;">Coaching Notes</th>
                </tr>
              </thead>
              <tbody>
                ${exercisesRows}
              </tbody>
            </table>
          ` : `
            <div style="padding: 16px 20px; color: #64748b; font-size: 0.92rem; font-style: italic;">
              Rest & Active Recovery day. Focus on light mobility, hydration, and nutritional restoration.
            </div>
          `}
        </div>
      `;
    }).join('');

    const docHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${currentPlan.title} - Weekly Timetable</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; background: #f8fafc; color: #0f172a; margin: 0; padding: 36px 20px; }
    .container { max-width: 940px; margin: 0 auto; }
    .header { text-align: center; margin-bottom: 30px; padding-bottom: 24px; border-bottom: 2px solid #e2e8f0; }
    .title { font-size: 2.2rem; font-weight: 800; color: #0f172a; margin: 0 0 10px 0; }
    .subtitle { color: #64748b; font-size: 1.05rem; margin: 0; }
    .badge-bar { display: flex; justify-content: center; gap: 10px; margin-top: 14px; flex-wrap: wrap; }
    .badge { padding: 5px 12px; border-radius: 6px; font-size: 0.85rem; font-weight: 600; background: #e2e8f0; color: #334155; }
    .print-btn { background: #16a34a; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 700; cursor: pointer; margin-bottom: 20px; display: inline-flex; align-items: center; gap: 8px; font-size: 0.95rem; }
    @media print { .print-btn { display: none; } body { padding: 0; background: #ffffff; } }
  </style>
</head>
<body>
  <div class="container">
    <button class="print-btn" onclick="window.print()">🖨️ Print Timetable / Save to PDF</button>
    <div class="header">
      <h1 class="title">${currentPlan.title}</h1>
      <p class="subtitle">Official Weekly Training Timetable Document</p>
      <div class="badge-bar">
        <span class="badge" style="background: #dcfce7; color: #15803d;">Goal: ${currentPlan.fitnessGoal}</span>
        <span class="badge" style="background: #e0f2fe; color: #0369a1;">Split: ${currentPlan.trainingSplit}</span>
        <span class="badge">Session: ${currentPlan.workoutDuration} mins</span>
        <span class="badge">Equipment: ${currentPlan.equipment}</span>
      </div>
    </div>
    ${daysHtml}
    <div style="text-align: center; margin-top: 36px; color: #94a3b8; font-size: 0.88rem;">
      Generated by FitSchedule &bull; ${new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([docHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem' }}>
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
          <span className="badge badge-lime" style={{ marginBottom: '0.45rem' }}>Weekly Training Calendar</span>
          <h1 className="section-title">Weekly Schedule</h1>
          <p className="section-subtitle">
            Visual day-by-day layout reflecting your active program and rest distribution.
          </p>
        </div>

        {/* Plan Switcher Dropdown */}
        {plans.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <label style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Active Plan:</label>
            <select
              className="form-control"
              style={{ minWidth: '220px', padding: '0.55rem 0.85rem' }}
              value={currentPlan?.id || ''}
              onChange={(e) => {
                const found = plans.find((p) => p.id === parseInt(e.target.value));
                if (found) onSelectPlan(found);
              }}
            >
              {plans.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* If No Plans Saved */}
      {(!currentPlan || !currentPlan.days || currentPlan.days.length === 0) ? (
        <div className="card" style={{ textAlign: 'center', padding: '4rem 2rem', maxWidth: '600px', margin: '2rem auto', backgroundColor: '#ffffff' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem', color: '#0f172a' }}>No Active Schedule Found</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Generate and save a personalized workout plan to populate your weekly calendar.
          </p>
          <button className="btn btn-primary" onClick={() => setActiveTab('planner')}>
            Build My Workout Plan &rarr;
          </button>
        </div>
      ) : (
        <>
          {/* Plan Info Strip */}
          <div className="card" style={{
            padding: '1.25rem 1.75rem',
            marginBottom: '2rem',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '1rem',
            backgroundColor: '#ffffff',
          }}>
            <div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>{currentPlan.title}</div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.35rem', flexWrap: 'wrap' }}>
                <span className="badge badge-lime">{currentPlan.fitnessGoal}</span>
                <span className="badge badge-cyan">{currentPlan.trainingSplit}</span>
                <span className="badge badge-muted">⏱ {currentPlan.workoutDuration} min/session</span>
                <span className="badge badge-muted">🏋️ {currentPlan.equipment}</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleDownloadTimetable}
                style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}
                title="Download weekly schedule timetable document to your device"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                Download Timetable
              </button>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onEditPlan(currentPlan)}
              >
                ✏️ Modify Schedule
              </button>
            </div>
          </div>

          {/* 7-Day Calendar Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1.25rem',
            marginBottom: '3rem',
          }}>
            {currentPlan.days.map((day, idx) => {
              const isTraining = !day.isRestDay;
              const exerciseCount = day.exercises?.length || 0;

              return (
                <div
                  key={idx}
                  className="card card-hover"
                  onClick={() => setSelectedDayModal(day)}
                  style={{
                    padding: '1.5rem',
                    cursor: 'pointer',
                    borderColor: isTraining ? '#bbf7d0' : 'var(--border-light)',
                    backgroundColor: isTraining ? '#ffffff' : '#f8fafc',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Accent Top Border */}
                  {isTraining && (
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: '4px',
                      backgroundColor: '#16a34a',
                    }}></div>
                  )}

                  {/* Day Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                      {day.dayOfWeek}
                    </div>
                    <span className={`badge ${isTraining ? 'badge-lime' : 'badge-muted'}`} style={{ fontSize: '0.72rem' }}>
                      {isTraining ? `${day.estimatedDuration} mins` : 'Rest Day'}
                    </span>
                  </div>

                  {/* Focus Title */}
                  <h3 style={{
                    fontSize: '1rem',
                    fontWeight: 700,
                    marginBottom: '0.35rem',
                    color: isTraining ? '#0f172a' : '#64748b',
                  }}>
                    {day.title}
                  </h3>

                  <p style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-muted)',
                    marginBottom: '1rem',
                    lineHeight: 1.4,
                  }}>
                    {day.focus}
                  </p>

                  {/* Exercise Preview List */}
                  {isTraining && day.exercises && (
                    <div style={{
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.85rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.45rem',
                    }}>
                      {day.exercises.slice(0, 4).map((ex, eIdx) => (
                        <div
                          key={eIdx}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.8rem',
                          }}
                        >
                          <span style={{
                            color: '#0f172a',
                            fontWeight: 500,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '170px',
                          }}>
                            {ex.exerciseName}
                          </span>
                          <span style={{ color: '#15803d', fontWeight: 600 }}>
                            {ex.sets} × {ex.reps}
                          </span>
                        </div>
                      ))}

                      {exerciseCount > 4 && (
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                          + {exerciseCount - 4} more exercises...
                        </div>
                      )}
                    </div>
                  )}

                  {!isTraining && (
                    <div style={{
                      borderTop: '1px solid var(--border-light)',
                      paddingTop: '0.85rem',
                      fontSize: '0.82rem',
                      color: 'var(--text-dim)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}>
                      <span>💤 Recovery & muscle rebuilding</span>
                    </div>
                  )}

                  <div style={{
                    marginTop: '1.25rem',
                    textAlign: 'right',
                    fontSize: '0.78rem',
                    color: isTraining ? '#15803d' : 'var(--text-dim)',
                    fontWeight: 600,
                  }}>
                    Click to view full details &rarr;
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Day Inspection Modal */}
      {selectedDayModal && (
        <div className="modal-overlay" onClick={() => setSelectedDayModal(null)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '650px', backgroundColor: '#ffffff' }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '1.25rem',
              borderBottom: '1px solid var(--border-light)',
              paddingBottom: '1rem',
            }}>
              <div>
                <span className="badge badge-lime">{selectedDayModal.dayOfWeek}</span>
                <h2 style={{ fontSize: '1.45rem', fontWeight: 800, marginTop: '0.35rem', color: '#0f172a' }}>
                  {selectedDayModal.title}
                </h2>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Focus: {selectedDayModal.focus}
                </div>
              </div>

              <span className={`badge ${selectedDayModal.isRestDay ? 'badge-muted' : 'badge-lime'}`}>
                {selectedDayModal.isRestDay ? 'Rest' : `${selectedDayModal.estimatedDuration} mins`}
              </span>
            </div>

            {selectedDayModal.isRestDay ? (
              <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💤</div>
                <h4 style={{ fontSize: '1.15rem', marginBottom: '0.45rem', color: '#0f172a' }}>Rest & Active Recovery</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
                  Optimal recovery accelerates hypertrophy and neural adaptation. Ensure sufficient protein intake, adequate hydration, and restorative sleep.
                </p>
              </div>
            ) : selectedDayModal.exercises && (
              <div style={{ maxHeight: '380px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.86rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid var(--border-medium)', color: '#475569', textAlign: 'left' }}>
                      <th style={{ padding: '0.5rem' }}>Exercise</th>
                      <th style={{ padding: '0.5rem' }}>Muscle</th>
                      <th style={{ padding: '0.5rem' }}>Sets</th>
                      <th style={{ padding: '0.5rem' }}>Reps</th>
                      <th style={{ padding: '0.5rem' }}>Rest</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedDayModal.exercises.map((ex, i) => (
                      <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#0f172a' }}>{ex.exerciseName}</td>
                        <td style={{ padding: '0.65rem 0.5rem' }}>
                          <span className="badge badge-cyan" style={{ fontSize: '0.68rem' }}>{ex.muscleGroup}</span>
                        </td>
                        <td style={{ padding: '0.65rem 0.5rem', fontWeight: 700, color: '#15803d' }}>{ex.sets}</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: '#0f172a' }}>{ex.reps}</td>
                        <td style={{ padding: '0.65rem 0.5rem', color: 'var(--text-muted)' }}>{ex.restSeconds}s</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            <div style={{ marginTop: '1.75rem', textAlign: 'right' }}>
              <button className="btn btn-secondary" onClick={() => setSelectedDayModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
