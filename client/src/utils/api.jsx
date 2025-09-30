import axios from "axios";

// Base API URL - change this for production
// eslint-disable-next-line no-undef
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://exam-portal-40mc.onrender.com/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - logout user
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============ AUTH API CALLS ============

export const authAPI = {
  // Register new user
  register: async (userData) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // Login user
  login: async (credentials) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },
};

// ============ EXAM API CALLS ============

export const examAPI = {
  // Get all exams
  getAllExams: async () => {
    const response = await api.get("/exams");
    return response.data;
  },

  // Get single exam by ID
  getExamById: async (examId) => {
    const response = await api.get(`/exams/${examId}`);
    return response.data;
  },

  // Create new exam (admin only)
  createExam: async (examData) => {
    const response = await api.post("/exams", examData);
    return response.data;
  },

  // Update exam (admin only)
  updateExam: async (examId, examData) => {
    const response = await api.put(`/exams/${examId}`, examData);
    return response.data;
  },

  // Delete exam (admin only)
  deleteExam: async (examId) => {
    const response = await api.delete(`/exams/${examId}`);
    return response.data;
  },
};

// ============ RESULT API CALLS ============

export const resultAPI = {
  // Submit exam answers
  submitExam: async (examId, answers) => {
    const response = await api.post("/results/submit", {
      examId,
      answers,
    });
    return response.data;
  },

  // Get my results (student)
  getMyResults: async () => {
    const response = await api.get("/results/my-results");
    return response.data;
  },

  // Get all results (admin only)
  getAllResults: async () => {
    const response = await api.get("/results/all");
    return response.data;
  },
};

export default api;
