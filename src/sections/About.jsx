import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

// ==========================================
// 1. Accessible & Performant Text Splitter
// ==========================================
const AccessibleGlowText = ({ text, as: Tag = "p", className = "", triggerRef }) => {
    const textRef = useRef(null);

    useGSAP(() => {
        if (!textRef.current || !triggerRef.current) return;

        const words = gsap.utils.toArray('.glow-word', textRef.current);

        // Staggering words instead of characters saves massive DOM overhead
        gsap.fromTo(words,
            { color: 'rgba(255,255,255,0.2)', textShadow: 'none' },
            {
                color: 'rgb(255,255,255)',
                textShadow: '0 0 15px rgba(238, 255, 0, 0.4)',
                stagger: 0.1,
                scrollTrigger: {
                    trigger: triggerRef.current,
                    start: 'top 60%',
                    end: 'bottom 40%',
                    scrub: 1,
                }
            }
        );
    }, { scope: textRef, dependencies: [triggerRef] });

    return (
        <Tag ref={textRef} className={className} aria-label={text}>
            <span aria-hidden="true" className="flex flex-wrap gap-[0.25em]">
                {text.split(" ").map((word, wIdx) => (
                    <span key={wIdx} className="glow-word transition-colors duration-300">
                        {word}
                    </span>
                ))}
            </span>
        </Tag>
    );
};

// ==========================================
// 2. Hardware-Accelerated 3D Magnetic Card
// ==========================================
const VisionMissionCard = ({ title, description, accentColor, accentGradient }) => {
    const cardRef = useRef(null);
    const innerRef = useRef(null);

    // quickTo is highly optimized for mouse tracking without triggering re-renders
    const xTo = useRef(null);
    const yTo = useRef(null);

    useGSAP(() => {
        xTo.current = gsap.quickTo(innerRef.current, "rotationY", { ease: "power3.out", duration: 0.6 });
        yTo.current = gsap.quickTo(innerRef.current, "rotationX", { ease: "power3.out", duration: 0.6 });

        gsap.from(cardRef.current, {
            y: 50,
            opacity: 0,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: cardRef.current,
                start: 'top 85%',
            }
        });
    }, { scope: cardRef });

    const handleMouseMove = (e) => {
        if (!cardRef.current || !xTo.current || !yTo.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        // Subtle constraints: max 10 degrees of rotation
        xTo.current(((x - centerX) / centerX) * 10);
        yTo.current(((y - centerY) / centerY) * -10);
    };

    const handleMouseLeave = () => {
        if (!xTo.current || !yTo.current) return;
        xTo.current(0);
        yTo.current(0);
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="relative rounded-[2.5rem] p-[2px] overflow-hidden group cursor-crosshair"
            style={{ perspective: '1000px' }}
        >
            {/* Elegant static border that reveals on hover, replacing expensive infinite spins */}
            <div className={`absolute inset-0 bg-gradient-to-br ${accentGradient} opacity-20 group-hover:opacity-100 transition-opacity duration-700`}></div>

            <div ref={innerRef} className="relative h-full w-full bg-[#0c0c0c]/90 backdrop-blur-xl rounded-[calc(2.5rem-2px)] p-10 md:p-14 z-10 will-change-transform border border-white/5">
                <h3 className={`text-[${accentColor}] text-xl md:text-2xl font-mono mb-8 uppercase tracking-widest flex items-center gap-4`}>
                    <span className="w-8 h-[1px]" style={{ backgroundColor: accentColor }}></span>
                    {title}
                </h3>
                <p className="text-2xl md:text-4xl font-light leading-tight text-gray-400">
                    {description}
                </p>
            </div>
        </div>
    );
};

// ==========================================
// 3. Main Orchestrator Component
// ==========================================
const AboutSection = () => {
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    const scrollContentRef = useRef(null);

    const purposeData = [
        { title: 'Expand Knowledge', text: 'Gain exposure to web development, cybersecurity, AI, robotics, and UX.', icon: '', num: '01', accent: '#eeff00' },
        { title: 'Develop Skills', text: 'Acquire hands-on experience through targeted workshops and hackathons.', icon: '💻', num: '02', accent: '#60a5fa' },
        { title: 'Solve Problems', text: 'Tackle real-world challenges through collaborative problem-solving.', icon: '', num: '03', accent: '#c084fc' },
        { title: 'Network & Grow', text: 'Connect with peers and interact with industry professionals.', icon: '', num: '04', accent: '#34d399' },
    ];

    useGSAP(() => {
        // Ambient Background Blobs
        gsap.to('.ambient-blob', {
            yPercent: -20,
            xPercent: 10,
            rotation: 15,
            duration: 10,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
            stagger: { amount: 2, from: "random" }
        });

        // Horizontal Scroll Setup
        if (scrollWrapperRef.current && scrollContentRef.current) {
            const sections = gsap.utils.toArray('.purpose-panel');

            gsap.to(sections, {
                xPercent: -100 * (sections.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: scrollWrapperRef.current,
                    pin: true,
                    scrub: 1,
                    snap: {
                        snapTo: 1 / (sections.length - 1),
                        duration: 0.5,
                        ease: "power2.inOut"
                    },
                    end: () => `+=${scrollContentRef.current.offsetWidth}`
                }
            });
        }
    }, { scope: containerRef });

    return (
        <section id="about" ref={containerRef} className="w-full bg-[#050505] text-white font-sans overflow-hidden selection:bg-[#eeff00] selection:text-black">

            {/* HERO SECTION */}
            <div ref={heroRef} className="relative min-h-screen flex flex-col justify-center px-6 md:px-20 pt-24 z-10">
                {/* Optimized Ambient Background */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
                    <div className="ambient-blob absolute top-0 right-0 w-[40vw] h-[40vw] rounded-full bg-[#eeff00]/5 blur-[120px]"></div>
                    <div className="ambient-blob absolute bottom-20 left-10 w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[120px]"></div>
                </div>

                <div className="z-10 max-w-7xl">
                    <AccessibleGlowText
                        as="h1"
                        text="WHO WE ARE"
                        triggerRef={heroRef}
                        className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none"
                    />
                    <AccessibleGlowText
                        as="h2"
                        text="Established Jan 9th, 2025"
                        triggerRef={heroRef}
                        className="text-2xl md:text-4xl lg:text-5xl font-light tracking-tight mt-6 text-gray-400"
                    />
                    <AccessibleGlowText
                        as="p"
                        text="Dive into the realm of innovation with Helix, the vibrant Tech and AI club at RVSCET. Welcoming students from all backgrounds, we cultivate a supportive community where members delve into cutting-edge fields."
                        triggerRef={heroRef}
                        className="text-xl md:text-3xl font-light leading-relaxed mt-12 max-w-4xl text-gray-500"
                    />
                </div>
            </div>

            {/* VISION & MISSION SECTION */}
            <div className="py-32 px-6 md:px-20 relative z-10 border-t border-white/5 bg-gradient-to-b from-[#050505] to-[#0a0a0a]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <VisionMissionCard
                        title="Our Vision"
                        description={<>To develop a <span className="text-white font-medium">tech-driven community</span> that empowers students to become industry leaders.</>}
                        accentColor="#eeff00"
                        accentGradient="from-transparent via-[#eeff00] to-transparent"
                    />
                    <VisionMissionCard
                        title="Our Mission"
                        description={<>Provide <span className="text-white font-medium">hands-on learning</span> and foster innovation to prepare you for the tech world.</>}
                        accentColor="#60a5fa"
                        accentGradient="from-transparent via-[#60a5fa] to-transparent"
                    />
                </div>
            </div>

            {/* HORIZONTAL PURPOSE SCROLL */}
            <div ref={scrollWrapperRef} className="h-screen w-full bg-[#0a0a0a] relative flex items-center overflow-hidden border-t border-white/5">

                {/* Fixed HUD UI */}
                <div className="absolute top-10 left-6 md:left-20 z-50 flex items-center gap-4">
                    <div className="w-3 h-3 rounded-full bg-[#eeff00] animate-pulse"></div>
                    <span className="text-sm md:text-base font-mono uppercase tracking-[0.2em] text-white/50">The Purpose</span>
                </div>

                <div ref={scrollContentRef} className="flex h-full will-change-transform" style={{ width: `${purposeData.length * 100}vw` }}>
                    {purposeData.map((purpose, idx) => (
                        <div key={idx} className="purpose-panel w-screen h-full flex items-center justify-center px-6 md:px-20 relative">
                            {/* Giant Watermark Number */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden opacity-30">
                                <span
                                    className="text-[50vw] font-black leading-none select-none tracking-tighter"
                                    style={{
                                        WebkitTextStroke: `2px ${purpose.accent}20`,
                                        color: 'transparent'
                                    }}>
                                    {purpose.num}
                                </span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-7xl w-full z-10 items-center">
                                <div>

                                    <h3 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">{purpose.title}</h3>
                                    <div className="h-1 w-24 rounded-full mb-8" style={{ backgroundColor: purpose.accent }}></div>
                                </div>
                                <div className="bg-[#111]/80 backdrop-blur-md p-10 md:p-12 rounded-[2rem] border border-white/5 shadow-2xl relative overflow-hidden">
                                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[60px] opacity-20" style={{ backgroundColor: purpose.accent }}></div>
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: purpose.accent }}></div>
                                        <span className="text-xs font-mono uppercase tracking-widest text-white/40">Step {purpose.num} of 04</span>
                                    </div>
                                    <p className="text-2xl md:text-3xl font-light text-gray-300 leading-relaxed">
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
