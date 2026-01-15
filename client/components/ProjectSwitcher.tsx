'use client'

import React from 'react'
import { ChevronDown, Folder, Plus } from 'lucide-react'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { switchProject, resetCurrentProject } from '@/lib/store/features/project/projectSlice'
import { useRouter } from 'next/navigation'

export default function ProjectSwitcher() {
    const dispatch = useAppDispatch()
    const router = useRouter()
    const { allProjects, currentProject } = useAppSelector((state) => state.project)
    const [isOpen, setIsOpen] = React.useState(false)

    const handleProjectSwitch = (projectId: string) => {
        dispatch(switchProject(projectId))
        router.push(`/dashboard/project/${projectId}`)
        setIsOpen(false)
    }

    const handleCreateNew = () => {
        dispatch(resetCurrentProject())
        router.push('/dashboard/settings/project')
        setIsOpen(false)
    }

    if (allProjects.length === 0) {
        return null // Don't render if no projects
    }

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm hover:bg-zinc-800 transition-colors min-w-50"
            >
                <Folder className="w-4 h-4 text-zinc-400" />
                <span className="flex-1 text-left truncate text-white">
                    {currentProject.name || 'Select Project'}
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full left-0 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl z-20 max-h-75 overflow-y-auto">
                        {/* Create New Project Button */}
                        <button
                            onClick={handleCreateNew}
                            className="w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-700"
                        >
                            <div className="flex items-center gap-2">
                                <Plus className="w-4 h-4 text-green-500" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-green-400">Create New Project</p>
                                    <p className="text-xs text-zinc-500">Start a new project from scratch</p>
                                </div>
                            </div>
                        </button>

                        {/* Existing Projects */}
                        {allProjects.map((project) => (
                            <button
                                key={project.projectId}
                                onClick={() => handleProjectSwitch(project.projectId)}
                                className={`w-full text-left px-4 py-3 hover:bg-zinc-800 transition-colors border-b border-zinc-800 last:border-b-0 ${currentProject.projectId === project.projectId ? 'bg-zinc-800' : ''
                                    }`}
                            >
                                <div className="flex items-center gap-2">
                                    <Folder className="w-4 h-4 text-zinc-400" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-white">{project.name}</p>
                                        <p className="text-xs text-zinc-500">{project.projectId}</p>
                                    </div>
                                    {currentProject.projectId === project.projectId && (
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    )
}
