import api from './api';

const API_URL = '/auth'; // api instance has base URL

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    id: string;
    email: string;
    fullName: string;
    role: string;
    message: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${API_URL}/login`, credentials);
        if (response.data.id) {
            // response.data hem user bilgileri hem token içeriyor
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${API_URL}/register`, data);
        if (response.data.id) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    },

    getCurrentUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    updateProfile: async (fullName: string, email: string): Promise<AuthResponse> => {
        const response = await api.put<AuthResponse>('/users/profile', { fullName, email });
        // Update local storage with new info
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.post('/users/change-password', { currentPassword, newPassword });
    }
};
