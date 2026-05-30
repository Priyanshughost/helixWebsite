import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText)

function Hero({loading}) {
  // 1. Added a container ref for safe GSAP scoping
  const containerRef = useRef(null)
  const headingRef = useRef(null)
  // 2. Added a ref for the paragraph
  const paragraphRef = useRef(null)

  useGSAP(() => {
    // Split into words
    const split = SplitText.create(headingRef.current, {
      type: 'words',
      wordsClass: 'hero-word'
    });

    const words = split.words;

    // Initial state
    gsap.set(words, {
      display: 'inline-block',
      transformOrigin: 'bottom center',
      scaleY: 0.3,
      color: '#e5e7eb',
      opacity: 0.1,
      willChange: 'transform, color, opacity'
    });

    // Paragraph split
    const pSplit = SplitText.create(paragraphRef.current, {
      type: 'words',
      wordsClass: 'word'
    });

    // Wrap each word in a mask
    pSplit.words.forEach((word) => {
      const wrapper = document.createElement('div');
      wrapper.style.overflow = 'hidden';
      wrapper.style.display = 'inline-block';
      word.parentNode.insertBefore(wrapper, word);
      wrapper.appendChild(word);
    });

    // Initial state
    gsap.set(pSplit.words, {
      yPercent: 120,
      willChange: 'transform'
    });
    
    // 🛑 GUARD CLAUSE: If loader is still active, don't run the animations
    if (loading) return;


    // Master timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: headingRef.current,
        start: 'top 75%',
        toggleActions: 'play none none none',
      }
    });

    tl.to(words, {
      opacity: 1,
      duration: 2,
      stagger: 0.07,
      ease: 'power4.out',
    }, 0);

    // PHASE 2 — scanner activation
    for (let i = 0; i < words.length; i += 3) {
      const group = words.slice(i, i + 3);

      tl.to(group, {
        color: '#eeff00',
        y: -12,
        scaleY: 1,
        duration: 0.5,
        stagger: 0.05
      }, i * 0.08);

      tl.to(group, {
        color: '#000',
        y: 0,
        duration: 0.5,
        stagger: 0.05
      }, i * 0.08 + 0.25);
    }


    // Animate
    gsap.to(pSplit.words, {
      yPercent: 0,
      duration: 1,
      stagger: 0.03,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: paragraphRef.current,
        start: 'top 85%',
        toggleActions: 'play none none none',
      }
    });

  }, {
    scope: containerRef,
    dependencies: [loading] // 🟢 Tell GSAP to re-run when loading changes
  });

  return (
    <section ref={containerRef} className="w-full bg-white pt-26 lg:pt-28 pb-38 lg:pb-34 px-4 md:px-6 lg:px-10 flex flex-col gap-14 md:gap-0 mt-16 ">
      {/* Left side */}
      <div className="w-full flex justify-start">
        <div
          ref={headingRef}
          className=" text-[10vw] sm:text-5xl w-full md:w-[60%] lg:text-7xl font-normal md:font-light tracking-tight leading-[0.95]"
        >
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </div>
      </div>

      {/* Right side */}
      <div className="w-full justify-end flex overflow-hidden">
        <div ref={paragraphRef} className="leading-none w-full md:w-1/3 text-left text-md sm:text-lg text-zinc-400 lg:pb-2 h-full">
          Eum rem deserunt eius commodi sit praesentium fugit atque tempora,
          placeat magni, doloremque blanditiis quasi, magnam nulla veniam vero et
          molestiae nisi.
        </div>
      </div>

    </section>
  )
}

export default Hero