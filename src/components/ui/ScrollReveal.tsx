import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export default function ScrollReveal({ children, className = '', delay = 0 }: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    if (!currentElement) return;

    const timer = setTimeout(() => {
      const observer = new IntersectionObserver(
        ([entry], observerInstance) => {
          if (entry.isIntersecting) {
            currentElement.classList.add('revealed');
            observerInstance.unobserve(currentElement);
          }
        },
        { threshold: 0.1 }
      );

      observer.observe(currentElement);

      return () => {
        if (currentElement) observer.unobserve(currentElement);
      };
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div ref={elementRef} className={`scroll-reveal ${className}`}>
      {children}
    </div>
  );
}