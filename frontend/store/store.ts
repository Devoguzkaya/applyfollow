import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';
import uiReducer from './features/ui/uiSlice';
import applicationReducer from './features/application/applicationSlice';
import cvReducer from './features/cv/cvSlice';
// Diğer slice'lar eklendikçe buraya gelecek

export const store = configureStore({
    reducer: {
        auth: authReducer,
        ui: uiReducer,
        applications: applicationReducer,
        cv: cvReducer,
    },
});

// TypeScript Tipleri
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
