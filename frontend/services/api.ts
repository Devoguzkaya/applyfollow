import axios from 'axios';

const getBaseURL = () => {
    // 1. Environment variable (Always prefer this)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Default Fallback (Relative path assumes same domain or proxy)
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor for Auth token (JWT)
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 1. Handle Token Expiration (401 Unauthorized)
        if (error.response && error.response.status === 401) {
            // Check if we are already on the login page to avoid infinite loops
            if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                // Clear all auth data
                localStorage.removeItem('user');
                localStorage.removeItem('token');

                // Trigger a custom event for UI components to handle the redirect cleanly (SPA friendly)
                window.dispatchEvent(new Event('auth:unauthorized'));
                return Promise.reject(error);
            }
        }

        // 2. Extract backend error message if available
        if (error.response && error.response.data) {
            // Support Spring Boot 3 ProblemDetail (RFC 7807) 'detail' field
            // Fallback to legacy 'message' or 'error' fields
            const backendMessage = error.response.data.detail || error.response.data.message || error.response.data.error;
            if (backendMessage) {
                // Attach backend message to error object for easier access
                error.message = backendMessage;
            }
        }
        return Promise.reject(error);
    }
);

export default api;
