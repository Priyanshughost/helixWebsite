import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
    // Refs
    const containerRef = useRef(null);
    const horizontalScrollRef = useRef(null);
    const purposeContainerRef = useRef(null);

    const renderGlowingText = (text, charClass) => {
        return text.split(" ").map((word, wIdx) => (
            <span key={wIdx} className="inline-block mr-[0.2em] whitespace-nowrap">
                {word.split("").map((char, cIdx) => (
                    <span
                        key={cIdx}
                        className={`${charClass} inline-block transition-transform duration-300 select-none`}
                        style={{
                            color: 'rgba(127, 200, 255, 0.15)',
                            textShadow: 'none',
                        }}
                    >
                        {char}
                    </span>
                ))}
            </span>
        ));
    };

    useGSAP(() => {
        // Hero Glow Text Animation (LangSmith Style)
        const heading1Chars = gsap.utils.toArray('.glow-char-1');
        const heading2Chars = gsap.utils.toArray('.glow-char-2');

        const tl1 = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-container',
                start: 'top 70%',
                end: 'top 10%',
                scrub: 0.5,
            }
        });

        heading1Chars.forEach((char, index) => {
            const start = index * 0.03;
            tl1.to(char, {
                color: 'rgb(255, 255, 255)',
                textShadow: '0 0 15px rgba(238, 255, 0, 0.8), 0 0 5px rgba(238, 255, 0, 0.5)',
                duration: 0.15,
            }, start)
                .to(char, {
                    color: 'rgb(238, 255, 0)',
                    textShadow: 'none',
                    duration: 0.15,
                }, start + 0.1);
        });

        const tl2 = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-container',
                start: 'top 50%',
                end: 'top -10%',
                scrub: 0.5,
            }
        });

        heading2Chars.forEach((char, index) => {
            const start = index * 0.03;
            tl2.to(char, {
                color: 'rgb(255, 255, 255)',
                textShadow: '0 0 15px rgba(127, 200, 255, 0.8), 0 0 5px rgba(127, 200, 255, 0.5)',
                duration: 0.15,
            }, start)
                .to(char, {
                    color: 'rgb(127, 200, 255)',
                    textShadow: 'none',
                    duration: 0.15,
                }, start + 0.1);
        });

        // Paragraph Glow Animation
        const paraChars = gsap.utils.toArray('.glow-char-3');

        const tl3 = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-container',
                start: 'top 30%',
                end: 'top -30%',
                scrub: 0.5,
            }
        });

        paraChars.forEach((char, index) => {
            const start = index * 0.005;
            tl3.to(char, {
                color: 'rgb(255, 255, 255)',
                textShadow: '0 0 12px rgba(127, 200, 255, 0.6), 0 0 4px rgba(127, 200, 255, 0.4)',
                duration: 0.08,
            }, start)
                .to(char, {
                    color: 'rgb(180, 220, 255)',
                    textShadow: 'none',
                    duration: 0.08,
                }, start + 0.05);
        });

        // Hover Effect on Characters
        const allGlowChars = [...heading1Chars, ...heading2Chars, ...paraChars];
        allGlowChars.forEach(char => {
            char.addEventListener('mouseenter', () => {
                gsap.to(char, {
                    color: 'rgb(255, 255, 255)',
                    textShadow: '0 0 18px rgba(127, 200, 255, 0.9), 0 0 8px rgba(127, 200, 255, 0.6)',
                    scale: 1.05,
                    duration: 0.2,
                    overwrite: 'auto'
                });
            });
            char.addEventListener('mouseleave', () => {
                gsap.to(char, {
                    color: 'rgb(127, 200, 255)',
                    textShadow: 'none',
                    scale: 1,
                    duration: 0.4,
                    overwrite: 'auto'
                });
            });
        });

        // Vision & Mission 3D Cards
        const cards = gsap.utils.toArray('.vm-card');
        cards.forEach((card, i) => {
            gsap.from(card, {
                y: 100,
                opacity: 0,
                rotationX: -15,
                duration: 1.2,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%',
                }
            });

            // 3D Tilt Effect on Mouse Move
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                gsap.to(card, {
                    rotationX: rotateX,
                    rotationY: rotateY,
                    transformPerspective: 1000,
                    ease: 'power1.out',
                    duration: 0.5
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    rotationX: 0,
                    rotationY: 0,
                    ease: 'power1.out',
                    duration: 0.5
                });
            });

            // Inner elements of VM card
            const q = gsap.utils.selector(card);
            gsap.from(q('h3, p'), {
                y: 30,
                opacity: 0,
                stagger: 0.2,
                duration: 1,
                ease: "power2.out",
                delay: 0.4,
                scrollTrigger: {
                    trigger: card,
                    start: 'top 85%'
                }
            });
        });

        // Floating animation for background blobs
        gsap.to('.hero-blob-1', {
            x: -100,
            y: 100,
            scale: 1.2,
            duration: 8,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });
        gsap.to('.hero-blob-2', {
            x: 100,
            y: -100,
            scale: 1.1,
            duration: 10,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1
        });

        // Horizontal Scroll for Purpose
        const purposeItems = gsap.utils.toArray('.purpose-item', purposeContainerRef.current);

        if (purposeContainerRef.current && purposeItems.length > 0) {
            // Animate each item horizontally by -100% * (number of items - 1)
            // This is the most reliable GSAP horizontal scroll pattern
            const horizontalTween = gsap.to(purposeItems, {
                xPercent: -100 * (purposeItems.length - 1),
                ease: "none",
                scrollTrigger: {
                    trigger: horizontalScrollRef.current,
                    pin: true,
                    scrub: 1,
                    snap: 1 / (purposeItems.length - 1),
                    end: () => "+=" + horizontalScrollRef.current.offsetWidth * (purposeItems.length - 1)
                }
            });

            // Container Animations for inner elements
            purposeItems.forEach((item, i) => {
                const q = gsap.utils.selector(item);

                const getTriggerConfig = (startRatio) => {
                    if (i === 0) {
                        return {
                            trigger: item, // item itself for vertical scroll
                            start: `top ${startRatio * 100}%`,
                            toggleActions: "play none none reverse"
                        };
                    } else {
                        return {
                            trigger: item,
                            containerAnimation: horizontalTween,
                            start: `left ${startRatio * 100}%`,
                            toggleActions: "play none none reverse"
                        };
                    }
                };

                // Animate big number (zoom in and fade with elastic bounce)
                gsap.from(q('.purpose-number'), {
                    scale: 0,
                    opacity: 0,
                    x: -100,
                    rotation: -15,
                    duration: 1.8,
                    ease: "elastic.out(1, 0.5)",
                    scrollTrigger: getTriggerConfig(0.85)
                });

                // Animate icon (spin and pop, then float)
                gsap.from(q('.purpose-icon'), {
                    scale: 0,
                    rotation: 360,
                    opacity: 0,
                    duration: 1.5,
                    ease: "back.out(1.5)",
                    scrollTrigger: getTriggerConfig(0.8),
                    onComplete: () => {
                        gsap.to(q('.purpose-icon'), {
                            y: -15,
                            duration: 2.5,
                            ease: "sine.inOut",
                            yoyo: true,
                            repeat: -1
                        });
                    }
                });

                // Animate title and line (slide right and fade, more stagger)
                gsap.from(q('.purpose-title, .purpose-line'), {
                    x: -80,
                    opacity: 0,
                    stagger: 0.3,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: getTriggerConfig(0.75)
                });

                // Animate the right card (slide in from right)
                gsap.from(q('.purpose-card'), {
                    x: 100,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out",
                    scrollTrigger: getTriggerConfig(0.7)
                });

                // Inner card elements animation
                gsap.from(q('.purpose-step, .purpose-text, .purpose-dots'), {
                    y: 30,
                    opacity: 0,
                    stagger: 0.25,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: getTriggerConfig(0.65)
                });
            });
        }

    }, { scope: containerRef });

    return (
        <div id="about" ref={containerRef} className="w-full bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#eeff00] selection:text-black">
            {/* HERO SECTION */}
            <div className="hero-container min-h-screen flex flex-col justify-center px-6 md:px-20 relative pt-24 md:pt-32">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="hero-blob-1 absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#eeff00]/5 blur-[150px]"></div>
                    <div className="hero-blob-2 absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[150px]"></div>
                </div>

                <div className="z-10">
                    <div className="mb-4">
                        <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter leading-none cursor-default">
                            {renderGlowingText("WHO WE ARE", "glow-char-1")}
                        </h1>
                    </div>
                    <div className="mb-12">
                        <h2 className="text-3xl md:text-5xl lg:text-7xl font-light tracking-tight cursor-default">
                            {renderGlowingText("Established Jan 9th, 2025", "glow-char-2")}
                        </h2>
                    </div>
                    <div className="max-w-5xl">
                        <p className="text-xl md:text-3xl font-light leading-relaxed cursor-default">
                            {renderGlowingText("Dive into the realm of innovation with Helix, the vibrant Tech and AI club at RVSCET. Welcoming students from all backgrounds, we cultivate a supportive community where members delve into cutting-edge fields—from web development and cybersecurity to AI, robotics, and UX.", "glow-char-3")}
                        </p>
                    </div>
                </div>
            </div>

            {/* VISION & MISSION SECTION */}
            <div className="py-32 px-6 md:px-20 relative z-10">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12" style={{ perspective: '1200px' }}>
                    <div className="vm-card relative rounded-[2.5rem] p-[4px] overflow-hidden group">
                        {/* Spinning Gradient Border */}
                        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#eeff00_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Inner Card Background */}
                        <div className="relative h-full w-full bg-[#111] rounded-[calc(2.5rem-4px)] p-12 md:p-16 z-10 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-[#eeff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h3 className="text-[#eeff00] text-xl md:text-2xl font-mono mb-8 md:mb-12 uppercase tracking-widest flex items-center gap-4 relative z-20">
                                <span className="w-8 h-[1px] bg-[#eeff00]"></span>
                                Our Vision
                            </h3>
                            <p className="text-3xl md:text-5xl font-light leading-tight text-gray-300 relative z-20">
                                To develop a <span className="text-white font-medium">tech-driven community</span> that empowers students to become industry leaders.
                            </p>
                        </div>
                    </div>
                    <div className="vm-card relative rounded-[2.5rem] p-[4px] overflow-hidden group">
                        {/* Spinning Gradient Border */}
                        <div className="absolute inset-[-100%] animate-[spin_4s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#00000000_50%,#60a5fa_100%)] opacity-50 group-hover:opacity-100 transition-opacity duration-500"></div>

                        {/* Inner Card Background */}
                        <div className="relative h-full w-full bg-[#111] rounded-[calc(2.5rem-4px)] p-12 md:p-16 z-10 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <h3 className="text-blue-400 text-xl md:text-2xl font-mono mb-8 md:mb-12 uppercase tracking-widest flex items-center gap-4 relative z-20">
                                <span className="w-8 h-[1px] bg-blue-400"></span>
                                Our Mission
                            </h3>
                            <p className="text-3xl md:text-5xl font-light leading-tight text-gray-300 relative z-20">
                                Provide <span className="text-white font-medium">hands-on learning</span> and foster innovation to prepare you for the tech world.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* PURPOSE OF HELIX (HORIZONTAL SCROLL) */}
            <div className="overflow-hidden bg-[#080808] relative" ref={horizontalScrollRef}>
                {/* Persistent top header bar */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"></div>

                {/* Floating Section Label */}
                <div className="absolute top-8 left-6 md:left-20 z-20 flex items-center gap-5">
                    <div className="w-4 h-4 rounded-full bg-[#eeff00] animate-pulse"></div>
                    <span className="text-lg md:text-2xl font-bold uppercase tracking-[0.3em] text-white/60">The Purpose</span>
                </div>

                {/* Step Counter */}
                <div className="absolute top-8 right-6 md:right-20 z-20">
                    <span className="text-xs font-mono text-white/30 tracking-widest">SCROLL →</span>
                </div>

                {/* Background giant number watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
                    <span className="text-[40vw] font-black text-white/[0.015] leading-none select-none tracking-tighter">∞</span>
                </div>

                <div className="purpose-container flex h-screen items-center" ref={purposeContainerRef} style={{ width: '400vw' }}>
                    {[
                        {
                            title: 'Expand Knowledge',
                            text: 'Gain exposure to a wide array of technologies, including web development, cybersecurity, AI, robotics, and UX.',
                            icon: '🧠',
                            num: '01',
                            accent: '#eeff00',
                            accentRgb: '238, 255, 0',
                        },
                        {
                            title: 'Develop Skills',
                            text: 'Acquire hands-on experience through workshops and hackathons, building a strong portfolio of demonstrable skills.',
                            icon: '💻',
                            num: '02',
                            accent: '#60a5fa',
                            accentRgb: '96, 165, 250',
                        },
                        {
                            title: 'Solve Problems',
                            text: 'Tackle real-world challenges through innovative projects and collaborative problem-solving activities.',
                            icon: '🧩',
                            num: '03',
                            accent: '#c084fc',
                            accentRgb: '192, 132, 252',
                        },
                        {
                            title: 'Network & Grow',
                            text: 'Connect with peers and interact with industry professionals through guest lectures, boosting employability.',
                            icon: '🚀',
                            num: '04',
                            accent: '#34d399',
                            accentRgb: '52, 211, 153',
                        },
                    ].map((purpose, idx) => (
                        <div key={idx} className="purpose-item w-screen h-full flex items-center justify-center px-6 md:px-20">
                            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 md:gap-16 items-center">
                                {/* Left: Number + Title */}
                                <div className="space-y-6">
                                    {/* Big Number */}
                                    <div className="flex items-baseline gap-4">
                                        <span
                                            className="purpose-number text-[8rem] md:text-[12rem] font-black leading-none tracking-tighter"
                                            style={{ color: purpose.accent, opacity: 0.15 }}
                                        >
                                            {purpose.num}
                                        </span>
                                    </div>
                                    {/* Icon */}
                                    <div className="purpose-icon text-6xl md:text-7xl">{purpose.icon}</div>
                                    {/* Title */}
                                    <h3 className="purpose-title text-4xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight leading-none">
                                        {purpose.title}
                                    </h3>
                                    {/* Colored Line */}
                                    <div className="purpose-line h-1 w-20 rounded-full" style={{ backgroundColor: purpose.accent }}></div>
                                </div>

                                {/* Right: Card with spinning border */}
                                <div className="purpose-card relative rounded-[2rem] p-[3px] overflow-hidden group/card">
                                    {/* Spinning border */}
                                    <div
                                        className="absolute inset-[-100%] animate-[spin_5s_linear_infinite] opacity-30 group-hover/card:opacity-100 transition-opacity duration-700"
                                        style={{
                                            background: `conic-gradient(from 90deg at 50% 50%, transparent 50%, ${purpose.accent} 100%)`
                                        }}
                                    ></div>

                                    {/* Inner card */}
                                    <div className="relative z-10 bg-[#0c0c0c] rounded-[calc(2rem-3px)] p-10 md:p-14 overflow-hidden backdrop-blur-xl">
                                        {/* Top accent line */}
                                        <div
                                            className="absolute top-0 left-0 w-full h-[2px]"
                                            style={{
                                                background: `linear-gradient(to right, ${purpose.accent}, transparent)`
                                            }}
                                        ></div>

                                        {/* Glow */}
                                        <div
                                            className="absolute -top-20 -right-20 w-40 h-40 rounded-full blur-[80px] opacity-0 group-hover/card:opacity-20 transition-opacity duration-700"
                                            style={{ backgroundColor: purpose.accent }}
                                        ></div>

                                        {/* Step label */}
                                        <div className="purpose-step flex items-center gap-3 mb-8">
                                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: purpose.accent }}></div>
                                            <span className="text-xs font-mono uppercase tracking-[0.25em] text-white/40">
                                                Step {purpose.num} of 04
                                            </span>
                                        </div>

                                        <p className="purpose-text text-2xl md:text-3xl lg:text-4xl text-gray-300 font-light leading-relaxed group-hover/card:text-white transition-colors duration-500">
                                            {purpose.text}
                                        </p>

                                        {/* Bottom decorative dots */}
                                        <div className="purpose-dots flex gap-2 mt-10">
                                            {[0, 1, 2, 3].map(i => (
                                                <div
                                                    key={i}
                                                    className="w-2 h-2 rounded-full transition-all duration-300"
                                                    style={{
                                                        backgroundColor: i === idx ? purpose.accent : 'rgba(255,255,255,0.1)',
                                                        boxShadow: i === idx ? `0 0 10px ${purpose.accent}` : 'none'
                                                    }}
                                                ></div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom progress line */}
                <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"></div>
            </div>


        </div>
    );
};

export default AboutSection;
