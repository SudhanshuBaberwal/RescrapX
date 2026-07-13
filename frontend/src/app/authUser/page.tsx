'use client'

import React, { useState } from 'react';

export default function SignUpGateway() {
    const [selectedRole, setSelectedRole] = useState<string | null>(null);

    const roles = [
        {
            id: 'user',
            title: 'Regular User / Customer',
            icon: '⚙️',
            badge: 'Instant Access',
            desc: 'Get instant vehicle evaluations, manage scrap certificates, and secure transactional pipelines seamlessly.',
            route: '/authUser/userAuth/register'
        },
        {
            id: 'partner',
            title: 'RVSF Partner Layer',
            icon: '🛡️',
            badge: 'Authorized Only',
            desc: 'Register your certified recycling facility to stream global biddings and scale high-volume inventory.',
            route: '/authUser/partnerAuth/register'
        },
        {
            id: 'admin',
            title: 'Platform Administrator',
            icon: '🔑',
            badge: 'Terminal Control',
            desc: 'Request encrypted console access for node parameters, database audits, and operations management.',
            route: '/authUser/adminAuth/register'
        }
    ];

    const handleNavigation = () => {
        if (!selectedRole) return;
        const activeRole = roles.find(r => r.id === selectedRole);
        if (activeRole) {
            window.location.href = activeRole.route;
        }
    };

    return (
        /* Hide scrollbar completely across body container tags */
        <div className="h-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased w-full overflow-y-auto overflow-x-hidden flex flex-col justify-between relative isolate [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">

            {/* 🌌 Ambient Background Layer (Stripe/Linear Style) */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-size-[4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* 💫 Floating Blurred Circles */}
            <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_8s_infinite_ease-in-out]" />
            <div className="absolute top-[20%] right-[-10%] w-150 h-150 rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen pointer-events-none animate-[pulse_10s_infinite_ease-in-out_1s]" />

            {/* Main Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 z-10 w-full max-w-6xl mx-auto my-auto">

                {/* Apple Style Minimal Logo Frame */}
                <div className="text-center space-y-4 mb-12 flex flex-col items-center">
                    <div className="w-64 md:w-72 overflow-hidden flex items-center justify-center invert opacity-95 brightness-200 drop-shadow-[0_0_25px_rgba(255,255,255,0.15)] transition-all duration-500 hover:scale-[1.02]">
                        <img
                            src="/logo.png"
                            alt="RescrapX Premium Logo"
                            className="w-full h-auto object-cover scale-x-125 scale-y-110"
                            onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                if (target.src.endsWith('/logo.png')) target.src = '/Rescrapx_logo.jpg';
                            }}
                        />
                    </div>
                    <p className="text-slate-400 text-xs md:text-sm max-w-md mx-auto leading-relaxed tracking-wide font-normal font-mono opacity-80">
                        Engineered layer for verified end-of-life vehicle liquidation.
                    </p>
                </div>

                {/* 💚 Premium Glassmorphism Selection Box */}
                <div className="w-full bg-[#0b0f19]/60 border border-white/[0.06] backdrop-blur-xl p-6 md:p-10 rounded-3xl shadow-[0_24px_60px_-15px_rgba(0,0,0,0.8)] space-y-8 relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent">

                    <div className="text-center space-y-1.5">
                        <h2 className="text-xl md:text-2xl font-semibold text-white tracking-tight">Create your workspace identity</h2>
                        <p className="text-xs text-slate-400 font-medium">Select a systemic access profile layer to instantiate secure registration.</p>
                    </div>

                    {/* Grid Layout: 3D Lift Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        {roles.map((role) => {
                            const isSelected = selectedRole === role.id;
                            return (
                                <button
                                    key={role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                    style={{ transformStyle: 'preserve-3d' }}
                                    className={`w-full text-left p-6 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-6 relative h-full group [perspective:1000px] ${isSelected
                                            ? 'border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_30px_-5px_rgba(16,185,129,0.2)] -translate-y-2'
                                            : 'border-white/[0.05] bg-[#111625]/40 hover:border-white/[0.15] hover:bg-[#151b2e]/60 hover:-translate-y-1.5 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]'
                                        }`}
                                >
                                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                                    <div className="space-y-4 w-full relative z-10">
                                        <div className="flex items-center justify-between">
                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-lg border transition-colors ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.03] text-slate-300 border-white/[0.05]'
                                                }`}>
                                                {role.icon}
                                            </div>
                                            <span className={`text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${isSelected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/[0.02] text-slate-400 border-white/[0.05]'
                                                }`}>
                                                {role.badge}
                                            </span>
                                        </div>

                                        <div className="space-y-1.5">
                                            <h3 className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors duration-300">
                                                {role.title}
                                            </h3>
                                            <p className="text-[11px] text-slate-400 leading-relaxed font-normal opacity-90">
                                                {role.desc}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="w-full flex justify-end pt-2 relative z-10">
                                        <div className={`h-5 w-5 rounded-full border flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-white/[0.15] bg-transparent'
                                            }`}>
                                            {isSelected && (
                                                <svg className="w-3 h-3 text-black font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {/* ⚡ Premium Stripe-Style CTA Button Frame */}
                    <div className="pt-6 border-t border-white/[0.05] flex flex-col items-center gap-4">
                        <button
                            onClick={handleNavigation}
                            disabled={!selectedRole}
                            className={`w-full md:w-72 font-semibold text-xs py-3.5 px-6 rounded-xl transition-all duration-300 shadow-md text-center tracking-wider uppercase relative overflow-hidden group ${selectedRole
                                    ? 'bg-white text-black hover:bg-slate-100 cursor-pointer active:scale-[0.98] drop-shadow-[0_0_20px_rgba(255,255,255,0.12)]'
                                    : 'bg-white/[0.02] text-slate-500 border border-white/[0.05] cursor-not-allowed'
                                }`}
                        >
                            {selectedRole && (
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-transparent to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            )}
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Initialize Provisioning {selectedRole && <span className="text-xs transition-transform group-hover:translate-x-1">→</span>}
                            </span>
                        </button>
                        <p className="text-[11px] text-slate-400 font-medium">
                            Existing credentials? <a href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors">Authenticate entry</a>
                        </p>
                    </div>

                </div>

            </main>

            {/* Linear Style Pure Border Flat Footer Layout */}
            <footer className="border-t border-white/[0.04] bg-[#070b14]/40 backdrop-blur-md px-8 py-5 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-slate-500 w-full tracking-wide font-mono z-10">
                <p>© 2026 RescrapX Inc. Authorization node active.</p>
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-medium flex items-center gap-1.5 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.04] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        SSL Core Pipeline Secure
                    </span>
                </div>
            </footer>

        </div>
    );
}