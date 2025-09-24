import axios from 'axios';
import { User, StudyRule, StudyMode, UsageReportsResponse, GameScore } from '../types';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await api.post('/login', { username, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/logout');
    return response.data;
  },
  
  register: async (username: string, email: string, password: string, role: string) => {
    const response = await api.post('/register', { username, email, password, role });
    return response.data;
  },
};

// Study Mode API
export const studyModeAPI = {
  get: async (): Promise<StudyMode> => {
    const response = await api.get('/study-mode');
    return response.data;
  },
  
  update: async (data: Partial<StudyMode>) => {
    const response = await api.post('/study-mode', data);
    return response.data;
  },
};

// Rules API
export const rulesAPI = {
  get: async (): Promise<StudyRule[]> => {
    const response = await api.get('/rules');
    return response.data;
  },
  
  create: async (rule: Omit<StudyRule, 'id'>) => {
    const response = await api.post('/rules', rule);
    return response.data;
  },
  
  delete: async (id: number) => {
    const response = await api.delete(`/rules?id=${id}`);
    return response.data;
  },
};

// Usage Reports API
export const usageReportsAPI = {
  get: async (days: number = 7): Promise<UsageReportsResponse> => {
    const response = await api.get(`/usage-reports?days=${days}`);
    return response.data;
  },
};

// Game Scores API
export const gameScoresAPI = {
  get: async (): Promise<GameScore[]> => {
    const response = await api.get('/game-scores');
    return response.data;
  },
  
  create: async (score: Omit<GameScore, 'played_at'>) => {
    const response = await api.post('/game-scores', score);
    return response.data;
  },
};

export default api;