import React from 'react';
import { motion } from 'framer-motion';

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export const PageTransition: React.FC<PageTransitionProps> = ({ children, className = "" }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.99 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.99 }}
      transition={{ 
        duration: 0.4, 
        ease: [0.2, 0.65, 0.3, 0.9], // Custom cubic-bezier for "Apple-like" smoothing
      }}
      className={`h-full ${className}`}
    >
      {children}
    </motion.div>
  );
};