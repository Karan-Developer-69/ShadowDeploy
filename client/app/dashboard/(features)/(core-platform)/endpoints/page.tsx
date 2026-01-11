'use client'

import React, { useState, useMemo } from 'react'
import {
    Search,
    Activity,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    MoreVertical,
    Clock,
    Zap,
    CheckCircle2,
    XCircle
} from "lucide-react"

// --- TYPE DEFINITIONS ---

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
type HealthStatus = 'healthy' | 'degraded' | 'critical';

interface EndpointData {
    id: string;
    method: HttpMethod;
    path: string;
    traffic24h: number; // Total requests
    trend: number; // % change
    avgLatencyLive: number; // ms
    avgLatencyShadow: number; // ms
    errorRateLive: number; // %
    errorRateShadow: number; // %
    status: HealthStatus;
    lastActive: string;
}

// --- MOCK DATA ---

const mockEndpoints: EndpointData[] = [
    {
        id: "ep_1",
        method: "GET",
        path: "/api/v1/users",
        traffic24h: 450200,
        trend: 12,
        avgLatencyLive: 45,
        avgLatencyShadow: 48,
        errorRateLive: 0.01,
        errorRateShadow: 0.01,
        status: "healthy",
        lastActive: "Just now"
    },
    {
        id: "ep_2",
        method: "POST",
        path: "/api/v1/checkout/process",
        traffic24h: 12500,
        trend: 5,
        avgLatencyLive: 120,
        avgLatencyShadow: 350, // Huge spike!
        errorRateLive: 0.5,
        errorRateShadow: 0.5,
        status: "degraded",
        lastActive: "2 min ago"
    },
    {
        id: "ep_3",
        method: "GET",
        path: "/api/v1/products/search",
        traffic24h: 89000,
        trend: -2,
        avgLatencyLive: 80,
        avgLatencyShadow: 82,
        errorRateLive: 0.1,
        errorRateShadow: 15.5, // Breaking changes!
        status: "critical",
        lastActive: "Just now"
    },
    {
        id: "ep_4",
        method: "PUT",
        path: "/api/v1/settings/profile",
        traffic24h: 3400,
        trend: 0,
        avgLatencyLive: 60,
        avgLatencyShadow: 58,
        errorRateLive: 0,
        errorRateShadow: 0,
        status: "healthy",
        lastActive: "15 min ago"
    },
    {
        id: "ep_5",
        method: "DELETE",
        path: "/api/v1/cart/items",
        traffic24h: 850,
        trend: 1,
        avgLatencyLive: 35,
        avgLatencyShadow: 35,
        errorRateLive: 0.2,
        errorRateShadow: 0.2,
        status: "healthy",
        lastActive: "1 hr ago"
    }
];

// --- COMPONENTS ---

const Page = (): React.ReactNode => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'all' | 'critical' | 'degraded'>('all');

    // Filter Logic
    const filteredEndpoints = useMemo(() => {
        return mockEndpoints.filter(ep => {
            const matchesSearch = ep.path.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = filter === 'all' ? true : ep.status === filter;
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, filter]);

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 flex flex-col gap-8 font-sans">

            {/* 1. Header & Stats */}
            <div className="flex flex-col gap-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Endpoint Performance</h1>
                        <p className="text-zinc-500 text-sm mt-1">
                            Analyzing <span className="text-white font-medium">{mockEndpoints.length} endpoints</span> across production and shadow environments.
                        </p>
                    </div>
                    <div className="flex gap-3 mt-4 md:mt-0">
                        <button className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 hover:text-white transition-colors">
                            <Clock className="w-4 h-4" /> 24h Window
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#8E1616] hover:bg-[#701111] text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_-5px_#8E1616]">
                            <Zap className="w-4 h-4" /> Auto-Analyze
                        </button>
                    </div>
                </div>

                {/* Quick Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard
                        label="Healthy Endpoints"
                        value="92%"
                        sub="Stable performance"
                        icon={CheckCircle2}
                        color="text-green-500"
                        bg="bg-green-500/10"
                        border="border-green-500/20"
                    />
                    <StatsCard
                        label="Critical Regressions"
                        value="3"
                        sub="Requires immediate attention"
                        icon={XCircle}
                        color="text-red-500"
                        bg="bg-red-500/10"
                        border="border-red-500/20"
                    />
                    <StatsCard
                        label="Latency Degradation"
                        value="Avg +12ms"
                        sub="Shadow is slightly slower"
                        icon={Activity}
                        color="text-yellow-500"
                        bg="bg-yellow-500/10"
                        border="border-yellow-500/20"
                    />
                </div>
            </div>

            {/* 2. Main Data Table Section */}
            <div className="flex-1 bg-zinc-900/30 border border-zinc-800 rounded-2xl flex flex-col overflow-hidden shadow-2xl">

                {/* Toolbar */}
                <div className="p-4 border-b border-zinc-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-zinc-950/50">
                    <div className="relative w-full sm:w-96">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search paths (e.g., /api/checkout)..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-black/50 border border-zinc-800 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#8E1616] focus:ring-1 focus:ring-[#8E1616]"
                        />
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
                        <FilterButton label="All Endpoints" active={filter === 'all'} onClick={() => setFilter('all')} />
                        <FilterButton label="Degraded" active={filter === 'degraded'} onClick={() => setFilter('degraded')} count={1} />
                        <FilterButton label="Critical" active={filter === 'critical'} onClick={() => setFilter('critical')} count={1} alert />
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-6 py-3 bg-black border-b border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider sticky top-0 z-10">
                    <div className="col-span-5 md:col-span-4">Endpoint Name</div>
                    <div className="col-span-3 md:col-span-2 text-center">Traffic (24h)</div>
                    <div className="col-span-2 hidden md:block text-right">Latency (Diff)</div>
                    <div className="col-span-2 hidden md:block text-right">Error Rate</div>
                    <div className="col-span-4 md:col-span-2 text-right">Health Status</div>
                </div>

                {/* Table Body */}
                <div className="overflow-y-auto flex-1 bg-[#080808]">
                    {filteredEndpoints.length > 0 ? (
                        filteredEndpoints.map((ep) => (
                            <div
                                key={ep.id}
                                className="group grid grid-cols-12 gap-4 px-6 py-4 items-center border-b border-zinc-800/50 hover:bg-zinc-900/60 transition-colors cursor-pointer"
                            >

                                {/* Endpoint Name */}
                                <div className="col-span-5 md:col-span-4 flex flex-col justify-center">
                                    <div className="flex items-center gap-3 mb-1">
                                        <MethodBadge method={ep.method} />
                                        <span className="text-zinc-300 font-medium text-sm truncate font-mono" title={ep.path}>
                                            {ep.path}
                                        </span>
                                    </div>
                                    <span className="text-[10px] text-zinc-600">Last active: {ep.lastActive}</span>
                                </div>

                                {/* Traffic */}
                                <div className="col-span-3 md:col-span-2 flex flex-col items-center justify-center">
                                    <span className="text-sm font-bold text-zinc-200">{ep.traffic24h.toLocaleString()}</span>
                                    <div className={`flex items-center text-[10px] ${ep.trend >= 0 ? 'text-green-500' : 'text-zinc-500'}`}>
                                        {ep.trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                                        {Math.abs(ep.trend)}%
                                    </div>
                                </div>

                                {/* Latency Comparison (Desktop) */}
                                <div className="col-span-2 hidden md:flex flex-col items-end justify-center">
                                    <div className="flex items-center gap-2 text-sm font-mono">
                                        <span className="text-zinc-500">{ep.avgLatencyLive}ms</span>
                                        <span className="text-zinc-700">→</span>
                                        <span className={`font-bold ${ep.avgLatencyShadow > ep.avgLatencyLive * 1.5 ? 'text-yellow-500' : 'text-zinc-300'
                                            }`}>
                                            {ep.avgLatencyShadow}ms
                                        </span>
                                    </div>
                                </div>

                                {/* Error Rate (Desktop) */}
                                <div className="col-span-2 hidden md:flex flex-col items-end justify-center">
                                    <div className="flex items-center gap-2 text-sm font-mono">
                                        <span className="text-zinc-500">{ep.errorRateLive}%</span>
                                        <span className="text-zinc-700">/</span>
                                        <span className={`font-bold ${ep.errorRateShadow > ep.errorRateLive ? 'text-red-500' : 'text-zinc-300'
                                            }`}>
                                            {ep.errorRateShadow}%
                                        </span>
                                    </div>
                                    {ep.errorRateShadow > 1 && (
                                        <span className="text-[10px] text-red-500 bg-red-500/10 px-1.5 rounded mt-1">High Failures</span>
                                    )}
                                </div>

                                {/* Health Status */}
                                <div className="col-span-4 md:col-span-2 flex justify-end items-center gap-4">
                                    <HealthBadge status={ep.status} />
                                    <MoreVertical className="w-4 h-4 text-zinc-600 hover:text-white" />
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="h-40 flex flex-col items-center justify-center text-zinc-500">
                            <Search className="w-8 h-8 mb-2 opacity-50" />
                            <p>No endpoints found matching your criteria.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

// --- SUB-COMPONENTS ---

interface StatsCardProps {
    label: string
    value: string
    sub: string
    icon: React.ElementType
    color: string
    bg: string
    border: string
}

const StatsCard = ({ label, value, sub, icon: Icon, color, bg, border }: StatsCardProps) => (
    <div className={`p-4 rounded-xl border ${border} ${bg} flex items-start gap-4`}>
        <div className={`p-2 rounded-lg bg-black/20 ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
        <div>
            <p className="text-zinc-400 text-xs font-medium uppercase">{label}</p>
            <h3 className="text-xl font-bold text-white mt-1">{value}</h3>
            <p className="text-[10px] text-zinc-400 opacity-80 mt-1">{sub}</p>
        </div>
    </div>
)

interface FilterButtonProps {
    label: string
    active: boolean
    onClick: () => void
    count?: number
    alert?: boolean
}

const FilterButton = ({ label, active, onClick, count, alert }: FilterButtonProps) => (
    <button
        onClick={onClick}
        className={`
         flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all whitespace-nowrap border
         ${active
                ? `bg-zinc-100 text-black border-white`
                : `bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-200`
            }
      `}
    >
        {label}
        {count && (
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${alert ? 'bg-red-500 text-white' : 'bg-zinc-700 text-zinc-300'
                }`}>
                {count}
            </span>
        )}
    </button>
)

const MethodBadge = ({ method }: { method: HttpMethod }) => {
    const styles: Record<string, string> = {
        GET: "text-blue-400 bg-blue-950 border-blue-900",
        POST: "text-green-400 bg-green-950 border-green-900",
        PUT: "text-orange-400 bg-orange-950 border-orange-900",
        DELETE: "text-red-400 bg-red-950 border-red-900",
    }
    return (
        <span className={`w-14 text-center py-1 rounded text-[10px] font-bold border border-opacity-50 ${styles[method] || "text-zinc-400"}`}>
            {method}
        </span>
    )
}

const HealthBadge = ({ status }: { status: HealthStatus }) => {
    if (status === 'critical') {
        return (
            <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-bold">
                <XCircle className="w-3 h-3 fill-current" /> Critical
            </div>
        )
    }
    if (status === 'degraded') {
        return (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/10 border border-yellow-500/20 rounded-full text-yellow-500 text-xs font-bold">
                <AlertTriangle className="w-3 h-3 fill-current" /> Degraded
            </div>
        )
    }
    return (
        <div className="flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-green-500 text-xs font-bold">
            <CheckCircle2 className="w-3 h-3 fill-current" /> Healthy
        </div>
    )
}

export default Page