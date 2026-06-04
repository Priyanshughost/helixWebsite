import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { eventList } from "./eventList";

gsap.registerPlugin(ScrollTrigger);

function EventSection() {
    const sectionRef = useRef(null);
    const cylinderRef = useRef(null);

    useGSAP(
        () => {
            const section = sectionRef.current;
            const cylinder = cylinderRef.current;
            if (!section || !cylinder) return;

            const cards = gsap.utils.toArray(".cylinder-card");
            const numCards = cards.length;

            let mm = gsap.matchMedia();

            mm.add({
                isMobile: "(max-width: 768px)",
                isDesktop: "(min-width: 769px)"
            }, (context) => {
                let { isMobile } = context.conditions

                const cardsPerLoop = isMobile ? 8 : 12;
                const angle = 360 / cardsPerLoop;
                const yStep = isMobile ? 50 : 40;
                const gap = isMobile ? 10 : 20;

                const cardWidth = cards[0].offsetWidth;
                const radius = Math.round((cardWidth + gap) / 2 / Math.tan(Math.PI / cardsPerLoop));

                // 1. Position each card in the spiral
                cards.forEach((card, i) => {
                    gsap.set(card, {
                        transform: `translateY(${i * yStep}px) rotateY(${i * angle}deg) translateZ(${radius}px)`,
                        transformOrigin: "50% 50%"
                    });
                });

                // 2. Exact mathematical sync for centering
                const totalYMovement = -((numCards - 1) * yStep);
                const totalRotation = (numCards - 1) * angle;

                gsap.to(cylinder, {
                    y: totalYMovement,
                    rotationY: -totalRotation,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        scrub: 1,
                        start: "top top",
                        end: () => `+=${numCards * 250}`,
                        invalidateOnRefresh: true,
                    },
                });
            }),
                { scope: sectionRef }
        });

    return (
        <section
            ref={sectionRef}
            // Added `relative` to correctly contain the absolutely positioned text
            className="relative w-full h-screen bg-[#0a0a0a] text-white font-sans overflow-hidden flex items-center justify-center perspective-[1500px]"
        >
            {/* --- CENTER TEXT --- */}
            {/* pointer-events-none ensures it doesn't block card hover states */}
            {/* translateZ(0) forces it into the same 3D rendering context as the cylinder */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none transform-[translateZ(0px)]">
                <h1 className="text-4xl md:text-7xl tracking-tight font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 uppercase text-center drop-shadow-2xl">
                    Events<br />By Helix
                </h1>
            </div>

            <div
                ref={cylinderRef}
                className="relative w-35 md:w-45 aspect-3/4 transform-3d"
            >
                {eventList.map((event, index) => (
                    <div
                        key={index}
                        className="absolute inset-0 cylinder-card group transform-3d"
                    >
                        <div className="w-full h-full relative transform transition-transform group-hover:scale-105 duration-500 transform-3d">

                            {/* --- FRONT FACE --- */}
                            <div className="absolute inset-0 overflow-hidden bg-gray-900 rounded-md shadow-xl border border-white/10 backface-hidden">
                                <img
                                    src={event.img}
                                    alt={event.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                />
                            </div>

                            {/* --- BACK FACE (Dimmed) --- */}
                            <div className="absolute inset-0 overflow-hidden bg-gray-900 rounded-md shadow-xl border border-white/10 backface-hidden transform-[rotateY(180deg)]">
                                <div className="absolute inset-0 bg-black/75 z-10 pointer-events-none"></div>
                                <img
                                    src={event.img}
                                    alt={event.title}
                                    className="w-full h-full object-cover opacity-40 grayscale-50"
                                />
                            </div>

                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default EventSection;