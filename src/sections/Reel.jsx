import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useCursor } from "../context/CursorContext";
import ClubInduction from "../assets/ClubInduction.jpg";

gsap.registerPlugin(ScrollTrigger);

function Reel() {
    const { setCursorVariant, setCursorImage } = useCursor();
    const reelImageUrl = ClubInduction;
    const handleMouseEnter = () => {
        setCursorVariant('reel-hover'); // Tell the cursor to become a rectangle
        setCursorImage(reelImageUrl);   // Pass the image URL to the cursor
    };

    const handleMouseLeave = () => {
        setCursorVariant('default');    // Revert to normal
        setCursorImage(null);           // Remove the image
    };

    const containerRef = useRef(null);
    const imageRef = useRef(null);

    useGSAP(() => {
        // 1. Create a matchMedia instance for responsive animations
        let mm = gsap.matchMedia();

        // 2. Add breakpoints
        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isMobile } = context.conditions;

            // --- Reveal Animation (Responsive Trigger) ---
            gsap.fromTo(
                containerRef.current,
                {
                    // Starts clipped with rounded corners
                    clipPath: "inset(25% 20% 0% 20% round 30px)",
                    yPercent: 20,
                },
                {
                    // Animates to full width/height, rounding interpolates down to 0px
                    clipPath: "inset(0% 0% 0% 0% round 0px)",
                    yPercent: 0,
                    duration: 2.5,
                    ease: "expo.out",
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: isMobile ? "top 80%" : "top 95%",
                        once: true,
                        // markers: true
                    }
                }
            );

            // --- Scroll-triggered Parallax Animation ---
            gsap.fromTo(
                imageRef.current,
                { yPercent: -30 },
                {
                    yPercent: 30,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1.5,
                        // markers: true
                    },
                }
            );
        });

        // Cleanup matchMedia when the component unmounts
        return () => mm.revert();

    }, { scope: containerRef });

    return (
        <div
            ref={containerRef}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className="parallax-wrapper will-change-transform"
            style={{ overflow: 'hidden', height: '100vh', width: '100%', position: 'relative' }}
        >
            <img
                loading="lazy"
                ref={imageRef}
                src={ClubInduction}
                alt="Parallax Reel"
                className="w-full h-[120%] object-cover absolute top-0 left-0 will-change-transform"
            />
        </div>
    );
}

export default Reel;