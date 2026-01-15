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
    endpoints: [],
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
