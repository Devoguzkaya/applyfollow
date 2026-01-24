import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService, LoginRequest, RegisterRequest, User } from '@/services/authService';

// State Tipi
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Başlangıç Değeri
const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,
};

// Async Thunks (API Çağrıları)

// 1. Check Auth (Sayfa yenilendiğinde kimlik kontrolü)
export const checkAuth = createAsyncThunk('auth/checkAuth', async () => {
    const user = authService.getCurrentUser();
    if (!user) throw new Error('No user found');
    return user;
});

// 2. Login
export const login = createAsyncThunk('auth/login', async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    return response; // { token, user } döner varsayıyoruz, authService güncellemesi gerekebilir
});

// 3. Register
export const register = createAsyncThunk('auth/register', async (data: RegisterRequest) => {
    const response = await authService.register(data);
    return response;
});

// 4. Update Profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async ({ fullName, email }: { fullName: string, email: string }) => {
    return await authService.updateProfile({ fullName, email });
});

// 5. Fetch User (For OAuth2 & Session Refresh)
export const fetchUser = createAsyncThunk('auth/fetchUser', async () => {
    return await authService.fetchUserProfile();
});

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            authService.logout();
            state.user = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action: PayloadAction<{ user: User; token: string }>) => {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.isLoading = false;
        },
    },
    extraReducers: (builder) => {
        // Check Auth
        builder.addCase(checkAuth.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        });
        builder.addCase(checkAuth.rejected, (state) => {
            state.user = null;
            state.isAuthenticated = false;
            state.isLoading = false;
        });

        // Login
        builder.addCase(login.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            // AuthResponse -> User dönüşümü (Token hariç)
            const { token, message, ...userData } = action.payload;
            state.user = userData;
            state.isAuthenticated = true;
            state.isLoading = false;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Login failed';
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.isLoading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            const { token, message, ...userData } = action.payload;
            state.user = userData;
            state.isAuthenticated = true;
            state.isLoading = false;
        });
        builder.addCase(register.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Registration failed';
        });

        // Update Profile
        builder.addCase(updateProfile.fulfilled, (state, action) => {
            state.user = action.payload;
        });

        // Fetch User
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.isLoading = false;
        });
        builder.addCase(fetchUser.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message || 'Failed to fetch user profile';
        });
    },
});

export const { logout, clearError, setCredentials } = authSlice.actions;
export default authSlice.reducer;
