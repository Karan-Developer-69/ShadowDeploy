'use client'

import React from 'react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { 
  ArrowRight, 
  GitCompare, 
  ShieldCheck, 
  Activity, 
  Database, 
  Lock, 
  Server, 
  Zap,
  CheckCircle2,
  XCircle,
  Terminal
} from "lucide-react";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// --- Components ---

const Hero = () => (
  <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
    {/* Background Glows */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-[#8E1616] opacity-10 blur-[120px] rounded-full pointer-events-none" />
    
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-[#8E1616] mb-8"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8E1616] opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8E1616]"></span>
        </span>
        Production Traffic Mirroring
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
      >
        Deploy without the <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 to-zinc-500">Fear of Breaking.</span>
      </motion.h1>

      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10"
      >
        Mirror real production traffic to your shadow environment securely. 
        Compare Live vs. Shadow responses instantly using our Async Comparison Engine.
      </motion.p>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex flex-col md:flex-row items-center justify-center gap-4"
      >
        <Button className="h-12 px-8 bg-[#8E1616] hover:bg-[#701111] text-white text-lg rounded-full w-full md:w-auto">
          Start Shadow Testing
        </Button>
        <Button variant="outline" className="h-12 px-8 border-zinc-800 bg-transparent text-white hover:bg-zinc-900 text-lg rounded-full w-full md:w-auto">
          View Architecture <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  </section>
)

const FeatureCard = ({ icon: Icon, title, desc }: { icon: any, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl border border-white/5 bg-zinc-900/20 backdrop-blur-sm hover:border-[#8E1616]/30 transition-all group">
    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center mb-4 group-hover:bg-[#8E1616]/10 transition-colors">
      <Icon className="w-6 h-6 text-zinc-400 group-hover:text-[#8E1616]" />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-zinc-400 leading-relaxed">{desc}</p>
  </div>
)

const CoreFeatures = () => (
  <section id="features" className="py-24 bg-black">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard 
          icon={ShieldCheck}
          title="Zero-Risk Testing"
          desc="Test new code with real traffic without affecting end-users. Read-only shadow requests ensure no side effects."
        />
        <FeatureCard 
          icon={Activity}
          title="Comparison Brain"
          desc="Automated diffs for Status Codes (200 vs 500), JSON body changes, and performance slowdowns."
        />
        <FeatureCard 
          icon={Database}
          title="PostgreSQL Power"
          desc="Optimized SQL Analytics with partitioning and indexing to handle millions of request logs efficiently."
        />
      </div>
    </div>
  </section>
)

const EngineVisualization = () => (
  <section id="engine" className="py-24 border-y border-white/5 bg-zinc-950/50 relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="mb-16 md:text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">The Traffic Mirroring Engine</h2>
        <p className="text-zinc-400 max-w-2xl mx-auto">Our HEART & BRAIN architecture ensures your production stays safe while you get deep insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Code/Tech View */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-white/10 bg-black">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <Terminal className="text-[#8E1616] w-5 h-5" />
              <span className="text-sm font-mono text-zinc-400">middleware.ts (Proxy)</span>
            </div>
            <pre className="font-mono text-sm text-zinc-300 overflow-x-auto">
              <span className="text-purple-400">async function</span> <span className="text-yellow-300">handleRequest</span>(req) {"{"}{"\n"}
              {"  "} <span className="text-gray-500">// 1. Forward to LIVE</span>{"\n"}
              {"  "} <span className="text-purple-400">const</span> liveRes = <span className="text-purple-400">await</span> fetch(LIVE_URL);{"\n"}{"\n"}
              {"  "} <span className="text-gray-500">// 2. Async Shadow (Fire & Forget)</span>{"\n"}
              {"  "} ShadowQueue.<span className="text-blue-400">enqueue</span>({"{"}{"\n"}
              {"    "} headers: req.headers,{"\n"}
              {"    "} body: req.body{"\n"}
              {"  "} {"}"});{"\n"}{"\n"}
              {"  "} <span className="text-purple-400">return</span> liveRes;{"\n"}
              {"}"}
            </pre>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <div className="text-[#8E1616] font-bold text-lg mb-1">Safe</div>
              <p className="text-xs text-zinc-500">Read-only Shadow execution.</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-900/50 border border-white/5">
              <div className="text-white font-bold text-lg mb-1">Async</div>
              <p className="text-xs text-zinc-500">Zero latency impact on users.</p>
            </div>
          </div>
        </div>

        {/* Right: Visual Flow */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-[#8E1616]/20 to-transparent blur-3xl" />
          <div className="relative z-10 space-y-4">
            {/* Incoming */}
            <div className="flex items-center justify-center">
               <div className="bg-white text-black px-4 py-2 rounded-full font-bold text-sm">User Request 🚀</div>
            </div>
            <div className="h-8 w-0.5 bg-zinc-700 mx-auto" />
            
            {/* Proxy */}
            <div className="bg-zinc-800 border border-zinc-700 p-4 rounded-xl text-center max-w-xs mx-auto shadow-xl">
               <span className="text-white font-bold">Shadow Proxy</span>
            </div>

            {/* Split */}
            <div className="flex justify-center gap-16 relative">
               {/* Lines */}
               <svg className="absolute top-0 w-full h-12 text-zinc-700" style={{zIndex:-1}}>
                 <path d="M 50% 0 L 50% 20 L 20% 40" fill="none" stroke="currentColor" strokeWidth="2" />
                 <path d="M 50% 0 L 50% 20 L 80% 40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
               </svg>

               {/* Live */}
               <div className="mt-12 text-center">
                 <div className="w-16 h-16 bg-green-900/30 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                   <Server className="text-green-500" />
                 </div>
                 <p className="text-green-400 font-bold">LIVE v1.0</p>
               </div>

               {/* Shadow */}
               <div className="mt-12 text-center">
                 <div className="w-16 h-16 bg-[#8E1616]/20 border border-[#8E1616]/50 rounded-full flex items-center justify-center mx-auto mb-2">
                   <Server className="text-[#8E1616]" />
                 </div>
                 <p className="text-[#8E1616] font-bold">SHADOW v1.1</p>
                 <span className="text-[10px] text-zinc-500 uppercase tracking-wider">Candidate</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const DashboardPreview = () => (
  <section className="py-24 bg-black">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Decision Intelligence</h2>
      <p className="text-zinc-400 max-w-2xl mx-auto mb-16">
        Don't guess. Know exactly what changed. Our Dashboard highlights breaking changes, 
        slowdowns, and errors before they hit production.
      </p>

      {/* Mock Dashboard Interface */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
        
        {/* Dashboard Header */}
        <div className="h-12 border-b border-zinc-800 bg-zinc-900/50 flex items-center px-4 gap-4">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-green-500" />
          </div>
          <div className="text-xs text-zinc-500 font-mono">dashboard.shadowdeploy.com/project/api-v2</div>
        </div>

        {/* Dashboard Body */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Stats */}
          <div className="space-y-4">
             <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
                <p className="text-zinc-500 text-sm">Total Requests</p>
                <p className="text-2xl font-bold text-white">1,240,500</p>
             </div>
             <div className="p-4 bg-[#8E1616]/10 rounded-lg border border-[#8E1616]/30">
                <p className="text-[#8E1616] text-sm">Diffs Found</p>
                <p className="text-2xl font-bold text-white">12 <span className="text-sm font-normal text-zinc-400">Critical</span></p>
             </div>
          </div>

          {/* Diff Viewer */}
          <div className="md:col-span-2 bg-black rounded-lg border border-zinc-800 p-4 font-mono text-xs md:text-sm">
             <div className="flex justify-between mb-4 text-zinc-500 border-b border-zinc-800 pb-2">
                <span>GET /api/users/123</span>
                <span className="text-red-400">Latency: +45ms ⚠️</span>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="opacity-50">
                  <p className="text-green-500 mb-2">LIVE (200 OK)</p>
                  <p className="text-zinc-300">{`{ "id": 123, "role": "user" }`}</p>
                </div>
                <div>
                  <p className="text-[#8E1616] mb-2">SHADOW (200 OK)</p>
                  <p className="text-zinc-300">
                    {`{ "id": 123, `}
                    <span className="bg-[#8E1616]/40 text-white px-1">"role": "admin"</span>
                    {` }`}
                  </p>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const Pricing = () => (
  <section id="pricing" className="py-24 border-t border-white/5 bg-gradient-to-b from-black to-zinc-950">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl md:text-5xl font-bold text-white mb-16 text-center">Transparent Pricing</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <div className="p-8 rounded-2xl border border-zinc-800 bg-black flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">Developer</h3>
          <div className="text-3xl font-bold text-white mb-6">$0<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> 10k Requests/mo</li>
            <li className="flex gap-3 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> 1 Project</li>
            <li className="flex gap-3 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Basic Diff Viewer</li>
          </ul>
          <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">Start Free</Button>
        </div>

        {/* Pro Tier */}
        <div className="p-8 rounded-2xl border border-[#8E1616] bg-zinc-900/40 relative flex flex-col shadow-2xl shadow-[#8E1616]/10">
          <div className="absolute top-0 right-0 bg-[#8E1616] text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">POPULAR</div>
          <h3 className="text-xl font-bold text-white mb-2">Startup</h3>
          <div className="text-3xl font-bold text-white mb-6">$49<span className="text-lg text-zinc-500 font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#8E1616]" /> 1M Requests/mo</li>
            <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#8E1616]" /> 5 Projects</li>
            <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#8E1616]" /> Advanced Replay</li>
            <li className="flex gap-3 text-zinc-300 text-sm"><CheckCircle2 className="w-4 h-4 text-[#8E1616]" /> Team Roles</li>
          </ul>
          <Button className="w-full bg-[#8E1616] hover:bg-[#701111] text-white">Get Started</Button>
        </div>

        {/* Team Tier */}
        <div className="p-8 rounded-2xl border border-zinc-800 bg-black flex flex-col">
          <h3 className="text-xl font-bold text-white mb-2">Enterprise</h3>
          <div className="text-3xl font-bold text-white mb-6">Custom</div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Unlimited Requests</li>
            <li className="flex gap-3 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> On-prem deployment</li>
            <li className="flex gap-3 text-zinc-400 text-sm"><CheckCircle2 className="w-4 h-4 text-zinc-600" /> Dedicated Support</li>
          </ul>
          <Button variant="outline" className="w-full border-zinc-700 text-white hover:bg-zinc-800">Contact Sales</Button>
        </div>
      </div>
    </div>
  </section>
)



const Page = () => {
  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans selection:bg-[#8E1616] selection:text-white">
      <Navbar />
      <Hero />
      <CoreFeatures />
      <EngineVisualization />
      <DashboardPreview />
      <Pricing />
      <Footer />
    </div>
  )
}

export default Page