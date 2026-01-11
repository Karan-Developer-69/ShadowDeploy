'use client'

import React, { useState } from 'react'
import {
    Key,
    Copy,
    Check,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    Terminal,
    Lock,
    RefreshCw,
    AlertTriangle
} from "lucide-react"

// --- TYPES ---
interface ApiKey {
    id: string;
    name: string;
    prefix: string;
    key: string; // The secret
    created: string;
    lastUsed: string;
}

interface EnvVar {
    id: string;
    key: string;
    value: string;
    isSecret: boolean;
}

// --- MOCK DATA ---
const initialKeys: ApiKey[] = [
    { id: "key_1", name: "Production Key", prefix: "sd_live", key: "sd_live_8x92nm...992mkLO", created: "Oct 12, 2024", lastUsed: "Just now" },
    { id: "key_2", name: "Development Key", prefix: "sd_test", key: "sd_test_772mnB...881pqXY", created: "Nov 01, 2024", lastUsed: "2 days ago" },
]

const initialEnvs: EnvVar[] = [
    { id: "env_1", key: "DATABASE_URL", value: "postgres://user:pass@db.shadowdeploy.com", isSecret: true },
    { id: "env_2", key: "NEXT_PUBLIC_API_URL", value: "https://api.shadowdeploy.com/v1", isSecret: false },
]

const Page = (): React.ReactNode => {
    const [keys, setKeys] = useState<ApiKey[]>(initialKeys)
    const [envs, setEnvs] = useState<EnvVar[]>(initialEnvs)

    // UI State for Copy/Visibility
    const [visibleKeyId, setVisibleKeyId] = useState<string | null>(null)
    const [copiedId, setCopiedId] = useState<string | null>(null)

    // Handlers
    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
    }

    const toggleVisibility = (id: string) => {
        setVisibleKeyId(visibleKeyId === id ? null : id)
    }

    const handleDeleteKey = (id: string) => {
        setKeys(keys.filter(k => k.id !== id))
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 font-sans pb-20">

            {/* 1. Page Header */}
            <div className="max-w-5xl mx-auto mb-10">
                <h1 className="text-2xl font-bold tracking-tight mb-2">API Keys & Environment</h1>
                <p className="text-zinc-400 text-sm max-w-2xl">
                    Manage access tokens for the ShadowDeploy CLI and configure environment variables for your shadow instances.
                    <span className="text-[#8E1616] ml-1 font-medium">Never share these keys publicly.</span>
                </p>
            </div>

            <div className="max-w-5xl mx-auto space-y-12">

                {/* --- SECTION 1: API KEYS --- */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                                <Key className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Active API Keys</h2>
                                <p className="text-xs text-zinc-500">Authentication tokens for external access.</p>
                            </div>
                        </div>
                        <button className="flex items-center gap-2 px-4 py-2 bg-[#8E1616] hover:bg-[#701111] text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_-8px_#8E1616]">
                            <Plus className="w-4 h-4" /> Create New Key
                        </button>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                        {keys.map((key, index) => (
                            <div
                                key={key.id}
                                className={`
                    p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6
                    ${index !== keys.length - 1 ? 'border-b border-zinc-800' : ''}
                  `}
                            >
                                {/* Key Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-2">
                                        <h3 className="font-semibold text-zinc-200">{key.name}</h3>
                                        <span className="px-2 py-0.5 rounded-full bg-zinc-800 text-[10px] text-zinc-400 border border-zinc-700">
                                            {key.prefix}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-3 group">
                                        <div className="font-mono text-sm bg-black/50 px-3 py-1.5 rounded border border-zinc-800 text-zinc-400 min-w-70 flex items-center justify-between">
                                            <span>
                                                {visibleKeyId === key.id ? key.key : `${key.prefix}_•••••••••••••••••••••`}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => toggleVisibility(key.id)}
                                            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {visibleKeyId === key.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                        <button
                                            onClick={() => handleCopy(key.key, key.id)}
                                            className="p-1.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-colors relative"
                                        >
                                            {copiedId === key.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                {/* Meta Stats */}
                                <div className="flex items-center gap-8 text-xs text-zinc-500">
                                    <div>
                                        <p className="mb-1 uppercase tracking-wider font-bold opacity-70">Created</p>
                                        <p className="text-zinc-300">{key.created}</p>
                                    </div>
                                    <div>
                                        <p className="mb-1 uppercase tracking-wider font-bold opacity-70">Last Used</p>
                                        <p className="text-zinc-300">{key.lastUsed}</p>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteKey(key.id)}
                                        className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded transition-colors text-zinc-600"
                                        title="Revoke Key"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mt-4 flex items-start gap-3 p-3 bg-yellow-900/10 border border-yellow-900/30 rounded-lg text-yellow-500/80 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p>If you suspect a key has been compromised, revoke it immediately. API requests using a revoked key will fail.</p>
                    </div>
                </section>


                {/* --- SECTION 2: INTEGRATION SNIPPET --- */}
                <section className="bg-black border border-zinc-800 rounded-xl p-6 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
                        <Terminal className="w-24 h-24 text-zinc-700" />
                    </div>

                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <Terminal className="w-5 h-5 text-[#8E1616]" /> Quick Integration
                    </h3>

                    <div className="bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-sm overflow-x-auto">
                        <div className="flex items-center justify-between text-zinc-500 mb-2 border-b border-zinc-900 pb-2">
                            <span>BASH / CURL</span>
                            <span className="text-xs">Copy</span>
                        </div>
                        <p className="text-zinc-300">
                            <span className="text-[#8E1616]">curl</span> -X POST https://api.shadowdeploy.com/v1/shadow \<br />
                            &nbsp;&nbsp;-H <span className="text-green-500">&ldquo;Authorization: Bearer sd_live_8x92nm...&ldquo;</span> \<br />
                            &nbsp;&nbsp;-d <span className="text-yellow-500">&apos;{`{"target": "http://localhost:3000"}`}&apos;</span>
                        </p>
                    </div>
                </section>


                {/* --- SECTION 3: ENVIRONMENT VARIABLES --- */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                        <div className="flex items-center gap-2">
                            <div className="p-2 bg-zinc-900 rounded-lg border border-zinc-800">
                                <Lock className="w-5 h-5 text-zinc-400" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Environment Variables</h2>
                                <p className="text-xs text-zinc-500">Secrets injected into your Shadow Container at runtime.</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm transition-colors">
                                <RefreshCw className="w-3.5 h-3.5" /> Sync
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 rounded-lg text-sm transition-colors">
                                <Plus className="w-3.5 h-3.5" /> Add Variable
                            </button>
                        </div>
                    </div>

                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl overflow-hidden">
                        {/* Header Row */}
                        <div className="grid grid-cols-12 px-6 py-3 bg-zinc-950/50 border-b border-zinc-800 text-xs font-bold text-zinc-500 uppercase tracking-wider">
                            <div className="col-span-4">Key</div>
                            <div className="col-span-7">Value</div>
                            <div className="col-span-1 text-right">Action</div>
                        </div>

                        {/* Env Rows */}
                        <div className="divide-y divide-zinc-800">
                            {envs.map((env) => (
                                <div key={env.id} className="grid grid-cols-12 px-6 py-4 items-center gap-4 hover:bg-zinc-900/40 transition-colors group">

                                    {/* Key Input */}
                                    <div className="col-span-12 md:col-span-4">
                                        <input
                                            type="text"
                                            value={env.key}
                                            readOnly
                                            className="w-full bg-transparent text-sm font-mono text-zinc-300 focus:outline-none cursor-default"
                                        />
                                    </div>

                                    {/* Value Input */}
                                    <div className="col-span-11 md:col-span-7 relative">
                                        <div className="relative group/input">
                                            <input
                                                type={visibleKeyId === env.id ? "text" : "password"}
                                                value={env.value}
                                                readOnly
                                                className="w-full bg-zinc-950/50 border border-zinc-800 rounded px-3 py-2 text-sm font-mono text-zinc-400 focus:outline-none focus:border-[#8E1616] pr-10"
                                            />
                                            <button
                                                onClick={() => toggleVisibility(env.id)}
                                                className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-300"
                                            >
                                                {visibleKeyId === env.id ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="col-span-1 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-zinc-600 hover:text-red-500 transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            {/* New Variable Placeholder Row */}
                            <div className="grid grid-cols-12 px-6 py-3 items-center gap-4 bg-zinc-950/30">
                                <div className="col-span-12 md:col-span-4">
                                    <input type="text" placeholder="NEW_VAR_KEY" className="w-full bg-transparent text-sm font-mono text-zinc-500 placeholder:text-zinc-700 focus:outline-none" />
                                </div>
                                <div className="col-span-12 md:col-span-7">
                                    <input type="text" placeholder="Value..." className="w-full bg-transparent text-sm font-mono text-zinc-500 placeholder:text-zinc-700 focus:outline-none" />
                                </div>
                                <div className="col-span-1 text-right">
                                    <button className="text-zinc-600 hover:text-[#8E1616]">
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </div>
        </div>
    )
}

export default Page