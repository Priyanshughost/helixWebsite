import React, { useRef } from 'react';
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
    const sectionRef = useRef(null);

    useGSAP(() => {
        const items = gsap.utils.toArray('.fame-item');

        // 1. Heading — dramatic 3D flip entrance
        gsap.fromTo('.fame-heading',
            {
                rotationX: -90,
                yPercent: 80,
                opacity: 0,
                transformPerspective: 1200,
                transformOrigin: 'center bottom'
            },
            {
                rotationX: 0,
                yPercent: 0,
                opacity: 1,
                duration: 2,
                ease: 'expo.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%',
                    toggleActions: 'play reverse play reverse',
                }
            }
        );

        // 2. Each card — 3D unfold from below, like cards flipping up from a table
        items.forEach((item, i) => {
            // Initial hidden state
            gsap.set(item, {
                transformPerspective: 1500,
                transformOrigin: 'center bottom',
            });

            // Entrance: direction-aware 3D flip
            // Scroll DOWN → cards flip up from below
            // Scroll UP   → cards flip down from above
            const enterFrom = { rotationX: -70, y: 150, scale: 0.85, opacity: 0, z: -200 };
            const enterBackFrom = { rotationX: 70, y: -150, scale: 0.85, opacity: 0, z: -200 };
            const enterTo = { rotationX: 0, y: 0, scale: 1, opacity: 1, z: 0, duration: 1.6, ease: 'expo.out' };

            // Start hidden
            gsap.set(item, enterFrom);

            ScrollTrigger.create({
                trigger: item,
                start: 'top 95%',
                end: 'bottom 5%',
                onEnter: () => {
                    // Scrolling DOWN — flip up from below
                    gsap.set(item, { transformOrigin: 'center bottom' });
                    gsap.fromTo(item, enterFrom, { ...enterTo, delay: i * 0.05 });
                },
                onLeave: () => {
                    gsap.to(item, { opacity: 0, y: -80, duration: 0.4, ease: 'power2.in' });
                },
                onEnterBack: () => {
                    // Scrolling UP — flip down from above
                    gsap.set(item, { transformOrigin: 'center top' });
                    gsap.fromTo(item, enterBackFrom, { ...enterTo, delay: i * 0.05 });
                },
                onLeaveBack: () => {
                    gsap.to(item, { opacity: 0, y: 80, duration: 0.4, ease: 'power2.in' });
                },
            });

            // 3. Continuous 3D scrub — subtle tilt as you scroll past
            const leftCol = item.querySelector('.fame-left');
            const rightCol = item.querySelector('.fame-right');

            gsap.fromTo(item,
                { rotationX: 3, y: 30 },
                {
                    rotationX: -3,
                    y: -30,
                    ease: 'none',
                    force3D: true,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: true,
                    }
                }
            );

            // Parallax between left and right columns
            if (leftCol && rightCol) {
                gsap.fromTo(leftCol,
                    { yPercent: 20 },
                    {
                        yPercent: -20,
                        ease: 'none',
                        force3D: true,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );

                gsap.fromTo(rightCol,
                    { yPercent: -15 },
                    {
                        yPercent: 15,
                        ease: 'none',
                        force3D: true,
                        scrollTrigger: {
                            trigger: item,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            }
        });

        // 4. Counter numbers — each index number scales in
        const counters = gsap.utils.toArray('.fame-counter');
        counters.forEach((counter) => {
            gsap.fromTo(counter,
                { scale: 0, rotationZ: -15, opacity: 0 },
                {
                    scale: 1,
                    rotationZ: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'back.out(2)',
                    scrollTrigger: {
                        trigger: counter,
                        start: 'top 90%',
                        toggleActions: 'play reverse play reverse',
                    }
                }
            );
        });

    }, { scope: sectionRef });

    return (
        <section
            id="hall-of-fame"
            ref={sectionRef}
            className="w-full bg-black text-white py-24 md:py-32 px-6 md:px-12 lg:px-20"
            style={{ perspective: '1500px' }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="fame-heading mb-24 md:mb-32">
                    <h2 className="text-5xl md:text-8xl lg:text-9xl font-normal tracking-tight text-[#eeff00] mb-6">
                        Hall of Fame
                    </h2>
                    <p className="text-lg md:text-2xl text-gray-400 max-w-2xl font-light">
                        Celebrating the outstanding achievements of Helix members on the national stage.
                    </p>
                </div>

                <div className="space-y-16 md:space-y-20">
                    {achievements.map((item, i) => (
                        <div
                            key={i}
                            className="fame-item border-b border-white/10 pb-12 md:pb-16 flex flex-col md:flex-row md:items-start gap-6 md:gap-12 will-change-transform"
                            style={{ transformStyle: 'preserve-3d' }}
                        >
                            {/* Big index number */}
                            <div className="fame-counter text-[#eeff00] text-6xl md:text-8xl font-bold leading-none md:w-24 shrink-0 tabular-nums select-none" style={{ transformOrigin: 'center center' }}>
                                {String(i + 1).padStart(2, '0')}
                            </div>

                            {/* Left: Title + meta */}
                            <div className="fame-left md:w-2/5 shrink-0">
                                <h3 className="text-2xl md:text-4xl font-medium tracking-tight leading-tight mb-4">{item.title}</h3>
                                <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-gray-500 uppercase tracking-widest">
                                    <span>{item.date}</span>
                                    <span>{item.org}</span>
                                </div>
                            </div>

                            {/* Right: Description */}
                            <div className="fame-right md:w-2/5">
                                <p className="text-lg md:text-xl text-gray-300 font-light leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default HallOfFame;
