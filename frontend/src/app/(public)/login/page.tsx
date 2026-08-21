'use client'

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight, ShieldCheck, Phone, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { googleLogin, login } from '@/services/auth.service';
import { setLoading, setUserData } from '@/store/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { GoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  // Input Change Handler
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Main Form Submit Handler
  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      dispatch(setUserData(result.data));
      showToast("Welcome back! Authentication successful.", "success");
      router.replace("/");
    } catch (error: any) {
      showToast(
        error?.response?.data?.message || error?.message || "Login failed. Please try again.",
        "error"
      );
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F2F1] flex items-center justify-center p-3 sm:p-4 lg:p-6 font-sans text-gray-800">

      {/* Main Elevated Card Container */}
      <div className="w-full max-w-7xl bg-white rounded-3xl shadow-2xl border border-gray-100/80 overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">

        {/* Left Section: Hidden on small screens, visible on LG screens and up */}
        <div className="hidden lg:flex lg:col-span-6 bg-[#F2F5F2] p-8 xl:p-10 flex-col justify-between relative overflow-hidden">

          {/* Brand Header with Desktop Logo */}
          <div className="z-10 flex items-center justify-center">
            <img
              src="/logo2.png"
              alt="RescrapX Logo"
              className="h-20 md:h-24 lg:h-78 w-auto object-contain -ml-2"
            />
          </div>

          {/* Hero Content & Mobile Mockups */}
          <div className="my-auto py-4 z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center max-w-2xl mx-auto xl:max-w-none">

            {/* Tagline */}
            <div className="md:col-span-5 space-y-3">
              <h1 className="text-3xl xl:text-4xl font-extrabold text-[#0B5B32] leading-tight">
                Recycle Today, <br />
                Drive Tomorrow
              </h1>
              <p className="text-xs xl:text-sm text-slate-600 leading-relaxed font-medium">
                Turn your old vehicle into sustainable value. Transparent, certified, and completely hassle-free.
              </p>
            </div>

            {/* Mobile Mockup Artwork Visual Component */}
            <div className="md:col-span-7 relative flex justify-center items-center my-2">

              {/* Back Phone: Dashboard Mockup */}
              <div className="w-48 h-96 bg-white rounded-[2.5rem] border-4 border-slate-900 shadow-xl p-3 absolute -left-6 top-3 transform -rotate-6 z-0 opacity-95 hidden sm:block">
                <div className="w-16 h-3.5 bg-slate-900 rounded-full mx-auto mb-3"></div>
                <div className="text-xs font-bold text-slate-700 border-b pb-1.5 mb-3">≡ Dashboard</div>
                <div className="bg-slate-50 p-2.5 rounded-xl text-[10px] space-y-1 border border-slate-100">
                  <div className="font-bold text-slate-800">Welcome Back!</div>
                  <div className="text-slate-400">Track your vehicle scrapping status</div>
                </div>
                <div className="mt-4 space-y-2.5 text-[9px]">
                  <div className="text-slate-500 font-bold">Your Scrapping Progress</div>
                  <div className="space-y-2 text-emerald-700 font-semibold pl-1">
                    <div className="flex items-center gap-1.5">✓ Request Submitted</div>
                    <div className="flex items-center gap-1.5">✓ Vehicle Picked Up</div>
                    <div className="flex items-center gap-1.5">✓ At RVSF Facility</div>
                    <div className="text-slate-300 font-normal">○ Vehicle Scrapped</div>
                  </div>
                </div>
              </div>

              {/* Front Phone: Main Landing App Mockup */}
              <div className="w-60 h-[460px] bg-slate-900 rounded-[3rem] p-3.5 shadow-2xl relative z-10 border-4 border-slate-800">
                <div className="w-20 h-4 bg-slate-800 rounded-full mx-auto mb-3"></div>
                <div className="bg-white rounded-[2.2rem] h-[calc(100%-1.5rem)] overflow-hidden p-4 flex flex-col justify-between text-center relative">

                  {/* Brand inside app */}
                  <div className="mt-1">
                    <div className="text-base font-black tracking-tight text-slate-900">Rescrap<span className="text-[#0B5B32]">X</span></div>
                    <div className="text-[8px] font-extrabold text-[#0B5B32] uppercase">Scrap Right. Scrap Safe.</div>
                  </div>

                  {/* App Center Text */}
                  <div className="my-auto space-y-1.5">
                    <div className="text-[#0B5B32] font-black text-base leading-tight">Scrap Right, <br />Scrap Safe.</div>
                    <p className="text-[9px] text-slate-500 px-2 leading-tight">
                      We make vehicle scrapping easy, eco-friendly, and totally hassle-free.
                    </p>
                  </div>

                  {/* Tow Truck / Banner graphic representative area */}
                  <div className="bg-[#0B5B32] rounded-xl p-2 text-white my-2">
                    <div className="text-[8px] font-black tracking-wider">&gt;&gt;&gt; WE PICK UP, YOU RELAX. &lt;&lt;&lt;</div>
                  </div>

                  {/* Eco Badge Card */}
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-2.5 text-left flex items-center gap-2 mt-auto">
                    <div className="w-6 h-6 rounded-full bg-emerald-100 text-[#0B5B32] flex items-center justify-center text-xs flex-shrink-0">🌱</div>
                    <div>
                      <div className="text-[9px] font-bold text-slate-800">Eco-Friendly Process</div>
                      <div className="text-[7.5px] text-slate-400 leading-tight">We follow certified and environment safe scrapping practices.</div>
                    </div>
                  </div>

                  {/* Pagination dots */}
                  <div className="flex justify-center gap-1.5 mt-2.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                    <span className="w-2 h-2 rounded-full bg-slate-200"></span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Verification Badge */}
          <div className="z-10 pt-2">
            <div className="inline-flex items-center gap-2 bg-emerald-100/80 text-[#0B5B32] px-4 py-2 rounded-full text-xs font-bold border border-emerald-200/60">
              <ShieldCheck size={18} />
              <span>100% Government Approved Process</span>
            </div>
          </div>

        </div>

        {/* Right Section: Login Form Content */}
        <div className="lg:col-span-6 p-6 sm:p-8 xl:p-12 flex flex-col justify-center">
          <div className="max-w-lg w-full mx-auto space-y-4">

            {/* Mobile-Only Logo Header */}
            <div className="flex items-center justify-center lg:hidden mb-2">
              <img
                src="/logo2.png"
                alt="RescrapX Logo"
                className="h-50 w-auto object-contain"
              />
            </div>

            {/* Header */}
            <div>
              <h2 className="text-3xl xl:text-4xl font-extrabold text-slate-900">Welcome Back!</h2>
              <p className="text-xs xl:text-sm text-slate-500 font-medium mt-1">Login to manage your vehicle scrapping progress</p>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-3">

              {/* Email Address */}
              <div>
                <label className="block text-[11px] font-black uppercase text-slate-700 tracking-wider mb-1">EMAIL ADDRESS</label>
                <div className="relative flex items-center">
                  <Mail size={18} className="absolute left-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your registered email"
                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0B5B32] focus:bg-white transition text-slate-800 font-medium"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[11px] font-black uppercase text-slate-700 tracking-wider">PASSWORD</label>
                  <a href="/forgot-password" className="text-[#0B5B32] text-xs font-bold hover:underline">
                    Forgot Password?
                  </a>
                </div>
                <div className="relative flex items-center">
                  <Lock size={18} className="absolute left-4 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-11 pr-11 py-2.5 bg-slate-50/80 border border-slate-200 rounded-xl text-sm outline-none focus:border-[#0B5B32] focus:bg-white transition text-slate-800 font-medium"
                    disabled={isLoading}
                    required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} disabled={isLoading} className="absolute right-4 text-slate-400 hover:text-slate-600 transition">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B5B32] hover:bg-[#084827] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition shadow-md hover:shadow-lg disabled:opacity-50 mt-4"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Login Securely</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Social Divider */}
            <div className="relative flex items-center py-1">
              <div className="flex-grow border-t border-slate-100"></div>
              <span className="flex-shrink mx-4 text-[11px] font-bold text-slate-400 tracking-wider uppercase">OR LOGIN WITH</span>
              <div className="flex-grow border-t border-slate-100"></div>
            </div>

            {/* OAuth buttons wrapper */}
            <div className="space-y-2.5">

              {/* Google OAuth Component */}
              <div className="w-full flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!max-w-full">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (!credentialResponse.credential) return;
                    try {
                      const response = await googleLogin(credentialResponse.credential);
                      dispatch(setUserData(response.data));
                      showToast("Google authentication successful!", "success");
                      router.replace("/");
                    } catch (error: any) {
                      showToast(
                        error?.response?.data?.message || "Google authentication failed.",
                        "error"
                      );
                    }
                  }}
                  onError={() => {
                    showToast("Google Login Failed", "error");
                  }}
                  width="100%"
                />
              </div>

              {/* Alternative Mobile Login Secondary Action */}
              <button
                type="button"
                className="w-full border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 rounded-xl font-bold text-xs xl:text-sm flex items-center justify-center gap-2 transition"
              >
                <Phone size={16} className="text-[#0B5B32]" />
                <span>Continue with Mobile Number</span>
              </button>
            </div>

            {/* Redirect Footer */}
            <p className="text-center text-xs xl:text-sm text-slate-500 font-medium pt-1">
              Don't have an account?{' '}
              <a href="/register" className="text-[#0B5B32] font-extrabold hover:underline">
                Create Account
              </a>
            </p>

          </div>
        </div>

      </div>
    </div>
  );
}