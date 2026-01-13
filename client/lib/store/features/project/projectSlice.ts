import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '@/lib/api/services';

export interface ProjectState {
    currentProject: {
        name: string;
        plan: string;
        tier: 'Developer' | 'Startup' | 'Enterprise';
        liveUrl: string;
        shadowUrl: string;
    };
    usage: {
        percentage: number;
        resetDays: number;
    };
    loading: boolean;
    error: string | null;
}

const initialState: ProjectState = {
    currentProject: {
        name: '',
        plan: '',
        tier: 'Startup',
        liveUrl: '',
        shadowUrl: '',
    },
    usage: {
        percentage: 10,
        resetDays: 12,
    },
    loading: false,
    error: null,
};

export const fetchProjectDetails = createAsyncThunk(
    'project/fetchDetails',
    async () => {
        const response = await projectService.getProjectDetails();
        return response;
    }
);

export const projectSlice = createSlice({
    name: 'project',
    initialState,
    reducers: {
        setProject: (state, action: PayloadAction<ProjectState['currentProject']>) => {
            state.currentProject = action.payload;
        },
        updateUsage: (state, action: PayloadAction<Partial<ProjectState['usage']>>) => {
            state.usage = { ...state.usage, ...action.payload };
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProjectDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProjectDetails.fulfilled, (state, action) => {
                state.loading = false;
                if (action.payload.currentProject) state.currentProject = action.payload.currentProject;
                if (action.payload.usage) state.usage = action.payload.usage;
            })
            .addCase(fetchProjectDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch project details';
            });
    },
});

export const { setProject, updateUsage } = projectSlice.actions;
export default projectSlice.reducer;
