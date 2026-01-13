import { api } from './axios';
import { ProjectState } from '@/lib/store/features/project/projectSlice';
import { TrafficLog, TrafficStats, TrafficTrends } from '@/lib/store/features/traffic/trafficSlice';
import { ComparisonData } from '@/lib/store/features/diff/diffSlice';
import { EndpointData } from '@/lib/store/features/endpoint/endpointSlice';

export const projectService = {
    getProjectDetails: async () => {
        const response = await api.get<{ currentProject: ProjectState['currentProject'], usage: ProjectState['usage'] }>('/project');
        return response.data;
    },
};

export const trafficService = {
    getStats: async () => {
        const response = await api.get<{ stats: TrafficStats, trends: TrafficTrends }>('/traffic/stats', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
    getLogs: async () => {
        const response = await api.get<TrafficLog[]>('/traffic/logs', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
};

export const diffService = {
    getRecentDiffs: async () => {
        const response = await api.get<ComparisonData[]>('/diffs/recent', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
};

export const endpointService = {
    getEndpoints: async () => {
        const response = await api.get<EndpointData[]>('/endpoints', {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        return response.data;
    },
};
