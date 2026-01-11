'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FileQuestion, ArrowLeft, LayoutDashboard } from 'lucide-react'

export default function DashboardNotFound() {
    const router = useRouter()

    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[60vh] text-center px-4 animate-in fade-in duration-300">

            <div className="relative mb-8 group">
                <div className="absolute inset-0 bg-[#8E1616]/20 blur-2xl rounded-full opacity-50 group-hover:opacity-80 transition-opacity duration-500" />
                <div className="relative p-5 bg-zinc-900/80 border border-zinc-800/80 rounded-2xl ring-1 ring-white/5 backdrop-blur-sm">
                    <FileQuestion className="w-12 h-12 text-[#8E1616]" />
                </div>
            </div>

            <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Page Not Found
            </h2>

            <p className="text-zinc-500 max-w-sm mb-8 text-sm leading-relaxed">
                The dashboard page you are looking for doesn&apos;t exist. <br />
                It might have been moved or the URL is incorrect.
            </p>

            <div className="flex items-center gap-3">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 rounded-lg"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Go Back
                </button>

                <Link
                    href="/dashboard"
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#8E1616] hover:bg-[#7a1212] rounded-lg transition-all shadow-lg shadow-[#8E1616]/20 hover:shadow-[#8E1616]/40"
                >
                    <LayoutDashboard className="w-4 h-4" />
                    Return Home
                </Link>
            </div>

            <div className="mt-12 font-mono text-[10px] text-zinc-800">
                404_ERR_DASHBOARD_ROUTE
            </div>
        </div>
    )
}
