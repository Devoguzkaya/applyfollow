import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { applicationService, ApplicationResponse, JobStatus, CreateApplicationRequest } from '@/services/applicationService';

interface ApplicationState {
    items: ApplicationResponse[];
    stats: {
        total: number;
        interviews: number;
        offers: number;
        rejections: number;
    };
    isLoading: boolean;
    error: string | null;
}

const initialState: ApplicationState = {
    items: [],
    stats: { total: 0, interviews: 0, offers: 0, rejections: 0 },
    isLoading: false,
    error: null,
};

// Async Thunks
export const fetchApplications = createAsyncThunk('applications/fetchAll', async () => {
    return await applicationService.getAllApplications();
});

export const addApplication = createAsyncThunk('applications/add', async (data: CreateApplicationRequest) => {
    return await applicationService.createApplication(data);
});

export const deleteApplication = createAsyncThunk('applications/delete', async (id: string) => {
    await applicationService.deleteApplication(id);
    return id;
});

export const updateApplicationStatus = createAsyncThunk('applications/updateStatus', async ({ id, status }: { id: string, status: JobStatus }) => {
    return await applicationService.updateApplicationStatus(id, status);
});

export const applicationSlice = createSlice({
    name: 'applications',
    initialState,
    reducers: {
        // Client-side filtering/sorting logic here if needed
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchApplications.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchApplications.fulfilled, (state, action) => {
            state.items = action.payload;
            state.isLoading = false;

            // Calculate Stats
            state.stats.total = action.payload.length;
            state.stats.interviews = action.payload.filter(app => app.status === 'INTERVIEW').length;
            state.stats.offers = action.payload.filter(app => app.status === 'OFFER').length;
            state.stats.rejections = action.payload.filter(app => app.status === 'REJECTED').length;
        });
        builder.addCase(fetchApplications.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to fetch applications';
        });

        // Add
        builder.addCase(addApplication.fulfilled, (state, action) => {
            state.items.unshift(action.payload); // Add to top
            state.stats.total += 1;
        });

        // Delete
        builder.addCase(deleteApplication.fulfilled, (state, action) => {
            state.items = state.items.filter(app => app.id !== action.payload);
            state.stats.total -= 1;
            // Re-calculate stats ideally, or just decrement total
        });

        // Update Status
        builder.addCase(updateApplicationStatus.fulfilled, (state, action) => {
            const index = state.items.findIndex(app => app.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
        });
    },
});

export default applicationSlice.reducer;
