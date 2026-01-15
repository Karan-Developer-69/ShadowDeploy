import axios from 'axios';

// Default to localhost for development if env var is missing
const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:6900') + '/shadow/api/client';

export const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper to get auth token for client-side requests
let getTokenFn: (() => Promise<string | null>) | null = null;

// Helper to get Redux store (will be set by StoreProvider)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let getStoreFn: (() => any) | null = null;

export const setAuthTokenGetter = (fn: () => Promise<string | null>) => {
    getTokenFn = fn;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const setStoreGetter = (fn: () => any) => {
    getStoreFn = fn;
};

// Request interceptor to add auth token and project credentials
api.interceptors.request.use(
    async (config) => {
        // Try to get token from the stored getter function (client-side)
        if (getTokenFn) {
            try {
                const token = await getTokenFn();
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.warn('Failed to get auth token:', error);
            }
        }

        // Add project credentials from Redux store if available
        if (getStoreFn) {
            try {
                const store = getStoreFn();
                const state = store.getState();
                const { currentProject } = state.project;

                if (currentProject?.projectId && currentProject?.apiKey) {
                    config.headers['X-Project-ID'] = currentProject.projectId;
                    config.headers['X-API-Key'] = currentProject.apiKey;
                }
            } catch (error) {
                console.warn('Failed to get project credentials:', error);
            }
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for global error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors like 401 Unauthorized
        if (error.response && error.response.status === 401) {
            console.warn("Unauthorized access - 401");
            // Redirect to sign-in if in browser
            // if (typeof window !== 'undefined') {
            //     window.location.href = '/';
            // }
        }
        return Promise.reject(error);
    }
);
