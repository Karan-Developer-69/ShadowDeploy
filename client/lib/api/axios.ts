import axios from 'axios';

// Default to localhost for development if env var is missing
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6900') + '/shadow/api/client';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access - 401");
        }
        return Promise.reject(error);
    }
);
