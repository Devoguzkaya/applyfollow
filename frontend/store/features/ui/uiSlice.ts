import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UiState {
    theme: 'light' | 'dark';
    language: 'en' | 'tr';
    isSidebarOpen: boolean;
}

const initialState: UiState = {
    theme: 'dark', // Varsayılan karanlık mod
    language: 'en',
    isSidebarOpen: true,
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleTheme: (state) => {
            state.theme = state.theme === 'dark' ? 'light' : 'dark';
            // LocalStorage'a kaydetme işlemini component tarafında veya middleware ile yapabiliriz
        },
        setLanguage: (state, action: PayloadAction<'en' | 'tr'>) => {
            state.language = action.payload;
        },
        toggleSidebar: (state) => {
            state.isSidebarOpen = !state.isSidebarOpen;
        },
        setSidebarOpen: (state, action: PayloadAction<boolean>) => {
            state.isSidebarOpen = action.payload;
        },
    },
});

export const { toggleTheme, setLanguage, toggleSidebar, setSidebarOpen } = uiSlice.actions;
export default uiSlice.reducer;
