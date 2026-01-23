import axios from 'axios';

const getBaseURL = () => {
    // 1. Environment variable (Docker/Vercel sets this)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost development fallback
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8080/api';
    }

    // 3. Default Production Fallback (Relative path for Same Domain)
    return '/api';
};

const api = axios.create({
    baseURL: getBaseURL(),
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 30000,
});

// Request interceptor for future Auth token (JWT)
api.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    if (user && user.token) {
                        config.headers['Authorization'] = `Bearer ${user.token}`;
                    }
                } catch (e) {
                    console.error("Failed to parse user from local storage", e);
                }
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

                // Optional: Trigger a custom event if you want to show a toast via UI components
                // window.dispatchEvent(new Event('auth:unauthorized'));

                // Force redirect to login
                window.location.href = '/login?expired=true';
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
