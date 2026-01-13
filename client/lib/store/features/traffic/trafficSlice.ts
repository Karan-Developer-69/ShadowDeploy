import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { trafficService } from '@/lib/api/services';

export interface TrafficStats {
    totalRequests: string;
    shadowErrors: number;
    avgLatency: string;
    matchRate: string;
}

export interface TrafficTrends {
    requestsChange: string; // e.g., "+12.5%"
    errorsChange: string;
    latencyChange: string;
    matchRateChange: string;
}

export interface TrafficLog {
    id: string;
    time: string;
    method: string;
    path: string;
    live: number;
    shadow: number;
    latencyLive: number;
    latencyShadow: number;
}

interface TrafficState {
    stats: TrafficStats;
    trends: TrafficTrends;
    liveLogs: TrafficLog[];
    loading: boolean;
    error: string | null;
}

const initialState: TrafficState = {
    stats: {
        totalRequests: '1.2M',
        shadowErrors: 42,
        avgLatency: '145ms',
        matchRate: '99.8%',
    },
    trends: {
        requestsChange: '+12.5%',
        errorsChange: '+2',
        latencyChange: '-12ms',
        matchRateChange: '-0.1%',
    },
    liveLogs: [
        { id: "req_99a", time: "10:42:05", method: "GET", path: "/api/v1/dashboard/stats", live: 200, shadow: 200, latencyLive: 45, latencyShadow: 48 },
        { id: "req_99b", time: "10:42:04", method: "POST", path: "/api/auth/login", live: 200, shadow: 500, latencyLive: 120, latencyShadow: 15 },
        { id: "req_99c", time: "10:42:02", method: "GET", path: "/api/v1/users/me", live: 200, shadow: 200, latencyLive: 30, latencyShadow: 32 },
        { id: "req_99d", time: "10:42:01", method: "PUT", path: "/api/v1/settings", live: 204, shadow: 204, latencyLive: 90, latencyShadow: 88 },
        { id: "req_99e", time: "10:41:58", method: "DELETE", path: "/api/v1/items/882", live: 403, shadow: 403, latencyLive: 25, latencyShadow: 24 },
        { id: "req_99f", time: "10:41:55", method: "GET", path: "/api/v1/search?q=shadow", live: 200, shadow: 200, latencyLive: 150, latencyShadow: 210 },
        { id: "req_99g", time: "10:41:50", method: "POST", path: "/api/webhooks/stripe", live: 200, shadow: 404, latencyLive: 80, latencyShadow: 5 },
        { id: "req_99h", time: "10:41:48", method: "GET", path: "/health", live: 200, shadow: 200, latencyLive: 5, latencyShadow: 6 },
    ],
    loading: false,
    error: null,
};

export const fetchTrafficStats = createAsyncThunk(
    'traffic/fetchStats',
    async () => {
        const response = await trafficService.getStats();
        return response;
    }
);

export const fetchTrafficLogs = createAsyncThunk(
    'traffic/fetchLogs',
    async () => {
        const response = await trafficService.getLogs();
        return response;
    }
);

export const trafficSlice = createSlice({
    name: 'traffic',
    initialState,
    reducers: {
        updateStats: (state, action: PayloadAction<Partial<TrafficStats>>) => {
            state.stats = { ...state.stats, ...action.payload };
        },
        updateTrends: (state, action: PayloadAction<Partial<TrafficTrends>>) => {
            state.trends = { ...state.trends, ...action.payload };
        },
        addTrafficLog: (state, action: PayloadAction<TrafficLog>) => {
            state.liveLogs.unshift(action.payload);
            if (state.liveLogs.length > 50) state.liveLogs.pop();
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTrafficStats.fulfilled, (state, action) => {
                if (action.payload.stats) state.stats = action.payload.stats;
                if (action.payload.trends) state.trends = action.payload.trends;
            })
            .addCase(fetchTrafficLogs.fulfilled, (state, action) => {
                state.liveLogs = action.payload;
            });
    },
});

export const { updateStats, updateTrends, addTrafficLog } = trafficSlice.actions;
export default trafficSlice.reducer;
