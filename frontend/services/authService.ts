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
    token?: string; // Add token to User interface
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
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(`${API_URL}/register`, data);
        if (response.data.id && response.data.token) {
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

    setCurrentUser: (user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
    },

    updateProfile: async (data: UpdateProfileData): Promise<AuthResponse> => {
        const response = await api.put<AuthResponse>('/users/profile', data);

        if (response.data) {
            const currentUserStr = localStorage.getItem('user');
            if (currentUserStr) {
                const currentUser = JSON.parse(currentUserStr);
                // Preserve the token while updating user info
                const updatedUser = {
                    ...response.data,
                    token: currentUser.token
                };
                localStorage.setItem('user', JSON.stringify(updatedUser));
            }
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
            const token = localStorage.getItem('token') || authService.getCurrentUser()?.token;
            const userWithToken = { ...response.data, token };
            localStorage.setItem('user', JSON.stringify(userWithToken));
            return userWithToken;
        }
        throw new Error('User profile could not be fetched');
    },

    setToken: (token: string) => {
        // Create a temporary user object with token to satisfy auth checks until full profile is fetched
        const tempUser = { token };
        // We can also store token in a separate key if api interceptor uses it
        localStorage.setItem('user', JSON.stringify(tempUser));
    }
};
