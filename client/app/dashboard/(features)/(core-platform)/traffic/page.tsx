'use client'

import React, { useState, useMemo } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Search,
  Filter,
  MoreHorizontal,
  ArrowRight,
  WifiOff,
  AlertCircle,
  Download
} from "lucide-react"
import { ModeToggle } from "@/components/mode-toggle"
import { useAppSelector, useAppDispatch } from '@/lib/store/hooks'
import { fetchTrafficLogs } from '@/lib/store/features/traffic/trafficSlice'
import { exportToCSV } from '@/lib/utils/export'
import ProjectSwitcher from '@/components/ProjectSwitcher'
import { useEffect } from 'react'

const Page = (): React.ReactNode => {
  const dispatch = useAppDispatch()
  const [isPaused, setIsPaused] = useState(false)
  const [filterText, setFilterText] = useState('')
  const [methodFilter, setMethodFilter] = useState<string>('all')
  const [errorsOnly, setErrorsOnly] = useState(false)
  const { liveLogs, loading } = useAppSelector((state) => state.traffic)
  const { currentProject } = useAppSelector((state) => state.project)

  // Apply filters
  const filteredLogs = useMemo(() => {
    return liveLogs.filter(log => {
      // Text search filter
      const matchesText = !filterText ||
        log.id.toLowerCase().includes(filterText.toLowerCase()) ||
        log.path.toLowerCase().includes(filterText.toLowerCase()) ||
        log.method.toLowerCase().includes(filterText.toLowerCase());

      // Method filter
      const matchesMethod = methodFilter === 'all' || log.method === methodFilter;

      // Error filter
      const matchesError = !errorsOnly || log.live >= 400 || log.shadow >= 400;

      return matchesText && matchesMethod && matchesError;
    });
  }, [liveLogs, filterText, methodFilter, errorsOnly]);

  // Handle export
  const handleExport = () => {
    const exportData = filteredLogs.map(log => ({
      Timestamp: log.time,
      ID: log.id,
      Method: log.method,
      Path: log.path,
      LiveStatus: log.live,
      ShadowStatus: log.shadow,
      LiveLatency: `${log.latencyLive}ms`,
      ShadowLatency: `${log.latencyShadow}ms`,
      Match: log.live === log.shadow ? 'Yes' : 'No'
    }));
    exportToCSV(exportData, `traffic_${currentProject.name || 'export'}`);
  };

  // Handle refresh
  const handleRefresh = () => {
    dispatch(fetchTrafficLogs());
  };

  // Fetch data on mount and when project changes
  useEffect(() => {
    if (currentProject.projectId) {
      dispatch(fetchTrafficLogs());
    }
  }, [dispatch, currentProject.projectId]);

  return (
    <div className="h-screen flex flex-col bg-background text-foreground overflow-hidden">

      {/* --- 1. Top Control Bar --- */}
      <header className="h-16 border-b border-border bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 flex items-center justify-between px-4 md:px-6 shrink-0 z-20">

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 px-3 py-1.5 bg-muted/50 rounded-full border border-border">
            {isPaused ? (
              <WifiOff className="w-4 h-4 text-muted-foreground" />
            ) : (
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            )}
            <span className={`text-sm font-mono font-medium ${isPaused ? "text-muted-foreground" : "text-green-500"}`}>
              {isPaused ? "PAUSED" : "LIVE STREAM"}
            </span>
          </div>
          <div className="h-6 w-px bg-border hidden md:block" />
          <p className="text-muted-foreground text-sm hidden md:block">
            Mirroring <span className="text-foreground font-medium">production-v1</span> to <span className="text-destructive font-medium">shadow-v2</span>
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ProjectSwitcher />
          <div className="mr-2">
            <ModeToggle />
          </div>
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg text-sm font-semibold transition-colors shadow-sm"
          >
            {isPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
            {isPaused ? "Resume" : "Pause"}
          </button>
          <button
            onClick={handleRefresh}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
            title="Refresh data"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-3 py-2 bg-accent text-accent-foreground hover:bg-accent/80 rounded-lg text-sm font-medium transition-colors"
          >
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </header>

      {/* --- 2. Filter & Search Toolbar --- */}
      <div className="py-4 px-4 md:px-6 bg-background border-b border-border flex flex-col md:flex-row gap-4 shrink-0">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Filter by Request ID, Path or Status..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="w-full bg-muted/50 border border-input text-foreground text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground font-mono transition-shadow"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <FilterBtn
            label="All Methods"
            active={methodFilter === 'all'}
            onClick={() => setMethodFilter('all')}
          />
          <FilterBtn
            label="GET"
            active={methodFilter === 'GET'}
            onClick={() => setMethodFilter('GET')}
          />
          <FilterBtn
            label="POST"
            active={methodFilter === 'POST'}
            onClick={() => setMethodFilter('POST')}
          />
          <FilterBtn
            label="PUT"
            active={methodFilter === 'PUT'}
            onClick={() => setMethodFilter('PUT')}
          />
          <FilterBtn
            label="DELETE"
            active={methodFilter === 'DELETE'}
            onClick={() => setMethodFilter('DELETE')}
          />
          <div className="h-6 w-px bg-border mx-1" />
          <FilterBtn
            label="Errors Only"
            icon={AlertCircle}
            active={errorsOnly}
            onClick={() => setErrorsOnly(!errorsOnly)}
          />
        </div>
      </div>

      {/* --- 3. Main Traffic Feed (Table) --- */}
      <div className="flex-1 overflow-y-auto relative">
        {/* Table Header (Sticky) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-muted/50 border-b border-border text-xs font-medium text-muted-foreground sticky top-0 backdrop-blur-sm z-10">
          <div className="col-span-2">TIMESTAMP</div>
          <div className="col-span-1">METHOD</div>
          <div className="col-span-4">PATH</div>
          <div className="col-span-2 text-center">STATUS (Live vs Shadow)</div>
          <div className="col-span-2 text-right">LATENCY</div>
          <div className="col-span-1"></div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-border pb-20">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`
                group relative grid grid-cols-1 md:grid-cols-12 gap-4 px-4 md:px-6 py-4 items-center transition-all hover:bg-muted/50 cursor-pointer
                ${log.live !== log.shadow ? 'bg-destructive/5 hover:bg-destructive/10' : ''}
              `}
            >
              {/* Left Highlight Bar for diffs */}
              {log.live !== log.shadow && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-destructive" />
              )}

              {/* Timestamp & ID */}
              <div className="col-span-12 md:col-span-2 flex items-center gap-3">
                <span className="text-muted-foreground font-mono text-xs">{log.time}</span>
                <span className="text-foreground font-mono text-[10px] uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded">{log.id}</span>
              </div>

              {/* Method */}
              <div className="col-span-12 md:col-span-1">
                <MethodBadge method={log.method} />
              </div>

              {/* Path */}
              <div className="col-span-12 md:col-span-4 overflow-hidden">
                <p className="font-mono text-sm text-foreground/80 truncate hover:text-primary transition-colors cursor-pointer decoration-dotted underline-offset-4 hover:underline" title={log.path}>
                  {log.path}
                </p>
              </div>

              {/* Status Comparison (The Core Value) */}
              <div className="col-span-6 md:col-span-2 flex items-center justify-center gap-3">
                <StatusBadge code={log.live} />
                <span className="text-muted-foreground text-xs"><ArrowRight className="w-3 h-3" /></span>
                <StatusBadge code={log.shadow} isShadow />
              </div>

              {/* Latency */}
              <div className="col-span-6 md:col-span-2 flex flex-col items-end justify-center">
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="text-muted-foreground">{log.latencyLive}ms</span>
                  <span className="text-muted-foreground/50">vs</span>
                  <span className={`${log.latencyShadow > log.latencyLive * 1.5 ? 'text-amber-500 font-bold' : 'text-muted-foreground/80'}`}>
                    {log.latencyShadow}ms
                  </span>
                </div>
                {log.latencyShadow > log.latencyLive * 1.5 && (
                  <span className="text-[10px] text-amber-500/90 flex items-center gap-1 mt-0.5">
                    <AlertCircle className="w-3 h-3" /> Slow
                  </span>
                )}
              </div>

              {/* Action */}
              <div className="col-span-12 md:col-span-1 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                <button className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md text-muted-foreground">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}

          {/* Loading / Empty State */}
          {loading && liveLogs.length === 0 && (
            <div className="py-12 text-center">
              <div className="inline-flex items-center gap-2 text-muted-foreground text-sm">
                <span className="relative flex h-2 w-2 mr-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span>Loading traffic data...</span>
              </div>
            </div>
          )}

          {!loading && liveLogs.length === 0 && (
            <div className="py-12 text-center">
              <WifiOff className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">No traffic data yet</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Waiting for requests...</p>
            </div>
          )}

          {!loading && liveLogs.length > 0 && filteredLogs.length === 0 && (
            <div className="py-12 text-center">
              <Search className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
              <p className="text-muted-foreground text-sm">No matches found</p>
              <p className="text-muted-foreground/70 text-xs mt-1">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

// --- Components ---

const FilterBtn = ({ label, active, icon: Icon, onClick }: { label: string, active?: boolean, icon?: React.ElementType, onClick?: () => void }) => (
  <button
    onClick={onClick}
    className={`
      flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all whitespace-nowrap shadow-sm
      ${active
        ? "bg-primary text-primary-foreground border-primary"
        : "bg-background text-muted-foreground border-input hover:border-accent-foreground/20 hover:text-foreground hover:bg-accent"
      }
    `}>
    {Icon && <Icon className="w-3 h-3" />}
    {label}
  </button>
)

const MethodBadge = ({ method }: { method: string }) => {
  const styles: Record<string, string> = {
    GET: "text-blue-500 bg-blue-500/10 border-blue-500/20 dark:text-blue-400 dark:bg-blue-900/20 dark:border-blue-800",
    POST: "text-green-500 bg-green-500/10 border-green-500/20 dark:text-green-400 dark:bg-green-900/20 dark:border-green-800",
    PUT: "text-orange-500 bg-orange-500/10 border-orange-500/20 dark:text-orange-400 dark:bg-orange-900/20 dark:border-orange-800",
    DELETE: "text-red-500 bg-red-500/10 border-red-500/20 dark:text-red-400 dark:bg-red-900/20 dark:border-red-800",
  }
  return (
    <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold border ${styles[method] || "text-muted-foreground border-border bg-muted/50"}`}>
      {method}
    </span>
  )
}

const StatusBadge = ({ code, isShadow }: { code: number, isShadow?: boolean }) => {
  let color = "text-muted-foreground border-border bg-muted/30"
  if (code >= 200 && code < 300) color = "text-emerald-600 bg-emerald-100/50 border-emerald-200 dark:text-emerald-400 dark:bg-emerald-900/20 dark:border-emerald-800/50"
  if (code >= 400 && code < 500) color = "text-amber-600 bg-amber-100/50 border-amber-200 dark:text-amber-400 dark:bg-amber-900/20 dark:border-amber-800/50"
  if (code >= 500) color = "text-rose-600 bg-rose-100/50 border-rose-200 dark:text-rose-400 dark:bg-rose-900/20 dark:border-rose-800/50"

  // Special styling for Shadow to distinguish it
  const shadowStyle = isShadow ? "ring-2 ring-destructive/20" : ""

  return (
    <div className={`
      w-12 h-6 flex items-center justify-center rounded text-xs font-mono font-bold border ${color} ${shadowStyle}
    `}>
      {code}
    </div>
  )
}

export default Page