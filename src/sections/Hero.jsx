import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

function Hero({ loading }) {
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  const paragraphRef = useRef(null)
  
  const svgRef = useRef(null)
  const stroke1Ref = useRef(null)
  const stroke2Ref = useRef(null)

  useGSAP(() => {
    const splitHeading = new SplitText(headingRef.current, {
      type: 'words, chars',
      charsClass: 'hero-char'
    });

    const splitParagraph = new SplitText(paragraphRef.current, {
      type: 'words',
      wordsClass: 'word'
    });

    const chars = splitHeading.chars;
    const words = splitParagraph.words;

    // Initial states
    gsap.set(chars, {
      display: 'inline-block',
      transformOrigin: 'bottom center',
      scaleY: 0.3,
      color: '#e5e7eb',
      opacity: 0.1,
      willChange: 'transform, opacity'
    });

    gsap.set(words, {
      yPercent: 120,
      clipPath: 'inset(0% 0% 100% 0%)',
      willChange: 'transform'
    });

    if (loading) return;

    // Master text timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    tl.to(chars, {
      opacity: 1,
      duration: 2,
      stagger: 0.01,
      ease: 'power4.out',
    }, 0);

    const waveSpeed = 0.01;
    const bandWidth = 0.5;
    const animSpeed = 0.8;

    for (let i = 0; i < chars.length; i += 3) {
      const group = chars.slice(i, i + 3);

      tl.to(group, {
        color: '#eeff00',
        y: -12,
        scaleY: 1,
        duration: animSpeed,
        stagger: 0.02
      }, i * waveSpeed);

      tl.to(group, {
        color: '#000',
        y: 0,
        duration: animSpeed,
        stagger: 0.02
      }, (i * waveSpeed) + bandWidth);
    }

    gsap.to(words, {
      yPercent: 0,
      clipPath: 'inset(0% 0% -20% 0%)', 
      duration: 1,
      stagger: 0.03,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: paragraphRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // ==========================================
    // DUAL STROKE ANIMATION
    // ==========================================
    
    // Draw both lines from left to right with a slight stagger
    gsap.to([stroke2Ref.current, stroke1Ref.current], {
      strokeDashoffset: 0,
      duration: 3.5,
      delay: 0.2,
      stagger: 0.25, // Stroke 1 starts 0.25s after Stroke 2
      ease: 'power3.inOut',
    });

    // Give the whole SVG a very slow, subtle floating effect
    gsap.to(svgRef.current, {
      y: 20,
      rotation: 1,
      duration: 5,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut'
    });

    // Cleanup
    return () => {
      splitHeading.revert();
      splitParagraph.revert();
    };

  }, {
    scope: containerRef,
    dependencies: [loading]
  });

  return (
    <section 
      id="home" 
      ref={containerRef} 
      className="relative w-full min-h-[100vh] flex flex-col items-center justify-center bg-white px-4 md:px-8 lg:px-12 pt-32 mt-8 overflow-hidden"
    >
      
      <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none z-0">
        <svg 
          ref={svgRef}
          viewBox="0 0 1200 600" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="w-[200%] md:w-[110%] h-auto opacity-90" 
        >
          <defs>
            {/* Original Blue Gradient */}
            <linearGradient id="blueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4f4f5" />
              <stop offset="40%" stopColor="#2563eb" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#eeff00" />
            </linearGradient>

            {/* NEW Violet/Cyan Gradient */}
            <linearGradient id="violetGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f4f4f5" />
              <stop offset="40%" stopColor="#7c3aed" /> {/* Violet */}
              <stop offset="70%" stopColor="#06b6d4" /> {/* Cyan */}
              <stop offset="100%" stopColor="#eeff00" /> 
            </linearGradient>

            {/* Shared Drop Shadow */}
            <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow dx="0" dy="15" stdDeviation="15" floodColor="#000000" floodOpacity="0.1" />
            </filter>
          </defs>
          
          {/* 
            Stroke 2: The Violet/Cyan Ribbon (Rendered behind Stroke 1)
            Slightly thinner and flows in an intersecting sine wave pattern.
          */}
          <path 
            ref={stroke2Ref}
            d="M -100,200 C 300,0 400,550 800,400 C 1050,300 1150,550 1300,450" 
            stroke="url(#violetGradient)" 
            strokeWidth="45" 
            strokeLinecap="round" 
            filter="url(#softShadow)"
            strokeDasharray="3000"
            strokeDashoffset="3000"
            opacity="0.9"
          />

          {/* 
            Stroke 1: The Primary Blue Ribbon
            Massive stroke width, flows in the original pattern.
          */}
          <path 
            ref={stroke1Ref}
            d="M -100,300 C 200,550 400,50 700,250 C 1000,450 1100,100 1300,150" 
            stroke="url(#blueGradient)" 
            strokeWidth="60" 
            strokeLinecap="round" 
            filter="url(#softShadow)"
            strokeDasharray="3000"
            strokeDashoffset="3000"
          />
        </svg>
      </div>

      <div className="relative z-10 w-full flex justify-center">
        <div
          ref={headingRef}
          className="text-center text-[10vw] sm:text-6xl md:text-7xl lg:text-[6.5rem] w-full max-w-300 font-medium tracking-tighter leading-[1.05]"
        >
          The Future of Tech Starts Here — Helix, RVSCET
        </div>
      </div>

      <div className="relative z-10 w-full flex justify-center overflow-hidden mt-8 md:mt-10">
        <div 
          ref={paragraphRef} 
          className="text-center w-full max-w-2xl text-base sm:text-lg md:text-xl text-zinc-500 leading-relaxed font-light"
        >
          Welcome to the genesis of our tech revolution. Dive into the realm of innovation with Helix, the vibrant Tech and AI club at RVSCET.
        </div>
      </div>
    </section>
  )
}

export default Hero