import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService } from '@/lib/api/services';

const PROJECT_STORAGE_KEY = 'shadowdeploy_current_project';
const ALL_PROJECTS_STORAGE_KEY = 'shadowdeploy_all_projects';

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

// Helper to load from localStorage
const loadFromStorage = () => {
    try {
        const savedProject = localStorage.getItem(PROJECT_STORAGE_KEY);
        const savedAllProjects = localStorage.getItem(ALL_PROJECTS_STORAGE_KEY);
        return {
            currentProject: savedProject ? JSON.parse(savedProject) : null,
            allProjects: savedAllProjects ? JSON.parse(savedAllProjects) : [],
        };
    } catch (error) {
        console.error('Failed to load from localStorage:', error);
        return { currentProject: null, allProjects: [] };
    }
};

const cached = loadFromStorage();

const initialState: ProjectState = {
    currentProject: cached.currentProject || {
        name: '',
        projectId: '',
        apiKey: '',
        plan: '',
        tier: 'Startup',
        liveUrl: '',
        shadowUrl: '',
    },
    allProjects: cached.allProjects,
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
            // Persist to localStorage
            if (action.payload.projectId && action.payload.apiKey) {
                localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(action.payload));
            }
        },
        updateUsage: (state, action: PayloadAction<Partial<ProjectState['usage']>>) => {
            state.usage = { ...state.usage, ...action.payload };
        },
        switchProject: (state, action: PayloadAction<string>) => {
            // Switch current project by projectId
            const project = state.allProjects.find(p => p.projectId === action.payload);
            if (project) {
                state.currentProject = project;
                // Persist to localStorage
                localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(project));
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
                if (action.payload.currentProject) {
                    state.currentProject = action.payload.currentProject;
                    localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(action.payload.currentProject));
                }
                if (action.payload.allProjects) {
                    state.allProjects = action.payload.allProjects;
                    localStorage.setItem(ALL_PROJECTS_STORAGE_KEY, JSON.stringify(action.payload.allProjects));
                }
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
                // Add to allProjects if not already present
                const exists = state.allProjects.find(p => p.projectId === action.payload.projectId);
                if (!exists) {
                    state.allProjects.push(action.payload);
                }
                // Persist to localStorage
                localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(action.payload));
                localStorage.setItem(ALL_PROJECTS_STORAGE_KEY, JSON.stringify(state.allProjects));
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
