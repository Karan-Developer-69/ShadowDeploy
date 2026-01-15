'use client'

import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { updateProject } from '@/lib/store/features/project/projectSlice'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Check, ArrowLeft, Loader2 } from 'lucide-react'

export default function ProjectSettingsPage() {
    const params = useParams()
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { currentProject, loading } = useAppSelector((state) => state.project)
    const projectId = params.id as string

    const [formData, setFormData] = useState({
        name: '',
        liveUrl: '',
        shadowUrl: '',
    })
    const [copiedField, setCopiedField] = useState<string | null>(null)
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle')
    const [hasChanges, setHasChanges] = useState(false)

    // Load project data
    useEffect(() => {
        if (currentProject.projectId === projectId) {
            setFormData({
                name: currentProject.name || '',
                liveUrl: currentProject.liveUrl || '',
                shadowUrl: currentProject.shadowUrl || '',
            })
        }
    }, [currentProject, projectId])

    // Track changes
    useEffect(() => {
        const changed =
            formData.name !== (currentProject.name || '') ||
            formData.liveUrl !== (currentProject.liveUrl || '') ||
            formData.shadowUrl !== (currentProject.shadowUrl || '')
        setHasChanges(changed)
    }, [formData, currentProject])

    const handleCopy = async (text: string, field: string) => {
        await navigator.clipboard.writeText(text)
        setCopiedField(field)
        setTimeout(() => setCopiedField(null), 2000)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
        setSaveStatus('idle')
    }

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            await dispatch(updateProject({
                projectId,
                ...formData
            })).unwrap()

            setSaveStatus('success')
            setHasChanges(false)
            setTimeout(() => setSaveStatus('idle'), 3000)
        } catch (error) {
            console.error('Failed to update project:', error)
            setSaveStatus('error')
            setTimeout(() => setSaveStatus('idle'), 3000)
        }
    }

    const handleCancel = () => {
        setFormData({
            name: currentProject.name || '',
            liveUrl: currentProject.liveUrl || '',
            shadowUrl: currentProject.shadowUrl || '',
        })
        setHasChanges(false)
        setSaveStatus('idle')
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold">Project Settings</h1>
                        <p className="text-muted-foreground mt-1">
                            Manage your project configuration
                        </p>
                    </div>
                </div>

                {/* Status Messages */}
                {saveStatus === 'success' && (
                    <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 px-4 py-3 rounded-lg flex items-center gap-2">
                        <Check className="h-5 w-5" />
                        <span>Project updated successfully!</span>
                    </div>
                )}
                {saveStatus === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400 px-4 py-3 rounded-lg">
                        Failed to update project. Please try again.
                    </div>
                )}

                <div className="grid gap-6">
                    {/* Read-only Information */}
                    <div className="bg-card border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Project Credentials</h2>
                        <p className="text-sm text-muted-foreground">
                            These credentials are read-only and cannot be changed.
                        </p>

                        <div className="space-y-4">
                            {/* Project ID */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">Project ID</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentProject.projectId}
                                        readOnly
                                        className="bg-muted/50 cursor-not-allowed"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCopy(currentProject.projectId, 'projectId')}
                                    >
                                        {copiedField === 'projectId' ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            {/* API Key */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium">API Key</label>
                                <div className="flex gap-2">
                                    <Input
                                        value={currentProject.apiKey}
                                        readOnly
                                        type="password"
                                        className="bg-muted/50 cursor-not-allowed font-mono"
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        size="icon"
                                        onClick={() => handleCopy(currentProject.apiKey, 'apiKey')}
                                    >
                                        {copiedField === 'apiKey' ? (
                                            <Check className="h-4 w-4 text-green-500" />
                                        ) : (
                                            <Copy className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                    Keep this secret! Your API key is used to authenticate requests.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Editable Settings */}
                    <form onSubmit={handleSave} className="bg-card border rounded-lg p-6 space-y-4">
                        <h2 className="text-lg font-semibold">Project Configuration</h2>
                        <p className="text-sm text-muted-foreground">
                            Update your project details below.
                        </p>

                        <div className="space-y-4">
                            {/* Project Name */}
                            <div className="space-y-2">
                                <label htmlFor="name" className="text-sm font-medium">
                                    Project Name <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="My Awesome Project"
                                    required
                                />
                            </div>

                            {/* Live URL */}
                            <div className="space-y-2">
                                <label htmlFor="liveUrl" className="text-sm font-medium">
                                    Live URL <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="liveUrl"
                                    name="liveUrl"
                                    type="url"
                                    value={formData.liveUrl}
                                    onChange={handleChange}
                                    placeholder="https://api.example.com"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your production environment URL
                                </p>
                            </div>

                            {/* Shadow URL */}
                            <div className="space-y-2">
                                <label htmlFor="shadowUrl" className="text-sm font-medium">
                                    Shadow URL <span className="text-red-500">*</span>
                                </label>
                                <Input
                                    id="shadowUrl"
                                    name="shadowUrl"
                                    type="url"
                                    value={formData.shadowUrl}
                                    onChange={handleChange}
                                    placeholder="https://staging.example.com"
                                    required
                                />
                                <p className="text-xs text-muted-foreground">
                                    Your staging/testing environment URL
                                </p>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4">
                            <Button
                                type="submit"
                                disabled={!hasChanges || loading}
                                className="min-w-[100px]"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    'Save Changes'
                                )}
                            </Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={!hasChanges || loading}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
