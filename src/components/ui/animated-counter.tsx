import React, { useState, useEffect, useRef } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Optimized Animated Counter Component
interface AnimatedCounterProps {
  targetValue: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  decimals?: number;
}

export function AnimatedCounter({
  targetValue,
  duration = 1500,
  prefix = "",
  suffix = "",
  className = "",
  decimals = 0,
}: AnimatedCounterProps) {
  const [currentValue, setCurrentValue] = useState(0);
  const [ref, isVisible] = useScrollAnimation(0.2);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (!isVisible) return;

    const startTime = Date.now();
    const startValue = 0;

    const updateValue = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth easing function
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const newValue = startValue + (targetValue - startValue) * easeOutCubic;
      setCurrentValue(newValue);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(updateValue);
      }
    };

    const timer = setTimeout(() => {
      rafRef.current = requestAnimationFrame(updateValue);
    }, 100);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [targetValue, duration, isVisible]);

  const formatNumber = (num: number) => {
    if (decimals > 0) {
      return num.toFixed(decimals);
    }
    return Math.floor(num).toLocaleString();
  };

  return (
    <div ref={ref}>
      <span className={className}>
        {prefix}
        {formatNumber(currentValue)}
        {suffix}
      </span>
    </div>
  );
}
