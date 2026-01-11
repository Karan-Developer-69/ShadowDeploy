'use client'

import React, { useState } from 'react'
import {
    UserPlus,
    ShieldCheck,
    Trash2,
    CheckCircle2,
    Clock,
    Search,
    Copy,
    Users,
    Crown
} from "lucide-react"
import Image from 'next/image';

// --- TYPES (Strict Type Safety) ---

type Role = 'owner' | 'admin' | 'member' | 'viewer';
type Status = 'active' | 'invited';

interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: Role;
    status: Status;
    joinedAt: string;
    avatarUrl?: string; // Optional
}

// --- MOCK DATA ---

const initialMembers: TeamMember[] = [
    {
        id: "u_1",
        name: "Alex Sterling",
        email: "alex@shadowdeploy.com",
        role: "owner",
        status: "active",
        joinedAt: "Oct 12, 2023",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026024d"
    },
    {
        id: "u_2",
        name: "Sarah Connors",
        email: "sarah@techcorp.io",
        role: "admin",
        status: "active",
        joinedAt: "Nov 05, 2023",
        avatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d"
    },
    {
        id: "u_3",
        name: "Dev Team Lead",
        email: "dev@techcorp.io",
        role: "member",
        status: "active",
        joinedAt: "Jan 10, 2024"
    },
    {
        id: "u_4",
        name: "John Doe",
        email: "john.d@freelance.com",
        role: "viewer",
        status: "invited",
        joinedAt: "Pending..."
    }
];

const Page = (): React.ReactNode => {
    const [members, setMembers] = useState<TeamMember[]>(initialMembers);
    const [filter, setFilter] = useState('');
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    // Seat Logic (SaaS Limit)
    const usedSeats = members.length;
    const totalSeats = 10;
    const usagePercent = (usedSeats / totalSeats) * 100;

    const handleRemoveMember = (id: string) => {
        setMembers(members.filter(m => m.id !== id));
    };

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(filter.toLowerCase()) ||
        m.email.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white p-6 md:p-8 font-sans pb-24">

            {/* 1. Header & Seat Stats */}
            <div className="max-w-5xl mx-auto mb-10 flex flex-col md:flex-row items-end justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight mb-2">Team & Access</h1>
                    <p className="text-zinc-400 text-sm max-w-xl">
                        Manage who can view shadow traffic and deploy configuration changes.
                    </p>
                </div>

                {/* Seat Usage Widget */}
                <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 w-full md:w-72">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">Plan Seats</span>
                        <span className="text-xs font-mono text-zinc-500">{usedSeats} / {totalSeats} Used</span>
                    </div>
                    <div className="h-2 w-full bg-black rounded-full overflow-hidden border border-zinc-800">
                        <div
                            className={`h-full rounded-full ${usagePercent > 80 ? 'bg-yellow-600' : 'bg-[#8E1616]'}`}
                            style={{ width: `${usagePercent}%` }}
                        />
                    </div>
                    {usagePercent >= 80 && (
                        <p className="text-[10px] text-yellow-500 mt-2">Running low on seats. Upgrade plan.</p>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto space-y-8">

                {/* --- 2. Action Bar --- */}
                <div className="flex flex-col md:flex-row justify-between gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                            className="w-full bg-zinc-900/30 border border-zinc-800 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#8E1616] transition-colors"
                        />
                    </div>

                    {/* Invite Button */}
                    <button
                        onClick={() => setIsInviteOpen(!isInviteOpen)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-[#8E1616] hover:bg-[#701111] text-white rounded-lg text-sm font-bold transition-all shadow-[0_0_20px_-8px_#8E1616]"
                    >
                        <UserPlus className="w-4 h-4" /> Invite Member
                    </button>
                </div>

                {/* --- 3. Invite Panel (Collapsible) --- */}
                {isInviteOpen && (
                    <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-6 animate-in fade-in slide-in-from-top-2">
                        <h3 className="text-sm font-bold text-white mb-4">Invite New Users</h3>
                        <div className="flex flex-col md:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="colleague@company.com"
                                className="flex-1 bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-[#8E1616]"
                            />
                            <select className="bg-black border border-zinc-800 rounded-lg px-4 py-2 text-sm text-zinc-300 focus:outline-none focus:border-[#8E1616]">
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                                <option value="viewer">Viewer</option>
                            </select>
                            <button className="px-6 py-2 bg-white text-black font-bold rounded-lg text-sm hover:bg-zinc-200 transition-colors">
                                Send Invite
                            </button>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 cursor-pointer hover:text-white">
                            <Copy className="w-3 h-3" />
                            <span>Or copy invite link</span>
                        </div>
                    </div>
                )}

                {/* --- 4. Members List --- */}
                <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
                    {/* Table Header */}
                    <div className="grid grid-cols-12 px-6 py-3 bg-zinc-950/50 border-b border-zinc-800 text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                        <div className="col-span-5">User</div>
                        <div className="col-span-3">Role</div>
                        <div className="col-span-2">Status</div>
                        <div className="col-span-2 text-right">Actions</div>
                    </div>

                    {/* List Items */}
                    <div className="divide-y divide-zinc-800">
                        {filteredMembers.map((member) => (
                            <div key={member.id} className="grid grid-cols-12 px-6 py-4 items-center gap-4 hover:bg-zinc-900/40 transition-colors group">

                                {/* User Info */}
                                <div className="col-span-5 flex items-center gap-3">
                                    <Avatar member={member} />
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-white truncate">{member.name}</p>
                                        <p className="text-xs text-zinc-500 truncate">{member.email}</p>
                                    </div>
                                </div>

                                {/* Role Selector */}
                                <div className="col-span-3">
                                    <RoleBadge role={member.role} />
                                </div>

                                {/* Status */}
                                <div className="col-span-2">
                                    {member.status === 'active' ? (
                                        <div className="flex items-center gap-1.5 text-xs text-green-500 font-medium">
                                            <CheckCircle2 className="w-3.5 h-3.5" /> Active
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-medium">
                                            <Clock className="w-3.5 h-3.5" /> Invited
                                        </div>
                                    )}
                                    <p className="text-[10px] text-zinc-600 mt-0.5">{member.joinedAt}</p>
                                </div>

                                {/* Actions */}
                                <div className="col-span-2 flex justify-end">
                                    {member.role !== 'owner' && (
                                        <button
                                            onClick={() => handleRemoveMember(member.id)}
                                            className="p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                                            title="Remove User"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                </div>

                {/* --- 5. Role Legend (Helpful UX) --- */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6 border-t border-zinc-800">
                    <RoleExplanation
                        title="Owner"
                        desc="Full access to billing, project deletion, and managing all roles."
                        icon={Crown}
                        color="text-yellow-500"
                    />
                    <RoleExplanation
                        title="Admin"
                        desc="Can manage API keys, environment variables, and invite members."
                        icon={ShieldCheck}
                        color="text-purple-400"
                    />
                    <RoleExplanation
                        title="Member"
                        desc="Can view dashboards, debug diffs, and configure safety rules."
                        icon={Users}
                        color="text-blue-400"
                    />
                </div>

            </div>
        </div>
    )
}

// --- SUB-COMPONENTS ---

const Avatar = ({ member }: { member: TeamMember }) => {
    if (member.avatarUrl) {
        return (
            <Image
                src={member.avatarUrl}
                alt={member.name}
                className="w-9 h-9 rounded-full border border-zinc-700 object-cover"
            />
        )
    }
    // Fallback Initials
    const initials = member.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    const isInvited = member.status === 'invited';

    return (
        <div className={`
         w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold
         ${isInvited
                ? 'bg-transparent border-2 border-dashed border-zinc-700 text-zinc-500'
                : 'bg-zinc-800 border border-zinc-700 text-zinc-300'
            }
      `}>
            {initials}
        </div>
    )
}

const RoleBadge = ({ role }: { role: Role }) => {
    switch (role) {
        case 'owner':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">
                    <Crown className="w-3 h-3" /> Owner
                </span>
            )
        case 'admin':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    <ShieldCheck className="w-3 h-3" /> Admin
                </span>
            )
        case 'member':
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    <Users className="w-3 h-3" /> Member
                </span>
            )
        default:
            return (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                    Viewer
                </span>
            )
    }
}

interface RoleExplanationProps {
    title: string
    desc: string
    icon: React.ElementType
    color: string
}

const RoleExplanation = ({ title, desc, icon: Icon, color }: RoleExplanationProps) => (
    <div className="flex gap-3">
        <div className={`mt-0.5 ${color}`}>
            <Icon className="w-4 h-4" />
        </div>
        <div>
            <h4 className="text-sm font-bold text-zinc-200">{title}</h4>
            <p className="text-xs text-zinc-500 leading-relaxed">{desc}</p>
        </div>
    </div>
)

export default Page