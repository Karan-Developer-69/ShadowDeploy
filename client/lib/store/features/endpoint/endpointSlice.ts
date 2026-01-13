import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { endpointService } from '@/lib/api/services';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
export type HealthStatus = 'healthy' | 'degraded' | 'critical';

export interface EndpointData {
    id: string;
    method: HttpMethod;
    path: string;
    traffic24h: number; // Total requests
    trend: number; // % change
    avgLatencyLive: number; // ms
    avgLatencyShadow: number; // ms
    errorRateLive: number; // %
    errorRateShadow: number; // %
    status: HealthStatus;
    lastActive: string;
}

interface EndpointState {
    endpoints: EndpointData[];
    loading: boolean;
    error: string | null;
}

const initialState: EndpointState = {
    endpoints: [
        {
            id: "ep_1",
            method: "GET",
            path: "/api/v1/users",
            traffic24h: 450200,
            trend: 12,
            avgLatencyLive: 45,
            avgLatencyShadow: 48,
            errorRateLive: 0.01,
            errorRateShadow: 0.01,
            status: "healthy",
            lastActive: "Just now"
        },
        // ... (Keep other initial data as fallback)
        {
            id: "ep_2",
            method: "POST",
            path: "/api/v1/checkout/process",
            traffic24h: 12500,
            trend: 5,
            avgLatencyLive: 120,
            avgLatencyShadow: 350,
            errorRateLive: 0.5,
            errorRateShadow: 0.5,
            status: "degraded",
            lastActive: "2 min ago"
        },
        {
            id: "ep_3",
            method: "GET",
            path: "/api/v1/products/search",
            traffic24h: 89000,
            trend: -2,
            avgLatencyLive: 80,
            avgLatencyShadow: 82,
            errorRateLive: 0.1,
            errorRateShadow: 15.5,
            status: "critical",
            lastActive: "Just now"
        },
        {
            id: "ep_4",
            method: "PUT",
            path: "/api/v1/settings/profile",
            traffic24h: 3400,
            trend: 0,
            avgLatencyLive: 60,
            avgLatencyShadow: 58,
            errorRateLive: 0,
            errorRateShadow: 0,
            status: "healthy",
            lastActive: "15 min ago"
        },
        {
            id: "ep_5",
            method: "DELETE",
            path: "/api/v1/cart/items",
            traffic24h: 850,
            trend: 1,
            avgLatencyLive: 35,
            avgLatencyShadow: 35,
            errorRateLive: 0.2,
            errorRateShadow: 0.2,
            status: "healthy",
            lastActive: "1 hr ago"
        }
    ],
    loading: false,
    error: null,
};

export const fetchEndpoints = createAsyncThunk(
    'endpoint/fetchEndpoints',
    async () => {
        const response = await endpointService.getEndpoints();
        return response;
    }
);

export const endpointSlice = createSlice({
    name: 'endpoint',
    initialState,
    reducers: {
        updateEndpoint: (state, action: PayloadAction<EndpointData>) => {
            const index = state.endpoints.findIndex(e => e.id === action.payload.id);
            if (index !== -1) {
                state.endpoints[index] = action.payload;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchEndpoints.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchEndpoints.fulfilled, (state, action) => {
                state.loading = false;
                state.endpoints = action.payload;
            })
            .addCase(fetchEndpoints.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch endpoints';
            });
    }
});

export const { updateEndpoint } = endpointSlice.actions;
export default endpointSlice.reducer;
