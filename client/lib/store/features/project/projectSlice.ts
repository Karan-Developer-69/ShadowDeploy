import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '@/lib/api/services';

export interface ProjectState {
    currentProject: {
        name: string;
        projectId: string;
        apiKey: string;
        plan: string;
        tier: 'Developer' | 'Startup' | 'Enterprise';
        liveUrl: string;
        shadowUrl: string;
    };
    allProjects: {
        name: string;
        projectId: string;
        apiKey: string;
        plan: string;
        tier: 'Developer' | 'Startup' | 'Enterprise';
        liveUrl: string;
        shadowUrl: string;
    }[];
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
        projectId: '',
        apiKey: '',
        plan: '',
        tier: 'Startup',
        liveUrl: '',
        shadowUrl: '',
    },
    allProjects: [],
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

export const createProject = createAsyncThunk(
    'project/create',
    async (data: { name: string; liveUrl: string; shadowUrl: string; userId: string }) => {
        const response = await projectService.createProject(data);
        return response.project;
    }
);

export const updateProject = createAsyncThunk(
    'project/update',
    async (data: { projectId: string; name: string; liveUrl: string; shadowUrl: string }) => {
        const { projectId, ...updateData } = data;
        const response = await projectService.updateProject(projectId, updateData);
        return response.project;
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
        switchProject: (state, action: PayloadAction<string>) => {
            // Switch current project by projectId
            const project = state.allProjects.find(p => p.projectId === action.payload);
            if (project) {
                state.currentProject = project;
            }
        },
        resetCurrentProject: (state) => {
            // Reset to empty state for creating new project
            state.currentProject = {
                name: '',
                projectId: '',
                apiKey: '',
                plan: '',
                tier: 'Startup',
                liveUrl: '',
                shadowUrl: '',
            };
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
                if (action.payload.allProjects) state.allProjects = action.payload.allProjects;
                if (action.payload.usage) state.usage = action.payload.usage;
            })
            .addCase(fetchProjectDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to fetch project details';
            })
            .addCase(createProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createProject.fulfilled, (state, action) => {
                state.loading = false;
                state.currentProject = action.payload;
                state.allProjects.push(action.payload); // Add to allProjects
            })
            .addCase(createProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to create project';
            })
            .addCase(updateProject.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateProject.fulfilled, (state, action) => {
                state.loading = false;
                // Update current project if it's the one being updated
                if (state.currentProject.projectId === action.payload.projectId) {
                    state.currentProject = action.payload;
                }
                // Update in allProjects array
                const index = state.allProjects.findIndex(p => p.projectId === action.payload.projectId);
                if (index !== -1) {
                    state.allProjects[index] = action.payload;
                }
            })
            .addCase(updateProject.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message || 'Failed to update project';
            });
    },
});

export const { setProject, updateUsage, switchProject, resetCurrentProject } = projectSlice.actions;
export default projectSlice.reducer;
