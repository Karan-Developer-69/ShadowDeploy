'use client'

import { useEffect } from 'react'
import { useAuth } from '@clerk/nextjs'
import { useAppDispatch } from '@/lib/store/hooks'
import { setAuthTokenGetter } from '@/lib/api/axios'
import { fetchProjectDetails } from '@/lib/store/features/project/projectSlice'

export default function DataInitializer({
    children,
}: {
    children: React.ReactNode
}) {
    const dispatch = useAppDispatch()
    const { getToken } = useAuth()

    // Set up auth token getter for API calls
    useEffect(() => {
        setAuthTokenGetter(async () => {
            return await getToken();
        });
    }, [getToken]);

    // Fetch all projects on mount - this will also set the first project as current
    useEffect(() => {
        dispatch(fetchProjectDetails())
    }, [dispatch])

    return <>{children}</>
}
