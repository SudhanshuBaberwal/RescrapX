'use client'

import React, { useState } from 'react';
import { Eye, EyeOff, ArrowRight, ShieldCheck, Mail, Loader2 } from 'lucide-react';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import { useToast } from '@/lib/ui/toast/ToastContext';
import { login } from '@/services/auth.service';
import { setLoading, setUserData } from '@/store/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
export default function LoginPage() {
  const dispatch = useDispatch<AppDispatch>()
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      // API call using your unified API module
      const result = await login({
        email: formData.email,
        password: formData.password,
      });
      dispatch(setUserData(result.data))
      setSuccessMessage("Authentication successful! Redirecting...");
      showToast("Welcome back! Authentication successful.", "success");
      router.replace("/");
      
    } catch (error: any) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message ||
        error?.message ||
        "Invalid credentials or connection pipeline issue."
      );
      showToast(error?.message || "Login failed. Please try again.", "error");
    } finally {
      setIsLoading(false);
      dispatch(setLoading(false))
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between p-4 md:p-8 font-sans text-gray-800">

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto my-auto bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[750px]">

        {/* Left Column: Visual Hero Side (Visible on lg devices) */}
        <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-emerald-50 via-emerald-100/40 to-white p-12 flex-col justify-between relative overflow-hidden border-r border-gray-100">
          <div className="absolute inset-0 opacity-40 pointer-events-none">
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-emerald-200/50 to-transparent border-t border-dashed border-emerald-300"></div>
          </div>

          {/* Logo Branding */}
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-[#0B5B32]">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-[#10B981] text-xs font-semibold tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          {/* Big Featured Graphic Showcase */}
          <div className="relative my-auto flex flex-col items-center text-center z-10">
            <div className="relative mb-6">
              <div className="absolute -right-4 -top-4 bg-emerald-500 text-white p-3 rounded-2xl shadow-lg shadow-emerald-500/20 z-20 animate-bounce-slow">
                <ShieldCheck size={32} className="stroke-2" />
              </div>
              <img
                src="https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=500&q=80"
                alt="White Sedan showcasing vehicle scrapping service"
                className="w-72 object-contain drop-shadow-2xl mix-blend-multiply"
              />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Eco-Friendly Vehicle Scrapping</h3>
            <p className="text-gray-500 text-sm max-w-sm leading-relaxed">
              Turn your old vehicle into sustainable value. Transparent, certified, and completely hassle-free.
            </p>
          </div>

          {/* Micro Trust badge */}
          <div className="flex items-center gap-2 text-xs font-medium text-emerald-800 bg-emerald-100/60 w-fit px-3 py-1.5 rounded-full z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            100% Government Approved Process
          </div>
        </div>

        {/* Right Column: Login Form Content */}
        <div className="col-span-1 lg:col-span-7 p-8 md:p-14 flex flex-col justify-between h-full">

          {/* Mobile Logo View (hidden on lg) */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="flex items-center gap-1 text-2xl font-bold text-gray-900 tracking-tight">
              <span className="text-[#0B5B32]">🚗 Rescrap</span>
              <span className="text-[#10B981]">X</span>
            </div>
            <p className="text-[#10B981] text-xs font-medium tracking-wide mt-1">Recycle Today, Drive Tomorrow</p>
          </div>

          <div className="max-w-md w-full mx-auto my-auto space-y-7">
            {/* Header Description */}
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Welcome Back!</h2>
              <p className="text-gray-500 text-sm">Login to manage your vehicle scrapping progress</p>
            </div>

            {/* Dynamic Status Notifications */}
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-xl animate-fade-in">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium rounded-xl animate-fade-in">
                {successMessage}
              </div>
            )}

            {/* Input Form Fields */}
            <form onSubmit={handleLogin} className="space-y-5">

              {/* Email Input Component */}
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Email Address</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-white">
                  <Mail size={18} className="absolute left-4 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your registered email"
                    className="w-full pl-11 pr-4 py-3.5 text-sm outline-none placeholder-gray-400 font-medium text-gray-800"
                    disabled={isLoading}
                    required
                  />
                </div>
              </div>

              {/* Password Input Component */}
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Password</label>
                <div className="relative flex items-center border-2 border-gray-100 rounded-xl overflow-hidden focus-within:border-emerald-600 transition bg-white">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 text-sm outline-none placeholder-gray-400 font-medium text-gray-800 pr-12"
                    disabled={isLoading}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-gray-400 hover:text-gray-600 transition"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <a href="/forgot-password" className="text-[#10B981] text-xs font-bold hover:underline tracking-wide">Forgot Password?</a>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#0B5B32] hover:bg-[#094d2a] disabled:bg-gray-200 disabled:text-gray-400 text-white py-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-emerald-900/10 transition duration-150 transform active:scale-[0.99] mt-2 disabled:transform-none disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Login Securely</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            {/* Separator Layout */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-100"></div>
              <span className="flex-shrink mx-4 text-xs text-gray-400 font-bold tracking-wider uppercase">or continue with</span>
              <div className="flex-grow border-t border-gray-100"></div>
            </div>

            {/* Centered Single Google Login Wrapper */}
            <div className="w-full flex justify-center">
              <div className="w-full max-w-sm flex justify-center [&>div]:w-full [&_iframe]:!w-full [&_iframe]:!max-w-full">
                {/* <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    if (!credentialResponse.credential) return;

                    const response = await googleLogin(
                      credentialResponse.credential
                    );

                    // Update auth state cache
                    queryClient.setQueryData(
                      ["current-user"],
                      response
                    );

                    await refetchUser();
                    router.replace("/");
                  }}
                  onError={() => {
                    console.log("Google Login Failed");
                  }}
                  width="100%"
                /> */}
              </div>
            </div>

            {/* Inline Privacy Note */}
            <div className="flex gap-3 items-start bg-emerald-50/50 border border-emerald-100 rounded-xl p-3">
              <ShieldCheck className="text-[#10B981] flex-shrink-0 mt-0.5" size={18} />
              <p className="text-[11px] text-gray-500 font-medium leading-relaxed">
                Your data security is our priority. We deploy military-grade encryption protocols to insulate sensitive operational information.
              </p>
            </div>
          </div>

          {/* Toggle Redirection */}
          <div className="text-center mt-8 text-sm text-gray-500 font-medium">
            Don't have a secure account?{' '}
            <a href="/register" className="text-[#10B981] font-extrabold hover:underline transition">
              Create Account
            </a>
          </div>
        </div>

      </div>

      {/* Corporate Copyright text */}
      <p className="text-center text-xs text-gray-400 font-medium mt-8">
        © 2026 RescrapX Inc. All legal architecture secured.
      </p>
    </div>
  );
}