"use client";

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const achievements = [
    { title: "Top 20 Finalists at Hackatron 25", org: "BIT Sindri", date: "May 11-12, 2025", desc: "Out of 1,050+ participants, the team was selected as one of the Top 20 finalists in this 36-hour offline hackathon." },
    { title: "NPTEL Star Award Winner", org: "Top 7 IITs", date: "July 20, 2025", desc: "Prayog Priyanshu was honored as an NPTEL Star Awardee for consistent excellence and outstanding performance in Machine Learning." },
    { title: "Techfest IIT Bombay: Zonals Winner", org: "NIT Jamshedpur", date: "Nov 2, 2025", desc: "Neha Kumari (First Year) secured Rank 1 in the Codecode competition, highlighting the technical talent of RVSCET." },
    { title: "SIH 2025 Finalists", org: "MoE & AICTE", date: "Dec 8-9, 2025", desc: "Team CodeXtream represented RVSCET at the Smart India Hackathon Grand Finale among lakhs of national participants." },
    { title: "Winners of Xplore XII", org: "Netaji Subhas University", date: "Dec 18-20, 2025", desc: "Aadarsh Shaheb Singh secured Winner in HashCode (DSA), and Prayog Priyanshu emerged as Winner in Promptathon (AI)." },
    { title: "Winners of Hack Horizon 2025", org: "Arka Jain University", date: "Apr 11-12, 2025", desc: "Team Helix achieved an outstanding victory at this national-level 24-hour hackathon in collaboration with GDG On Campus." },
    { title: "Runner-up of Eklavya Techfest 2025", org: "DSPMU Ranchi", date: "Apr 23-24, 2025", desc: "Team Helix secured the runner-up position out of 75+ teams in collaboration with GDG Ranchi." }
];

function HallOfFame() {
    const containerRef = useRef(null);
    const rightPanelRef = useRef(null);
    const contentRef = useRef(null);
    const itemRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(0);

    // 1. Handle dynamic crossfading of the sticky content
    useGSAP(() => {
        if (!contentRef.current) return;
        
        gsap.fromTo(contentRef.current,
            { opacity: 0, y: 15, filter: 'blur(8px)' },
            { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.6, ease: 'power3.out' }
        );
    }, { scope: containerRef, dependencies: [activeIndex] });

    // 2. Map scroll positions to the active index
    useGSAP(() => {
        const items = itemRefs.current;
        
        items.forEach((item, i) => {
            if (!item) return;
            
            ScrollTrigger.create({
                trigger: item,
                start: 'center center+=10%',
                end: 'center center-=10%',
                onEnter: () => setActiveIndex(i),
                onEnterBack: () => setActiveIndex(i),
            });
        });

        gsap.to('.progress-line', {
            scaleY: 1,
            ease: 'none',
            scrollTrigger: {
                trigger: rightPanelRef.current,
                start: 'top center',
                end: 'bottom center',
                scrub: true,
            }
        });

    }, { scope: containerRef });

    const handleItemClick = (index) => {
        if (itemRefs.current[index]) {
            itemRefs.current[index].scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    };

    return (
        <section 
            id="hall-of-fame" 
            ref={containerRef} 
            className="relative w-full bg-[#050505] text-white selection:bg-[#eeff00] selection:text-black font-sans"
        >
            {/* BUG FIX: Removed overflow-hidden from this wrapper so the child can be sticky */}
            <div className="flex flex-col lg:flex-row w-full max-w-full">
                
                {/* LEFT PANEL: STICKY HERO DISPLAY */}
                <div className="relative lg:w-1/2 lg:sticky lg:top-0 h-[45vh] lg:h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24 border-b lg:border-b-0 lg:border-r border-white/5 z-10 bg-[#050505]">
                    
                    {/* Ambient Glow - contained properly so it doesn't overflow the page */}
                    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 z-0">
                        <div className="absolute top-1/2 -left-1/4 w-[60vh] h-[60vh] -translate-y-1/2 rounded-full bg-[#eeff00] blur-[120px] transition-all duration-700 ease-in-out"></div>
                    </div>

                    <div ref={contentRef} className="relative z-10 will-change-transform">
                        <div className="flex items-center gap-4 mb-6">
                            <span className="w-8 h-[1px] bg-[#eeff00]"></span>
                            <span className="text-[#eeff00] font-mono tracking-[0.2em] text-xs uppercase">
                                Entry {String(activeIndex + 1).padStart(2, '0')}
                            </span>
                        </div>
                        
                        <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tighter mb-8 leading-[1.1]">
                            {achievements[activeIndex].title}
                        </h2>
                        
                        <div className="flex flex-wrap gap-3 text-xs md:text-sm font-mono text-gray-400 uppercase tracking-wider mb-8">
                            <span className="border border-white/10 rounded-full px-4 py-1.5 bg-white/[0.02] backdrop-blur-md">
                                {achievements[activeIndex].org}
                            </span>
                            <span className="border border-white/10 rounded-full px-4 py-1.5 bg-white/[0.02] backdrop-blur-md">
                                {achievements[activeIndex].date}
                            </span>
                        </div>
                        
                        <p className="text-lg md:text-2xl text-gray-400 font-light leading-relaxed max-w-xl">
                            {achievements[activeIndex].desc}
                        </p>
                    </div>
                </div>

                {/* RIGHT PANEL: SCROLLING INDEX */}
                <div ref={rightPanelRef} className="lg:w-1/2 relative bg-[#0a0a0a]">
                    {/* Center Progress Line */}
                    <div className="absolute left-8 lg:left-24 top-0 bottom-0 w-[1px] bg-white/5 z-0 hidden lg:block">
                        <div className="progress-line w-full h-full bg-[#eeff00] origin-top scale-y-0"></div>
                    </div>

                    <div className="py-[10vh] lg:py-[50vh] px-8 md:px-16 lg:px-32 flex flex-col gap-12 lg:gap-32 relative z-10">
                        <div className="lg:hidden text-[#eeff00] font-mono tracking-widest text-xs uppercase mb-8">
                            Scroll to explore ↓
                        </div>

                        {achievements.map((item, i) => (
                            <div 
                                key={i} 
                                ref={el => itemRefs.current[i] = el}
                                onClick={() => handleItemClick(i)}
                                className={`group flex flex-col lg:flex-row lg:items-center gap-4 lg:gap-10 cursor-pointer transition-all duration-700 ease-out will-change-transform ${
                                    activeIndex === i 
                                        ? 'opacity-100 scale-100 pl-4 lg:pl-8' 
                                        : 'opacity-30 hover:opacity-60 scale-95'
                                }`}
                            >
                                <div 
                                    className="text-5xl lg:text-7xl font-black tabular-nums transition-colors duration-500"
                                    style={{ 
                                        WebkitTextStroke: activeIndex === i ? '0px transparent' : '1px rgba(255,255,255,0.4)',
                                        color: activeIndex === i ? '#eeff00' : 'transparent'
                                    }}
                                >
                                    {String(i + 1).padStart(2, '0')}
                                </div>
                                
                                <div>
                                    <h3 className={`text-2xl lg:text-4xl font-medium tracking-tight transition-colors duration-500 ${activeIndex === i ? 'text-white' : 'text-gray-400'}`}>
                                        {item.title}
                                    </h3>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}

export default HallOfFame;
