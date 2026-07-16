'use client';

import React, { useState, Suspense } from 'react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import axios from 'axios'; // Ensure axios is installed or replace with your preferred fetch wrapper
import { getCurrentUser, setRole } from '@/services/auth.service';
import { setUserData } from '@/store/userSlice';
import { getPartnerStatus } from '@/services/partner.service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

function GatewayContent() {
    const { showToast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useDispatch<AppDispatch>()
    // Context variables configuration
    const email = searchParams.get("email") || "";
    const {userData} = useSelector((state:RootState) => state.user)
    const [selectedRole, setSelectedRole] = useState<string | null>(null);
    const [isNavigating, setIsNavigating] = useState<boolean>(false);

    const roles = [
        {
            id: 'user',
            title: 'Regular User / Customer',
            icon: '⚙️',
            badge: 'Instant Access',
            desc: 'Get instant vehicle evaluations, manage scrap certificates, and secure transactional pipelines seamlessly.',
            route: '/dashboard'
        },
        {
            id: 'partner',
            title: 'RVSF Partner Layer',
            icon: '🛡️',
            badge: 'Authorized Only',
            desc: 'Register your certified recycling facility to stream global biddings and scale high-volume inventory.',
            route: '/partner/verify-documents'
        },
        {
            id: 'admin',
            title: 'Platform Administrator',
            icon: '🔑',
            badge: 'Terminal Control',
            desc: 'Request encrypted console access for node parameters, database audits, and operations management.',
            route: '/admin/dashboard'
        }
    ];

    // Backend Role Setting API Handler
    const updateRoleInBackend = async (role: string) => {
        try {
            const result = await setRole({ role })
            //  dispatch(
            //         setUserData({
            //           ...userData,
            //           partnerStatus: "PENDING",
            //           partnerNextStep: "UPLOAD_DOCUMENTS",
            //         })
            //       );
            return result;
        } catch (error: any) {
            console.error("Backend Role Provisioning Failed:", error);
            showToast(
                error?.response?.data?.message || "Could not map selected identity profile layer to backend secure context.",
                "error"
            );
            return false;
        }
    };

    const handleNavigation = async () => {
        try {
            if (!selectedRole) {
                showToast("Please select an identity layer to initialize provisioning.", "warning");
                return;
            }

            const activeRole = roles.find(r => r.id === selectedRole);
            if (activeRole) {
                setIsNavigating(true);
                showToast(`Provisioning workspace for ${activeRole.title}...`, "success", 2000);

                // Invoke backend system API to set state/role profile
                const result = await updateRoleInBackend(activeRole.id.toUpperCase());

                if (!result) {
                    setIsNavigating(false);
                    return;
                }

                dispatch(setUserData(result.data));

                switch (activeRole.id) {
                    case "partner":
                        router.replace("/partner/register");
                        break;

                    case "admin":
                        router.replace("/admin");
                        break;

                    default:
                        router.replace("/reject-approval");
                        break;
                }

                // setTimeout(() => {
                //     if (activeRole.id === 'partner' && email) {
                //         router.push(`${activeRole.route}?email=${encodeURIComponent(email)}`);
                //     } else {
                //         router.push(activeRole.route);
                //     }
                // }, 800);
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (
        <div className="w-full bg-[#0b0f19]/75 border border-white/[0.08] backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-[0_32px_70px_-20px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent animate-in fade-in zoom-in duration-300">

            <div className="text-center space-y-1">
                <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">Create your workspace identity</h2>
                <p className="text-xs text-slate-400 font-medium">Select a systemic access profile layer to instantiate secure registration.</p>
            </div>

            {/* Cards Grid aligned with Premium Styling */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {roles.map((role) => {
                    const isSelected = selectedRole === role.id;
                    return (
                        <button
                            key={role.id}
                            disabled={isNavigating}
                            onClick={() => setSelectedRole(role.id)}
                            style={{ transformStyle: 'preserve-3d' }}
                            className={`w-full text-left p-5 rounded-2xl border transition-all duration-300 flex flex-col justify-between space-y-4 relative min-h-[145px] group [perspective:1000px] disabled:opacity-50 disabled:cursor-not-allowed ${isSelected
                                ? 'border-emerald-500/60 bg-emerald-950/25 shadow-[0_0_30px_-5px_rgba(16,185,129,0.25)] -translate-y-1'
                                : 'border-white/[0.05] bg-[#111625]/50 hover:border-white/[0.15] hover:bg-[#151b2e]/70 hover:-translate-y-1 hover:shadow-[0_12px_30px_-10px_rgba(0,0,0,0.5)]'
                                }`}
                        >
                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />

                            <div className="space-y-2.5 w-full relative z-10">
                                <div className="flex items-center justify-between">
                                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-bold text-md border transition-colors ${isSelected ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/[0.03] text-slate-300 border-white/[0.05]'
                                        }`}>
                                        {role.icon}
                                    </div>
                                    <span className={`text-[8px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full border ${isSelected ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-white/[0.02] text-slate-400 border-white/[0.05]'
                                        }`}>
                                        {role.badge}
                                    </span>
                                </div>

                                <div className="space-y-1">
                                    <h3 className={`text-xs font-semibold transition-colors duration-300 ${isSelected ? 'text-emerald-400' : 'text-white'
                                        }`}>
                                        {role.title}
                                    </h3>
                                    <p className="text-[10px] text-slate-400 leading-relaxed font-normal opacity-85">
                                        {role.desc}
                                    </p>
                                </div>
                            </div>

                            <div className="w-full flex justify-end pt-1 relative z-10">
                                <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center transition-all duration-300 ${isSelected ? 'border-emerald-500 bg-emerald-500' : 'border-white/[0.15] bg-transparent'
                                    }`}>
                                    {isSelected && (
                                        <svg className="w-2.5 h-2.5 text-black font-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Action Buttons Container */}
            <div className="pt-4 border-t border-white/[0.06] flex flex-col items-center gap-3">
                <button
                    onClick={handleNavigation}
                    disabled={isNavigating || !selectedRole}
                    className={`w-full md:w-64 font-semibold text-[11px] py-3.5 px-5 rounded-xl transition-all duration-300 shadow-md text-center tracking-wider uppercase relative overflow-hidden group ${selectedRole && !isNavigating
                        ? 'bg-white text-black hover:bg-slate-100 cursor-pointer active:scale-[0.98] drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                        : 'bg-white/[0.02] text-slate-500 border border-white/[0.05] cursor-not-allowed'
                        }`}
                >
                    {selectedRole && !isNavigating && (
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-400/20 via-transparent to-indigo-400/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    )}
                    <span className="relative z-10 flex items-center justify-center gap-2">
                        {isNavigating ? (
                            <>
                                <Loader2 size={12} className="animate-spin text-black" />
                                Redirecting...
                            </>
                        ) : (
                            <>
                                Initialize Provisioning {selectedRole && <span className="text-xs transition-transform group-hover:translate-x-1">→</span>}
                            </>
                        )}
                    </span>
                </button>
                <p className="text-[10px] text-slate-400 font-medium">
                    Existing credentials? <a href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors">Authenticate entry</a>
                </p>
            </div>
        </div>
    );
}

export default function SignUpGateway() {
    return (
        <div className="h-screen w-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased flex flex-col justify-between relative isolate overflow-hidden">

            {/* Ambient Background Structure */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-emerald-500/10 blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_8s_infinite_ease-in-out]" />
            <div className="absolute top-[20%] right-[-10%] w-150 h-150 rounded-full bg-indigo-500/10 blur-[140px] mix-blend-screen pointer-events-none animate-[pulse_10s_infinite_ease-in-out_1s]" />

            {/* Premium Scaled Branded Graphics Layer */}
            <div className="absolute left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] lg:w-[75%] max-w-5xl -z-15 pointer-events-none flex flex-col items-center select-none opacity-25 brightness-150 drop-shadow-[0_0_50px_rgba(255,255,255,0.08)] mt-8">
                <img
                    src="/logo.png"
                    alt="RescrapX Premium Logo Layout"
                    className="w-full h-auto object-contain scale-105"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.endsWith('/logo.png')) target.src = '/Rescrapx_logo.jpg';
                    }}
                />
                <p className="text-slate-400 text-[10px] md:text-[12px] leading-none tracking-[0.25em] uppercase font-mono opacity-40 -mt-2 md:-mt-4">
                    Engineered layer for verified end-of-life vehicle liquidation.
                </p>
            </div>

            {/* Aligned Container Layout */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full max-w-4xl mx-auto my-auto h-[calc(100vh-60px)]">
                <Suspense fallback={
                    <div className="h-40 flex items-center justify-center">
                        <Loader2 className="animate-spin text-emerald-500" size={36} />
                    </div>
                }>
                    <GatewayContent />
                </Suspense>
            </main>

            {/* Compact Space-Tech Styled Footer */}
            <footer className="border-t border-white/[0.04] bg-[#070b14]/50 backdrop-blur-md px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 w-full tracking-wide font-mono z-10">
                <p>© 2026 RescrapX Inc. Authorization node active.</p>
                <div className="flex gap-4 items-center">
                    <span className="text-[9px] font-medium flex items-center gap-1.5 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.04] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        SSL Core Pipeline Secure
                    </span>
                </div>
            </footer>
        </div>
    );
}