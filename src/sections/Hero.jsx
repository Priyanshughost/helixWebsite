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

  useGSAP(() => {
    // 1. Create splits (we store them in variables so we can kill them later)
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
      // Removed color from willChange to save GPU memory
      willChange: 'transform, opacity'
    });

    // 2. Modern wrapper-free text reveal state using clipPath
    gsap.set(words, {
      yPercent: 120,
      clipPath: 'inset(0% 0% 100% 0%)', // Hides the element from the bottom up
      willChange: 'transform'
    });

    if (loading) return;

    // Master timeline
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

    // 3. Reveal words using clipPath and transform simultaneously
    gsap.to(words, {
      yPercent: 0,
      clipPath: 'inset(0% 0% -20% 0%)', // Reveal completely (with buffer for descenders like 'g' or 'p')
      duration: 1,
      stagger: 0.03,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: paragraphRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

    // 4. CRITICAL CLEANUP: Revert splits when the component unmounts or re-renders
    return () => {
      splitHeading.revert();
      splitParagraph.revert();
    };

  }, {
    scope: containerRef,
    dependencies: [loading]
  });

  return (
    <section id="home" ref={containerRef} className="w-full bg-white pt-26 lg:pt-28 pb-38 lg:pb-34 px-4 md:px-6 lg:px-10 flex flex-col gap-14 md:gap-0 mt-16 ">
      {/* Left side */}
      <div className="w-full flex justify-start">
        <div
          ref={headingRef}
          className=" text-[10vw] sm:text-5xl w-full md:w-[60%] lg:text-7xl font-normal md:font-light tracking-tight leading-[0.95]"
        >
          The Future of Tech Starts Here — Helix, RVSCET
        </div>
      </div>

      {/* Right side */}
      <div className="w-full justify-end flex overflow-hidden">
        <div ref={paragraphRef} className="leading-none w-full md:w-1/3 text-left text-md sm:text-lg text-zinc-400 lg:pb-2 h-full">
          Welcome to the genesis of our tech revolution. Dive into the realm of innovation with Helix, the vibrant Tech and AI club at RVSCET.
        </div>
      </div>

    </section>
  )
}

export default Hero