'use client'

import React, { useState } from 'react';
import { useToast } from '@/lib/ui/toast/ToastContext';// Custom Toast Hook integration
import { forgotPassword } from '@/services/auth.service';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
    const { showToast } = useToast();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter()
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email) {
            showToast("Please enter your registered security email.", "warning");
            return;
        }
        setIsLoading(true);
        const result = await forgotPassword({ email })
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
            showToast("Decryption key and recovery link dispatched successfully.", "success", 4000);
        }, 1500);
        router.push(
            `/reset-password?email=${encodeURIComponent(email)}`
        );
    };

    return (
        /* Strict Viewport Locking to match the login/signup gateway */
        <div className="h-screen w-screen bg-[#030712] text-slate-200 selection:bg-emerald-500/30 selection:text-emerald-300 font-sans antialiased flex flex-col justify-between relative isolate overflow-hidden">

            {/* 🌌 Ambient Grid Background Layer */}
            <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-size-[4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

            {/* 💫 Floating Blurred Glow Effects */}
            <div className="absolute top-[-10%] left-[-10%] w-125 h-125 rounded-full bg-indigo-500/10 blur-[120px] mix-blend-screen pointer-events-none animate-[pulse_8s_infinite_ease-in-out]" />
            <div className="absolute bottom-[-10%] right-[-10%] w-150 h-150 rounded-full bg-emerald-500/10 blur-[140px] mix-blend-screen pointer-events-none animate-[pulse_10s_infinite_ease-in-out_1s]" />

            {/* 🏎️ Premium Subtle Logo Layer Behind Cards */}
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2 w-[90%] md:w-[85%] lg:w-[75%] max-w-5xl -z-15 pointer-events-none flex flex-col items-center select-none opacity-20 brightness-200 invert drop-shadow-[0_0_50px_rgba(255,255,255,0.15)]">
                <img
                    src="/logo.png"
                    alt="RescrapX Premium Logo Layout"
                    className="w-full h-auto object-contain scale-110"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        if (target.src.endsWith('/logo.png')) target.src = '/Rescrapx_logo.jpg';
                    }}
                />
            </div>

            {/* Main Recovery Content Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full max-w-md mx-auto my-auto h-[calc(100vh-60px)]">

                {/* 🔒 Glassmorphism Credential Card */}
                <div className="w-full bg-[#0b0f19]/75 border border-white/[0.08] backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-[0_32px_70px_-20px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent">

                    {/* Header States */}
                    <div className="text-center space-y-2">
                        <div className="mx-auto h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-lg text-slate-300">
                            🔑
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-lg md:text-xl font-semibold text-white tracking-tight">Recover Node Credentials</h2>
                            <p className="text-[11px] text-slate-400 font-medium max-w-[280px] mx-auto leading-normal">
                                {!isSubmitted
                                    ? "Enter your linked terminal email to deploy an encrypted recovery pipeline token."
                                    : "Authorization parameters routed successfully."}
                            </p>
                        </div>
                    </div>

                    {!isSubmitted ? (
                        /* Input Form State */
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-1.5 relative">
                                <label className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block pl-1">
                                    Identity Layer Email
                                </label>
                                <div className="relative group">
                                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs text-slate-500 group-focus-within:text-emerald-400 transition-colors">
                                        📧
                                    </span>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="operator@rescrapx.com"
                                        disabled={isLoading}
                                        className="w-full bg-[#111625]/50 border border-white/[0.06] focus:border-emerald-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 outline-none transition-all duration-300 focus:shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)] disabled:opacity-50"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Action Dispatch Button */}
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full font-semibold text-[11px] py-3 px-5 rounded-xl transition-all duration-300 shadow-md text-center tracking-wider uppercase relative overflow-hidden group ${isLoading
                                    ? 'bg-white/[0.02] text-slate-500 border border-white/[0.05] cursor-wait'
                                    : 'bg-white text-black hover:bg-slate-100 cursor-pointer active:scale-[0.98] drop-shadow-[0_0_25px_rgba(255,255,255,0.1)]'
                                    }`}
                            >
                                <span className="relative z-10 flex items-center justify-center gap-2">
                                    {isLoading ? (
                                        <>
                                            <span className="h-3 w-3 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                                            Initializing Dispatch...
                                        </>
                                    ) : (
                                        <>
                                            Initialize Recovery <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
                                        </>
                                    )}
                                </span>
                            </button>
                        </form>
                    ) : (
                        /* Success Acknowledgment State */
                        <div className="space-y-4 animate-fade-in">
                            <div className="bg-emerald-950/20 border border-emerald-500/20 p-4 rounded-xl space-y-2 text-center">
                                <p className="text-[11px] text-emerald-400 leading-relaxed font-normal">
                                    A secured reset transmission has been broadcasted to <strong className="text-white font-semibold">{email}</strong>. Please check your system logs / inbox within the next 15 minutes.
                                </p>
                            </div>

                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="w-full text-center text-[10px] font-mono text-slate-500 hover:text-slate-300 transition-colors py-1 block"
                            >
                                ↺ Re-enter token parameters
                            </button>
                        </div>
                    )}

                    {/* Navigation Routing Options */}
                    <div className="pt-4 border-t border-white/[0.06] text-center">
                        <p className="text-[10px] text-slate-400 font-medium">
                            Remember your parameters? <a href="/login" className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors">Return to Terminal</a>
                        </p>
                    </div>

                </div>
            </main>

            {/* Flat Standard Footer Component */}
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