import axios from 'axios';

const API_URL = 'http://localhost:8080/api/users';

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
    token: string;
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

const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return { Authorization: `Bearer ${token}` };
};

export const userService = {
    updateProfile: async (data: UpdateProfileRequest): Promise<AuthResponse> => {
        const response = await axios.put<AuthResponse>(`${API_URL}/profile`, data, {
            headers: getAuthHeader(),
        });
        return response.data;
    },

    changePassword: async (data: ChangePasswordRequest): Promise<void> => {
        await axios.post(`${API_URL}/change-password`, data, {
            headers: getAuthHeader(),
        });
    },
};
