'use client'

import { useRouter } from "next/navigation";
import React, { useState } from 'react';
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckSquare, Square, Loader2 } from 'lucide-react';
// Imported custom toast hook
import api from '@/utils/api';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { googleLogin, signup } from '@/services/auth.service';
import {
  GoogleLogin,
} from "@react-oauth/google";
import { useAuth } from "@/context/AuthProvider";
import { useQueryClient } from "@tanstack/react-query";

export default function SignUpPage() {
  const { showToast } = useToast();

  // Input Field States
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const { refetchUser } = useAuth();
  const queryClient = useQueryClient();
  
  // Structural Toggles
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Unified Input Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const router = useRouter();

  // Submit Handler with full pipeline verification
  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!agreeTerms) {
      showToast(
        "Please review and agree to the Terms & Conditions to proceed.",
        "warning"
      );
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    if (formData.password.length < 8) {
      showToast("Password must be at least 8 characters.", "warning");
      return;
    }

    try {
      setIsLoading(true);

      await signup({
        fullName: formData.name,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      });

      showToast(
        "Registration initialized successfully!",
        "success"
      );

      router.push(
        `/authUser/userAuth/verify-otp?email=${encodeURIComponent(
          formData.email
        )}`
      );
    } catch (error: any) {
      showToast(
        error?.response?.data?.message ||
        "Registration failed.",
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

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

          <div className="max-w-xl w-full mx-auto my-auto space-y-6">
            {/* Header Content */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Create Your Account</h2>
              <p className="text-gray-500 text-sm">Join RescrapX and initiate your green vehicle scrapping journey</p>
            </div>

            {/* Stepper Wizard Indicator Component */}
            <div className="flex items-center justify-center lg:justify-start max-w-sm mx-auto lg:mx-0 py-2">
              <div className="flex flex-col items-center lg:items-start flex-1">
                <div className="w-8 h-8 rounded-full bg-[#0B5B32] text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-50">1</div>
                <span className="text-[11px] font-bold text-[#0B5B32] mt-1.5">Basic Info</span>
              </div>
              <div className="h-0.5 bg-gray-100 w-16 -mt-5"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">2</div>
                <span className="text-[11px] font-semibold text-gray-400 mt-1.5">Verify</span>
              </div>
              <div className="h-0.5 bg-gray-100 w-16 -mt-5"></div>
              <div className="flex flex-col items-center flex-1">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-200 text-gray-400 flex items-center justify-center text-xs font-bold">3</div>
                <span className="text-[11px] font-semibold text-gray-400 mt-1.5">Complete</span>
              </div>
            </div>

            {/* Main Multi-input Form */}
            <form onSubmit={handleSignUp} className="space-y-4 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
              {/* Full Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Full Name</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-white">
                  <User size={18} className="absolute left-4 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full pl-11 pr-4 py-3 text-sm outline-none font-medium text-gray-800"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Email Address Fields */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Email Address</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-white">
                  <Mail size={18} className="absolute left-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full pl-11 pr-4 py-3 text-sm outline-none font-medium text-gray-800"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Create Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Password</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-white">
                  <Lock size={18} className="absolute left-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a password"
                    className="w-full pl-11 pr-10 py-3 text-sm outline-none font-medium text-gray-800"
                    disabled={isLoading}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute right-3 text-gray-400 hover:text-gray-600 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <p className="text-[10px] text-gray-400 font-medium mt-1 leading-normal">Min. 8 characters with numbers & letters</p>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Confirm Password</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-white">
                  <Lock size={18} className="absolute left-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                    className="w-full pl-11 pr-10 py-3 text-sm outline-none font-medium text-gray-800"
                    disabled={isLoading}
                    required
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} disabled={isLoading} className="absolute right-3 text-gray-400 hover:text-gray-600 transition">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Terms and conditions segment */}
              <div className="sm:col-span-2 flex items-start gap-3 py-2">
                <button type="button" onClick={() => setAgreeTerms(!agreeTerms)} disabled={isLoading} className="mt-0.5 text-[#0B5B32] flex-shrink-0 disabled:opacity-50">
                  {agreeTerms ? <CheckSquare size={20} className="fill-[#0B5B32] stroke-white" /> : <Square size={20} className="text-gray-300" />}
                </button>
                <p className="text-xs text-gray-500 leading-normal font-medium selection:bg-transparent">
                  I expressly verify and agree to the <a href="#" className="text-[#0B5B32] font-bold hover:underline">Terms & Conditions</a> along with the company's detailed <a href="#" className="text-[#0B5B32] font-bold hover:underline">Privacy Policy</a>.
                </p>
              </div>

              {/* Register Call to Action */}
              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#0B5B32] hover:bg-[#094d2a] disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition disabled:transform-none disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      <span>Creating Secure Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Continue Registration</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Social Oauth Splitting */}
            <div className="relative flex items-center pt-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold uppercase tracking-wider">or sign up with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Centered Single Google Login Wrapper */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-sm flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!max-w-full">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (!credentialResponse.credential) return;

                    const response = await googleLogin(
                      credentialResponse.credential
                    );

                    // Immediately update auth state cache
                    queryClient.setQueryData(
                      ["current-user"],
                      response
                    );

                    router.replace("/");
                  }}
                  onError={() => {
                    console.log("Google Login Failed");
                  }}
                  width="100%"
                />
              </div>
            </div>
          </div>

          {/* Core redirection linking */}
          <div className="text-center mt-6 text-sm text-gray-500 font-medium">
            Already registered an account?{' '}
            <a href="/authUser/userAuth/login" className="text-[#10B981] font-extrabold hover:underline">
              Login here
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
              <p className="text-gray-400 text-xs leading-relaxed">Every piece of user information, document upload, and credential hash is preserved under protected isolated databases.</p>
            </div>

            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">02 / Open Framework</h4>
              <h3 className="text-lg font-bold text-white mb-2">100% Operational Transparency</h3>
              <p className="text-gray-400 text-xs leading-relaxed">No hidden processing dues, zero regulatory surprises. Keep real-time tracking loops over valuation estimates directly.</p>
            </div>

            <div>
              <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest mb-1">03 / Certified Scrapping</h4>
              <h3 className="text-lg font-bold text-white mb-2">Legal Compliance Protocols</h3>
              <p className="text-gray-400 text-xs leading-relaxed">Fully aligned with governmental vehicle deregistration frameworks, delivering formal destruction certifications seamlessly.</p>
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