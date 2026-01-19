import api from './api';

const SECTION_URL = '/users';

export interface UpdateProfileRequest {
    fullName: string;
    email: string;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    summary?: string;
}

export interface ChangePasswordRequest {
    currentPassword?: string;
    newPassword?: string;
}

export interface AuthResponse {
    token?: string;
    id: string;
    email: string;
    fullName: string;
    role: string;
    message?: string;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    summary?: string;
}

export const userService = {
    updateProfile: async (data: UpdateProfileRequest): Promise<AuthResponse> => {
        const response = await api.put<AuthResponse>(`${SECTION_URL}/profile`, data);
        return response.data;
    },

    getProfile: async (): Promise<AuthResponse> => {
        const response = await api.get<AuthResponse>(`${SECTION_URL}/profile`);
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await api.post(`${SECTION_URL}/change-password`, data);
    },
};
