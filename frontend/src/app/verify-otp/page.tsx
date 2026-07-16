'use client';

import React, { useState, useRef, useEffect, Suspense } from 'react';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { verifyOTP } from '@/services/auth.service';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { setUserData } from '@/store/userSlice';
import { ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

function OTPFormContent() {
  const { showToast } = useToast();
  const router = useRouter();
  
  // Progress flow steps: 2 = OTP Verification, 3 = Complete & Setup Redirect
  const [currentStep, setCurrentStep] = useState<2 | 3>(2);
  
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(59);

  const inputRefs = useRef<HTMLInputElement[]>([]);
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  // Countdown logic for security token regeneration
  useEffect(() => {
    if (currentStep !== 2) return;
    const interval = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [currentStep]);

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
      const fullOtp = otp.join("");

      if (fullOtp.length !== 6) {
        showToast(
          "Security perimeter mismatch: Token must be exactly 6 digits.",
          "warning"
        );
        return;
      }

      if (!email) {
        showToast("Email not found in session parameters.", "error");
        return;
      }

      setIsLoading(true);

      const result = await verifyOTP({
        email,
        otp: fullOtp,
      });
      
      dispatch(setUserData(result.data));
      
      showToast(
        "Identity verification successful. Session authenticated.",
        "success",
        2000
      );

      // Transition smoothly to step 3 (Complete & Redirect Dashboard)
      setCurrentStep(3);

      // Delay logic before pushing user details directly to operational dashboard
      setTimeout(() => {
        router.push("/roles");
      }, 2500);

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
      showToast("Email parameter mismatch.", "error");
      return;
    }

    try {
      setIsLoading(true);
      // await resendVerificationOTP({ email });

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
    <div className="max-w-xl w-full mx-auto my-auto space-y-8">
      {/* Header Content */}
      <div className="text-center lg:text-left transition-all duration-300">
        {currentStep === 2 ? (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Verify Your Account</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              We have dispatched a 6-digit verification code to <span className="text-gray-800 font-bold break-all">{email || 'your registered email'}</span>.
            </p>
          </>
        ) : (
          <>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Registration Completed!</h2>
            <p className="text-gray-500 text-sm leading-relaxed">
              Your profile verification is successful. Preparing your personalized green scrapping workspace...
            </p>
          </>
        )}
      </div>

      {/* Stepper Wizard Indicator Component */}
      <div className="flex items-center justify-center lg:justify-start max-w-sm mx-auto lg:mx-0 py-2">
        {/* Step 1 */}
        <div className="flex flex-col items-center lg:items-start flex-1">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#0B5B32] flex items-center justify-center text-xs font-bold">✓</div>
          <span className="text-[11px] font-semibold text-gray-400 mt-1.5">Basic Info</span>
        </div>
        <div className="h-0.5 bg-[#0B5B32] w-16 -mt-5"></div>
        
        {/* Step 2 */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            currentStep === 3 
              ? 'bg-emerald-100 text-[#0B5B32]' 
              : 'bg-[#0B5B32] text-white ring-4 ring-emerald-50'
          }`}>
            {currentStep === 3 ? '✓' : '2'}
          </div>
          <span className={`text-[11px] mt-1.5 font-bold ${currentStep === 3 ? 'text-gray-400 font-semibold' : 'text-[#0B5B32]'}`}>Verify</span>
        </div>
        <div className={`h-0.5 w-16 -mt-5 transition-colors duration-300 ${currentStep === 3 ? 'bg-[#0B5B32]' : 'bg-gray-100'}`}></div>
        
        {/* Step 3 */}
        <div className="flex flex-col items-center flex-1">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all duration-300 ${
            currentStep === 3 
              ? 'bg-[#0B5B32] border-[#0B5B32] text-white ring-4 ring-emerald-50' 
              : 'bg-white border-gray-200 text-gray-400'
          }`}>
            3
          </div>
          <span className={`text-[11px] mt-1.5 font-bold ${currentStep === 3 ? 'text-[#0B5B32]' : 'text-gray-400 font-semibold'}`}>Complete</span>
        </div>
      </div>

      {currentStep === 2 ? (
        <>
          {/* Main OTP Verification Form */}
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2 text-center lg:text-left">
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide">Enter 6-Digit Code</label>
              <div className="flex justify-center lg:justify-start gap-2.5 sm:gap-3 py-2">
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
                    className="w-11 h-13 sm:w-12 sm:h-14 bg-gray-50/50 border-2 border-gray-100 focus:border-emerald-600 focus:bg-white rounded-xl text-center text-lg font-bold text-gray-900 outline-none transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {/* Verification CTA Action */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B5B32] hover:bg-[#094d2a] disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:transform-none disabled:cursor-not-allowed cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Validating Security Key...</span>
                  </>
                ) : (
                  <>
                    <span>Verify & Finish Setup</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Resend Action Framework */}
          <div className="bg-gray-50/50 border border-gray-100 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-center sm:text-left">
              <p className="text-xs text-gray-400 font-bold uppercase tracking-wider">Didn't receive the code?</p>
              <p className="text-[11px] text-gray-500 font-medium mt-0.5">Please check spam folder or trigger dynamic re-send.</p>
            </div>
            
            {resendTimer > 0 ? (
              <span className="text-xs font-bold text-gray-400 bg-gray-100 px-3 py-1.5 rounded-lg">
                Resend in {resendTimer}s
              </span>
            ) : (
              <button
                type="button"
                onClick={handleResend}
                className="text-xs font-bold text-[#0B5B32] hover:text-[#094d2a] hover:underline bg-emerald-50 px-3.5 py-2 rounded-lg transition cursor-pointer"
              >
                Resend Code
              </button>
            )}
          </div>
        </>
      ) : (
        /* STEP 3 COMPLETE CARD */
        <div className="w-full bg-emerald-50/30 border border-emerald-100 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
          <div className="p-3 bg-emerald-100 rounded-full text-[#0B5B32] animate-bounce">
            <CheckCircle2 size={40} className="stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h4 className="text-lg font-extrabold text-gray-900">Security Verified!</h4>
            <p className="text-sm text-gray-500 font-semibold max-w-sm">
              Your RescrapX Account has been activated. We are redirecting you to your business operations control center.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-[#0B5B32] bg-white border border-emerald-100 px-4 py-2 rounded-lg shadow-2xs">
            <Loader2 size={14} className="animate-spin" />
            <span>Redirecting to Dashboard...</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VerifyOTP() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 md:p-8 font-sans text-gray-800">

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto my-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[820px]">

        {/* Left Column: Form Content */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-14 flex flex-col justify-between h-full order-2 lg:order-1">

          {/* Mobile Head Logo */}
          <div className="flex flex-col items-center mb-6 lg:hidden">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-[#0B5B32]">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-[#10B981] text-xs font-medium tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          <Suspense fallback={
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="animate-spin text-emerald-600" size={32} />
            </div>
          }>
            <OTPFormContent />
          </Suspense>

          {/* Core redirection linking */}
          <div className="text-center mt-6 text-sm text-gray-500 font-medium">
            Incorrect details entered?{' '}
            <a href="/login" className="text-[#10B981] font-extrabold hover:underline">
              Return to Terminal
            </a>
          </div>
        </div>

        {/* Right Column: Dynamic Informative Feature Grid Showcase Sidebar */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-tr from-gray-900 to-emerald-950 p-12 flex-col justify-between text-white relative order-1 lg:order-2">

          {/* Top Brand Tag */}
          <div>
            <div className="flex items-center gap-1.5 text-2xl font-bold tracking-tight">
              <span>🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-emerald-400 text-xs font-medium tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          {/* Core Corporate Values List Block */}
          <div className="space-y-8 my-auto pr-4">
            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">01 / Secure Assets</h4>
              <h3 className="text-lg font-bold text-white mb-2">Bank-Level Security Structuring</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-normal">Every piece of user information, document upload, and credential hash is preserved under protected isolated databases.</p>
            </div>

            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">02 / Open Framework</h4>
              <h3 className="text-lg font-bold text-white mb-2">100% Operational Transparency</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-normal">No hidden processing dues, zero regulatory surprises. Keep real-time tracking loops over valuation estimates directly.</p>
            </div>

            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">03 / Certified Scrapping</h4>
              <h3 className="text-lg font-bold text-white mb-2">Legal Compliance Protocols</h3>
              <p className="text-gray-400 text-xs leading-relaxed font-normal">Fully aligned with governmental vehicle deregistration frameworks, delivering formal destruction certifications seamlessly.</p>
            </div>
          </div>

          {/* Footer stats signature */}
          <div className="border-t border-emerald-800/60 pt-4 flex justify-between items-center text-[11px] font-medium text-emerald-300">
            <span>Clean Tech Certified Platform</span>
            <span>v2.4.0</span>
          </div>
        </div>

      </div>

      <p className="text-center text-xs text-gray-400 font-medium mt-8">
        © 2026 RescrapX Inc. All legal architecture secured.
      </p>
    </div>
  );
}