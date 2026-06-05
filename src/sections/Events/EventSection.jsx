import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { eventList } from "./eventList";

gsap.registerPlugin(ScrollTrigger);

function EventSection() {
    const sectionRef = useRef(null);
    const cylinderRef = useRef(null);
    const parallaxWrapperRef = useRef(null); // Added ref for the parallax tilt

    useGSAP(() => {
        const section = sectionRef.current;
        const cylinder = cylinderRef.current;
        const parallaxWrapper = parallaxWrapperRef.current;

        if (!section || !cylinder) return;

        // --- 1. SCROLL ANIMATION LOGIC ---
        const cards = gsap.utils.toArray(".cylinder-card");
        const numCards = cards.length;

        const mm = gsap.matchMedia();

        mm.add(
            {
                isMobile: "(max-width: 768px)",
                isDesktop: "(min-width: 769px)",
            },
            (context) => {
                const { isMobile } = context.conditions;

                const cardsPerLoop = isMobile ? 8 : 14;
                const angle = 360 / cardsPerLoop;
                const yStep = isMobile ? 50 : 30;
                const gap = isMobile ? 10 : 20;

                const cardWidth = cards[0]?.offsetWidth || 180;

                const radius = Math.round(
                    ((cardWidth + gap) / 2) /
                    Math.tan(Math.PI / cardsPerLoop)
                );

                cards.forEach((card, i) => {
                    gsap.set(card, {
                        transform: `translateY(${i * yStep}px) rotateY(${i * angle}deg) translateZ(${radius}px)`,
                        transformOrigin: "50% 50%",
                        force3D: true,
                    });
                });

                const totalYMovement = -((numCards - 1) * yStep);
                const totalRotation = (numCards - 1) * angle;

                gsap.to(cylinder, {
                    y: totalYMovement,
                    rotationY: -totalRotation,
                    ease: "none",
                    force3D: true,
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => `+=${numCards * 250}`,
                        invalidateOnRefresh: true,
                        anticipatePin: 1,
                    },
                });
            }
        );

        // --- 2. CAMERA TILT PARALLAX LOGIC ---
        let handleMouseMove;

        if (parallaxWrapper) {
            // Using quickTo for highly performant, jank-free mouse tracking
            const xTo = gsap.quickTo(parallaxWrapper, "rotationY", { ease: "power3", duration: 0.6 });
            const yTo = gsap.quickTo(parallaxWrapper, "rotationX", { ease: "power3", duration: 0.6 });

            handleMouseMove = (e) => {
                const { innerWidth, innerHeight } = window;
                // Normalize coordinates to [-1, 1]
                const x = (e.clientX / innerWidth) * 2 - 1;
                const y = (e.clientY / innerHeight) * 2 - 1;

                // Multiply by max tilt angle (12 degrees here)
                xTo(x * 5);
                yTo(-(y * 5));
            };

            window.addEventListener("mousemove", handleMouseMove);
        }

        // --- 3. CLEANUP ---
        return () => {
            mm.revert(); // Revert ScrollTrigger matchMedia
            if (handleMouseMove) {
                window.removeEventListener("mousemove", handleMouseMove); // Cleanup mouse listener
            }
        };
    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="
                relative
                w-full
                h-screen
                bg-black
                text-white
                overflow-hidden
                flex
                items-center
                justify-center
                perspective-distant
            "
        >
            {/* CENTER TEXT */}
            <div
                className="absolute flex flex-col justify-start w-max items-start pointer-events-none"
                style={{
                    transform: "translate3d(0,0,0)",
                    willChange: "transform",
                }}
            >
                <h1 className="text-[3vw] tracking-wider uppercase text-center font-extralight text-white">
                    Events Organized By
                </h1>
                <h1 className="text-[25vw] font-semibold tracking-widest uppercase text-center text-transparent bg-clip-text bg-linear-to-b from-white via-blue-500 via-20% to-black to-70% drop-shadow-2xl">
                    HELIX
                </h1>
            </div>

            {/* PARALLAX WRAPPER */}
            {/* This takes the mouse tilt, leaving cylinderRef free for ScrollTrigger */}
            <div
                ref={parallaxWrapperRef}
                className="relative flex items-center justify-center transform-3d will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
            >
                <div
                    ref={cylinderRef}
                    className="relative w-35 md:w-45 aspect-3/4 transform-3d will-change-transform"
                    style={{
                        transformStyle: "preserve-3d",
                    }}
                >
                    {eventList.map((event, index) => (
                        <div
                            key={index}
                            className="absolute inset-0 cylinder-card group will-change-transform"
                            style={{
                                transformStyle: "preserve-3d",
                                contain: "layout paint style",
                            }}
                        >
                            <div
                                className="
                                    relative
                                    w-full
                                    h-full
                                    transform-3d
                                    transition-transform
                                    duration-300
                                    group-hover:scale-[1.02]
                                "
                            >
                                {/* FRONT */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        overflow-hidden
                                        rounded-md
                                        bg-gray-900
                                        border
                                        border-white/10
                                        shadow-xl
                                        backface-hidden
                                    "
                                >
                                    <img
                                        src={event.img}
                                        alt={event.title}
                                        loading="lazy"
                                        decoding="async"
                                        draggable="false"
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                            opacity-80
                                            group-hover:opacity-100
                                            transition-opacity
                                            duration-300
                                        "
                                    />
                                </div>

                                {/* BACK */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        overflow-hidden
                                        rounded-md
                                        bg-gray-900
                                        border
                                        border-white/10
                                        shadow-xl
                                        backface-hidden
                                    "
                                    style={{
                                        transform: "rotateY(180deg)",
                                    }}
                                >
                                    <div className="absolute inset-0 bg-black/75 z-10 pointer-events-none" />

                                    <img
                                        src={event.img}
                                        alt={event.title}
                                        loading="lazy"
                                        decoding="async"
                                        draggable="false"
                                        className="
                                            w-full
                                            h-full
                                            object-cover
                                            opacity-25
                                        "
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default EventSection;