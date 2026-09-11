import React, { useEffect, useRef, useState } from 'react';

export type RevealDirection = 'up' | 'down' | 'left' | 'right' | 'zoom' | 'fade' | 'none';

export interface RevealOnScrollProps {
  children: React.ReactNode;
  direction?: RevealDirection;
  delay?: number; // in milliseconds
  duration?: number; // in milliseconds
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

export const RevealOnScroll: React.FC<RevealOnScrollProps> = ({
  children,
  direction = 'up',
  delay = 0,
  duration = 1000,
  threshold = 0.12,
  rootMargin = '0px 0px -40px 0px',
  once = true,
  className = '',
  style = {}
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // If IntersectionObserver is not supported, reveal immediately
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsRevealed(true);
      return;
    }

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          if (once && elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        } else if (!once) {
          setIsRevealed(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    const currentEl = elementRef.current;
    if (currentEl) {
      observer.observe(currentEl);
    }

    return () => {
      if (currentEl) {
        observer.unobserve(currentEl);
      }
    };
  }, [threshold, rootMargin, once]);

  // Direction modifier class
  const directionClass =
    direction === 'none'
      ? ''
      : `reveal-${direction}`;

  return (
    <div
      ref={elementRef}
      className={`reveal-on-scroll ${directionClass} ${isRevealed ? 'revealed' : ''} ${className}`}
      style={{
        transitionDelay: `${delay}ms`,
        transitionDuration: `${duration}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default RevealOnScroll;
