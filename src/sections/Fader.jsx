import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Fader = () => {
    const containerRef = useRef(null);
    const part1Ref = useRef(null);
    const part2Ref = useRef(null);
    const part3Ref = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=250%", 
                pin: true,
                scrub: 1,
                // invalidateOnRefresh is CRITICAL for responsive design. 
                // It forces GSAP to recalculate values when the window is resized.
                invalidateOnRefresh: true, 
            }
        });

        tl.add("startReveal")
            .fromTo(part1Ref.current,
                { yPercent: -100 },
                {
                    yPercent: 0,
                    duration: 1,
                    ease: "power2.out"
                },
                "startReveal"
            )
            .fromTo(part2Ref.current,
                { yPercent: 130 },
                {
                    yPercent: 0,
                    duration: 1,
                    ease: "power2.out"
                },
                "startReveal"
            )
            .fromTo(part3Ref.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "none"
                }
            )
            .to(part3Ref.current,
                {
                    // Use a function for 'x' so it recalculates on window resize
                    x: () => -(part3Ref.current.scrollWidth - window.innerWidth),
                    duration: 2.5,
                    ease: "none"
                }
            );

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            // Replaced h-screen with h-[100svh] to fix mobile browser address bar jumps
            className='w-full h-[100svh] to-white to-100% bg-linear-to-t via-blue-500 via-65% from-black from-20% pointer-events-none overflow-hidden'
            aria-hidden="true"
            style={{ position: 'relative' }}
        >
            {/* 
              Responsive changes: 
              - flex-col on mobile, flex-row on md+ 
              - text-center on mobile, items-baseline on md+
              - Adjusted top positioning so it doesn't collide with the big text on small screens
            */}
            <div className="absolute top-[15%] md:top-[25%] left-0 w-full flex flex-col md:flex-row justify-center items-center md:items-baseline gap-2 md:gap-4 px-4 z-10">

                {/* Part 1: Mask and Text */}
                {/* pb-2 prevents descender letters (like g, p, y) from getting cut off by overflow-hidden */}
                <div className="overflow-hidden pb-2">
                    <div
                        ref={part1Ref}
                        className="font-medium text-white tracking-tight will-change-transform text-center leading-tight md:leading-normal"
                        style={{ fontSize: 'clamp(1.5rem, 4vw, 3.5rem)' }}
                    >
                        We don't follow the Tech Standards,
                    </div>
                </div>

                {/* Part 2: Mask and Text */}
                <div className="overflow-hidden pt-1 md:pt-0 pb-2">
                    <div
                        ref={part2Ref}
                        className="uppercase font-bold text-white tracking-tight will-change-transform text-center leading-tight md:leading-normal"
                        style={{ fontSize: 'clamp(1.8rem, 4.5vw, 4.2rem)' }}
                    >
                        because we are the
                    </div>
                </div>

            </div>

            {/* Part 3: The massive sliding text */}
            <div
                ref={part3Ref}
                // Scaled sizes down slightly for mobile (50svh) so it doesn't overwhelm the screen
                className="inline-block text-[50svh] md:text-[80svh] lg:text-[100svh] font-black text-black/70 whitespace-nowrap will-change-transform absolute top-1/2 -translate-y-1/2 left-0"
            >
                STANDARD.
            </div>
        </div>
    );
};

export default Fader;