import { api } from './axios';
import { ProjectState } from '@/lib/store/features/project/projectSlice';
import { TrafficLog, TrafficStats, TrafficTrends } from '@/lib/store/features/traffic/trafficSlice';
import { ComparisonData, ComparisonLog } from '@/lib/store/features/diff/diffSlice';
import { EndpointData } from '@/lib/store/features/endpoint/endpointSlice';

export const projectService = {
    getAllProjects: async () => {
        const response = await api.get<ProjectState['currentProject'][]>('/user/projects');
        return response.data;
    },
    getProjectDetails: async () => {
        // Fetch all projects and return the first one as current, with usage data
        const projects = await api.get<ProjectState['currentProject'][]>('/user/projects');
        const currentProject = projects.data[0] || {
            name: '',
            projectId: '',
            apiKey: '',
            plan: '',
            tier: 'Startup' as const,
            liveUrl: '',
            shadowUrl: '',
        };
        return {
            currentProject,
            allProjects: projects.data,
            usage: {
                percentage: 10,
                resetDays: 12,
            }
        };
    },
    createProject: async (data: { name: string; liveUrl: string; shadowUrl: string; userId: string }) => {
        const response = await api.post<{ message: string, project: ProjectState['currentProject'] }>('/project', data);
        return response.data;
    },
    updateProject: async (projectId: string, data: { name: string; liveUrl: string; shadowUrl: string }) => {
        const response = await api.put<{ message: string, project: ProjectState['currentProject'] }>(`/project/${projectId}`, data);
        return response.data;
    }
};

export const trafficService = {
    getStats: async () => {
        const response = await api.get<{ stats: TrafficStats, trends: TrafficTrends }>('/traffic/stats');
        return response.data;
    },
    getLogs: async () => {
        const response = await api.get<TrafficLog[]>('/traffic/logs');
        return response.data;
    },
};

export const diffService = {
    getRecentDiffs: async (projectId?: string) => {
        const config = projectId ? {
            headers: {
                'x-project-id': projectId
            }
        } : {};
        const response = await api.get<{
            recentComparisons: ComparisonLog[],
            detailedComparisons: ComparisonData[]
        }>('/diffs/recent', config);
        return response.data;
    },
};

export const endpointService = {
    getEndpoints: async () => {
        const response = await api.get<EndpointData[]>('/endpoints');
        return response.data;
    },
};
