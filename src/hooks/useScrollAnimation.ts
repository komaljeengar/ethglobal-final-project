import { useState, useEffect, useRef } from 'react';

// Custom hook for scroll-based animations - Optimized
export function useScrollAnimation(threshold = 0.1) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Disconnect after first trigger for performance
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin: "50px 0px -50px 0px", // Optimized margins
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible] as const;
}

// Enhanced scroll animations hook with stagger support - Optimized
export function useStaggeredAnimation(itemCount: number, delay = 80) {
  const [visibleItems, setVisibleItems] = useState<boolean[]>(
    new Array(itemCount).fill(false)
  );
  const ref = useRef<HTMLDivElement>(null);
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Clear any existing timeouts
          timeoutsRef.current.forEach(clearTimeout);
          timeoutsRef.current = [];

          // Stagger the animation of items
          for (let i = 0; i < itemCount; i++) {
            const timeout = setTimeout(() => {
              setVisibleItems((prev) => {
                const newState = [...prev];
                newState[i] = true;
                return newState;
              });
            }, i * delay);
            timeoutsRef.current.push(timeout);
          }
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: "30px 0px -30px 0px" }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      observer.disconnect();
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [itemCount, delay]);

  return [ref, visibleItems] as const;
}

// Optimized Parallax scroll hook with throttling
export function useParallax(factor = 0.3) {
  const [transform, setTransform] = useState("translateY(0px)");
  const ref = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    const handleScroll = () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        if (ref.current) {
          const scrolled = window.pageYOffset;
          const rate = scrolled * factor;
          setTransform(`translateY(${rate}px)`);
        }
      });
    };

    // Throttled scroll listener
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", throttledScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", throttledScroll);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [factor]);

  return [ref, transform] as const;
}
