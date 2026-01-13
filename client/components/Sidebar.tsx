'use client'

import React, { useState } from 'react'
import {
    LayoutDashboard,
    GitCompare,
    Activity,
    Server,
    Settings,
    CreditCard,
    ChevronDown,
    LogOut,
    Layers,
    Code2,
    ChevronLeft,
    X
} from "lucide-react"
import { SignedIn, SignedOut, SignInButton, SignOutButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import Link from 'next/link'
import Logo from './Logo'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/lib/store/hooks'

// --- Types ---
type NavItem = {
    title: string
    icon: React.ElementType
    href: string
    badge?: number // For notification counts
}

type Section = {
    label: string
    items: NavItem[]
}

interface SidebarProps {
    isCollapsed?: boolean // Desktop only
    onToggleCollapse?: () => void
    isMobile?: boolean
    onCloseMobile?: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
    isCollapsed = false,
    onToggleCollapse,
    isMobile = false,
    onCloseMobile
}) => {
    const [activePath, setActivePath] = useState('/dashboard')
    const { currentProject, usage } = useAppSelector((state) => state.project)

    // --- Sidebar Data Structure based on Mind Map ---
    const navSections: Section[] = [
        {
            label: "Core Platform",
            items: [
                { title: "Overview", icon: LayoutDashboard, href: "/dashboard" },
                { title: "Live Traffic", icon: Activity, href: "/dashboard/traffic", badge: 0 },
                { title: "Comparison Engine", icon: GitCompare, href: "/dashboard/diffs" },
                { title: "Endpoints", icon: Server, href: "/dashboard/endpoints" },
            ]
        },
        {
            label: "Configuration",
            items: [
                { title: "API Keys & Env", icon: Code2, href: "/dashboard/settings/keys" },
                { title: "Project Settings", icon: Settings, href: "/dashboard/settings/project" },
            ]
        },
        {
            label: "Billing",
            items: [
                { title: "Subscription", icon: CreditCard, href: "/dashboard/payment/billing" },
            ]
        }
    ]

    return (
        <aside className={cn(
            "h-full bg-[#050505] border-r border-white/5 flex flex-col justify-between text-zinc-400 select-none transition-all duration-300",
            isCollapsed ? "w-20" : "w-72"
        )}>

            {/* 1. Header & Logo */}
            <div className="p-4 flex items-center justify-between relative">
                <div className={cn("transition-all duration-300", isCollapsed ? "mx-auto" : "")}>
                    <Logo collapsed={isCollapsed && !isMobile} />
                </div>

                {/* Mobile Close Button */}
                {isMobile && (
                    <button onClick={onCloseMobile} className="p-2 text-zinc-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                )}

                {/* Desktop Collapse Toggle */}
                {!isMobile && (
                    <button
                        onClick={onToggleCollapse}
                        className={cn(
                            "absolute -right-3 top-8 w-6 h-6 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer z-50",
                            isCollapsed ? "rotate-180" : ""
                        )}
                    >
                        <ChevronLeft className="w-3 h-3" />
                    </button>
                )}
            </div>

            {/* 2. Project Switcher (Simplified if collapsed) */}
            <div className={cn("px-4 pb-2 transition-all duration-300", isCollapsed ? "opacity-0 h-0 overflow-hidden" : "opacity-100")}>
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5 group">
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-medium text-white truncate">{currentProject.name}</h4>
                        <p className="text-xs text-zinc-500 truncate">{currentProject.plan}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
            </div>
            {isCollapsed && (
                <div className="px-2 pb-2 flex justify-center">
                    <div className="w-10 h-10 rounded-lg bg-zinc-900 flex items-center justify-center text-xs font-bold text-zinc-500 hover:bg-zinc-800 cursor-pointer">
                        {currentProject.name.substring(0, 2).toUpperCase()}
                    </div>
                </div>
            )}

            {/* 3. Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-hide">
                {navSections.map((section, idx) => (
                    <div key={idx}>
                        {!isCollapsed && (
                            <h3 className="px-4 text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-2 whitespace-nowrap">
                                {section.label}
                            </h3>
                        )}
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = activePath === item.href
                                return (
                                    <Link
                                        href={item.href}
                                        key={item.href}
                                        onClick={() => {
                                            setActivePath(item.href)
                                            if (isMobile && onCloseMobile) onCloseMobile()
                                        }}
                                        title={isCollapsed ? item.title : undefined}
                                        className={cn(
                                            "group flex items-center px-3 py-2.5 rounded-lg cursor-pointer transition-all duration-200",
                                            isCollapsed ? "justify-center" : "justify-between",
                                            isActive ? "bg-[#8E1616]/10 text-[#8E1616]" : "hover:bg-zinc-900/50 hover:text-zinc-200"
                                        )}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={cn(
                                                "w-5 h-5 min-w-5",
                                                isActive ? "text-[#8E1616]" : "text-zinc-500 group-hover:text-zinc-300"
                                            )} />
                                            {!isCollapsed && (
                                                <span className="text-sm font-medium whitespace-nowrap">{item.title}</span>
                                            )}
                                        </div>

                                        {/* Badge for Notifications */}
                                        {!isCollapsed && item.badge !== undefined && (
                                            <span className={cn(
                                                "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                                isActive ? "bg-[#8E1616] text-white" : "bg-zinc-800 text-zinc-400"
                                            )}>
                                                {item.badge}
                                            </span>
                                        )}
                                        {isCollapsed && item.badge !== undefined && (
                                            <div className="absolute top-1 right-2 w-2 h-2 bg-[#8E1616] rounded-full" />
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* 4. Footer: Usage & Profile */}
            <div className="p-3 border-t border-white/5 bg-zinc-950/30 space-y-4">

                {/* Usage Tracker (Hidden if collapsed) */}
                {!isCollapsed && (
                    <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                        <div className="flex justify-between items-end mb-2">
                            <div>
                                <p className="text-xs font-medium text-white">Monthly Usage</p>
                                <p className="text-[10px] text-zinc-500">Resets in {usage.resetDays} days</p>
                            </div>
                            <p className="text-xs font-bold text-[#8E1616]">{usage.percentage}%</p>
                        </div>
                        <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-[#8E1616] rounded-full shadow-[0_0_10px_#8E1616]" style={{ width: `${usage.percentage}%` }} />
                        </div>
                    </div>
                )}

                {/* User Profile */}
                <div className={cn(
                    "flex items-center gap-3 cursor-pointer transition-opacity",
                    isCollapsed ? "justify-center" : "justify-between px-2"
                )}>

                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        {!isCollapsed ? (
                            <div className='flex-1 items-center gap-2 flex flex-col'>
                                <SignInButton>
                                    <Button className="w-full text-white hover:text-zinc-200 font-semibold rounded-lg h-9">
                                        Login
                                    </Button>
                                </SignInButton>
                            </div>
                        ) : (
                            <SignInButton>
                                <Button size="icon" variant="ghost">
                                    <Settings className="w-5 h-5" />
                                </Button>
                            </SignInButton>
                        )}
                    </SignedOut>

                    {!isCollapsed && (
                        <div className='flex items-center'>
                            <SignOutButton>
                                <Button variant="ghost" size="icon" className="text-zinc-500 hover:text-red-500">
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </SignOutButton>
                        </div>
                    )}
                </div>
            </div>

        </aside>
    )
}

export default Sidebar