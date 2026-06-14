import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const partnerships = [
    { name: "DevFest Ranchi 2025", role: "Community Partner", date: "Oct 11, 2025", desc: "Helix proudly participated as a Community Partner at GP Birla Auditorium, BIT Mesra, contributing actively to the success of the event. Aadarsh Shaheb Singh and Prayog Priyanshu served as Training & Development Lead and Community Lead respectively.", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=2070&auto=format&fit=crop" },
    { name: "Martinovation", role: "Community Partner", date: "Nov 3-7, 2025", desc: "Served as a Community Partner for the flagship hackathon of UMU TechFest organized by Usha Martin University, assisting with sponsor outreach and strategic guidance.", image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop" },
    { name: "RanchiHacks 2026", role: "Community Partner", date: "Jan 17-18, 2026", desc: "Helix played a key role in planning, promotion, and execution support for this national-level hackathon organized by GDG Ranchi.", image: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?q=80&w=2012&auto=format&fit=crop" }
];

function Partnerships() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.partner-card');

        // 1. Heading — Smooth entrance from bottom
        gsap.fromTo('.partner-heading-text',
            {
                yPercent: 100,
                opacity: 0,
            },
            {
                yPercent: 0,
                opacity: 1,
                duration: 1.2,
                stagger: 0.1,
                ease: 'power4.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                }
            }
        );

        // 2. Each card — 3D unfold from below on scroll
        cards.forEach((card, i) => {
            gsap.set(card, {
                transformPerspective: 1500,
                transformOrigin: 'center bottom',
            });

            gsap.fromTo(card,
                { 
                    rotationX: -60,
                    y: 150,
                    opacity: 0, 
                    scale: 0.9,
                    z: -200
                },
                {
                    rotationX: 0,
                    y: 0,
                    opacity: 1,
                    scale: 1,
                    z: 0,
                    duration: 1.4,
                    delay: i * 0.1,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 95%',
                        toggleActions: 'play reverse play reverse',
                    }
                }
            );
        });

        // 3. Index badges — bounce in
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
            className="w-full bg-black py-28 md:py-40 px-6 md:px-12 lg:px-20 overflow-hidden relative"
            style={{ perspective: '1500px' }}
        >
            {/* Ambient Background Light */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] md:w-[40vw] h-[80vw] md:h-[40vw] bg-[#eeff00]/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="mb-20 md:mb-28">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-normal tracking-tight text-white mb-4">
                        <div className="overflow-hidden">
                            <div className="partner-heading-text inline-block">Community</div>
                        </div>
                        <div className="overflow-hidden">
                            <div className="partner-heading-text inline-block text-[#eeff00]">Partnerships</div>
                        </div>
                    </h2>
                    <div className="overflow-hidden">
                        <p className="partner-heading-text text-lg md:text-xl text-gray-400 max-w-2xl font-light">
                            Building ecosystems beyond the campus boundaries.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                    {partnerships.map((p, i) => (
                        <div
                            key={i}
                            id={`partner-card-${i}`}
                            className="partner-card relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl overflow-hidden will-change-transform"
                            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center center' }}
                        >
                            {/* Big index number */}
                            <div className="partner-badge absolute top-6 right-6 w-12 h-12 md:w-14 md:h-14 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-[#eeff00] flex items-center justify-center text-lg md:text-xl font-bold z-20 select-none"
                                style={{ transformOrigin: 'center center' }}
                            >
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            {/* Background Image */}
                            <div className="absolute inset-0 w-full h-full z-0 pointer-events-none overflow-hidden">
                                <div className="absolute inset-0 bg-black/70 z-10" />
                                <img
                                    src={p.image}
                                    alt={p.name}
                                    className="partner-card-img w-full h-full object-cover opacity-80 transition-all duration-700"
                                />
                            </div>

                            {/* Card Content */}
                            <div className="relative z-20 p-8 md:p-10 pt-16 md:pt-20 flex flex-col h-full min-h-[350px] md:min-h-[400px] pointer-events-none">
                                <div className="text-xs font-medium tracking-widest uppercase text-[#eeff00] mb-4 md:mb-6">{p.date}</div>
                                <h3 className="text-2xl md:text-3xl font-medium tracking-tight text-white mb-2 md:mb-3">{p.name}</h3>
                                <h4 className="text-xs md:text-sm font-semibold tracking-widest uppercase text-white/50 mb-6 md:mb-8">{p.role}</h4>
                                <p className="text-gray-300 leading-relaxed mt-auto text-sm md:text-base font-light">{p.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Partnerships;
