'use client'

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastProps {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
  onClose: (id: string) => void;
}

const toastThemes = {
  success: {
    bg: 'bg-white/90 backdrop-blur-md border-emerald-100',
    icon: <CheckCircle2 size={19} className="text-emerald-600" />,
    progress: 'bg-emerald-600',
    shadow: 'shadow-[0_8px_30px_rgb(16,185,129,0.12)]'
  },
  error: {
    bg: 'bg-white/90 backdrop-blur-md border-rose-100',
    icon: <AlertCircle size={19} className="text-rose-600" />,
    progress: 'bg-rose-600',
    shadow: 'shadow-[0_8px_30px_rgb(244,63,94,0.12)]'
  },
  info: {
    bg: 'bg-white/90 backdrop-blur-md border-blue-100',
    icon: <Info size={19} className="text-blue-600" />,
    progress: 'bg-blue-600',
    shadow: 'shadow-[0_8px_30px_rgb(59,130,246,0.12)]'
  },
  warning: {
    bg: 'bg-white/90 backdrop-blur-md border-amber-100',
    icon: <AlertTriangle size={19} className="text-amber-500" />,
    progress: 'bg-amber-500',
    shadow: 'shadow-[0_8px_30px_rgb(245,158,11,0.12)]'
  }
};

export default function Toast({ id, message, type, duration = 4000, onClose }: ToastProps) {
  const theme = toastThemes[type];

  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className={`flex flex-col w-full max-w-sm border ${theme.bg} ${theme.shadow} rounded-2xl overflow-hidden pointer-events-auto`}
    >
      <div className="flex items-center gap-3 p-4">
        {/* Animated Icon Container */}
        <div className="flex-shrink-0 p-1 rounded-lg bg-gray-50">
          {theme.icon}
        </div>
        
        {/* Message */}
        <p className="flex-grow text-sm font-semibold text-gray-800 leading-relaxed">
          {message}
        </p>

        {/* Close Button */}
        <button 
          onClick={() => onClose(id)}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100/80 transition flex-shrink-0"
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress Bar Animation */}
      <div className="w-full h-[3px] bg-gray-100/50 mt-auto">
        <motion.div 
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${theme.progress}`}
        />
      </div>
    </motion.div>
  );
}