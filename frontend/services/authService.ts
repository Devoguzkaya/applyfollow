import api from './api';

const API_URL = '/auth'; // api instance has base URL

export interface User {
    id: string;
    email: string;
    fullName: string;
    role: string;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    summary?: string;
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface RegisterRequest {
    fullName: string;
    email: string;

    password: string;
    marketDataConsent: boolean;
}

export interface AuthResponse {
    token?: string; // Make token optional in response
    id: string;
    email: string;
    fullName: string;
    role: string;
    message: string;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    summary?: string;
}

export interface UpdateProfileData {
    fullName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    summary?: string;
}

export const authService = {
    login: async (credentials: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${API_URL}/login`, credentials);
        if (response.data.id && response.data.token) {
            localStorage.setItem('token', response.data.token);
            const { token, ...userData } = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${API_URL}/register`, data);
        if (response.data.id && response.data.token) {
            localStorage.setItem('token', response.data.token);
            const { token, ...userData } = response.data;
            localStorage.setItem('user', JSON.stringify(userData));
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    },

    getCurrentUser: (): User | null => {
        if (typeof window === 'undefined') return null;
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    },

    setCurrentUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    updateProfile: async (data: UpdateProfileData): Promise<AuthResponse> => {
        const response = await api.put<AuthResponse>('/users/profile', data);

        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
        await api.post('/users/change-password', { currentPassword, newPassword });
    },

    // OAuth2 Helpers
    fetchUserProfile: async (): Promise<User> => {
        const response = await api.get<AuthResponse>('/users/me');
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
            return response.data;
        }
        throw new Error('User profile could not be fetched');
    },

    setToken: (token: string) => {
        localStorage.setItem('token', token);
    }
};
