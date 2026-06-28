import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { eventList } from "./eventList";

gsap.registerPlugin(ScrollTrigger);

function EventSection() {
    const sectionRef = useRef(null);
    const cylinderRef = useRef(null);
    const parallaxWrapperRef = useRef(null);

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
            const xTo = gsap.quickTo(parallaxWrapper, "rotationY", { ease: "power3", duration: 0.6 });
            const yTo = gsap.quickTo(parallaxWrapper, "rotationX", { ease: "power3", duration: 0.6 });

            handleMouseMove = (e) => {
                const { innerWidth, innerHeight } = window;
                const x = (e.clientX / innerWidth) * 2 - 1;
                const y = (e.clientY / innerHeight) * 2 - 1;

                xTo(x * 5);
                yTo(-(y * 5));
            };

            window.addEventListener("mousemove", handleMouseMove);
        }

        // --- 3. CLEANUP ---
        return () => {
            mm.revert();
            if (handleMouseMove) {
                window.removeEventListener("mousemove", handleMouseMove);
            }
        };
    }, { scope: sectionRef });

    return (
        <section
            id="events"
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
            <div
                ref={parallaxWrapperRef}
                className="relative flex items-center justify-center w-full h-full transform-3d will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* CENTER TEXT */}
                <div 
                    className="absolute flex flex-col items-center justify-center pointer-events-none transform-3d"
                    style={{ transform: "translateZ(0px)" }} 
                >
                    <p className="text-sm md:text-lg tracking-[0.5em] uppercase text-center font-light text-blue-200/70 mb-2 md:mb-4">
                        Events Organized By
                    </p>
                    <h1 className="text-[clamp(5rem,18vw,16rem)] leading-none font-black tracking-widest uppercase text-center text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-400 to-[#0a0a0a] drop-shadow-[0_0_60px_rgba(96,165,250,0.4)]">
                        HELIX
                    </h1>
                </div>

                {/* CYLINDER CARDS */}
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
                            className="absolute inset-0 cylinder-card group will-change-transform cursor-pointer"
                            style={{
                                transformStyle: "preserve-3d",
                                contain: "layout paint style",
                            }}
                        >
                            {/* FLIP WRAPPER 
                                Added group-hover:[transform:rotateY(180deg)_scale(1.05)] to flip the entire block 
                                Added duration-500 and ease-out for a smoother physical spin 
                            */}
                            <div
                                className="
                                    relative
                                    w-full
                                    h-full
                                    transform-3d
                                    transition-all
                                    duration-500
                                    ease-out
                                    group-hover:[transform:rotateY(180deg)_scale(1.05)]
                                "
                            >
                                {/* FRONT FACE */}
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
                                            opacity-70
                                        "
                                    />
                                </div>

                                {/* BACK FACE */}
                                <div
                                    className="
                                        absolute
                                        inset-0
                                        overflow-hidden
                                        rounded-md
                                        bg-gray-900
                                        border
                                        border-blue-500/30
                                        shadow-[0_0_20px_rgba(59,130,246,0.2)]
                                        backface-hidden
                                    "
                                    style={{
                                        transform: "rotateY(180deg)",
                                    }}
                                >
                                    {/* A darker overlay on the back so the text pops */}
                                    <div className="absolute inset-0 bg-[#0a0a0a]/90 z-10 pointer-events-none" />
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
                                            opacity-20
                                            scale-110
                                            blur-sm
                                        "
                                    />
                                    {/* Text content revealed on flip */}
                                    <div className="absolute inset-0 z-20 flex flex-col items-center justify-center p-6 text-center">
                                        <div className="w-8 h-[2px] bg-blue-400 mb-4 rounded-full"></div>
                                        <h3 className="text-white text-xl md:text-2xl font-bold tracking-tight">{event.title}</h3>
                                        {event.date && <p className="text-blue-200/60 font-mono text-xs md:text-sm mt-3 tracking-widest">{event.date}</p>}
                                    </div>
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
