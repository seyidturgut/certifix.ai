import React from 'react';

interface SkeletonProps {
  className?: string;
  delay?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = "", delay = 0 }) => {
  return (
    <div 
      className={`bg-zinc-200/50 rounded-lg animate-pulse ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    />
  );
};