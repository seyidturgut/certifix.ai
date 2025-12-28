import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, className = '', hoverEffect = false }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -2, transition: { duration: 0.2 } } : {}}
      className={`
        bg-white/70 backdrop-blur-xl 
        border border-white/40 shadow-sm 
        rounded-[24px] 
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};