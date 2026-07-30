'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, AlertTriangle, FileUp, RefreshCw, HelpCircle, ArrowLeft, Loader } from 'lucide-react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { reuploadDocuments } from '@/services/admin.service';
import { setUserData } from '@/store/userSlice';

export default function RejectionApprovalGateway() {
    const { showToast } = useToast();
    const router = useRouter();
    const { userData } = useSelector((state: RootState) => state.user)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>()
    const [loading, setLoading] = useState(false)

    // Mock/Sample Rejection Reasons coming from backend compliance audit logs
    const rejectionLogs = userData?.rejectionReason

    const handleReuploadRedirect = () => {
        setLoading(true)
        try {
            if (!userData?._id) {
                showToast("Partner Id is reqired", 'error')
                return;
            }
            setIsSubmitting(true);
            reuploadDocuments(userData?._id)
            dispatch(setUserData({ ...userData, partnerStatus: "PENDING", partnerNextStep: "WAIT_APPROVAL" }))
            showToast("Opening secure validation pipeline for re-upload...", "success");
            setTimeout(() => {
                // Direct user back to upload pipeline with re-upload context flags
                router.push(`/partner/verify-documents`);
            }, 1000);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    };

    return (
        <div className="h-screen w-screen bg-[#030712] text-slate-200 selection:bg-rose-500/30 selection:text-rose-300 font-sans antialiased flex flex-col justify-between relative isolate overflow-hidden">

            {/* Ambient Red/Rose Nebula Space Glares */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
            <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-rose-500/5 blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_8s_infinite_ease-in-out]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full bg-indigo-500/5 blur-[140px] mix-blend-screen pointer-events-none animate-[pulse_10s_infinite_ease-in-out_1s]" />

            {/* Main Content Component Block */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full max-w-xl mx-auto my-auto">

                <div className="w-full bg-[#0b0f19]/75 border border-white/[0.08] backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-[0_32px_70px_-20px_rgba(0,0,0,0.9)] space-y-6 text-center relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent animate-in fade-in zoom-in duration-300">

                    {/* Compliance Rejection Radial Ring Display */}
                    <div className="flex justify-center pt-2 relative">
                        <div className="absolute w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/20 animate-ping opacity-60 duration-1000" />
                        <div className="h-16 w-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-[0_0_30px_-5px_rgba(244,63,94,0.2)]">
                            <XCircle size={28} />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <span className="text-[9px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border border-rose-500/20 bg-rose-500/10 text-rose-400">
                            Verification Failed
                        </span>
                        <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">
                            Compliance Audit Declined
                        </h2>
                        <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                            Our compliance desk reviewed your RVSF onboarding parameters and found discrepancies that violate protocol standards.
                        </p>
                    </div>

                    {/* Audit Failure Discrepancies Logs */}
                    <div className="bg-[#111625]/60 border border-white/[0.04] rounded-2xl p-4 text-left space-y-3">
                        <div className="flex items-center gap-2 border-b border-white/[0.04] pb-2 text-rose-400 font-bold text-[10px] uppercase tracking-wider font-mono">
                            <AlertTriangle size={12} />
                            <span>System Discrepancy Logs:</span>
                        </div>

                        <div className="space-y-2.5 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                            {rejectionLogs}
                            {/* {rejectionLogs.map((log, idx) => (
                                <div key={idx} className="space-y-0.5">
                                    <span className="text-[10px] font-bold text-slate-300 block font-mono">
                                        • {log.field}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-normal pl-3 block leading-normal">
                                        {log.reason}
                                    </span>
                                </div>
                            ))} */}
                        </div>
                    </div>

                    {/* Action Execution Layer */}
                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                        <button
                            onClick={() => router.push('/register')}
                            disabled={isSubmitting}
                            className="w-full sm:w-1/3 font-semibold text-[11px] py-3.5 px-4 rounded-xl transition-all duration-300 border border-white/[0.05] bg-white/[0.02] text-slate-300 hover:bg-white/[0.06] flex items-center justify-center gap-1.5 active:scale-[0.98] cursor-pointer"
                        >
                            <ArrowLeft size={12} />
                            Exit Terminal
                        </button>

                        <button
                            onClick={handleReuploadRedirect}
                            disabled={isSubmitting}
                            className={`w-full sm:w-2/3 font-semibold text-[11px] py-3.5 px-5 rounded-xl transition-all duration-300 shadow-md text-center tracking-wider uppercase flex items-center justify-center gap-2 group active:scale-[0.98] ${isSubmitting
                                ? 'bg-white/[0.02] text-slate-500 border border-white/[0.05] cursor-not-allowed'
                                : 'bg-white text-black hover:bg-slate-100 cursor-pointer drop-shadow-[0_0_25px_rgba(255,255,255,0.15)]'
                                }`}
                        >
                            <FileUp size={12} className="transition-transform group-hover:-translate-y-0.5" />
                            {loading ? <Loader /> : "Modify & Re-upload Documents"}
                        </button>
                    </div>

                    <div className="pt-1">
                        <a
                            href="mailto:compliance@rescrapx.com"
                            className="text-[10px] text-slate-500 font-medium hover:text-rose-400 transition-colors inline-flex items-center gap-1 group"
                        >
                            <HelpCircle size={10} />
                            Dispute this compliance audit report
                        </a>
                    </div>
                </div>

            </main>

            {/* Premium Space-Tech Bottom Analytics Footer Layout */}
            <footer className="border-t border-white/[0.04] bg-[#070b14]/50 backdrop-blur-md px-8 py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-[10px] text-slate-500 w-full tracking-wide font-mono z-10">
                <p>© 2026 RescrapX Inc. Authorization node active.</p>
                <div className="flex gap-4 items-center">
                    <span className="text-[9px] font-medium flex items-center gap-1.5 bg-white/[0.02] px-2.5 py-1 rounded-md border border-white/[0.04] text-rose-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse" />
                        Audit Action Required
                    </span>
                </div>
            </footer>
        </div>
    );
}