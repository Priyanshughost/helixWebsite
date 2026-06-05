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
        const distance = part3Ref.current.scrollWidth - window.innerWidth;

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=250%", // Enough distance to handle all animations
                pin: true,
                scrub: 1,
            }
        });

        // Phase 1: Reveal both phrases on the same line simultaneously
        // We use the GSAP label "startReveal" so they fire at the exact same time
        tl.add("startReveal")
            .fromTo(part1Ref.current,
                { yPercent: -100 }, // Comes down from the TOP
                {
                    yPercent: 0,
                    duration: 1,
                    ease: "power2.out"
                },
                "startReveal"
            )
            .fromTo(part2Ref.current,
                { yPercent: 100 }, // Comes up from the BOTTOM
                {
                    yPercent: 0,
                    duration: 1,
                    ease: "power2.out"
                },
                "startReveal"
            )
            // Phase 2: The huge text fades in
            .fromTo(part3Ref.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "none"
                }
            )
            // Phase 3: The huge text slides left
            .to(part3Ref.current,
                {
                    x: -distance,
                    duration: 2.5,
                    ease: "none"
                }
            );

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            className='w-full h-screen to-white to-100% bg-linear-to-t via-blue-500 via-65% from-black from-20% pointer-events-none text-[100vh] overflow-hidden'
            aria-hidden="true"
            style={{ position: 'relative' }}
        >
            {/* The First Line: Flex container to hold both phrases side-by-side */}
            {/* items-baseline ensures the text lines up cleanly even with different font sizes */}
            <div className="absolute top-[25%] left-0 w-full flex flex-wrap justify-center items-baseline gap-2 md:gap-4 px-4 z-10">

                {/* Part 1: Mask and Text */}
                <div className="overflow-hidden">
                    <div
                        ref={part1Ref}
                        className="font-medium text-white tracking-tight will-change-transform"
                        // Sized slightly smaller than part 2
                        style={{ fontSize: 'clamp(1.5rem, 3vw, 3.5rem)' }}
                    >
                        We don't follow the Tech Standard,
                    </div>
                </div>

                {/* Part 2: Mask and Text (Uppercase, bolder, slightly bigger) */}
                <div className="overflow-hidden">
                    <div
                        ref={part2Ref}
                        className="uppercase font-bold text-white tracking-tight will-change-transform"
                        // Sized slightly larger than part 1
                        style={{ fontSize: 'clamp(1.8rem, 3.5vw, 4.2rem)' }}
                    >
                        because we are the
                    </div>
                </div>

            </div>

            {/* Part 3: The massive sliding text */}
            <div
                ref={part3Ref}
                className="inline-block text-black/70 whitespace-nowrap will-change-transform absolute top-1/2 -translate-y-1/2 left-0"
            >
                STANDARD.
            </div>
        </div>
    );
};

export default Fader;