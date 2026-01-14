import api from './api';

// Types matching Backend DTOs
export interface CompanyResponse {
    id: string; // Add ID
    name: string;
    logoUrl?: string;
    website?: string;
    linkedinUrl?: string;
}

// Status Type
export type JobStatus = 'APPLIED' | 'INTERVIEW' | 'OFFER' | 'REJECTED' | 'GHOSTED';

export interface ApplicationResponse {
    id: string;
    company: CompanyResponse;
    position: string;
    status: JobStatus;
    jobUrl?: string;
    notes?: string;
    appliedAt: string;
    updatedAt?: string;
}

export interface ApplicationRequest {
    companyName: string;
    position: string;
    status: JobStatus;
    jobUrl?: string;
    notes?: string;
}

// Alias for Redux slice consistency
export type CreateApplicationRequest = ApplicationRequest;

export interface ContactDto {
    id?: string;
    name: string;
    role?: string;
    email?: string;
    phone?: string;
    linkedIn?: string;
}

// API Methods
export const applicationService = {
    // Get all applications
    getAllApplications: async (): Promise<ApplicationResponse[]> => {
        const response = await api.get<ApplicationResponse[]>('/applications');
        return response.data;
    },

    // Get single application by ID
    getApplicationById: async (id: string): Promise<ApplicationResponse> => {
        const response = await api.get<ApplicationResponse>(`/applications/${id}`);
        return response.data;
    },

    // Create new application
    createApplication: async (data: ApplicationRequest): Promise<ApplicationResponse> => {
        const response = await api.post<ApplicationResponse>('/applications', data);
        return response.data;
    },

    // Update application status
    updateApplicationStatus: async (id: string, status: string): Promise<ApplicationResponse> => {
        const response = await api.patch<ApplicationResponse>(`/applications/${id}/status?status=${status}`);
        return response.data;
    },

    // Delete application
    deleteApplication: async (id: string): Promise<void> => {
        await api.delete(`/applications/${id}`);
    },

    // --- Contacts ---
    getContacts: async (applicationId: string): Promise<ContactDto[]> => {
        const response = await api.get<ContactDto[]>(`/applications/${applicationId}/contacts`);
        return response.data;
    },

    addContact: async (applicationId: string, contact: ContactDto): Promise<ContactDto> => {
        const response = await api.post<ContactDto>(`/applications/${applicationId}/contacts`, contact);
        return response.data;
    }
};
