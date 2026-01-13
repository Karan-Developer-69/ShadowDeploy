'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/store/hooks'
import { fetchProjectDetails } from '@/lib/store/features/project/projectSlice'
import { fetchTrafficStats, fetchTrafficLogs } from '@/lib/store/features/traffic/trafficSlice'
import { fetchRecentDiffs } from '@/lib/store/features/diff/diffSlice'
import { fetchEndpoints } from '@/lib/store/features/endpoint/endpointSlice'

export default function DataInitializer({
    children,
}: {
    children: React.ReactNode
}) {
    const dispatch = useAppDispatch()
    const { currentProject } = useAppSelector((state) => state.project) || {};

    // Fetch project details on mount (always)
    useEffect(() => {
        dispatch(fetchProjectDetails())
    }, [dispatch])

    // Fetch operational data ONLY when we have both liveUrl and shadowUrl
    useEffect(() => {
        if (currentProject.liveUrl && currentProject.shadowUrl) {
            dispatch(fetchTrafficStats())
            dispatch(fetchTrafficLogs())
            dispatch(fetchRecentDiffs())
            dispatch(fetchEndpoints())
        }
    }, [dispatch, currentProject.liveUrl, currentProject.shadowUrl])

    return <>{children}</>
}
