import axios from 'axios';

const getBaseURL = () => {
    // 1. Environment variable (Docker/Vercel sets this)
    if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;

    // 2. Localhost development fallback
    if (typeof window !== 'undefined' && window.location.hostname === 'localhost') {
        return 'http://localhost:8080/api';
    }

    // 3. Default Production Fallback
    return 'https://api.applyfollow.com';
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
        // Extract backend error message if available
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
