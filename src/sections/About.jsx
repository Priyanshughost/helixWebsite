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
        });

        // Horizontal Scroll for Purpose
        const purposeItems = gsap.utils.toArray('.purpose-item', purposeContainerRef.current);
        
        if (purposeContainerRef.current && purposeItems.length > 0) {
            // Animate each item horizontally by -100% * (number of items - 1)
            // This is the most reliable GSAP horizontal scroll pattern
            gsap.to(purposeItems, {
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
        }

    }, { scope: containerRef });

    return (
        <div ref={containerRef} className="w-full bg-[#0a0a0a] text-white font-sans overflow-x-hidden selection:bg-[#eeff00] selection:text-black">
            {/* HERO SECTION */}
            <div className="hero-container min-h-screen flex flex-col justify-center px-6 md:px-20 relative pt-24 md:pt-32">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] rounded-full bg-[#eeff00]/5 blur-[150px]"></div>
                    <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[150px]"></div>
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
                    <div className="vm-card bg-[#111] border border-white/10 rounded-[2.5rem] p-12 md:p-16 hover:border-[#eeff00]/50 transition-colors duration-500 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#eeff00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h3 className="text-[#eeff00] text-xl md:text-2xl font-mono mb-8 md:mb-12 uppercase tracking-widest flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-[#eeff00]"></span>
                            Our Vision
                        </h3>
                        <p className="text-3xl md:text-5xl font-light leading-tight text-gray-300">
                            To develop a <span className="text-white font-medium">tech-driven community</span> that empowers students to become industry leaders.
                        </p>
                    </div>
                    <div className="vm-card bg-[#111] border border-white/10 rounded-[2.5rem] p-12 md:p-16 hover:border-[#eeff00]/50 transition-colors duration-500 relative overflow-hidden group">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <h3 className="text-blue-400 text-xl md:text-2xl font-mono mb-8 md:mb-12 uppercase tracking-widest flex items-center gap-4">
                            <span className="w-8 h-[1px] bg-blue-400"></span>
                            Our Mission
                        </h3>
                        <p className="text-3xl md:text-5xl font-light leading-tight text-gray-300">
                            Provide <span className="text-white font-medium">hands-on learning</span> and foster innovation to prepare you for the tech world.
                        </p>
                    </div>
                </div>
            </div>

            {/* PURPOSE OF HELIX (HORIZONTAL SCROLL) */}
            <div className="overflow-hidden bg-[#111] relative" ref={horizontalScrollRef}>
                <div className="absolute top-20 left-6 md:left-20 z-10 w-full max-w-7xl pointer-events-none">
                    <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter text-white/10 uppercase">
                        The Purpose
                    </h2>
                </div>

                <div className="purpose-container flex h-screen items-center" ref={purposeContainerRef} style={{ width: '400vw' }}>
                    {[
                        { title: 'Expand Knowledge', text: 'Gain exposure to a wide array of technologies, including web development, cybersecurity, AI, robotics, and UX.', icon: '🧠' },
                        { title: 'Develop Skills', text: 'Acquire hands-on experience through workshops and hackathons, building a strong portfolio of demonstrable skills.', icon: '💻' },
                        { title: 'Solve Problems', text: 'Tackle real-world challenges through innovative projects and collaborative problem-solving activities.', icon: '🧩' },
                        { title: 'Network & Grow', text: 'Connect with peers and interact with industry professionals through guest lectures, boosting employability.', icon: '🚀' },
                    ].map((purpose, idx) => (
                        <div key={idx} className="purpose-item w-screen h-full flex items-center justify-center px-6 md:px-20 pt-20">
                            <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                                <div>
                                    <div className="text-[6rem] md:text-[8rem] lg:text-[10rem] mb-8 leading-none opacity-80">{purpose.icon}</div>
                                    <h3 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tight">{purpose.title}</h3>
                                </div>
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-[2.5rem] p-10 md:p-16 relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#eeff00] to-transparent"></div>
                                    <p className="text-2xl md:text-4xl text-gray-300 font-light leading-relaxed">{purpose.text}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>


        </div>
    );
};

export default AboutSection;
