'use client'

import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { Menu } from 'lucide-react'
import Logo from './Logo'

interface DashboardShellProps {
    children: React.ReactNode
}

const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
    // State
    const [isCollapsed, setIsCollapsed] = useState(false) // Desktop collapse
    const [isMobileOpen, setIsMobileOpen] = useState(false) // Mobile drawer
    const [isMobile, setIsMobile] = useState(false)

    // Handle resize to determine if mobile
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768)
            if (window.innerWidth >= 768) {
                setIsMobileOpen(false) // Close mobile drawer if resizing to desktop
            }
        }

        // Initial check
        handleResize()

        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return (
        <div className="flex h-screen bg-black overflow-hidden relative">

            {/* Mobile Header */}
            {isMobile && (
                <div className="absolute top-0 left-0 right-0 h-16 bg-black border-b border-white/5 flex items-center justify-between px-4 z-40">
                    <Logo collapsed={true} />
                    <button
                        onClick={() => setIsMobileOpen(true)}
                        className="p-2 text-zinc-400 hover:text-white"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Sidebar Overlay (Mobile Only) */}
            {isMobile && isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                ${isMobile ? 'fixed inset-y-0 left-0 z-50' : 'relative'}
                transition-all duration-300 ease-in-out
                ${isMobile
                    ? (isMobileOpen ? 'translate-x-0' : '-translate-x-full')
                    : (isCollapsed ? 'w-20' : 'w-72')
                }
            `}>
                <Sidebar
                    isCollapsed={!isMobile && isCollapsed}
                    onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
                    isMobile={isMobile}
                    onCloseMobile={() => setIsMobileOpen(false)}
                />
            </div>

            {/* Main Content */}
            <main className={`
                flex-1 overflow-y-auto bg-black
                ${isMobile ? 'pt-16' : ''} 
                transition-all duration-300
            `}>
                {children}
            </main>
        </div>
    )
}

export default DashboardShell
