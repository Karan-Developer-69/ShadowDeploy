'use client'

import React, { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { switchProject } from '@/lib/store/features/project/projectSlice'
import { fetchTrafficStats, fetchTrafficLogs } from '@/lib/store/features/traffic/trafficSlice'
import { fetchRecentDiffs } from '@/lib/store/features/diff/diffSlice'
import { fetchEndpoints } from '@/lib/store/features/endpoint/endpointSlice'
import { useProjectPersistence } from '@/lib/hooks/useProjectPersistence'

// Import the main dashboard page content
import DashboardPage from '../../page'

export default function ProjectPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { allProjects, currentProject } = useAppSelector((state) => state.project)
    const projectId = params.id as string

    // Use project persistence hook
    useProjectPersistence()

    // When projectId from URL changes, update Redux state
    useEffect(() => {
        if (projectId && allProjects.length > 0) {
            const project = allProjects.find(p => p.projectId === projectId)

            if (project) {
                // Optimistically switch to this project in Redux
                if (currentProject.projectId !== projectId) {
                    dispatch(switchProject(projectId))
                }
            } else {
                // Project not found, redirect to first project or dashboard
                if (allProjects.length > 0) {
                    router.push(`/dashboard/project/${allProjects[0].projectId}`)
                } else {
                    router.push('/dashboard')
                }
            }
        }
    }, [projectId, allProjects, currentProject.projectId, dispatch, router])

    // Fetch data when project changes (with debounce)
    useEffect(() => {
        if (currentProject.projectId && currentProject.liveUrl && currentProject.shadowUrl) {
            // Only fetch if we have complete project details
            dispatch(fetchTrafficStats())
            dispatch(fetchTrafficLogs())
            dispatch(fetchRecentDiffs())
            dispatch(fetchEndpoints())
        }
    }, [currentProject.projectId, dispatch, currentProject.liveUrl, currentProject.shadowUrl])

    return <DashboardPage />
}
