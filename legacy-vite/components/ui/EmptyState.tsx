import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { GlassCard } from './GlassCard';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] w-full">
      <GlassCard className="p-12 text-center max-w-md w-full relative overflow-hidden group">
        {/* Background Decorations */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-zinc-200 to-transparent opacity-50" />
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-zinc-50 rounded-full blur-3xl opacity-60 pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="w-20 h-20 bg-zinc-50 border border-zinc-100 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner"
        >
          <Icon size={32} className="text-zinc-300 group-hover:text-zinc-400 transition-colors duration-500" />
        </motion.div>

        <motion.h3 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-bold text-zinc-900 mb-2"
        >
          {title}
        </motion.h3>

        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-zinc-500 text-sm leading-relaxed mb-8"
        >
          {description}
        </motion.p>

        {action && (
          <motion.button
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={action.onClick}
            className="px-6 py-2.5 bg-zinc-900 text-white text-sm font-medium rounded-xl shadow-lg hover:bg-zinc-800 transition-all"
          >
            {action.label}
          </motion.button>
        )}
      </GlassCard>
    </div>
  );
};