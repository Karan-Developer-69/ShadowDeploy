import Sidebar from '@/components/Sidebar'
import React from 'react'

export const metadata = {
    title: "ShadowDeploy",
    description: ""
}

const layout = ({ children }: { children: React.ReactNode }) => {


    return <div className="flex h-screen bg-black overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
            {children}
        </main>
    </div>
}

export default layout