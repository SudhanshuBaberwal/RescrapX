'use client'

import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { verifyOTP } from '@/services/auth.service';
import { useSearchParams } from 'next/navigation';

export default function VerifyOTP() {
    const { showToast } = useToast();
    const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [resendTimer, setResendTimer] = useState(59);

    const inputRefs = useRef<HTMLInputElement[]>([]);

    // Countdown logic for security token regeneration
    useEffect(() => {
        const interval = setInterval(() => {
            setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const searchParams = useSearchParams();

    const email = searchParams.get("email");

    // Handles character input dynamic focusing controls
    const handleChange = (element: HTMLInputElement, index: number) => {
        if (isNaN(Number(element.value))) return;

        const updatedOtp = [...otp];
        updatedOtp[index] = element.value;
        setOtp(updatedOtp);

        // Auto shift cursor forward to the next index box
        if (element.value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handles deletion shift actions
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const fullOtp = otp.join(""); // string

            if (fullOtp.length !== 6) {
                showToast(
                    "Security perimeter mismatch: Token must be exactly 6 digits.",
                    "warning"
                );
                return;
            }

            if (!email) {
                showToast("Email not found.", "error");
                return;
            }

            setIsLoading(true);

            await verifyOTP({
                email,
                otp: fullOtp, // ✅ Send string instead of array
            });

            showToast(
                "Identity verification successful. Session authenticated.",
                "success",
                3000
            );

            setTimeout(() => {
                window.location.href = "/";
            }, 1000);

        } catch (error: any) {
            console.error(error);

            const fallbackErrorMessage =
                error?.response?.data?.message ||
                error?.message ||
                "Verification failed.";

            showToast(fallbackErrorMessage, "error");
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (resendTimer > 0) return;

        if (!email) {
            showToast("Email not found.", "error");
            return;
        }

        try {
            setIsLoading(true);

            // await resendVerificationOTP({
            //     email,
            // });

            setResendTimer(59);

            setOtp(new Array(6).fill(""));

            inputRefs.current[0]?.focus();

            showToast(
                "A new verification code has been sent to your email.",
                "success"
            );
        } catch (error: any) {
            showToast(
                error?.response?.data?.message ||
                "Failed to resend verification code.",
                "error"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        /* Strict Viewport Frame Alignment */
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

            {/* Main Center Verification Container */}
            <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-6 z-10 w-full max-w-md mx-auto my-auto h-[calc(100vh-60px)]">

                {/* 🔒 Glassmorphism OTP Verification Frame */}
                <div className="w-full bg-[#0b0f19]/75 border border-white/[0.08] backdrop-blur-2xl p-6 md:p-8 rounded-3xl shadow-[0_32px_70px_-20px_rgba(0,0,0,0.9)] space-y-6 relative overflow-hidden before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-b before:from-white/[0.03] before:to-transparent">

                    {/* Header Details */}
                    <div className="text-center space-y-1.5">
                        <div className="mx-auto h-10 w-10 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-lg text-slate-300">
                            💬
                        </div>
                        <div className="space-y-0.5">
                            <h2 className="text-lg font-semibold text-white tracking-tight">Two-Factor Authentication</h2>
                            <p className="text-[11px] text-slate-400 font-medium">Input the 6-digit access key dispatched to your device.</p>
                        </div>
                    </div>

                    {/* Verification Box Fields */}
                    <form onSubmit={handleVerify} className="space-y-5">
                        <div className="flex justify-center gap-2 sm:gap-3">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength={1}
                                    ref={(el) => { if (el) inputRefs.current[index] = el; }}
                                    value={data}
                                    onChange={(e) => handleChange(e.target, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    disabled={isLoading}
                                    className="w-10 h-12 sm:w-12 sm:h-14 bg-[#111625]/50 border border-white/[0.06] focus:border-emerald-500/50 rounded-xl text-center text-sm font-semibold font-mono text-white outline-none transition-all duration-300 focus:shadow-[0_0_20px_-5px_rgba(16,185,129,0.2)] disabled:opacity-50"
                                />
                            ))}
                        </div>

                        {/* Security Action Execution Controls */}
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
                                        Validating Parameters...
                                    </>
                                ) : (
                                    <>
                                        Verify Security Token <span className="text-xs transition-transform group-hover:translate-x-0.5">→</span>
                                    </>
                                )}
                            </span>
                        </button>
                    </form>

                    {/* Resend Action Framework Grid */}
                    <div className="pt-4 border-t border-white/[0.06] flex flex-col items-center gap-2">
                        <p className="text-[10px] text-slate-400 font-medium font-mono">
                            {resendTimer > 0 ? (
                                <span>Re-transmission unlock in <strong className="text-slate-200">{resendTimer}s</strong></span>
                            ) : (
                                <button
                                    onClick={handleResend}
                                    className="text-emerald-400 font-semibold hover:text-emerald-300 hover:underline transition-colors cursor-pointer"
                                >
                                    Resend Security Token
                                </button>
                            )}
                        </p>
                        <p className="text-[9px] text-slate-500">
                            Mistaken entry layer? <a href="/login" className="text-slate-400 hover:text-slate-300 transition-colors underline">Return to Terminal</a>
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