'use client'

import React, { useState } from 'react'
import {
    Check,
    X,
    Zap,
    ChevronDown,
    ArrowRight
} from "lucide-react"

// --- TYPES ---

type BillingCycle = 'monthly' | 'yearly';

interface PlanFeature {
    name: string;
    included: boolean;
}

interface PricingTier {
    id: string;
    name: string;
    description: string;
    priceMonthly: number;
    priceYearly: number; // 20% discount pre-calculated
    isPopular?: boolean;
    buttonText: string;
    current?: boolean; // Is this the user's current plan?
    features: PlanFeature[];
}

// --- MOCK DATA ---

const pricingTiers: PricingTier[] = [
    {
        id: 'free',
        name: 'Developer',
        description: 'Perfect for side projects and learning.',
        priceMonthly: 0,
        priceYearly: 0,
        buttonText: 'Current Plan',
        current: true,
        features: [
            { name: '10,000 Requests / mo', included: true },
            { name: '1 Project', included: true },
            { name: 'Basic Diff Viewer', included: true },
            { name: '24h Log Retention', included: true },
            { name: 'Team Members', included: false },
            { name: 'Priority Support', included: false },
        ]
    },
    {
        id: 'pro',
        name: 'Startup',
        description: 'For growing teams ensuring production safety.',
        priceMonthly: 49,
        priceYearly: 39, // approx 20% off
        isPopular: true,
        buttonText: 'Upgrade to Pro',
        current: false,
        features: [
            { name: '1,000,000 Requests / mo', included: true },
            { name: '5 Projects', included: true },
            { name: 'Advanced JSON Diff', included: true },
            { name: '30 Days Log Retention', included: true },
            { name: '3 Team Members', included: true },
            { name: 'Email Support', included: true },
        ]
    },
    {
        id: 'enterprise',
        name: 'Enterprise',
        description: 'Custom scale, security, and support.',
        priceMonthly: 299,
        priceYearly: 249,
        buttonText: 'Contact Sales',
        current: false,
        features: [
            { name: 'Unlimited Requests', included: true },
            { name: 'Unlimited Projects', included: true },
            { name: 'Custom Retention', included: true },
            { name: 'SSO & Audit Logs', included: true },
            { name: 'Dedicated Slack Channel', included: true },
            { name: 'On-premise Deployment', included: true },
        ]
    }
];

const faqs = [
    { q: "What counts as a request?", a: "Every time a request hits your Live URL and is mirrored to Shadow, it counts as 1 request." },
    { q: "Can I cancel anytime?", a: "Yes, you can downgrade to the Free plan at any time. Changes take effect at the end of your billing cycle." },
    { q: "What happens if I exceed my limit?", a: "We'll email you at 80% and 100%. After that, we pause Shadow mirroring (your live traffic is never affected)." },
]

// --- COMPONENTS ---

const Page = (): React.ReactNode => {
    const [billingCycle, setBillingCycle] = useState<BillingCycle>('monthly');
    const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

    const toggleFaq = (index: number) => {
        setExpandedFaq(expandedFaq === index ? null : index);
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 font-sans pb-24">

            {/* 1. Header & Usage Banner */}
            <div className="max-w-6xl mx-auto mb-12 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Subscription & Usage</h1>
                    <p className="text-zinc-400 text-sm">
                        Manage your billing information and monitor your monthly request quota.
                    </p>
                </div>

                {/* Current Usage Card */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <Zap className="w-24 h-24 text-white" />
                    </div>

                    <div className="relative z-10 flex flex-col md:flex-row gap-8 justify-between items-end">
                        <div className="w-full max-w-lg space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-wider">Current Cycle Usage</h3>
                                <span className="text-sm text-zinc-400">Resets in 12 days</span>
                            </div>

                            <div>
                                <div className="flex justify-between items-end mb-2">
                                    <span className="text-2xl font-bold text-white">7,840</span>
                                    <span className="text-sm text-zinc-500">of 10,000 requests</span>
                                </div>
                                {/* Progress Bar */}
                                <div className="h-3 w-full bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-linear-to-r from-[#8E1616] to-red-500 rounded-full"
                                        style={{ width: '78%' }}
                                    />
                                </div>
                            </div>

                            <p className="text-xs text-zinc-500">
                                You have used <span className="text-white">78%</span> of your free quota.
                                <span className="text-[#8E1616] cursor-pointer hover:underline ml-1">Upgrade to prevent pausing.</span>
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-xs text-zinc-500 uppercase font-bold">Current Plan</p>
                                <p className="text-xl font-bold text-white">Developer</p>
                            </div>
                            <button className="px-5 py-2.5 bg-zinc-100 text-black hover:bg-white rounded-lg font-bold text-sm transition-colors">
                                Manage Payment Method
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. Pricing Section */}
            <div className="max-w-6xl mx-auto space-y-10">

                {/* Toggle */}
                <div className="flex justify-center">
                    <div className="bg-zinc-900 p-1 rounded-xl flex items-center border border-zinc-800 relative">
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'monthly' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${billingCycle === 'yearly' ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'
                                }`}
                        >
                            Yearly
                        </button>

                        {/* Discount Badge */}
                        <span className="absolute -top-3 -right-6 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full animate-bounce">
                            Save 20%
                        </span>
                    </div>
                </div>

                {/* Cards Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pricingTiers.map((plan) => (
                        <PricingCard
                            key={plan.id}
                            plan={plan}
                            cycle={billingCycle}
                        />
                    ))}
                </div>

            </div>

            {/* 3. FAQ Section */}
            <div className="max-w-3xl mx-auto mt-24">
                <h2 className="text-xl font-bold text-white mb-8 text-center">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <div key={idx} className="bg-zinc-900/20 border border-zinc-800 rounded-xl overflow-hidden">
                            <button
                                onClick={() => toggleFaq(idx)}
                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-zinc-900/40 transition-colors"
                            >
                                <span className="text-sm font-medium text-zinc-200">{faq.q}</span>
                                <ChevronDown className={`w-4 h-4 text-zinc-500 transition-transform ${expandedFaq === idx ? 'rotate-180' : ''}`} />
                            </button>
                            {expandedFaq === idx && (
                                <div className="px-6 pb-4 text-sm text-zinc-400 leading-relaxed border-t border-zinc-800/50 pt-4">
                                    {faq.a}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

        </div>
    )
}

// --- SUB-COMPONENT: Pricing Card ---

const PricingCard = ({ plan, cycle }: { plan: PricingTier, cycle: BillingCycle }) => {
    const isPro = plan.isPopular;
    const price = cycle === 'monthly' ? plan.priceMonthly : plan.priceYearly;

    return (
        <div className={`
      relative flex flex-col p-8 rounded-2xl border transition-all duration-300
      ${isPro
                ? 'bg-zinc-900/40 border-[#8E1616] shadow-[0_0_30px_-10px_rgba(142,22,22,0.2)] scale-105 z-10'
                : 'bg-black border-zinc-800 hover:border-zinc-700'
            }
    `}>

            {isPro && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#8E1616] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
                    Most Popular
                </div>
            )}

            <div className="mb-6">
                <h3 className={`text-lg font-bold ${isPro ? 'text-white' : 'text-zinc-200'}`}>{plan.name}</h3>
                <p className="text-xs text-zinc-500 mt-2 min-h-10">{plan.description}</p>
            </div>

            <div className="mb-6">
                <span className="text-4xl font-bold text-white">${price}</span>
                <span className="text-zinc-500 text-sm font-medium">/{cycle === 'monthly' ? 'mo' : 'mo, billed yearly'}</span>
            </div>

            <button
                disabled={plan.current}
                className={`
           w-full py-3 rounded-xl font-bold text-sm transition-all mb-8 flex items-center justify-center gap-2
           ${plan.current
                        ? 'bg-zinc-800 text-zinc-400 cursor-not-allowed border border-zinc-700'
                        : isPro
                            ? 'bg-[#8E1616] hover:bg-[#701111] text-white shadow-lg'
                            : 'bg-white text-black hover:bg-zinc-200'
                    }
         `}
            >
                {plan.current && <Check className="w-4 h-4" />}
                {plan.buttonText}
                {!plan.current && <ArrowRight className="w-4 h-4" />}
            </button>

            <div className="space-y-4 flex-1">
                {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                        {feature.included ? (
                            <div className={`mt-0.5 p-0.5 rounded-full ${isPro ? 'bg-[#8E1616]/20 text-[#8E1616]' : 'bg-zinc-800 text-zinc-400'}`}>
                                <Check className="w-3 h-3" />
                            </div>
                        ) : (
                            <div className="mt-0.5 p-0.5 rounded-full bg-transparent text-zinc-700">
                                <X className="w-3 h-3" />
                            </div>
                        )}
                        <span className={`text-sm ${feature.included ? 'text-zinc-300' : 'text-zinc-600'}`}>
                            {feature.name}
                        </span>
                    </div>
                ))}
            </div>

        </div>
    )
}

export default Page