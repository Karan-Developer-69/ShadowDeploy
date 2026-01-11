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
    Code2
} from "lucide-react"
import { SignedIn, SignedOut, SignInButton, SignOutButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { Button } from './ui/button'
import Link from 'next/link'

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

const Sidebar = () => {
    const [activePath, setActivePath] = useState('/dashboard')

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
            label: "Billing & Team",
            items: [
                { title: "Subscription", icon: CreditCard, href: "/dashboard/payment/billing" },
                { title: "Team Members", icon: Layers, href: "/dashboard/payment/team" },
            ]
        }
    ]

    return (
        <aside className="h-screen w-72 bg-[#050505] border-r border-white/5 flex flex-col justify-between text-zinc-400 select-none">

            {/* 1. Workspace / Project Switcher */}
            <div className="p-6 pb-2">
                <div className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-white/5 cursor-pointer transition-colors border border-transparent hover:border-white/5 group">
                    <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#8E1616] to-black border border-[#8E1616]/30 flex items-center justify-center text-white font-bold shadow-[0_0_15px_-3px_rgba(142,22,22,0.4)]">
                        SD
                    </div>
                    <div className="flex-1 overflow-hidden">
                        <h4 className="text-sm font-medium text-white truncate">ShadowDeploy</h4>
                        <p className="text-xs text-zinc-500 truncate">Pro Plan Team</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
                </div>
            </div>

            {/* 2. Navigation Scroll Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-8 scrollbar-hide">
                {navSections.map((section, idx) => (
                    <div key={idx}>
                        <h3 className="px-4 text-[10px] uppercase tracking-wider font-semibold text-zinc-600 mb-2">
                            {section.label}
                        </h3>
                        <div className="space-y-1">
                            {section.items.map((item) => {
                                const isActive = activePath === item.href
                                return (
                                    <Link
                                        href={item.href}
                                        key={item.href}
                                        onClick={() => setActivePath(item.href)}
                                        className={`
                      group flex items-center justify-between px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200
                      ${isActive
                                                ? "bg-[#8E1616]/10 text-[#8E1616]"
                                                : "hover:bg-zinc-900/50 hover:text-zinc-200"
                                            }
                    `}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className={`w-4 h-4 ${isActive ? "text-[#8E1616]" : "text-zinc-500 group-hover:text-zinc-300"}`} />
                                            <span className="text-sm font-medium">{item.title}</span>
                                        </div>

                                        {/* Badge for Notifications (e.g., Live Errors) */}
                                        {item.badge && (
                                            <span className={`
                        text-[10px] px-2 py-0.5 rounded-full font-bold
                        ${isActive
                                                    ? "bg-[#8E1616] text-white"
                                                    : "bg-zinc-800 text-zinc-400"
                                                }
                      `}>
                                                {item.badge}
                                            </span>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                ))}
            </div>

            {/* 3. Footer: Usage & Profile */}
            <div className="p-4 border-t border-white/5 bg-zinc-950/30 space-y-4">

                {/* Usage Tracker (SaaS Logic) */}
                <div className="bg-zinc-900/50 rounded-xl p-4 border border-white/5">
                    <div className="flex justify-between items-end mb-2">
                        <div>
                            <p className="text-xs font-medium text-white">Monthly Usage</p>
                            <p className="text-[10px] text-zinc-500">Resets in 12 days</p>
                        </div>
                        <p className="text-xs font-bold text-[#8E1616]">78%</p>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full w-[78%] bg-[#8E1616] rounded-full shadow-[0_0_10px_#8E1616]" />
                    </div>
                    <p className="text-[10px] text-zinc-500 mt-2 text-center">
                        780k / 1M Requests
                    </p>
                </div>

                {/* User Profile */}
                <div className="flex items-center gap-3 px-2 pt-2 cursor-pointer justify-between transition-opacity">

                    <SignedIn>
                        <UserButton />
                    </SignedIn>

                    <SignedOut>
                        <div className='flex-1 items-center gap-4'>
                            <SignInButton>
                                <Button className="text-white hover:text-zinc-200 font-semibold rounded-full px-6">
                                    Login
                                </Button>
                            </SignInButton>
                            <SignUpButton>
                                <Button className="bg-white text-black hover:bg-zinc-200 font-semibold rounded-full px-6">
                                    Get Started
                                </Button>
                            </SignUpButton>
                        </div>
                    </SignedOut>
                    <div className='flex items-center'>
                        <SignOutButton>
                            <Button className="text-red-700  hover:text-red-800 cursor-pointer font-semibold rounded-full px-6">
                                <LogOut />
                            </Button>
                        </SignOutButton>
                    </div>
                </div>
            </div>

        </aside>
    )
}

export default Sidebar