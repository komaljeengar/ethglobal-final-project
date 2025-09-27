import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  glow?: boolean;
}

const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  hover = true, 
  glow = false 
}) => {
  return (
    <div 
      className={cn(
        "glass-card",
        hover && "hover:shadow-glow transition-all duration-300",
        glow && "animate-glow-pulse",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
