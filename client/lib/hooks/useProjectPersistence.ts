import { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks';
import { setProject } from '@/lib/store/features/project/projectSlice';

const PROJECT_STORAGE_KEY = 'shadowdeploy_current_project';
const ALL_PROJECTS_STORAGE_KEY = 'shadowdeploy_all_projects';

/**
 * Custom hook to sync project state with localStorage
 * Provides automatic persistence and rehydration of project data
 */
export const useProjectPersistence = () => {
    const dispatch = useAppDispatch();
    const { currentProject, allProjects } = useAppSelector((state) => state.project);

    // Rehydrate from localStorage on mount
    useEffect(() => {
        const savedCurrentProject = localStorage.getItem(PROJECT_STORAGE_KEY);
        const savedAllProjects = localStorage.getItem(ALL_PROJECTS_STORAGE_KEY);

        if (savedCurrentProject) {
            try {
                const project = JSON.parse(savedCurrentProject);
                // Only restore if we have valid data
                if (project.projectId && project.apiKey) {
                    dispatch(setProject(project));
                }
            } catch (error) {
                console.error('Failed to parse saved project:', error);
                localStorage.removeItem(PROJECT_STORAGE_KEY);
            }
        }
    }, [dispatch]);

    // Persist to localStorage whenever current project changes
    useEffect(() => {
        if (currentProject.projectId && currentProject.apiKey) {
            localStorage.setItem(PROJECT_STORAGE_KEY, JSON.stringify(currentProject));
        }
    }, [currentProject]);

    // Persist all projects to localStorage
    useEffect(() => {
        if (allProjects.length > 0) {
            localStorage.setItem(ALL_PROJECTS_STORAGE_KEY, JSON.stringify(allProjects));
        }
    }, [allProjects]);

    // Method to clear cached projects (useful on logout)
    const clearCache = () => {
        localStorage.removeItem(PROJECT_STORAGE_KEY);
        localStorage.removeItem(ALL_PROJECTS_STORAGE_KEY);
    };

    return { clearCache };
};
