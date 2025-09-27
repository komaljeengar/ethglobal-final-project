import React from 'react';
import { TrendingUp } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { AnimatedCounter } from './animated-counter';

// Animated Stat Card Component with scroll trigger
interface AnimatedStatCardProps {
  value: number;
  label: string;
  delay?: number;
  color?: "blue" | "purple" | "green" | "orange";
  suffix?: string;
}

export function AnimatedStatCard({
  value,
  label,
  delay = 0,
  color = "blue",
  suffix = "",
}: AnimatedStatCardProps) {
  const [ref, isVisible] = useScrollAnimation(0.2);

  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-600",
    purple: "bg-purple-50 border-purple-200 text-purple-600",
    green: "bg-green-50 border-green-200 text-green-600",
    orange: "bg-orange-50 border-orange-200 text-orange-600",
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-xl p-6 border shadow-lg transition-all duration-1000 ease-out ${
        isVisible
          ? "opacity-100 translate-y-0 scale-100"
          : "opacity-0 translate-y-12 scale-95"
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div
        className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        } ${colorClasses[color]}`}
        style={{ transitionDelay: `${delay + 200}ms` }}
      >
        <TrendingUp className="w-4 h-4 mr-1" />
        Live
      </div>

      <div
        className={`transition-all duration-700 ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{ transitionDelay: `${delay + 400}ms` }}
      >
        <AnimatedCounter
          targetValue={value}
          suffix={suffix}
          duration={2000}
          decimals={suffix === "%" ? 1 : 0}
          className="text-2xl font-bold text-gray-900 mb-2 block"
        />
      </div>

      <div
        className={`text-gray-600 text-sm font-medium transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
        }`}
        style={{ transitionDelay: `${delay + 600}ms` }}
      >
        {label}
      </div>
    </div>
  );
}
