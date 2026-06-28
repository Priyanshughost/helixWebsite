"use client";

import React, { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { eventList } from "./eventList"; // Assuming this exports an array of objects

gsap.registerPlugin(ScrollTrigger);

const EventSection = () => {
    const sectionRef = useRef(null);
    const cylinderRef = useRef(null);
    const parallaxWrapperRef = useRef(null);
    
    // State to hold dynamic radius so we can adjust on window resize
    const [radius, setRadius] = useState(0);

    useGSAP(() => {
        if (!sectionRef.current || !cylinderRef.current) return;

        const cards = gsap.utils.toArray(".cylinder-card");
        const numCards = cards.length;
        
        // Failsafe: If no cards, don't run the math
        if (numCards === 0) return;

        // 1. Dynamic Math Calculations
        const angle = 360 / numCards;
        
        const calculateAndSetRadius = () => {
            // Get actual DOM width of a card, fallback to 250
            const cardWidth = cards[0].offsetWidth || 250; 
            // The formula to find the radius of a regular polygon given its side length
            const calculatedRadius = Math.round((cardWidth / 2) / Math.tan(Math.PI / numCards));
            // Add a buffer gap (e.g., 40px)
            const finalRadius = calculatedRadius + 40; 
            
            setRadius(finalRadius);

            // Distribute cards in a perfect circle
            cards.forEach((card, i) => {
                gsap.set(card, {
                    rotationY: i * angle,
                    z: finalRadius,
                    transformOrigin: "50% 50%",
                });
            });
        };

        // Initial setup
        calculateAndSetRadius();

        // 2. The Scroll Animation
        // Instead of hardcoding pixels, we rotate a full 360 degrees (or more depending on data size)
        const totalRotation = 360 * (numCards > 10 ? 2 : 1); 

        const scrollAnim = gsap.to(cylinderRef.current, {
            rotationY: -totalRotation, // Negative rotates it naturally with downward scroll
            ease: "none",
            scrollTrigger: {
                trigger: sectionRef.current,
                pin: true,
                scrub: 1,
                start: "top top",
                // Make the scroll distance proportional to the number of cards so speed feels consistent
                end: () => `+=${numCards * 300}`,
                invalidateOnRefresh: true,
            },
        });

        // 3. Hardware-Accelerated Parallax (from your original, kept and refined)
        let handleMouseMove;
        if (parallaxWrapperRef.current) {
            const xTo = gsap.quickTo(parallaxWrapperRef.current, "rotationY", { ease: "power3", duration: 0.8 });
            const yTo = gsap.quickTo(parallaxWrapperRef.current, "rotationX", { ease: "power3", duration: 0.8 });

            handleMouseMove = (e) => {
                const { innerWidth, innerHeight } = window;
                const x = (e.clientX / innerWidth) * 2 - 1;
                const y = (e.clientY / innerHeight) * 2 - 1;
                xTo(x * 8); // Max 8 degrees of tilt
                yTo(-(y * 8));
            };
            window.addEventListener("mousemove", handleMouseMove);
        }

        // Cleanup
        return () => {
            if (handleMouseMove) window.removeEventListener("mousemove", handleMouseMove);
            scrollAnim.kill();
        };
    }, { scope: sectionRef, dependencies: [eventList.length] }); // Re-run if data length changes

    return (
        <section
            id="events"
            ref={sectionRef}
            className="relative w-full h-screen bg-[#050505] text-white overflow-hidden flex items-center justify-center"
            style={{ perspective: '1200px' }}
        >
            {/* ACCESSIBILITY: Visually hidden list for screen readers */}
            <div className="sr-only">
                <h2>Upcoming Helix Events</h2>
                <ul>
                    {eventList.map((event, idx) => (
                        <li key={idx}>
                            {event.title} on {event.date}
                        </li>
                    ))}
                </ul>
            </div>

            {/* BACKGROUND TYPOGRAPHY */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none z-0">
                <h2 className="text-[2vw] tracking-[0.5em] uppercase font-light text-white/30 mb-2">
                    Events Organized By
                </h2>
                <h1 className="text-[20vw] md:text-[25vw] font-black tracking-tighter uppercase text-transparent bg-clip-text bg-gradient-to-b from-white/10 to-transparent leading-none">
                    HELIX
                </h1>
            </div>

            {/* 3D PARALLAX WRAPPER */}
            <div
                ref={parallaxWrapperRef}
                className="relative z-10 flex items-center justify-center w-full h-full will-change-transform"
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* THE ROTATING CYLINDER */}
                <div
                    ref={cylinderRef}
                    className="relative w-[280px] sm:w-[320px] aspect-[3/4] will-change-transform"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {eventList.map((event, index) => (
                        // Card Container (handles the positioning in 3D space)
                        <div
                            key={index}
                            className="absolute inset-0 cylinder-card group cursor-pointer"
                            style={{ transformStyle: "preserve-3d" }}
                            aria-hidden="true" // Hide from screen readers to prevent tab-trapping in 3D space
                        >
                            {/* Card Flipper (handles the actual hover flip effect) */}
                            <div className="relative w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] transform-style-3d group-hover:[transform:rotateY(180deg)]">
                                
                                {/* FRONT FACE */}
                                <div className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-white/10 bg-[#111] backface-hidden shadow-[0_0_30px_rgba(0,0,0,0.8)]">
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10" />
                                    <img
                                        src={event.img}
                                        alt=""
                                        draggable="false"
                                        className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                                    />
                                    {/* Front Labels */}
                                    <div className="absolute bottom-6 left-6 z-20">
                                        <p className="text-sm font-mono text-[#eeff00] mb-1">0{index + 1}</p>
                                        <h3 className="text-2xl font-bold tracking-tight text-white">{event.title}</h3>
                                    </div>
                                </div>

                                {/* BACK FACE */}
                                <div 
                                    className="absolute inset-0 w-full h-full rounded-2xl overflow-hidden border border-[#eeff00]/30 bg-[#0a0a0a] backface-hidden flex flex-col items-center justify-center p-8 text-center"
                                    style={{ transform: "rotateY(180deg)" }}
                                >
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#eeff00] to-transparent opacity-50" />
                                    <span className="text-4xl mb-4 text-[#eeff00]">✦</span>
                                    <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                                    {event.date && (
                                        <p className="text-sm font-mono text-gray-400 mb-6">{event.date}</p>
                                    )}
                                    <button className="px-6 py-2 rounded-full border border-white/20 text-sm hover:bg-white hover:text-black transition-colors duration-300">
                                        View Details
                                    </button>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Scroll Indicator UI */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none z-20 opacity-50">
                <span className="text-xs font-mono uppercase tracking-[0.2em]">Scroll to Explore</span>
                <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
            </div>
        </section>
    );
};

export default EventSection;
