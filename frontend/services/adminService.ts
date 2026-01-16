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

export interface AdminUserDetailResponse {
    id: string;
    email: string;
    fullName: string;
    role: string;
    active: boolean;
    phoneNumber?: string;
    address?: string;
    linkedinUrl?: string;
    githubUrl?: string;
    websiteUrl?: string;
    summary?: string;
}

export const adminService = {
    getUsers: async (page = 0, size = 10, email = '') => {
        const response = await api.get<PageResponse<UserAdminResponse>>(`/admin/users`, {
            params: { page, size, email }
        });
        return response.data;
    },

    getUserDetails: async (id: string) => {
        const response = await api.get<AdminUserDetailResponse>(`/admin/users/${id}`);
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
    },

    // --- User Detail Endpoints ---

    getUserApplications: async (userId: string) => {
        // We import ApplicationResponse dynamically or define it here if imports are circular, 
        // but better to use 'any' if we want to avoid complex circular deps for now, 
        // OR better: let's use the type from applicationService.
        // Assuming we can request /api/applications/user/{userId}
        const response = await api.get(`/applications/user/${userId}`);
        return response.data;
    },

    getUserCv: async (userId: string) => {
        // Request /api/cv/user/{userId}
        const response = await api.get(`/cv/user/${userId}`);
        return response.data;
    },

    downloadUserCv: async (userId: string) => {
        const response = await api.get(`/cv/user/${userId}/download`, {
            responseType: 'blob',
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;

        const contentDisposition = response.headers['content-disposition'];
        let fileName = `CV_User_${userId}.docx`;
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
            if (fileNameMatch && fileNameMatch.length === 2)
                fileName = fileNameMatch[1].replace(/"/g, '');
        }

        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    }
};
