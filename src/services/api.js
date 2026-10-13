const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      let errorMessage = 'An error occurred while processing your request.';
      if (data) {
        if (data.fieldErrors) {
          errorMessage = Object.values(data.fieldErrors).join('. ');
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        }
      }
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to the FitSchedule backend server. Please verify Spring Boot is running on port 8080.');
    }
    throw error;
  }
}

export const authApi = {
  login: (credentials) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),

  register: (userData) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  }),

  updateUsername: (email, newUsername) => request('/auth/update-username', {
    method: 'PUT',
    body: JSON.stringify({ email, newUsername }),
  }),

  updateEmail: (currentEmail, newEmail) => request('/auth/update-email', {
    method: 'PUT',
    body: JSON.stringify({ currentEmail, newEmail }),
  }),

  // Admin-only trainer management
  addTrainer: (adminEmail, trainerData) => request('/auth/admin/trainers', {
    method: 'POST',
    headers: { 'X-Admin-Email': adminEmail },
    body: JSON.stringify(trainerData),
  }),

  removeTrainer: (adminEmail, trainerId) => request(`/auth/admin/trainers/${trainerId}`, {
    method: 'DELETE',
    headers: { 'X-Admin-Email': adminEmail },
  }),

  getAdminTrainers: (adminEmail) => request('/auth/admin/trainers', {
    method: 'GET',
    headers: { 'X-Admin-Email': adminEmail },
  }),
};

export const workoutApi = {
  generatePlan: (params) => request('/workouts/generate', {
    method: 'POST',
    body: JSON.stringify(params),
  }),

  savePlan: (plan) => request('/workouts', {
    method: 'POST',
    body: JSON.stringify(plan),
  }),

  getAllPlans: (userEmail) => {
    const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : '';
    return request(`/workouts${query}`, {
      method: 'GET',
    });
  },

  getPlanById: (id) => request(`/workouts/${id}`, {
    method: 'GET',
  }),

  updatePlan: (id, plan) => request(`/workouts/${id}`, {
    method: 'PUT',
    body: JSON.stringify(plan),
  }),

  deletePlan: (id) => request(`/workouts/${id}`, {
    method: 'DELETE',
  }),
};

export const exerciseApi = {
  getExercises: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.muscleGroup && filters.muscleGroup !== 'All') {
      params.append('muscleGroup', filters.muscleGroup);
    }
    if (filters.equipment && filters.equipment !== 'All') {
      params.append('equipment', filters.equipment);
    }
    const query = params.toString();
    return request(`/exercises${query ? `?${query}` : ''}`, {
      method: 'GET',
    });
  },

  getExerciseById: (id) => request(`/exercises/${id}`, {
    method: 'GET',
  }),
};

export const trainerApi = {
  getTrainers: () => request('/trainers', {
    method: 'GET',
  }),

  getTrainerById: (id) => request(`/trainers/${id}`, {
    method: 'GET',
  }),

  submitInquiry: (inquiry) => request('/trainer-inquiries', {
    method: 'POST',
    body: JSON.stringify(inquiry),
  }),

  getAllInquiries: () => request('/trainer-inquiries', {
    method: 'GET',
  }),

  updateStatus: (id, status) => request(`/trainer-inquiries/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  }),
};
