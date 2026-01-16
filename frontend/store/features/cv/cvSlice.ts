import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cvService, CvData, Education, Experience, Skill } from '@/services/cvService';
// Remove toast import to prevent double notification
// import toast from 'react-hot-toast';

interface CvState {
    data: CvData | null;
    isLoading: boolean;
    isSaving: boolean;
    error: string | null;
}

const initialState: CvState = {
    data: {
        educations: [],
        experiences: [],
        skills: [],
        languages: [],
        certificates: [],
    },
    isLoading: false,
    isSaving: false,
    error: null,
};

// Async Thunks
export const fetchCv = createAsyncThunk('cv/fetch', async () => {
    return await cvService.getCv();
});

export const saveCv = createAsyncThunk('cv/save', async (data: CvData) => {
    await cvService.updateCv(data);
    return data;
});

export const downloadCv = createAsyncThunk('cv/download', async () => {
    await cvService.downloadCv();
});

export const cvSlice = createSlice({
    name: 'cv',
    initialState,
    reducers: {
        updateLocalCv: (state, action) => {
            // Form üzerinde anlık değişiklikler (Redux'a yansıtmak istersek)
            state.data = action.payload;
        },
        addExperience: (state, action) => {
            state.data?.experiences.push(action.payload);
        },
        removeExperience: (state, action) => {
            if (state.data) {
                state.data.experiences = state.data.experiences.filter((_, i) => i !== action.payload);
            }
        },
        // Benzer şekilde Education ve Skills için reducer'lar eklenebilir
        // Ama şimdilik formu lokal state'te tutup "Save" diyince hepsini saveCv thunk'ına basmak daha kolay.
    },
    extraReducers: (builder) => {
        // Fetch
        builder.addCase(fetchCv.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(fetchCv.fulfilled, (state, action) => {
            state.data = action.payload;
            state.isLoading = false;
        });
        builder.addCase(fetchCv.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to load CV';
        });

        // Save
        builder.addCase(saveCv.pending, (state) => {
            state.isSaving = true;
        });
        builder.addCase(saveCv.fulfilled, (state, action) => {
            state.data = action.payload;
            state.isSaving = false;
            // Removed toast.success call here.
            // Toast will be handled in the component layer to support localization.
        });
        builder.addCase(saveCv.rejected, (state, action) => {
            state.isSaving = false;
            state.error = action.error.message || 'Failed to save CV';
            // Removed toast.error call here.
            // Error toast will be handled in the component layer or can be re-added here if generic error msg is fine.
            // For better UX, let component handle it.
        });
    },
});

export const { updateLocalCv } = cvSlice.actions;
export default cvSlice.reducer;
