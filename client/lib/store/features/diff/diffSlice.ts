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
    recentComparisons: [],
    detailedComparisons: [],
    loading: false,
    error: null,
};

export const fetchRecentDiffs = createAsyncThunk(
    'diff/fetchRecent',
    async (projectId?: string) => {
        const response = await diffService.getRecentDiffs(projectId);
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
                // Handle the complete diff object with both arrays
                if (action.payload.recentComparisons) {
                    state.recentComparisons = action.payload.recentComparisons;
                }
                if (action.payload.detailedComparisons) {
                    state.detailedComparisons = action.payload.detailedComparisons;
                }
            })
            .addCase(fetchRecentDiffs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch diffs';
            });
    },
});

export const { addComparison, clearComparisons, addDetailedComparison } = diffSlice.actions;
export default diffSlice.reducer;
