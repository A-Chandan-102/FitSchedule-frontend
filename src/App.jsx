import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Toast from './components/Toast';
import Home from './pages/Home';
import WorkoutPlanner from './pages/WorkoutPlanner';
import MyWorkouts from './pages/MyWorkouts';
import WorkoutDetails from './pages/WorkoutDetails';
import EditWorkout from './pages/EditWorkout';
import WeeklySchedule from './pages/WeeklySchedule';
import ContactTrainer from './pages/ContactTrainer';
import ExerciseDatabase from './pages/ExerciseDatabase';
import TrainerDashboard from './pages/TrainerDashboard';
import AdminPortal from './pages/AdminPortal';
import Login from './pages/Login';
import { workoutApi } from './services/api';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();

  const [plans, setPlans] = useState([]);
  const [activePlan, setActivePlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toasts, setToasts] = useState([]);

  // User auth state with localStorage persistence
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fitschedule_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Tab & path mapping
  const tabToPath = {
    home: '/',
    planner: '/planner',
    'my-workouts': '/my-workouts',
    schedule: '/schedule',
    exercises: '/exercises',
    contact: '/contact',
    'trainer-portal': '/trainer-portal',
    'admin-portal': '/admin-portal',
    'workout-details': '/workout-details',
    'edit-workout': '/edit-workout',
    login: '/login',
  };

  const pathToTab = {
    '/': 'home',
    '/planner': 'planner',
    '/my-workouts': 'my-workouts',
    '/schedule': 'schedule',
    '/exercises': 'exercises',
    '/contact': 'contact',
    '/trainer-portal': 'trainer-portal',
    '/admin-portal': 'admin-portal',
    '/workout-details': 'workout-details',
    '/edit-workout': 'edit-workout',
    '/login': 'login',
  };

  const activeTab = pathToTab[location.pathname] || 'home';

  const handleSetActiveTab = useCallback((tab) => {
    const targetPath = tabToPath[tab] || '/';
    navigate(targetPath);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  // Toast helper
  const addToast = useCallback((message, type = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
  }, []);

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Fetch plans from backend (filtered strictly by currentUser email so accounts never share workouts)
  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      if (!currentUser?.email) {
        setPlans([]);
        setActivePlan(null);
        setLoading(false);
        return;
      }

      const data = await workoutApi.getAllPlans(currentUser.email);
      const userPlans = data || [];
      setPlans(userPlans);
      if (userPlans.length > 0) {
        setActivePlan((prev) => {
          if (prev && userPlans.some((p) => p.id === prev.id)) {
            return prev;
          }
          return userPlans[0];
        });
      } else {
        setActivePlan(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to load workout plans.');
      setPlans([]);
      setActivePlan(null);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.email]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  // Auth handlers
  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setPlans([]);
    setActivePlan(null);
    localStorage.setItem('fitschedule_user', JSON.stringify(user));
    addToast(`Welcome back, ${user.fullName}!`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setPlans([]);
    setActivePlan(null);
    localStorage.removeItem('fitschedule_user');
    addToast('You have been signed out.', 'info');
    navigate('/');
  };

  const handleUpdateUser = (updatedUser) => {
    setCurrentUser(updatedUser);
    localStorage.setItem('fitschedule_user', JSON.stringify(updatedUser));
    addToast(`Username successfully changed to "${updatedUser.fullName}"!`, 'success');
  };

  // CRUD Handlers
  const handlePlanSaved = (newPlan) => {
    setPlans((prev) => [newPlan, ...prev]);
    setActivePlan(newPlan);
    addToast(`"${newPlan.title}" successfully saved!`, 'success');
  };

  const handleDeletePlan = async (id) => {
    try {
      await workoutApi.deletePlan(id);
      setPlans((prev) => prev.filter((p) => p.id !== id));
      if (activePlan?.id === id) {
        setActivePlan(null);
      }
      addToast('Workout plan deleted successfully from MySQL.', 'info');
    } catch (err) {
      addToast(err.message || 'Failed to delete plan.', 'error');
    }
  };

  const handleUpdateSuccess = (updatedPlan) => {
    setPlans((prev) => prev.map((p) => (p.id === updatedPlan.id ? updatedPlan : p)));
    setActivePlan(updatedPlan);
    addToast('Plan updated successfully!', 'success');
    navigate('/workout-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (plan) => {
    setActivePlan(plan);
    navigate('/workout-details');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleEditPlan = (plan) => {
    setActivePlan(plan);
    navigate('/edit-workout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewSchedule = (plan) => {
    if (plan) setActivePlan(plan);
    navigate('/schedule');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSetActiveTab}
        planCount={plans.length}
        currentUser={currentUser}
        onLogout={handleLogout}
        onUpdateUser={handleUpdateUser}
      />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <Home
                setActiveTab={handleSetActiveTab}
                onSelectPlan={setActivePlan}
                plans={plans}
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/planner"
            element={
              <WorkoutPlanner
                currentUser={currentUser}
                onPlanSaved={handlePlanSaved}
                setActiveTab={handleSetActiveTab}
              />
            }
          />
          <Route
            path="/my-workouts"
            element={
              <MyWorkouts
                plans={plans}
                loading={loading}
                error={error}
                onRefresh={fetchPlans}
                onDeletePlan={handleDeletePlan}
                onViewDetails={handleViewDetails}
                onEditPlan={handleEditPlan}
                onViewSchedule={handleViewSchedule}
                setActiveTab={handleSetActiveTab}
              />
            }
          />
          <Route
            path="/workout-details"
            element={
              <WorkoutDetails
                plan={activePlan}
                onBack={() => handleSetActiveTab('my-workouts')}
                onEdit={handleEditPlan}
                onViewSchedule={handleViewSchedule}
              />
            }
          />
          <Route
            path="/edit-workout"
            element={
              <EditWorkout
                plan={activePlan}
                onCancel={() => handleSetActiveTab('workout-details')}
                onSaveSuccess={handleUpdateSuccess}
              />
            }
          />
          <Route
            path="/schedule"
            element={
              <WeeklySchedule
                plans={plans}
                activePlan={activePlan}
                onSelectPlan={setActivePlan}
                onEditPlan={handleEditPlan}
                setActiveTab={handleSetActiveTab}
              />
            }
          />
          <Route
            path="/exercises"
            element={
              <ExerciseDatabase
                setActiveTab={handleSetActiveTab}
              />
            }
          />
          <Route
            path="/contact"
            element={
              <ContactTrainer
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/trainer-portal"
            element={
              <TrainerDashboard
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/admin-portal"
            element={
              <AdminPortal
                currentUser={currentUser}
              />
            }
          />
          <Route
            path="/login"
            element={
              <Login
                currentUser={currentUser}
                onAuthSuccess={handleAuthSuccess}
                onLogout={handleLogout}
                setActiveTab={handleSetActiveTab}
              />
            }
          />
          {/* Fallback to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer setActiveTab={handleSetActiveTab} />

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </>
  );
}
