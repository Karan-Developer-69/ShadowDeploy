'use client'

import React from 'react'
import { motion } from "framer-motion"
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Database,
  Server,
  CheckCircle2,
  Terminal
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton, SignUpButton, UserButton } from '@clerk/nextjs'
import { GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Logo from '@/components/Logo';
import { ModeToggle } from '@/components/mode-toggle';
import Link from 'next/link';

// --- Components ---

const Navbar = () => (
  <nav className="fixed top-0 w-full z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo />
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
        <a href="#features" className="hover:text-foreground transition-colors">Features</a>
        <a href="#engine" className="hover:text-foreground transition-colors">How it Works</a>
        <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
      </div>
      <div className="flex items-center gap-4">
        <ModeToggle />
        <div>
          <SignedOut>
            <div className='flex items-center gap-4'>
              <SignInButton>
                <Button variant="ghost" className="text-muted-foreground hover:text-foreground font-semibold rounded-full px-6">
                  Login
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="font-semibold rounded-full px-6">
                  Get Started
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

      </div>
    </div>
  </nav>
)

const Hero = () => (
  <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden bg-background">
    {/* Background Glows */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-250 h-125 bg-destructive/20 opacity-30 blur-[120px] rounded-full pointer-events-none dark:opacity-10" />
    <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-destructive/20 bg-destructive/10 text-xs font-medium text-destructive mb-8"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-destructive"></span>
        </span>
        Production Traffic Mirroring
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground mb-6 leading-tight"
      >
        Deploy without the <br />
        <span className="text-transparent bg-clip-text bg-linear-to-r from-zinc-400 to-zinc-700 dark:from-zinc-200 dark:to-zinc-500">Fear of Breaking.</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10"
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
        <Link href="/dashboard" className="h-12 px-8 content-center bg-destructive hover:bg-destructive/90 text-destructive-foreground text-lg rounded-full w-full md:w-auto shadow-lg shadow-destructive/20">
          Start Shadow Testing
        </Link>
        <Button variant="outline" className="h-12 px-8 border-input bg-background/50 text-foreground hover:bg-accent hover:text-accent-foreground text-lg rounded-full w-full md:w-auto">
          View Architecture <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </motion.div>
    </div>
  </section>
)

const FeatureCard = ({ icon: Icon, title, desc }: { icon: React.ElementType, title: string, desc: string }) => (
  <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:border-destructive/30 transition-all group shadow-sm hover:shadow-md">
    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mb-4 group-hover:bg-destructive/10 transition-colors">
      <Icon className="w-6 h-6 text-muted-foreground group-hover:text-destructive" />
    </div>
    <h3 className="text-xl font-bold text-foreground mb-2">{title}</h3>
    <p className="text-muted-foreground leading-relaxed">{desc}</p>
  </div>
)

const CoreFeatures = () => (
  <section id="features" className="py-24 bg-muted/20">
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
  <section id="engine" className="py-24 border-y border-border bg-background relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="mb-16 md:text-center">
        <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">The Traffic Mirroring Engine</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">Our HEART & BRAIN architecture ensures your production stays safe while you get deep insights.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        {/* Left: Code/Tech View */}
        <div className="space-y-6">
          <div className="p-6 rounded-2xl border border-border bg-zinc-950 dark:bg-black shadow-2xl">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <Terminal className="text-destructive w-5 h-5" />
              <span className="text-sm font-mono text-zinc-400">middleware.ts (Proxy)</span>
            </div>
            <pre className="font-mono text-sm text-zinc-300 overflow-x-auto">
              <span className="text-purple-400">async function</span> <span className="text-yellow-300">handleRequest</span>(req) {"{"}{"\n"}
              {"  "} <span className="text-gray-500">&quot;// 1. Forward to LIVE&quot;</span>{"\n"}
              {"  "} <span className="text-purple-400">const</span> liveRes = <span className="text-purple-400">await</span> fetch(LIVE_URL);{"\n"}{"\n"}
              {"  "} <span className="text-gray-500">&quot;// 2. Async Shadow (Fire & Forget)&quot;</span>{"\n"}
              {"  "} ShadowQueue.<span className="text-blue-400">enqueue</span>({"{"}{"\n"}
              {"    "} headers: req.headers,{"\n"}
              {"    "} body: req.body{"\n"}
              {"  "} {"}"});{"\n"}{"\n"}
              {"  "} <span className="text-purple-400">return</span> liveRes;{"\n"}
              {"}"}
            </pre>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-destructive font-bold text-lg mb-1">Safe</div>
              <p className="text-xs text-muted-foreground">Read-only Shadow execution.</p>
            </div>
            <div className="p-4 rounded-xl bg-muted/50 border border-border">
              <div className="text-foreground font-bold text-lg mb-1">Async</div>
              <p className="text-xs text-muted-foreground">Zero latency impact on users.</p>
            </div>
          </div>
        </div>

        {/* Right: Visual Flow */}
        <div className="relative">
          <div className="absolute inset-0 bg-linear-to-r from-destructive/20 to-transparent blur-3xl opacity-50" />
          <div className="relative z-10 space-y-4">
            {/* Incoming */}
            <div className="flex items-center justify-center">
              <div className="bg-foreground text-background px-4 py-2 rounded-full font-bold text-sm shadow-lg">User Request 🚀</div>
            </div>
            <div className="h-8 w-0.5 bg-border mx-auto" />

            {/* Proxy */}
            <div className="bg-card border border-border p-4 rounded-xl text-center max-w-xs mx-auto shadow-xl">
              <span className="text-card-foreground font-bold">Shadow Proxy</span>
            </div>

            {/* Split */}
            <div className="flex justify-center gap-16 relative">
              {/* Lines */}
              <svg className="absolute top-0 w-full h-12 text-border" style={{ zIndex: -1 }}>
                <path d="M 50% 0 L 50% 20 L 20% 40" fill="none" stroke="currentColor" strokeWidth="2" />
                <path d="M 50% 0 L 50% 20 L 80% 40" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="5,5" />
              </svg>

              {/* Live */}
              <div className="mt-12 text-center">
                <div className="w-16 h-16 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Server className="text-green-500" />
                </div>
                <p className="text-green-600 dark:text-green-400 font-bold">LIVE v1.0</p>
              </div>

              {/* Shadow */}
              <div className="mt-12 text-center">
                <div className="w-16 h-16 bg-destructive/10 border border-destructive/30 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Server className="text-destructive" />
                </div>
                <p className="text-destructive font-bold">SHADOW v1.1</p>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Candidate</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const DashboardPreview = () => (
  <section className="py-24 bg-foreground/5 dark:bg-black">
    <div className="max-w-7xl mx-auto px-6 text-center">
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">Decision Intelligence</h2>
      <p className="text-muted-foreground max-w-2xl mx-auto mb-16">
        Don&apos;t guess. Know exactly what changed. Our Dashboard highlights breaking changes,
        slowdowns, and errors before they hit production.
      </p>

      {/* Mock Dashboard Interface */}
      <div className="rounded-xl border border-border bg-zinc-950 overflow-hidden shadow-2xl relative group">
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent z-10 pointer-events-none" />

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
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 text-left bg-black text-zinc-300">
          {/* Stats */}
          <div className="space-y-4">
            <div className="p-4 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-zinc-500 text-sm">Total Requests</p>
              <p className="text-2xl font-bold text-white">1,240,500</p>
            </div>
            <div className="p-4 bg-red-900/10 rounded-lg border border-red-900/30">
              <p className="text-red-500 text-sm">Diffs Found</p>
              <p className="text-2xl font-bold text-white">12 <span className="text-sm font-normal text-zinc-400">Critical</span></p>
            </div>
          </div>

          {/* Diff Viewer */}
          <div className="md:col-span-2 bg-zinc-950 rounded-lg border border-zinc-800 p-4 font-mono text-xs md:text-sm">
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
                <p className="text-red-500 mb-2">SHADOW (200 OK)</p>
                <p className="text-zinc-300">
                  {`{ "id": 123, `}
                  <span className="bg-red-900/40 text-white px-1">&quot;role&quot;: &quot;admin&quot;</span>
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
  <section id="pricing" className="py-24 border-t border-border bg-linear-to-b from-background to-muted/20">
    <div className="max-w-7xl mx-auto px-6">
      <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-16 text-center">Transparent Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Free Tier */}
        <div className="p-8 rounded-2xl border border-border bg-card flex flex-col shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-2">Developer</h3>
          <div className="text-3xl font-bold text-foreground mb-6">$0<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-muted-foreground text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> 10k Requests/mo</li>
            <li className="flex gap-3 text-muted-foreground text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> 1 Project</li>
            <li className="flex gap-3 text-muted-foreground text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Basic Diff Viewer</li>
          </ul>
          <Button variant="outline" className="w-full">Start Free</Button>
        </div>

        {/* Pro Tier */}
        <div className="p-8 rounded-2xl border border-destructive bg-card relative flex flex-col shadow-2xl shadow-destructive/10 scale-105 z-10">
          <div className="absolute top-0 right-0 bg-destructive text-destructive-foreground text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-xl">POPULAR</div>
          <h3 className="text-xl font-bold text-foreground mb-2">Startup</h3>
          <div className="text-3xl font-bold text-foreground mb-6">$49<span className="text-lg text-muted-foreground font-normal">/mo</span></div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-foreground/80 text-sm"><CheckCircle2 className="w-4 h-4 text-destructive" /> 1M Requests/mo</li>
            <li className="flex gap-3 text-foreground/80 text-sm"><CheckCircle2 className="w-4 h-4 text-destructive" /> 5 Projects</li>
            <li className="flex gap-3 text-foreground/80 text-sm"><CheckCircle2 className="w-4 h-4 text-destructive" /> Advanced Replay</li>
            <li className="flex gap-3 text-foreground/80 text-sm"><CheckCircle2 className="w-4 h-4 text-destructive" /> Team Roles</li>
          </ul>
          <Button className="w-full bg-destructive hover:bg-destructive/90 text-white">Get Started</Button>
        </div>

        {/* Team Tier */}
        <div className="p-8 rounded-2xl border border-border bg-card flex flex-col shadow-sm">
          <h3 className="text-xl font-bold text-foreground mb-2">Enterprise</h3>
          <div className="text-3xl font-bold text-foreground mb-6">Custom</div>
          <ul className="space-y-4 mb-8 flex-1">
            <li className="flex gap-3 text-muted-foreground text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Unlimited Requests</li>
            <li className="flex gap-3 text-muted-foreground text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> On-prem deployment</li>
            <li className="flex gap-3 text-muted-foreground text-sm"><CheckCircle2 className="w-4 h-4 text-primary" /> Dedicated Support</li>
          </ul>
          <Button variant="outline" className="w-full">Contact Sales</Button>
        </div>
      </div>
    </div>
  </section>
)

const Footer = () => (
  <footer className="py-12 bg-muted/30 border-t border-border text-muted-foreground text-sm">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="flex items-center gap-2">
        <GitCompare className="w-5 h-5 text-foreground" />
        <span className="font-bold text-foreground">ShadowDeploy</span>
      </div>
      <div className="flex gap-6">
        <a href="#" className="hover:text-foreground">Documentation</a>
        <a href="#" className="hover:text-foreground">GitHub</a>
        <a href="#" className="hover:text-foreground">Twitter</a>
      </div>
      <div>
        © 2024 ShadowDeploy Inc. All rights reserved.
      </div>
    </div>
  </footer>
)


const Page = () => {
  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-destructive selection:text-white">
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