import api from './api';

export interface UserAdminResponse {
    id: string;
    email: string;
    fullName: string;
    role: string;
    active: boolean;
}

export interface PageResponse<T> {
    content: T[];
    totalPages: number;
    totalElements: number;
    size: number;
    number: number;
}

export interface ContactMessage {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    replied: boolean;
    createdAt: string;
}

export const adminService = {
    getUsers: async (page = 0, size = 10, email = '') => {
        const response = await api.get<PageResponse<UserAdminResponse>>(`/admin/users`, {
            params: { page, size, email }
        });
        return response.data;
    },

    toggleUserStatus: async (id: string) => {
        const response = await api.patch(`/admin/users/${id}/toggle-status`, {});
        return response.data;
    },

    getMessages: async (page = 0, size = 10) => {
        const response = await api.get<PageResponse<ContactMessage>>(`/admin/messages`, {
            params: { page, size }
        });
        return response.data;
    },

    toggleMessageReplied: async (id: string) => {
        const response = await api.patch<ContactMessage>(`/admin/messages/${id}/toggle-replied`, {});
        return response.data;
    },

    deleteMessage: async (id: string) => {
        await api.delete(`/admin/messages/${id}`);
    }
};
