import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  type?: 'success' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose, type = 'success' }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
        >
          <div className="flex items-center gap-3 px-6 py-3 bg-zinc-900 text-white rounded-full shadow-2xl shadow-zinc-900/20 backdrop-blur-md border border-zinc-800/50">
            {type === 'success' ? (
              <CheckCircle2 size={18} className="text-emerald-400" />
            ) : (
              <XCircle size={18} className="text-rose-400" />
            )}
            <span className="text-sm font-medium">{message}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};