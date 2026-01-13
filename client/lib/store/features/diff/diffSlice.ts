import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { diffService } from '@/lib/api/services';

// --- Shared Types ---
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

export interface RequestMeta {
    id: string;
    timestamp: string;
    method: HttpMethod;
    path: string;
}

export interface ResponseDetails {
    status: number;
    latency: number;
    body: Record<string, JsonValue>;
    headers: Record<string, string>;
}

export interface ComparisonData {
    meta: RequestMeta;
    live: ResponseDetails;
    shadow: ResponseDetails;
    diffSummary: {
        statusMatch: boolean;
        bodyMatch: boolean;
        latencyDiff: number; // in ms
        breakingScore: number; // 0-100
    }
}

// Dashboard was:
export interface ComparisonLog {
    id: string;
    path: string;
    method: string;
    liveStatus: number;
    shadowStatus: number;
    latencyDiff: string;
    match: boolean;
}

interface DiffState {
    recentComparisons: ComparisonLog[]; // For Dashboard Table
    detailedComparisons: ComparisonData[]; // For Diff Page
    loading: boolean;
    error: string | null;
}

const initialState: DiffState = {
    recentComparisons: [
        { id: "req_8x92", path: "/api/v1/users", method: "GET", liveStatus: 200, shadowStatus: 200, latencyDiff: "+12ms", match: true },
        { id: "req_7z11", path: "/api/v1/auth/login", method: "POST", liveStatus: 200, shadowStatus: 500, latencyDiff: "---", match: false },
        { id: "req_3a44", path: "/api/v1/products", method: "GET", liveStatus: 200, shadowStatus: 200, latencyDiff: "-5ms", match: true },
        { id: "req_9c55", path: "/api/v1/checkout", method: "POST", liveStatus: 201, shadowStatus: 201, latencyDiff: "+45ms", match: true },
        { id: "req_1b22", path: "/api/v1/search?q=t", method: "GET", liveStatus: 200, shadowStatus: 404, latencyDiff: "---", match: false },
    ],
    detailedComparisons: [
        {
            meta: { id: "req_88a", timestamp: "10:45:01", method: "GET", path: "/api/v1/users/profile" },
            live: {
                status: 200,
                latency: 45,
                body: { id: 101, name: "Alice", role: "admin", features: ["beta", "pro"] },
                headers: { "content-type": "application/json" }
            },
            shadow: {
                status: 200,
                latency: 52,
                body: { id: 101, name: "Alice", role: "user", features: ["beta"] },
                headers: { "content-type": "application/json" }
            },
            diffSummary: { statusMatch: true, bodyMatch: false, latencyDiff: +7, breakingScore: 45 }
        },
        {
            meta: { id: "req_88b", timestamp: "10:44:55", method: "POST", path: "/api/checkout" },
            live: {
                status: 201,
                latency: 120,
                body: { success: true, orderId: "ORD-999" },
                headers: {}
            },
            shadow: {
                status: 500,
                latency: 15,
                body: { error: "Internal Server Error", code: "DB_FAIL" },
                headers: {}
            },
            diffSummary: { statusMatch: false, bodyMatch: false, latencyDiff: -105, breakingScore: 100 }
        },
        {
            meta: { id: "req_88c", timestamp: "10:44:20", method: "GET", path: "/api/v1/settings" },
            live: {
                status: 200,
                latency: 30,
                body: { theme: "dark", notifications: true },
                headers: {}
            },
            shadow: {
                status: 200,
                latency: 31,
                body: { theme: "dark", notifications: true },
                headers: {}
            },
            diffSummary: { statusMatch: true, bodyMatch: true, latencyDiff: +1, breakingScore: 0 }
        }
    ],
    loading: false,
    error: null,
};

export const fetchRecentDiffs = createAsyncThunk(
    'diff/fetchRecent',
    async () => {
        const response = await diffService.getRecentDiffs();
        return response;
    }
);

export const diffSlice = createSlice({
    name: 'diff',
    initialState,
    reducers: {
        addComparison: (state, action: PayloadAction<ComparisonLog>) => {
            state.recentComparisons.unshift(action.payload);
            if (state.recentComparisons.length > 50) {
                state.recentComparisons.pop();
            }
        },
        clearComparisons: (state) => {
            state.recentComparisons = [];
        },
        addDetailedComparison: (state, action: PayloadAction<ComparisonData>) => {
            state.detailedComparisons.unshift(action.payload);
            if (state.detailedComparisons.length > 20) {
                state.detailedComparisons.pop();
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRecentDiffs.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecentDiffs.fulfilled, (state, action) => {
                state.loading = false;
                state.detailedComparisons = action.payload;
            })
            .addCase(fetchRecentDiffs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch diffs';
            });
    },
});

export const { addComparison, clearComparisons, addDetailedComparison } = diffSlice.actions;
export default diffSlice.reducer;
