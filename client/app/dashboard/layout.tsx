import DashboardShell from '@/components/DashboardShell'
import React from 'react'

export const metadata = {
    title: "ShadowDeploy",
    description: ""
}

const layout = ({ children }: { children: React.ReactNode }) => {
    return (
        <DashboardShell>
            {children}
        </DashboardShell>
    )
}


export default layout