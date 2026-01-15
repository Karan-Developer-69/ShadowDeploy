'use client'

import React, { useState } from 'react'
import {
    Save,
    Trash2,
    AlertTriangle,
    Globe,
    Shield,
    Bell,
    Copy,
    Check,
    Activity,
    Layout,
    RefreshCw
} from "lucide-react"

import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { setProject, createProject, fetchProjectDetails } from '@/lib/store/features/project/projectSlice'

import { useAuth } from '@clerk/nextjs'

const Page = (): React.ReactNode => {
    const { userId } = useAuth()
    const [copied, setCopied] = useState(false)
    const dispatch = useAppDispatch()

    // Redux State
    const { currentProject } = useAppSelector((state) => state.project)

    // Local state for form inputs (initialized from Redux)
    const [localProjectName, setLocalProjectName] = useState(currentProject.name)
    const [localShadowUrl, setLocalShadowUrl] = useState(currentProject.shadowUrl)

    // Sync local state when redux state changes (e.g. initial load)
    React.useEffect(() => {
        setLocalProjectName(currentProject.name)
        setLocalShadowUrl(currentProject.shadowUrl)
    }, [currentProject])

    // Toggles
    const [settings, setSettings] = useState({
        autoPause: true,
        emailAlerts: true,
        slackIntegration: false,
        strictDiff: false
    })

    const handleCopyId = () => {
        navigator.clipboard.writeText(currentProject.projectId || "")
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const toggleSetting = (key: keyof typeof settings) => {
        setSettings(prev => ({ ...prev, [key]: !prev[key] }))
    }

    const handleSaveChanges = async () => {
        if (!userId) {
            alert("Please sign in to create a project.")
            return
        }

        if (!currentProject.projectId) {
            // Create mode
            try {
                await dispatch(createProject({
                    name: localProjectName,
                    liveUrl: "", // Removed from UI, sending empty string
                    shadowUrl: localShadowUrl,
                    userId: userId
                })).unwrap()

                // Refetch all projects to ensure frontend is in sync with backend
                await dispatch(fetchProjectDetails()).unwrap()
                alert("Project created successfully!")
            } catch (error) {
                console.error("Failed to create project:", error)
                alert("Failed to create project. Please try again.")
            }
        } else {
            // Update mode
            dispatch(setProject({
                ...currentProject,
                name: localProjectName,
                shadowUrl: localShadowUrl
            }))
            alert("Changes saved to global store!")
        }
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 font-sans pb-24">

            {/* Header */}
            <div className="max-w-4xl mx-auto mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Project Settings</h1>
                    <p className="text-zinc-400 text-sm">
                        Manage configuration for <span className="text-white font-medium">{localProjectName || "New Project"}</span>.
                    </p>
                </div>
                <button
                    onClick={handleSaveChanges}
                    className="flex items-center gap-2 px-6 py-2.5 bg-white text-black hover:bg-zinc-200 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-white/5">
                    <Save className="w-4 h-4" /> {currentProject.projectId ? "Save Changes" : "Create Project"}
                </button>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">

                {/* --- 1. General Information --- */}
                <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-2">
                        <Layout className="w-4 h-4 text-zinc-400" />
                        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">General</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Project Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Project Name</label>
                                <input
                                    type="text"
                                    value={localProjectName}
                                    onChange={(e) => setLocalProjectName(e.target.value)}
                                    placeholder="Enter project name..."
                                    className="w-full bg-black/50 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8E1616] transition-colors"
                                />
                            </div>

                            {/* Project ID (Read Only) */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300">Project ID</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={currentProject.projectId || "Not Created Yet"}
                                        readOnly
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-500 font-mono focus:outline-none cursor-copy"
                                        onClick={handleCopyId}
                                    />
                                    {currentProject.projectId && (
                                        <button
                                            onClick={handleCopyId}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white transition-colors"
                                        >
                                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                            {/* API Key (Read Only) */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-medium text-zinc-300">API Key</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={currentProject.apiKey || "Hidden / Not Created"}
                                        readOnly
                                        className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-sm text-zinc-500 font-mono focus:outline-none cursor-copy"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* --- 2. Target Configuration (The Core) --- */}
                <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-zinc-400" />
                        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Target URLs</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        <div className="p-4 bg-blue-900/10 border border-blue-900/30 rounded-lg flex gap-3 text-sm text-blue-200 mb-4">
                            <Activity className="w-5 h-5 shrink-0 text-blue-400" />
                            <p>Requests are mirrored asynchronously. Ensure your Shadow URL is accessible from our public IPs.</p>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {/* Live URL Removed as per request */}

                            {/* Shadow URL */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-[#8E1616]"></span> Shadow Environment (Target)
                                </label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-zinc-800 bg-zinc-900 text-zinc-500 text-sm">URL --&gt; </span>
                                    <input
                                        type="text"
                                        value={localShadowUrl}
                                        onChange={(e) => setLocalShadowUrl(e.target.value.startsWith('https://') || e.target.value.startsWith('http://') ? e.target.value : `${e.target.value}`)}
                                        className="flex-1 bg-black/50 border border-zinc-800 rounded-r-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8E1616] font-mono"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button className="text-sm text-zinc-400 hover:text-white flex items-center gap-2 transition-colors">
                                <RefreshCw className="w-3 h-3" /> Test Connection
                            </button>
                        </div>
                    </div>
                </section>

                {/* --- 3. Rules & Automation --- */}
                <section className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                    <div className="px-6 py-4 border-b border-zinc-800 bg-zinc-950/50 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-zinc-400" />
                        <h2 className="text-sm font-bold text-zinc-300 uppercase tracking-wider">Safety & Alerts</h2>
                    </div>

                    <div className="p-6 space-y-6">
                        {/* Toggle Item */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-medium text-white">Auto-Pause on High Error Rate</h3>
                                <p className="text-xs text-zinc-500">Automatically stop mirroring if Shadow error rate exceeds 5%.</p>
                            </div>
                            <ToggleSwitch checked={settings.autoPause} onChange={() => toggleSetting('autoPause')} />
                        </div>

                        <hr className="border-zinc-800" />

                        {/* Toggle Item */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <h3 className="text-sm font-medium text-white">Strict Diff Matching</h3>
                                <p className="text-xs text-zinc-500">Mark request as failed even if only JSON key order differs.</p>
                            </div>
                            <ToggleSwitch checked={settings.strictDiff} onChange={() => toggleSetting('strictDiff')} />
                        </div>

                        <hr className="border-zinc-800" />

                        {/* Toggle Item */}
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5 flex items-center gap-2">
                                <Bell className="w-4 h-4 text-zinc-400" />
                                <div>
                                    <h3 className="text-sm font-medium text-white">Email Alerts</h3>
                                    <p className="text-xs text-zinc-500">Receive weekly summary and critical alerts.</p>
                                </div>
                            </div>
                            <ToggleSwitch checked={settings.emailAlerts} onChange={() => toggleSetting('emailAlerts')} />
                        </div>
                    </div>
                </section>

                {/* --- 4. Danger Zone --- */}
                <section className="border border-red-900/30 bg-red-950/5 rounded-2xl overflow-hidden mt-12">
                    <div className="px-6 py-4 border-b border-red-900/20 bg-red-950/10 flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        <h2 className="text-sm font-bold text-red-500 uppercase tracking-wider">Danger Zone</h2>
                    </div>

                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div>
                            <h3 className="text-sm font-medium text-zinc-200">Delete Project</h3>
                            <p className="text-xs text-zinc-500 mt-1 max-w-md">
                                Once you delete a project, there is no going back. All collected data, diffs, and settings will be permanently removed.
                            </p>
                        </div>
                        <button className="px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 hover:border-red-500 rounded-lg text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2">
                            <Trash2 className="w-4 h-4" /> Delete Project
                        </button>
                    </div>
                </section>

            </div>
        </div>
    )
}

// --- SUB-COMPONENTS ---

const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: () => void }) => (
    <button
        onClick={onChange}
        className={`w-11 h-6 rounded-full relative transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#8E1616] focus:ring-offset-2 focus:ring-offset-black ${checked ? 'bg-[#8E1616]' : 'bg-zinc-700'}`}
    >
        <span
            className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 shadow-sm ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
    </button>
)

export default Page