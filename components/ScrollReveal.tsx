'use client';
import { useEffect, useRef, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface ScrollRevealProps {
  children: string;
  scrollContainerRef?: React.RefObject<HTMLElement>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

const ScrollReveal = ({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.1,
  baseRotation = 3,
  blurStrength = 4,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom bottom',
  wordAnimationEnd = 'bottom bottom',
}: ScrollRevealProps) => {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return <span className="word inline-block" key={index}>{word}</span>;
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const scroller = scrollContainerRef?.current ?? window;

    // gsap.context() scopes all animations to this element only.
    // ctx.revert() on cleanup tears down exactly these animations —
    // nothing outside this component is touched.
    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        { ease: 'none', rotate: 0, scrollTrigger: { trigger: el, scroller, start: 'top bottom', end: rotationEnd, scrub: true } }
      );

      const wordElements = el.querySelectorAll('.word');
      gsap.fromTo(
        wordElements,
        { opacity: baseOpacity, willChange: 'opacity' },
        { ease: 'none', opacity: 1, stagger: 0.05, scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true } }
      );

      if (enableBlur) {
        gsap.fromTo(
          wordElements,
          { filter: `blur(${blurStrength}px)` },
          { ease: 'none', filter: 'blur(0px)', stagger: 0.05, scrollTrigger: { trigger: el, scroller, start: 'top bottom-=20%', end: wordAnimationEnd, scrub: true } }
        );
      }
    }, el); // ← scope to this element only

    return () => ctx.revert(); // ← only reverts animations created above
  }, [scrollContainerRef, enableBlur, baseRotation, baseOpacity, rotationEnd, wordAnimationEnd, blurStrength]);

  return (
    <h2 ref={containerRef} className={`my-5 ${containerClassName}`}>
      <p className={`text-[clamp(1.6rem,4vw,3rem)] leading-relaxed font-semibold ${textClassName}`}>
        {splitText}
      </p>
    </h2>
  );
};

export default ScrollReveal;
