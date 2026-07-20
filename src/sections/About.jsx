import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// Vision / Mission card — tilt on mouse move
// ==========================================
const PillarCard = ({ label, heading, body, accent }) => {
    const cardRef = useRef(null);
    const innerRef = useRef(null);
    const xTo = useRef(null);
    const yTo = useRef(null);

    useGSAP(() => {
        xTo.current = gsap.quickTo(innerRef.current, 'rotationY', { ease: 'power3.out', duration: 0.6 });
        yTo.current = gsap.quickTo(innerRef.current, 'rotationX', { ease: 'power3.out', duration: 0.6 });

        gsap.from(cardRef.current, {
            y: 40,
            opacity: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: cardRef.current, start: 'top 88%' },
        });
    }, { scope: cardRef });

    const handleMove = (e) => {
        const rect = cardRef.current.getBoundingClientRect();
        const px = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
        const py = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
        xTo.current(px * 8);
        yTo.current(py * -8);
    };

    const handleLeave = () => {
        xTo.current(0);
        yTo.current(0);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative rounded-[2rem] p-px overflow-hidden group"
            style={{ perspective: '1000px' }}
        >
            <div
                className="absolute inset-0 opacity-25 group-hover:opacity-90 transition-opacity duration-700"
                style={{ background: `linear-gradient(120deg, transparent, ${accent}, transparent)` }}
            />
            <div
                ref={innerRef}
                className="relative h-full bg-[#0b0b0b] rounded-[calc(2rem-1px)] p-9 md:p-12 border border-white/[0.06] will-change-transform"
            >
                <div className="flex items-center gap-3 mb-8">
                    <span className="w-6 h-px" style={{ backgroundColor: accent }} />
                    <span className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/40">{label}</span>
                </div>
                <p className="text-2xl md:text-[2.15rem] font-light leading-[1.35] text-gray-300">
                    {heading} <span className="text-white font-medium">{body}</span>
                </p>
            </div>
        </div>
    );
};

// ==========================================
// Main section
// ==========================================
const AboutSection = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const scrollContentRef = useRef(null);
    const pathRef = useRef(null);

    const purposeData = [
        { title: 'Expand Knowledge', text: 'Gain exposure to web development, cybersecurity, AI, robotics, and UX.', accent: '#eeff00' },
        { title: 'Develop Skills', text: 'Acquire hands-on experience through targeted workshops and hackathons.', accent: '#60a5fa' },
        { title: 'Solve Problems', text: 'Tackle real-world challenges through collaborative problem-solving.', accent: '#c084fc' },
        { title: 'Network & Grow', text: 'Connect with peers and interact with industry professionals.', accent: '#34d399' },
    ];

    useGSAP(() => {
        // 1. Setup the Scroll-Triggered SVG Line
        if (pathRef.current) {
            const path = pathRef.current;
            const length = path.getTotalLength();
            
            // Set initial state (fully hidden)
            gsap.set(path, {
                strokeDasharray: length,
                strokeDashoffset: length,
            });

            // Animate it drawing based on the scroll progress of the entire section
            gsap.to(path, {
                strokeDashoffset: 0,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 1, // Smooth scrub
                },
            });
        }

        // 2. Horizontal Scroll Logic
        if (scrollWrapperRef.current && scrollContentRef.current) {
            const panels = gsap.utils.toArray('.purpose-panel');
            gsap.to(panels, {
                xPercent: -100 * (panels.length - 1),
                ease: 'none',
                scrollTrigger: {
                    trigger: scrollWrapperRef.current,
                    pin: true,
                    scrub: 1,
                    snap: { snapTo: 1 / (panels.length - 1), duration: 0.5, ease: 'power2.inOut' },
                    end: () => `+=${scrollContentRef.current.offsetWidth}`,
                },
            });
        }
    }, { scope: containerRef });

    return (
        <section
            id="about"
            ref={containerRef}
            className="relative w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#eeff00] selection:text-black"
        >
            {/* SVG BACKGROUND LINE */}
            <svg
                className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
            >
                <defs>
                    <linearGradient id="neonGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#eeff00" />  {/* Yellow */}
                        <stop offset="33%" stopColor="#60a5fa" /> {/* Blue */}
                        <stop offset="66%" stopColor="#c084fc" /> {/* Purple */}
                        <stop offset="100%" stopColor="#34d399" /> {/* Green */}
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="1.5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                </defs>
                {/* 
                    The path uses a 0-100 coordinate system that stretches.
                    It weaves back and forth down the component. 
                */}
                <path
                    ref={pathRef}
                    d="M -5,5 C 30,15 90,20 85,35 C 80,50 15,45 20,65 C 25,85 85,80 105,95"
                    fill="none"
                    stroke="url(#neonGradient)"
                    strokeWidth="1.2"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="opacity-70"
                />
            </svg>

            {/* HERO */}
            {/* Note: Background gradient adjusted to be slightly transparent to show the line */}
            <div
                ref={heroRef}
                className="relative z-10 min-h-screen flex flex-col justify-center px-6 md:px-20 pt-24 bg-gradient-to-b from-[#111111]/80 via-[#0d0d0d]/80 to-transparent"
            >
                <div className="relative z-10 max-w-7xl flex flex-col">
                    <div className="flex items-center gap-3 mb-8">
                        <span className="w-2 h-2 rounded-full bg-[#eeff00] animate-pulse" />
                        <span className="text-xs md:text-sm font-mono uppercase tracking-[0.35em] text-white/40">
                            Est. Jan 9, 2025 — RVSCET
                        </span>
                    </div>

                    <span className="text-6xl md:text-8xl lg:text-[9rem] font-bold tracking-tighter leading-[0.9]">
                        WHO WE ARE
                    </span>

                    <span className="text-lg md:text-2xl font-light leading-relaxed mt-10 max-w-2xl text-gray-500">
                        Dive into the realm of innovation with Helix, the vibrant Tech and AI club at RVSCET. Welcoming students from all backgrounds, we cultivate a supportive community where members delve into cutting-edge fields.
                    </span>
                </div>
            </div>

            {/* VISION & MISSION */}
            <div className="relative z-10 py-28 px-6 md:px-20 border-t border-white/[0.06] bg-transparent">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <PillarCard
                        label="Our Vision"
                        heading="To develop a"
                        body="tech-driven community that empowers students to become industry leaders."
                        accent="#eeff00"
                    />
                    <PillarCard
                        label="Our Mission"
                        heading="Provide"
                        body="hands-on learning and foster innovation to prepare you for the tech world."
                        accent="#60a5fa"
                    />
                </div>
            </div>

            {/* PURPOSE — horizontal scroll */}
            <div
                ref={scrollWrapperRef}
                className="relative z-10 h-screen w-full bg-transparent flex items-center overflow-hidden border-t border-white/[0.06]"
            >
                <div className="absolute top-10 left-6 md:left-20 z-50 flex items-center gap-4">
                    <div className="w-2.5 h-2.5 rounded-full bg-[#eeff00] animate-pulse" />
                    <span className="text-sm font-mono uppercase tracking-[0.3em] text-white/40">The Purpose</span>
                </div>

                <div
                    ref={scrollContentRef}
                    className="flex h-full will-change-transform"
                    style={{ width: `${purposeData.length * 100}vw` }}
                >
                    {purposeData.map((purpose, idx) => (
                        <div
                            key={idx}
                            className="purpose-panel w-screen h-full flex items-center justify-center px-6 md:px-20 relative"
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.07]">
                                <span
                                    className="text-[45vw] font-black leading-none tracking-tighter"
                                    style={{ WebkitTextStroke: `2px ${purpose.accent}`, color: 'transparent' }}
                                >
                                    {String(idx + 1).padStart(2, '0')}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-6xl w-full items-center relative z-10">
                                <div>
                                    <span className="block text-xs font-mono uppercase tracking-[0.3em] text-white/30 mb-4">
                                        {String(idx + 1).padStart(2, '0')} / {String(purposeData.length).padStart(2, '0')}
                                    </span>
                                    <h3 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 leading-[1.05]">
                                        {purpose.title}
                                    </h3>
                                    <div className="h-1 w-16 rounded-full" style={{ backgroundColor: purpose.accent }} />
                                </div>

                                <div className="bg-[#050505]/70 backdrop-blur-md p-9 md:p-11 rounded-[1.75rem] border border-white/[0.06] relative overflow-hidden">
                                    <div
                                        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-[60px] opacity-20"
                                        style={{ backgroundColor: purpose.accent }}
                                    />
                                    <p className="relative text-xl md:text-2xl font-light text-gray-300 leading-relaxed">
                                        {purpose.text}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutSection;