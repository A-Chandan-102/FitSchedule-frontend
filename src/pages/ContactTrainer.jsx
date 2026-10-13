import React, { useState, useEffect } from 'react';
import { trainerApi } from '../services/api';

const INTEREST_AREAS = [
  'Muscle hypertrophy & physique development',
  'Fat loss & metabolic conditioning',
  'Strength development & powerlifting',
  'Injury prevention & mobility',
  'Workout split optimization',
  'Beginner form check & technique advice',
];

export default function ContactTrainer({ currentUser }) {
  const [trainers, setTrainers] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [loadingTrainers, setLoadingTrainers] = useState(true);

  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    fitnessGoal: 'Muscle hypertrophy & physique development',
    message: '',
    trainerId: null,
    trainerName: '',
  });

  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState('');
  const [submittedInquiry, setSubmittedInquiry] = useState(null);

  // Sync user if logged in
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        fullName: prev.fullName || currentUser.fullName,
        email: prev.email || currentUser.email,
      }));
    }
  }, [currentUser]);

  // Load trainers from backend
  useEffect(() => {
    async function fetchTrainers() {
      try {
        setLoadingTrainers(true);
        const data = await trainerApi.getTrainers();
        setTrainers(data || []);
      } catch (err) {
        console.error('Failed to load trainers:', err);
      } finally {
        setLoadingTrainers(false);
      }
    }
    fetchTrainers();
  }, []);

  const handleSelectTrainer = (trainer) => {
    setSelectedTrainer(trainer);
    setFormData((prev) => ({
      ...prev,
      trainerId: trainer ? trainer.id : null,
      trainerName: trainer ? trainer.name : '',
    }));
    // Smooth scroll down to form
    const formEl = document.getElementById('inquiry-form-section');
    if (formEl) formEl.scrollIntoView({ behavior: 'smooth' });
  };

  const validate = () => {
    const errors = {};
    if (!formData.trainerId && !selectedTrainer) {
      errors.trainerId = 'Please select a coach or trainer from the list.';
    }

    if (!formData.message.trim()) {
      errors.message = 'Message or question is required.';
    } else if (formData.message.trim().length < 5) {
      errors.message = 'Please provide at least 5 characters detailing your message.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');
    const errors = validate();
    setFieldErrors(errors);

    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      setIsSubmitting(true);
      const result = await trainerApi.submitInquiry(formData);
      setSubmittedInquiry(result);
      setFormData({
        fullName: currentUser?.fullName || '',
        email: currentUser?.email || '',
        fitnessGoal: 'Muscle hypertrophy & physique development',
        message: '',
        trainerId: selectedTrainer?.id || null,
        trainerName: selectedTrainer?.name || '',
      });
      setFieldErrors({});
    } catch (err) {
      setServerError(err.message || 'Failed to submit inquiry. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: '2.5rem', paddingBottom: '4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="badge badge-lime" style={{ marginBottom: '0.65rem' }}>Personalized Coaching</span>
        <h1 className="section-title">Contact a Certified Trainer</h1>
        <p className="section-subtitle" style={{ margin: '0 auto' }}>
          Meet our certified trainers below, review their specialisations, and send questions directly to your preferred coach.
        </p>
      </div>

      {/* Trainers Directory Section */}
      <div style={{ marginBottom: '3.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>
            Our Coaching Specialists
          </h2>
          {selectedTrainer && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleSelectTrainer(null)}
            >
              Clear Selected Trainer (Ask Any Coach)
            </button>
          )}
        </div>

        {loadingTrainers ? (
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <span className="spinner"></span>
            <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Loading coaching roster...</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem',
          }}>
            {trainers.map((tr) => {
              const isSelected = selectedTrainer?.id === tr.id;
              return (
                <div
                  key={tr.id}
                  className="card card-hover"
                  style={{
                    padding: '1.5rem',
                    backgroundColor: '#ffffff',
                    borderColor: isSelected ? '#16a34a' : 'var(--border-light)',
                    boxShadow: isSelected ? '0 0 0 2px #16a34a' : 'var(--shadow-sm)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    {/* Trainer Avatar & Rating */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <img
                        src={tr.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={tr.name}
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          border: '2px solid #bbf7d0',
                        }}
                      />
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                          {tr.name}
                        </h3>
                        <div style={{ fontSize: '0.8rem', color: '#16a34a', fontWeight: 600 }}>
                          ⭐ {tr.rating} &bull; {tr.experienceYears} yrs exp.
                        </div>
                      </div>
                    </div>

                    {/* Specialisation Badge */}
                    <div style={{ marginBottom: '0.85rem' }}>
                      <span className="badge badge-cyan" style={{ fontSize: '0.74rem' }}>
                        {tr.specialization}
                      </span>
                    </div>

                    {/* Bio */}
                    <p style={{
                      color: 'var(--text-muted)',
                      fontSize: '0.86rem',
                      lineHeight: 1.5,
                      marginBottom: '1.25rem',
                    }}>
                      {tr.bio}
                    </p>
                  </div>

                  {/* Select button */}
                  <button
                    type="button"
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-lime'}`}
                    onClick={() => handleSelectTrainer(tr)}
                    style={{ width: '100%' }}
                  >
                    {isSelected ? '✓ Trainer Selected' : `Consult ${tr.name.split(' ')[0]}`}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Inquiry Form Section */}
      <div id="inquiry-form-section" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '2.5rem',
        maxWidth: '1020px',
        margin: '0 auto',
      }}>
        {/* Left Information Card */}
        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
            Submit Your Inquiry
          </h3>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your question will be delivered to our certified coaching desk. Trainers can log into their portal to review your training history and provide customized guidance.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#dcfce7',
                color: '#16a34a',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700,
              }}>
                ✓
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem', color: '#0f172a' }}>Direct Trainer Routing</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>
                  {selectedTrainer
                    ? `Your question will be assigned directly to ${selectedTrainer.name}.`
                    : 'Choose a coach above or let the first available trainer reply.'}
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                backgroundColor: '#e0f2fe',
                color: '#0284c7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                fontWeight: 700,
              }}>
                ✓
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', marginBottom: '0.2rem', color: '#0f172a' }}>Logged in Tracking</h4>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.86rem' }}>
                  Member inquiries are saved in MySQL and can be reviewed anytime through the trainer dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Card */}
        <div className="card" style={{ padding: '2.5rem', backgroundColor: '#ffffff' }}>
          {/* Target Trainer Indicator */}
          {selectedTrainer && (
            <div style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#dcfce7',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              marginBottom: '1.5rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: '#166534', fontWeight: 600, display: 'block' }}>
                  Consulting Dedicated Trainer:
                </span>
                <strong style={{ color: '#15803d', fontSize: '0.95rem' }}>
                  {selectedTrainer.name} ({selectedTrainer.specialization})
                </strong>
              </div>
              <button
                type="button"
                onClick={() => handleSelectTrainer(null)}
                style={{ fontSize: '1.1rem', color: '#166534', cursor: 'pointer' }}
                title="Deselect"
              >
                &times;
              </button>
            </div>
          )}

          {/* Success Banner */}
          {submittedInquiry && (
            <div className="alert alert-success" style={{ marginBottom: '1.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, fontSize: '0.98rem' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Inquiry Submitted Successfully
              </div>
              <div style={{ fontSize: '0.92rem', color: '#166534' }}>
                Your inquiry has been submitted successfully. Our trainer team will review your request.
              </div>
              <div style={{ fontSize: '0.8rem', color: '#15803d', marginTop: '0.25rem' }}>
                Reference ID: #{submittedInquiry.id} &bull; Timestamp: {new Date(submittedInquiry.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          )}

          {serverError && (
            <div className="alert alert-error" style={{ marginBottom: '1.5rem' }}>
              <div>{serverError}</div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Trainer Selection Dropdown */}
            <div className="form-group">
              <label className="form-label">Select Trainer *</label>
              <select
                className="form-control"
                value={selectedTrainer ? selectedTrainer.id : ''}
                onChange={(e) => {
                  const tId = Number(e.target.value);
                  const found = trainers.find((t) => t.id === tId) || null;
                  handleSelectTrainer(found);
                }}
              >
                <option value="">-- Choose a Trainer --</option>
                {trainers.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} — {t.specialization} ({t.experienceYears} yrs exp)
                  </option>
                ))}
              </select>
              {fieldErrors.trainerId && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  {fieldErrors.trainerId}
                </div>
              )}
            </div>

            {/* Fitness Goal / Area of Interest */}
            <div className="form-group">
              <label className="form-label">Fitness Goal / Topic *</label>
              <select
                className="form-control"
                value={formData.fitnessGoal}
                onChange={(e) => setFormData({ ...formData, fitnessGoal: e.target.value })}
              >
                {INTEREST_AREAS.map((area, idx) => (
                  <option key={idx} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              {fieldErrors.fitnessGoal && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  {fieldErrors.fitnessGoal}
                </div>
              )}
            </div>

            {/* Message */}
            <div className="form-group">
              <label className="form-label">Message or Question *</label>
              <textarea
                className="form-control"
                placeholder="Describe your current routine, exercise questions, or training hurdles..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{ minHeight: '120px' }}
              />
              {fieldErrors.message && (
                <div style={{ color: 'var(--accent-rose)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                  {fieldErrors.message}
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Submitting to Trainer...
                </>
              ) : selectedTrainer ? (
                `Send Inquiry to ${selectedTrainer.name}`
              ) : (
                'Submit Inquiry'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
