'use client'

import React from 'react'
import {
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Filter,
  Download,
  MoreHorizontal,
  Search
} from "lucide-react"
import { useAppSelector } from '@/lib/store/hooks'

const Page = (): React.ReactNode => {
  const { stats, trends } = useAppSelector((state) => state.traffic)
  const { recentComparisons } = useAppSelector((state) => state.diff)
  const { currentProject } = useAppSelector((state) => state.project)

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 overflow-y-auto">

      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
          <p className="text-zinc-500 text-sm">Monitoring <span className="text-white font-medium">{currentProject.name} (shadow-v1.2)</span> against production traffic.</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-zinc-400">
            <Clock className="w-4 h-4 mr-2" />
            <span>Last 24 Hours</span>
          </div>
          <button className="flex items-center justify-center w-10 h-10 rounded-lg border border-zinc-800 bg-zinc-900 hover:bg-zinc-800 transition-colors">
            <Filter className="w-4 h-4 text-zinc-400" />
          </button>
          <button className="flex items-center gap-2 bg-[#8E1616] hover:bg-[#701111] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>
      </header>

      {/* 2. KPI Cards (Stats) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          title="Total Requests"
          value={stats.totalRequests}
          change={trends.requestsChange}
          trend={trends.requestsChange.includes('+') ? 'up' : 'down'}
          icon={Activity}
        />
        <StatCard
          title="Shadow Errors"
          value={stats.shadowErrors.toString()}
          change={trends.errorsChange}
          trend={trends.errorsChange.includes('+') ? 'down' : 'up'} // More errors = bad (down trend visually) - logic depends on prop
          icon={AlertTriangle}
          isDestructive
        />
        <StatCard
          title="Avg Latency"
          value={stats.avgLatency}
          change={trends.latencyChange}
          trend={trends.latencyChange.includes('-') ? 'up' : 'down'} // Faster = up? Or just green.
          icon={Clock}
          subValue="Live: 157ms"
        />
        <StatCard
          title="Match Rate"
          value={stats.matchRate}
          change={trends.matchRateChange}
          trend={trends.matchRateChange.includes('-') ? 'down' : 'up'}
          icon={CheckCircle2}
        />
      </div>

      {/* 3. Main Grid: Charts & Verdict */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* CHART SECTION (Empty Placeholder) */}
        <div className="lg:col-span-2 min-h-100 bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 relative flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">Traffic Comparison</h3>
            <div className="flex gap-2 text-xs">
              <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-zinc-500"></div> Live</span>
              <span className="flex items-center gap-1 text-zinc-400"><div className="w-2 h-2 rounded-full bg-[#8E1616]"></div> Shadow</span>
            </div>
          </div>

          {/* EMPTY STATE CONTAINER */}
          <div className="flex-1 rounded-xl border-2 border-dashed border-zinc-800 bg-black/40 flex items-center justify-center relative overflow-hidden group">
            {/* Subtle Grid Background */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-24px_24px"></div>

            <div className="z-10 text-center opacity-50 group-hover:opacity-80 transition-opacity">
              <Activity className="w-10 h-10 mx-auto mb-2 text-zinc-600" />
              <p className="text-zinc-500 text-sm font-medium">Render Charts Here</p>
              <p className="text-zinc-600 text-xs">Area reserved for Recharts / Chart.js</p>
            </div>
          </div>
        </div>

        {/* Verdict / Health Panel */}
        <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-lg mb-1">Deployment Health</h3>
            <p className="text-zinc-500 text-sm mb-6">Based on shadow traffic analysis.</p>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-medium text-green-200">Logic Integrity</span>
                </div>
                <span className="text-green-500 font-bold">100%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-200">Performance</span>
                </div>
                <span className="text-yellow-500 font-bold">-2%</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                  <span className="text-sm font-medium text-red-200">New Errors</span>
                </div>
                <span className="text-red-500 font-bold">3 Crit</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <p className="text-xs text-zinc-500 mb-3 text-center">Confidence Score: <span className="text-white">88/100</span></p>
            <button className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm font-medium transition-colors cursor-not-allowed border border-zinc-700">
              Wait for more data...
            </button>
          </div>
        </div>
      </div>

      {/* 4. Recent Requests Table */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h3 className="font-semibold text-lg">Recent Comparisons</h3>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search endpoints..."
              className="bg-black/50 border border-zinc-800 rounded-full pl-9 pr-4 py-1.5 text-sm text-white focus:outline-none focus:border-[#8E1616]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-black/50 text-zinc-500 font-medium">
              <tr>
                <th className="px-6 py-4">Request ID</th>
                <th className="px-6 py-4">Method & Path</th>
                <th className="px-6 py-4">Live Status</th>
                <th className="px-6 py-4">Shadow Status</th>
                <th className="px-6 py-4">Latency Diff</th>
                <th className="px-6 py-4">Verdict</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {recentComparisons.map((req) => (
                <tr key={req.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-mono text-zinc-400">{req.id}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getMethodColor(req.method)}`}>
                        {req.method}
                      </span>
                      <span className="font-mono text-zinc-300 truncate max-w-37.5">{req.path}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <BadgeStatus status={req.liveStatus} />
                  </td>
                  <td className="px-6 py-4">
                    <BadgeStatus status={req.shadowStatus} />
                  </td>
                  <td className="px-6 py-4 font-mono text-zinc-400">
                    <span className={req.latencyDiff.includes('+') ? "text-yellow-500" : "text-zinc-400"}>
                      {req.latencyDiff}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {req.match ? (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">
                        Match
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">
                        Mismatch
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <MoreHorizontal className="w-4 h-4 text-zinc-600 cursor-pointer hover:text-white" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  )
}

// --- Sub-components for cleaner code ---

const StatCard = ({ title, value, change, trend, icon: Icon, isDestructive, subValue }: { title: string, value: string, change: string, trend: 'up' | 'down', icon: React.ComponentType<{ className?: string }>, isDestructive?: boolean, subValue?: string }) => (
  <div className="bg-zinc-900/30 border border-zinc-800 p-5 rounded-2xl hover:border-zinc-700 transition-colors">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-2 rounded-lg ${isDestructive ? 'bg-red-500/10 text-red-500' : 'bg-zinc-800 text-white'}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className={`flex items-center text-xs font-medium px-2 py-1 rounded-full ${isDestructive
        ? 'bg-red-500/10 text-red-500'
        : trend === 'up' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
        }`}>
        {trend === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
        {change}
      </div>
    </div>
    <div>
      <p className="text-zinc-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-white mt-1">{value}</h3>
      {subValue && <p className="text-xs text-zinc-600 mt-1">{subValue}</p>}
    </div>
  </div>
)

const BadgeStatus = ({ status }: { status: number }) => {
  const colorClass = status >= 200 && status < 300
    ? "text-green-400 bg-green-400/10 border-green-400/20"
    : status >= 500
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";

  return (
    <span className={`px-2 py-1 rounded-md text-xs font-mono font-medium border ${colorClass}`}>
      {status}
    </span>
  )
}

const getMethodColor = (method: string) => {
  switch (method) {
    case 'GET': return 'bg-blue-500/20 text-blue-400';
    case 'POST': return 'bg-green-500/20 text-green-400';
    case 'PUT': return 'bg-yellow-500/20 text-yellow-400';
    case 'DELETE': return 'bg-red-500/20 text-red-400';
    default: return 'bg-zinc-500/20 text-zinc-400';
  }
}

export default Page