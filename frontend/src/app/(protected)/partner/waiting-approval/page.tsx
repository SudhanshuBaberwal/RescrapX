'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ShieldAlert, Loader2, RefreshCw, Clock, ExternalLink } from 'lucide-react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { getCurrentUser } from '@/services/auth.service';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';

export default function PendingApprovalGateway() {
    // getCurrentUser()
    const { showToast } = useToast();
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user)
    const [isChecking, setIsChecking] = useState<boolean>(false);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                await getCurrentUser();
            } catch (err) {
                console.error(err);
            }
        }, 10000); // every 10 sec

        return () => clearInterval(interval);

    }, []);
    // Dynamic Server Polling Execution to check verification status update
    const checkVerificationStatus = async () => {

        try {
            setIsChecking(true);
            console.log(userData)
            const status = userData?.partnerStatus
            const nextStep = userData?.partnerNextStep
            if (status === 'APPROVED' && nextStep === "DASHBOARD") {
                showToast("Account validation complete. Provisioning RVSF terminal node...", "success");
                router.push('/');
            } else if (status === 'REJECTED') {
                showToast("Verification compliance failed. Redirecting to validation corrections.", "error");
                router.push(`/partner/reject-approval`);
            } else {
                showToast("Security audit ongoing. Node remains in verification queue.", "warning");
            }
        } catch (error: any) {
            console.error("Status check failed:", error);
            showToast(
                error?.response?.data?.message || "Unable to sync compliance ledger node state.",
                "error"
            );
        } finally {
            setIsChecking(false);
        }
    };

    return (
        <div className="h-screen w-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased flex flex-col justify-between relative isolate overflow-hidden">

            {/* Ambient Nebula Space Glares */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-amber-500/5 blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_8s_infinite_ease-in-out]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full bg-emerald-500/5 blur-[140px] mix-blend-screen pointer-events-none animate-[pulse_10s_infinite_ease-in-out_1s]" />

            {/* Main Component Block Wrapper */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full max-w-xl mx-auto my-auto">

                <div className="w-full bg-[#0b0f19]/75 border border-white/8 backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-[0_32px_70px_-20px_rgba(0,0,0,0.9)] space-y-6 text-center relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent animate-in fade-in zoom-in duration-300">

                    {/* Pulsing Compliance Radial Ring Display */}
                    <div className="flex justify-center pt-2 relative">
                        <div className="absolute w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 animate-ping opacity-60 duration-1000" />
                        <div className="h-16 w-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_30px_-5px_rgba(245,158,11,0.2)]">
                            <Clock size={28} className="animate-pulse" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-amber-500/20 bg-amber-500/10 text-amber-400">
                            Verification Pending
                        </span>
                        <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                            Security Audit & Operations Syncing
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                            Your RVSF registration pipeline data has been queued. Platform nodes are auditing system parameters and compliance structures.
                        </p>
                    </div>

                    {/* Operational Parameter Logs Check */}
                    <div className="bg-[#111625]/60 border border-white/4 rounded-2xl p-4 text-left space-y-2.5">
                        <div className="flex items-center justify-between border-b border-white/4 pb-2">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">Registry Target:</span>
                            <span className="text-[11px] font-bold text-slate-300 truncate max-w-50 font-mono">{'anonymous-node'}</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 font-mono">ETA Window:</span>
                            <span className="text-[10px] font-semibold text-amber-400 flex items-center gap-1">
                                <ShieldAlert size={12} /> Within 12-24 Business Hours
                            </span>
                        </div>
                    </div>

                    {/* Refresh / Action Controller Execution */}
                    <div className="pt-2 flex flex-col items-center gap-3">
                        <button
                            onClick={checkVerificationStatus}
                            disabled={isChecking}
                            className={`w-full font-semibold text-[11px] py-3.5 px-5 rounded-xl transition-all duration-300 shadow-md text-center tracking-wider uppercase flex items-center justify-center gap-2 group active:scale-[0.98] ${isChecking
                                ? 'bg-white/2 text-slate-500 border border-white/5 cursor-not-allowed'
                                : 'bg-white text-black hover:bg-slate-100 cursor-pointer drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                                }`}
                        >
                            {isChecking ? (
                                <>
                                    <Loader2 size={12} className="animate-spin text-slate-500" />
                                    Synchronizing Nodes...
                                </>
                            ) : (
                                <>
                                    <RefreshCw size={12} className="transition-transform group-hover:rotate-180 duration-500" />
                                    Sync Verification State
                                </>
                            )}
                        </button>

                        <a
                            href="mailto:support@rescrapx.com"
                            className="text-[10px] text-slate-400 font-medium hover:text-emerald-400 transition-colors flex items-center gap-1.5 pt-1 group"
                        >
                            Contact compliance operational desk
                            <ExternalLink size={10} className="text-slate-500 group-hover:text-emerald-400 transition-colors" />
                        </a>
                    </div>
                </div>

            </main>

            {/* Premium Space-Tech Bottom Analytics Footer Layout */}
            <footer className="border-t border-white/[0.04] bg-[#070b14]/50 backdrop-blur-md px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 w-full tracking-wide font-mono z-10">
                <p>© 2026 RescrapX Inc. Authorization node active.</p>
                <div className="flex gap-4 items-center">
                    <span className="text-[9px] font-medium flex items-center gap-1.5 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.04] text-slate-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                        Audit Pending Core
                    </span>
                </div>
            </footer>
        </div>
    );
}