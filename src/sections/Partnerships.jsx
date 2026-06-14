import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const partnerships = [
    { name: "DevFest Ranchi 2025", role: "Community Partner", date: "Oct 11, 2025", desc: "Helix proudly participated as a Community Partner at GP Birla Auditorium, BIT Mesra, contributing actively to the success of the event. Aadarsh Shaheb Singh and Prayog Priyanshu served as Training & Development Lead and Community Lead respectively." },
    { name: "Martinovation", role: "Community Partner", date: "Nov 3-7, 2025", desc: "Served as a Community Partner for the flagship hackathon of UMU TechFest organized by Usha Martin University, assisting with sponsor outreach and strategic guidance." },
    { name: "RanchiHacks 2026", role: "Community Partner", date: "Jan 17-18, 2026", desc: "Helix played a key role in planning, promotion, and execution support for this national-level hackathon organized by GDG Ranchi." }
];

function Partnerships() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.partner-card');

        // 1. Heading — 3D tilt entrance
        gsap.fromTo('.partner-heading',
            {
                rotationX: -60,
                yPercent: 60,
                opacity: 0,
                transformPerspective: 1200,
                transformOrigin: 'center bottom'
            },
            {
                rotationX: 0,
                yPercent: 0,
                opacity: 1,
                duration: 1.8,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                }
            }
        );

        // 2. Each card — 3D flip entrance, direction-aware
        cards.forEach((card, i) => {
            gsap.set(card, {
                transformPerspective: 1500,
                transformOrigin: 'center bottom',
            });

            const enterFrom = { rotationX: -60, rotationY: (i % 2 === 0 ? -15 : 15), y: 200, scale: 0.8, opacity: 0, z: -300 };
            const enterBackFrom = { rotationX: 60, rotationY: (i % 2 === 0 ? 15 : -15), y: -200, scale: 0.8, opacity: 0, z: -300 };
            const enterTo = { rotationX: 0, rotationY: 0, y: 0, scale: 1, opacity: 1, z: 0, duration: 1.4, ease: 'expo.out' };

            gsap.set(card, enterFrom);

            ScrollTrigger.create({
                trigger: card,
                start: 'top 95%',
                end: 'bottom 5%',
                onEnter: () => {
                    gsap.set(card, { transformOrigin: 'center bottom' });
                    gsap.fromTo(card, enterFrom, { ...enterTo, delay: i * 0.12 });
                },
                onLeave: () => {
                    gsap.to(card, { opacity: 0, y: -60, scale: 0.95, duration: 0.4, ease: 'power2.in' });
                },
                onEnterBack: () => {
                    gsap.set(card, { transformOrigin: 'center top' });
                    gsap.fromTo(card, enterBackFrom, { ...enterTo, delay: i * 0.12 });
                },
                onLeaveBack: () => {
                    gsap.to(card, { opacity: 0, y: 60, scale: 0.95, duration: 0.4, ease: 'power2.in' });
                },
            });

            // 3. Continuous 3D tilt scrub while scrolling
            gsap.fromTo(card,
                { rotationX: 4, rotationY: (i % 2 === 0 ? 3 : -3) },
                {
                    rotationX: -4,
                    rotationY: (i % 2 === 0 ? -3 : 3),
                    ease: 'none',
                    force3D: true,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                }
            );
        });

        // 4. Index badges — bounce in
        const badges = gsap.utils.toArray('.partner-badge');
        badges.forEach((badge) => {
            gsap.fromTo(badge,
                { scale: 0, rotation: -20, opacity: 0 },
                {
                    scale: 1,
                    rotation: 0,
                    opacity: 1,
                    duration: 0.8,
                    ease: 'back.out(2.5)',
                    scrollTrigger: {
                        trigger: badge,
                        start: 'top 92%',
                        toggleActions: 'play reverse play reverse',
                    }
                }
            );
        });

    }, { scope: sectionRef });

    return (
        <section
            ref={sectionRef}
            className="w-full bg-white py-28 md:py-40 px-6 md:px-12 lg:px-20 overflow-hidden"
            style={{ perspective: '1500px' }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="partner-heading mb-20 md:mb-28">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-black mb-4">
                        Community<br />Partnerships
                    </h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl font-light">
                        Building ecosystems beyond the campus boundaries.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
                    {partnerships.map((p, i) => (
                        <div
                            key={i}
                            className="partner-card relative bg-[#f4f4f4] rounded-2xl overflow-hidden will-change-transform group hover:shadow-2xl transition-shadow duration-500"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Big index number */}
                            <div className="partner-badge absolute top-6 right-6 w-14 h-14 rounded-full bg-black text-[#eeff00] flex items-center justify-center text-xl font-bold z-10 select-none"
                                style={{ transformOrigin: 'center center' }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            <div className="p-10 pt-14 flex flex-col h-full min-h-[340px]">
                                <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-6">{p.date}</div>
                                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-black mb-3 group-hover:text-gray-700 transition-colors">{p.name}</h3>
                                <h4 className="text-sm font-semibold tracking-widest uppercase text-black/50 mb-8">{p.role}</h4>
                                <p className="text-gray-600 leading-relaxed mt-auto text-base">{p.desc}</p>
                            </div>

                            {/* Bottom accent bar */}
                            <div className="h-1 w-full bg-gradient-to-r from-black via-gray-400 to-transparent group-hover:from-[#eeff00] group-hover:via-[#eeff00]/40 transition-all duration-700" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Partnerships;
