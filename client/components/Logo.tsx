import React from 'react'
import { GitCompare } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
    collapsed?: boolean
    className?: string
}

const Logo: React.FC<LogoProps> = ({ collapsed = false, className }) => {
    return (
        <div className={cn("flex items-center gap-2", className)}>
            <div className={cn(
                "rounded-lg bg-linear-to-br from-[#8E1616] to-black border border-[#8E1616]/30 flex items-center justify-center text-white font-bold shadow-[0_0_15px_-3px_rgba(142,22,22,0.4)] transition-all duration-300",
                collapsed ? "w-8 h-8" : "w-10 h-10"
            )}>
                {collapsed ? (
                    <span className="text-xs">SD</span>
                ) : (
                    <GitCompare className="w-5 h-5" />
                )}
            </div>

            {!collapsed && (
                <div className="flex-1 overflow-hidden transition-all duration-300">
                    <h4 className="text-lg font-bold tracking-tight text-white truncate">ShadowDeploy</h4>
                </div>
            )}
        </div>
    )
}

export default Logo
