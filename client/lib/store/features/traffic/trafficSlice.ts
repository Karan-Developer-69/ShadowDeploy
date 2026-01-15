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
        totalRequests: '0',
        shadowErrors: 0,
        avgLatency: '0ms',
        matchRate: '0%',
    },
    trends: {
        requestsChange: '0%',
        errorsChange: '0',
        latencyChange: '0ms',
        matchRateChange: '0%',
    },
    liveLogs: [],
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
                if (action.payload.stats) state.stats = { ...state.stats, ...action.payload.stats };
                if (action.payload.trends) state.trends = { ...state.trends, ...action.payload.trends };
            })
            .addCase(fetchTrafficLogs.fulfilled, (state, action) => {
                state.liveLogs = action.payload;
            });
    },
});

export const { updateStats, updateTrends, addTrafficLog } = trafficSlice.actions;
export default trafficSlice.reducer;
