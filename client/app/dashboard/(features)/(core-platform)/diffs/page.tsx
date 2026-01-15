'use client'

import React, { useState, useMemo } from 'react'
import {
    GitCompare,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Clock,
    Code2,
    FileJson,
    Loader2,
    AlertCircle
} from "lucide-react"

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { fetchRecentDiffs } from '@/lib/store/features/diff/diffSlice'
import ProjectSwitcher from '@/components/ProjectSwitcher'
import { useEffect } from 'react'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

// --- COMPONENT: Json Diff Viewer ---

interface JsonDiffRowProps {
    lKey: string
    lVal: JsonValue | undefined
    rVal: JsonValue | undefined
    depth?: number
}

const JsonDiffRow = ({
    lKey,
    lVal,
    rVal,
    depth = 0
}: JsonDiffRowProps) => {

    const indent = depth * 20;

    // Logic to determine diff type
    const isMissingInShadow = rVal === undefined;
    const isDifferent = !isMissingInShadow && JSON.stringify(lVal) !== JSON.stringify(rVal);
    const isObject = typeof lVal === 'object' && lVal !== null && !Array.isArray(lVal);

    if (isObject && !isMissingInShadow) {
        // Recursive render for objects
        // Cast to object for iteration
        const lObj = lVal as { [key: string]: JsonValue };
        const rObj = rVal as { [key: string]: JsonValue } | undefined;

        return (
            <>
                <div className="flex flex-col md:flex-row border-b border-zinc-900 hover:bg-white/5">
                    <div className="w-full md:w-1/2 p-2 font-mono text-sm text-zinc-400 pl-4" style={{ paddingLeft: `${indent + 16}px` }}>&quot;{lKey}&quot;: {"{"}</div>
                    <div className="w-full md:w-1/2 p-2 font-mono text-sm text-zinc-400 border-t md:border-t-0 md:border-l border-zinc-800 pl-4" style={{ paddingLeft: `${indent + 16}px` }}>&quot;{lKey}&quot;: {"{"}</div>
                </div>
                {Object.keys(lObj).map(childKey => (
                    <JsonDiffRow
                        key={childKey}
                        lKey={childKey}
                        lVal={lObj[childKey]}
                        rVal={rObj?.[childKey]}
                        depth={depth + 1}
                    />
                ))}
                <div className="flex flex-col md:flex-row border-b border-zinc-900">
                    <div className="w-full md:w-1/2 p-2 font-mono text-sm text-zinc-400 pl-4" style={{ paddingLeft: `${indent + 16}px` }}>{"}"}</div>
                    <div className="w-full md:w-1/2 p-2 font-mono text-sm text-zinc-400 border-t md:border-t-0 md:border-l border-zinc-800 pl-4" style={{ paddingLeft: `${indent + 16}px` }}>{"}"}</div>
                </div>
            </>
        )
    }

    return (
        <div className={`flex flex-col md:flex-row border-b border-zinc-800/50 transition-colors ${isMissingInShadow ? 'bg-red-900/10' : isDifferent ? 'bg-yellow-900/10' : ''
            }`}>
            {/* Live Side */}
            <div className="w-full md:w-1/2 p-2 font-mono text-sm text-zinc-300 break-all" style={{ paddingLeft: `${indent + 16}px` }}>
                <div className="md:hidden text-[10px] text-zinc-600 uppercase mb-1">Live</div>
                <span className="text-zinc-500">&quot;{lKey}&quot;:</span> <span className="text-green-300">{JSON.stringify(lVal)}</span>
            </div>

            {/* Shadow Side */}
            <div className="w-full md:w-1/2 p-2 font-mono text-sm text-zinc-300 border-t md:border-t-0 md:border-l border-zinc-800 break-all relative" style={{ paddingLeft: `${indent + 16}px` }}>
                <div className="md:hidden text-[10px] text-zinc-600 uppercase mb-1">Shadow</div>
                {isMissingInShadow ? (
                    <span className="text-red-500 text-xs font-bold uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded">Missing</span>
                ) : (
                    <>
                        <span className="text-zinc-500">&quot;{lKey}&quot;:</span> <span className={`${isDifferent ? 'text-yellow-400 font-bold' : 'text-zinc-300'}`}>{JSON.stringify(rVal)}</span>
                        {isDifferent && <span className="absolute right-2 top-2 w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />}
                    </>
                )}
            </div>
        </div>
    )
}


// --- MAIN PAGE COMPONENT ---

const Page = (): React.ReactNode => {
    const { detailedComparisons, loading, error } = useAppSelector((state) => state.diff);
    const { currentProject } = useAppSelector((state) => state.project);
    const dispatch = useAppDispatch();
    const [selectedId, setSelectedId] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'body' | 'headers'>('body');

    // Fetch data on mount and when project changes
    useEffect(() => {
        if (currentProject.projectId) {
            dispatch(fetchRecentDiffs());
        }
    }, [dispatch, currentProject.projectId]);

    // Initialize selectedId when data is available
    React.useEffect(() => {
        if (detailedComparisons.length > 0 && !selectedId) {
            setSelectedId(detailedComparisons[0].meta.id);
        }
    }, [detailedComparisons, selectedId]);

    // Find currently selected data
    const currentData = useMemo(() =>
        detailedComparisons.find(c => c.meta.id === selectedId) || detailedComparisons[0],
        [selectedId, detailedComparisons]);

    // Helper to ensure body/headers are objects, not strings
    const ensureObject = (data: unknown): Record<string, JsonValue> => {
        if (typeof data === 'string') {
            try {
                return JSON.parse(data);
            } catch {
                return { value: data };
            }
        }
        return (data as Record<string, JsonValue>) || {} as Record<string, JsonValue>;
    };

    // Normalize current data to ensure bodies are always objects
    const normalizedData = useMemo(() => {
        if (!currentData) return null;
        return {
            ...currentData,
            live: {
                ...currentData.live,
                body: ensureObject(currentData.live.body),
                headers: ensureObject(currentData.live.headers)
            },
            shadow: {
                ...currentData.shadow,
                body: ensureObject(currentData.shadow.body),
                headers: ensureObject(currentData.shadow.headers)
            }
        };
    }, [currentData]);

    // Calculate stats from data
    const stats = useMemo(() => {
        const critical = detailedComparisons.filter(d => d.diffSummary.breakingScore > 50).length;
        const warnings = detailedComparisons.filter(d => d.diffSummary.breakingScore > 0 && d.diffSummary.breakingScore <= 50).length;
        return { critical, warnings };
    }, [detailedComparisons]);

    // Use normalized data for rendering
    const displayData = normalizedData || currentData;

    // Loading state
    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-[#8E1616] animate-spin mx-auto mb-4" />
                    <p className="text-zinc-400">Loading diff comparisons...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Error Loading Diffs</h2>
                    <p className="text-zinc-400 mb-4">{error}</p>
                    <button
                        onClick={() => dispatch(fetchRecentDiffs(currentProject.projectId))}
                        className="px-4 py-2 bg-[#8E1616] hover:bg-[#8E1616]/80 rounded-lg transition-colors"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    // Empty state
    if (detailedComparisons.length === 0) {
        return (
            <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="text-center max-w-md">
                    <GitCompare className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">No Diff Data Available</h2>
                    <p className="text-zinc-400">
                        Start sending requests through your shadow deployment to see comparisons here.
                    </p>
                </div>
            </div>
        );
    }

    if (!displayData) return null;

    return (
        <div className="h-screen flex flex-col bg-[#050505] text-white overflow-hidden">

            {/* Header */}
            <header className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-[#8E1616]/10 rounded-lg">
                        <GitCompare className="w-5 h-5 text-[#8E1616]" />
                    </div>
                    <h1 className="text-base md:text-lg font-bold tracking-tight">Comparison Engine</h1>
                </div>
                <div className="flex items-center gap-3">
                    <ProjectSwitcher />
                    <div className="hidden md:flex items-center gap-4 text-sm text-zinc-500">
                        <span>Environment: <span className="text-zinc-200">Production</span></span>
                        <span className="h-4 w-px bg-zinc-800" />
                        <span>Baseline: <span className="text-green-500">v1.2.0</span></span>
                        <span>Candidate: <span className="text-[#8E1616]">v1.3.0-rc</span></span>
                    </div>
                </div>
            </header>

            {/* Main Content: Split Layout */}
            <div className="flex-1 flex flex-col md:flex-row overflow-hidden">

                {/* LEFT: Request List (Sidebar) */}
                <aside className="w-full md:w-80 h-48 md:h-auto flex-none border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/30 flex flex-col">
                    <div className="p-4 border-b border-zinc-800">
                        <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">Recent Mismatches</h3>
                        <div className="flex gap-2">
                            <span className="px-2 py-1 bg-red-500/10 text-red-500 text-xs rounded border border-red-500/20">{stats.critical} Critical</span>
                            <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 text-xs rounded border border-yellow-500/20">{stats.warnings} Warnings</span>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        {detailedComparisons.map((item) => (
                            <div
                                key={item.meta.id}
                                onClick={() => setSelectedId(item.meta.id)}
                                className={`
                    p-4 border-b border-zinc-800/50 cursor-pointer transition-all hover:bg-zinc-900
                    ${selectedId === item.meta.id ? 'bg-[#8E1616]/5 border-l-2 border-l-[#8E1616]' : 'border-l-2 border-l-transparent'}
                  `}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${item.meta.method === 'GET' ? 'text-blue-400 bg-blue-900/20' :
                                        item.meta.method === 'POST' ? 'text-green-400 bg-green-900/20' : 'text-zinc-400'
                                        }`}>{item.meta.method}</span>
                                    <span className="text-xs text-zinc-500 font-mono">{item.meta.timestamp}</span>
                                </div>
                                <p className="text-sm font-medium text-zinc-300 truncate mb-2">{item.meta.path}</p>

                                <div className="flex gap-2">
                                    {/* Status Indicator */}
                                    {item.diffSummary.statusMatch ? (
                                        <div className="flex items-center gap-1 text-[10px] text-zinc-500">
                                            <CheckCircle2 className="w-3 h-3 text-green-500" /> Status
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1 text-[10px] text-red-400 bg-red-400/10 px-1.5 rounded">
                                            <XCircle className="w-3 h-3" /> Status
                                        </div>
                                    )}

                                    {/* Body Indicator */}
                                    {!item.diffSummary.bodyMatch && (
                                        <div className="flex items-center gap-1 text-[10px] text-yellow-400 bg-yellow-400/10 px-1.5 rounded">
                                            <AlertTriangle className="w-3 h-3" /> Body Diff
                                        </div>
                                    )}

                                    {/* 404 Indicator */}
                                    {item.shadow.status === 404 && (
                                        <div className="flex items-center gap-1 text-[10px] text-orange-400 bg-orange-400/10 px-1.5 rounded">
                                            <XCircle className="w-3 h-3" /> 404
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* RIGHT: Detailed Diff View */}
                <main className="flex-1 flex flex-col bg-[#050505] min-w-0">

                    {/* 1. Request Summary Bar */}
                    <div className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/20">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <span className="text-xl font-mono text-white font-bold">{displayData.meta.method}</span>
                            <span className="text-lg text-zinc-400 truncate">{displayData.meta.path}</span>
                        </div>

                        {/* Breaking Score Badge */}
                        <div className="flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] text-zinc-500 uppercase font-bold">Risk Score</p>
                                <p className={`text-lg font-bold leading-none ${displayData.diffSummary.breakingScore > 50 ? 'text-red-500' :
                                    displayData.diffSummary.breakingScore > 0 ? 'text-yellow-500' : 'text-green-500'
                                    }`}>
                                    {displayData.diffSummary.breakingScore}%
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Stats & Controls */}
                    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 border-b border-zinc-800">

                        {/* LIVE CARD */}
                        <div className="bg-zinc-900/30 rounded-xl p-4 border border-zinc-800">
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
                                    <span className="text-sm font-bold text-zinc-300">LIVE (Baseline)</span>
                                </div>
                                <StatusBadge status={displayData.live.status} />
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{displayData.live.latency}ms</span>
                            </div>
                        </div>

                        {/* SHADOW CARD */}
                        <div className="bg-[#8E1616]/5 rounded-xl p-4 border border-[#8E1616]/30 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-1 bg-[#8E1616] rounded-bl-lg">
                                <GitCompare className="w-3 h-3 text-white" />
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-[#8E1616] shadow-[0_0_8px_rgba(142,22,22,0.6)]"></div>
                                    <span className="text-sm font-bold text-zinc-300">SHADOW (Candidate)</span>
                                </div>
                                <StatusBadge status={displayData.shadow.status} />
                            </div>
                            <div className="flex items-center gap-2 text-zinc-400 text-sm">
                                <Clock className="w-4 h-4" />
                                <span className={displayData.shadow.latency > displayData.live.latency ? 'text-yellow-500' : 'text-green-500'}>
                                    {displayData.shadow.latency}ms
                                </span>
                                <span className="text-xs text-zinc-600">
                                    ({displayData.diffSummary.latencyDiff > 0 ? '+' : ''}{displayData.diffSummary.latencyDiff}ms)
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* 3. The Diff Viewer Area */}
                    <div className="flex-1 flex flex-col min-h-0">
                        {/* Tabs */}
                        <div className="flex px-6 border-b border-zinc-800">
                            <button
                                onClick={() => setActiveTab('body')}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'body' ? 'border-[#8E1616] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <Code2 className="w-4 h-4" /> Response Body
                            </button>
                            <button
                                onClick={() => setActiveTab('headers')}
                                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === 'headers' ? 'border-[#8E1616] text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'
                                    }`}
                            >
                                <FileJson className="w-4 h-4" /> Headers
                            </button>
                        </div>

                        {/* Code View Area */}
                        <div className="flex-1 overflow-y-auto bg-[#0a0a0a] relative">

                            {/* Header for Columns */}
                            <div className="hidden md:flex sticky top-0 z-10 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur text-xs font-mono text-zinc-500 uppercase tracking-wider">
                                <div className="w-1/2 p-2 pl-6">Live Output</div>
                                <div className="w-1/2 p-2 pl-6 border-l border-zinc-800">Shadow Output</div>
                            </div>

                            {/* Actual Diff Rendering */}
                            <div className="pb-10">
                                {activeTab === 'body' ? (
                                    Object.keys(displayData.live.body).map((key) => (
                                        <JsonDiffRow
                                            key={key}
                                            lKey={key}
                                            lVal={displayData.live.body[key]}
                                            rVal={displayData.shadow.body[key]}
                                        />
                                    ))
                                ) : (
                                    // Headers View (Simplified for demo)
                                    <div className="p-6 text-zinc-500 italic text-center">
                                        Headers Comparison is similar to Body...
                                    </div>
                                )}

                                {/* Handle Keys only in Shadow (New fields) */}
                                {/* In a real app, you'd merge keys before mapping, but for mock this is omitted for brevity */}
                            </div>
                        </div>
                    </div>

                </main>
            </div>
        </div>
    )
}

// --- SUB COMPONENTS ---

const StatusBadge = ({ status }: { status: number }) => {
    let color: string;

    if (status >= 200 && status < 300) {
        // Success (2xx)
        color = 'bg-green-500/20 text-green-400 border-green-500/30';
    } else if (status === 404) {
        // Not Found
        color = 'bg-orange-500/20 text-orange-400 border-orange-500/30';
    } else if (status >= 400 && status < 500) {
        // Client errors (4xx)
        color = 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    } else if (status >= 500) {
        // Server errors (5xx)
        color = 'bg-red-500/20 text-red-400 border-red-500/30';
    } else {
        // Other
        color = 'bg-zinc-500/20 text-zinc-400 border-zinc-500/30';
    }

    return (
        <span className={`px-2.5 py-0.5 rounded text-xs font-mono font-bold border ${color}`}>
            {status}
        </span>
    )
}

export default Page