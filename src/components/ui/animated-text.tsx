import React, { useMemo } from 'react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

// Optimized Animated Text Component
interface AnimatedTextProps {
  text: string;
  delay?: number;
  className?: string;
}

export function AnimatedText({
  text,
  delay = 0,
  className = "",
}: AnimatedTextProps) {
  const [ref, isVisible] = useScrollAnimation(0.1);
  const words = useMemo(() => text.split(" "), [text]);

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <span
          key={index}
          className={`inline-block transition-all duration-600 ease-out will-change-transform ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{
            transitionDelay: `${delay + index * 40}ms`,
            backfaceVisibility: "hidden", // Performance optimization
          }}
        >
          {word}
          {index < words.length - 1 && "\u00A0"}
        </span>
      ))}
    </div>
  );
}
