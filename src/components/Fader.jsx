import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const Fader = () => {
    const containerRef = useRef(null);
    const hugeTextRef = useRef(null);
    const smallTextRef = useRef(null);

    useGSAP(() => {
        // Calculate the total distance the text needs to move to slide fully off-screen
        const distance = hugeTextRef.current.scrollWidth - window.innerWidth;

        // Use a timeline to sequence the animations seamlessly as the user scrolls
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top", // Animation and pinning start exactly when the section hits the top
                end: "+=200%",    // Extended scroll distance to comfortably fit all 3 animations
                pin: true,        // Locks the section in place
                scrub: 1,         // Ties the timeline smoothly to the scrollbar
            }
        });

        // Phase 1: Reveal "We don't follow the tech curve." from the bottom
        tl.fromTo(smallTextRef.current,
            { yPercent: 100 },
            {
                yPercent: 0,
                duration: 1,
                ease: "none"
            }
        )
            // Phase 2: The huge text fades in
            .fromTo(hugeTextRef.current,
                { opacity: 0 },
                {
                    opacity: 1,
                    duration: 1,
                    ease: "none"
                }
            )
            // Phase 3: The huge text slides left
            .to(hugeTextRef.current,
                {
                    x: -distance,
                    duration: 2, // Given a slightly longer duration so the slide feels smooth
                    ease: "none"
                }
            )
            // .to({},{},"+=1")

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            // Your exact, untouched CSS classes
            className='w-full h-screen bg-linear-to-b from-black/0 from-1% via-blue-500 via-30% to-black to-90% pointer-events-none text-[100vh] overflow-hidden'
            aria-hidden="true"
            // Applied relative positioning via style so absolute children align to this container without altering your CSS string
            style={{ position: 'relative' }}
        >
            {/* The Setup for Phase 1: Overflow-hidden wrapper to mask the text reveal */}
            <div className="absolute top-[25%] left-0 w-full flex justify-center overflow-hidden z-10">
                <div
                    ref={smallTextRef}
                    // This overrides the text-[100vh] inherited from the parent specifically for this sentence
                    className="text-3xl md:text-5xl lg:text-7xl font-medium text-white tracking-tight will-change-transform"
                    style={{ fontSize: 'clamp(2rem, 4vw, 5rem)' }}
                >
                    We don't follow the tech curve.
                </div>
            </div>

            {/* The Setup for Phase 2 & 3: The massive sliding text */}
            <div
                ref={hugeTextRef}
                className="inline-block text-black/70 whitespace-nowrap will-change-transform absolute top-1/2 -translate-y-1/2 left-0"
            >
                WE CODE IT.
            </div>
        </div>
    );
};

export default Fader;