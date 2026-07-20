import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import vp from '../assets/sumitGhosh.jpeg';
import president from '../assets/Satish.jpeg';
import Aman from '../assets/Aman.jpeg'
import Priyanshu from '../assets/Priyanshu.jpeg'
import Abhijeet from '../assets/Abhijeet.jpeg'
import Rohit from '../assets/rohit.png'

// ── Tech Team Photos ──────────────────────────────────────────────
// Uncomment each line and point it to the right file once you have the photos.
// import priyanshu from '../assets/priyanshu.jpeg';
// import aman      from '../assets/aman.jpeg';
// import abhijeet  from '../assets/abhijeet.jpeg';
// import rohit     from '../assets/rohit.jpeg';
// ─────────────────────────────────────────────────────────────────

gsap.registerPlugin(ScrollTrigger, SplitText);

const teamMembers = [
    {
        id: 4,
        roleLabel: "President",
        image: president,
        quote: "\"When we initialized Helix exactly one year ago, it wasn't just another club, it was a movement. We wanted to build a 'Source Code' for innovation at RVSCET.\"",
        name: "Satish Verma",
        title: "President, Helix",
        social: { platform: "LinkedIn", url: "#" }
    },
    {
        id: 5,
        roleLabel: "Vice President",
        image: vp,
        quote: "\"Technology evolves every second, and at Helix, our mission is to ensure that our students stay ahead of the curve. Helix is your sandbox. Experiment, fail, learn, and innovate.\"",
        name: "Sumit Ghosh",
        title: "Vice President, Helix",
        social: { platform: "LinkedIn", url: "https://www.linkedin.com/in/sumitgh0sh?utm_source=share_via&utm_content=profile&utm_medium=member_android" }
    }
];

const techTeam = [
    {
        id: 1,
        roleLabel: "Co-head, Tech",
        name: "Priyanshu Ghosh",
        image: Priyanshu, // replace null with: priyanshu  (after uncommenting the import above)
        social: { platform: "LinkedIn", url: "#" }
    },
    {
        id: 2,
        roleLabel: "Tech Coordinator",
        name: "Aman Kumar",
        image: Aman, // replace null with: aman
        social: { platform: "LinkedIn", url: "#" }
    },
    {
        id: 3,
        roleLabel: "Tech Coordinator",
        name: "Abhijeet Ghosh",
        image: Abhijeet, // replace null with: abhijeet
        social: { platform: "LinkedIn", url: "#" }
    },
    {
        id: 4,
        roleLabel: "Tech Coordinator",
        name: "Rohit Chandra",
        image: Rohit, // replace null with: rohit
        social: { platform: "LinkedIn", url: "#" }
    }
];

export default function TeamSection() {
    const containerRef = useRef(null);

    const headingTriggerRef = useRef(null);
    const text1SpanRef = useRef(null);
    const text2SpanRef = useRef(null);
    const lineRef = useRef(null);
    const split1Ref = useRef(null);
    const split2Ref = useRef(null);

    // Tech team section refs
    const techSectionRef = useRef(null);
    const techLabelRef = useRef(null);
    const techHeadingRef = useRef(null);
    const techRuleRef = useRef(null);

    // Cache the hover scale value so we don't trigger reflows on hover
    const lineTargetScale = useRef(1);

    const { contextSafe } = useGSAP(() => {
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isMobile } = context.conditions;

            // --- HEADING SETUP ---
            const split1 = new SplitText(text1SpanRef.current, { type: 'chars' });
            const split2 = new SplitText(text2SpanRef.current, { type: 'chars' });

            split1Ref.current = split1;
            split2Ref.current = split2;

            gsap.set(split2.chars, { yPercent: 120 });
            gsap.set(lineRef.current, { width: text1SpanRef.current.offsetWidth });

            // Pre-calculate the scale multiplier for the hover effect
            if (text1SpanRef.current && text2SpanRef.current) {
                lineTargetScale.current = text2SpanRef.current.offsetWidth / text1SpanRef.current.offsetWidth;
            }

            gsap.fromTo(split1.chars,
                { yPercent: 120 },
                {
                    yPercent: 0,
                    duration: 1,
                    stagger: 0.04,
                    ease: 'expo.out',
                    scrollTrigger: {
                        trigger: headingTriggerRef.current,
                        start: 'top 85%',
                    }
                }
            );

            // --- TEAM MEMBERS ANIMATIONS ---
            const memberCards = gsap.utils.toArray('.team-member-card');

            memberCards.forEach((card) => {
                const q = gsap.utils.selector(card);
                const revealTargets = q('.text-reveal-target');
                const imgWrapper = q('.image-reveal-wrapper');
                const imgTarget = q('.team-image');
                const rightColumn = q('.right-column-parallax');

                const cardStart = isMobile ? "top 85%" : "top 90%";

                // 1. The Entrance Reveal (Runs Once)
                const revealTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: cardStart,
                        once: true,
                    }
                });

                revealTl.fromTo(imgWrapper,
                    { clipPath: "inset(25% 20% 0% 20% round 100px)", yPercent: 15 },
                    { clipPath: "inset(0% 0% 0% 0% round 0px)", yPercent: 0, duration: 2.5, ease: "expo.out" },
                    0
                )
                    .fromTo(imgTarget,
                        { scale: 1.5 },
                        { scale: 1, duration: 2.5, ease: "expo.out" },
                        0
                    )
                    .fromTo(revealTargets,
                        { y: '110%' },
                        { y: '0%', duration: 1, stagger: 0.15, ease: 'power4.out' },
                        0.2
                    );

                // 2. The Continuous Parallax (Scrubbed)
                const scrubTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: card,
                        start: "top bottom",
                        end: "bottom top",
                        scrub: true,
                    }
                });

                scrubTl.fromTo(imgTarget,
                    { yPercent: -15 },
                    { yPercent: 15, ease: "none", force3D: true },
                    0
                );

                scrubTl.fromTo(rightColumn,
                    { y: isMobile ? 20 : 50 },
                    { y: isMobile ? -20 : -50, ease: "none", force3D: true },
                    0
                );
            });

            // --- TECH TEAM ANIMATIONS ---

            // 1. Heading reveal
            const techHeadingTargets = [
                techLabelRef.current,
                techHeadingRef.current,
                techRuleRef.current,
            ].filter(Boolean);

            gsap.fromTo(
                techHeadingTargets,
                { y: '110%', opacity: 0 },
                {
                    y: '0%',
                    opacity: 1,
                    duration: 1,
                    stagger: 0.12,
                    ease: 'power4.out',
                    scrollTrigger: {
                        trigger: techSectionRef.current,
                        start: 'top 85%',
                        once: true,
                    }
                }
            );

            // 2. Per-card animations
            const techCards = gsap.utils.toArray('.tech-card');

            techCards.forEach((card, i) => {
                const q = gsap.utils.selector(card);
                const placeholder = q('.tech-placeholder');
                const textTargets = q('.tech-text-reveal');
                const techImg = q('.tech-image'); // Target the actual image

                // Entrance — staggered so cards cascade in
                const entranceTl = gsap.timeline({
                    scrollTrigger: {
                        trigger: techSectionRef.current,
                        start: 'top 80%',
                        once: true,
                    }
                });

                entranceTl
                    .fromTo(
                        placeholder,
                        {
                            clipPath: 'inset(20% 15% 0% 15% round 80px)',
                            yPercent: 12, // Entry slide up (runs once)
                            scale: 1.08,
                        },
                        {
                            clipPath: 'inset(0% 0% 0% 0% round 0px)',
                            yPercent: 0,
                            scale: 1,
                            duration: 2,
                            delay: i * 0.12,
                            ease: 'expo.out',
                        },
                        0
                    )
                    .fromTo(
                        textTargets,
                        { y: '110%' },
                        {
                            y: '0%',
                            duration: 0.9,
                            stagger: 0.1,
                            ease: 'power4.out',
                            delay: i * 0.12,
                        },
                        0.25
                    );

                // FIX: Continuous parallax scrub is now applied to the inner image (techImg), 
                // leaving the container strictly locked in place above the text!
                gsap.fromTo(
                    techImg,
                    { yPercent: -10 },
                    {
                        yPercent: 10,
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
        });

        return () => {
            if (split1Ref.current) split1Ref.current.revert();
            if (split2Ref.current) split2Ref.current.revert();
        };
    }, { scope: containerRef });

    // --- HOVER INTERACTIONS ---
    const handleMouseEnter = contextSafe(() => {
        if (!split1Ref.current || !split2Ref.current) return;

        gsap.to(split1Ref.current.chars, { yPercent: -120, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });
        gsap.to(split2Ref.current.chars, { yPercent: 0, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });

        if (lineRef.current) {
            gsap.to(lineRef.current, { scaleX: lineTargetScale.current, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
        }
    });

    const handleMouseLeave = contextSafe(() => {
        if (!split1Ref.current || !split2Ref.current) return;

        gsap.to(split1Ref.current.chars, { yPercent: 0, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });
        gsap.to(split2Ref.current.chars, { yPercent: 120, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });

        if (lineRef.current) {
            gsap.to(lineRef.current, { scaleX: 1, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
        }
    });

    return (
        <section id="team" ref={containerRef} className="w-full bg-white pb-36 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

                <div ref={headingTriggerRef} className="flex justify-start items-center py-20 lg:py-28">
                    <div
                        className="relative inline-flex flex-col items-start cursor-pointer"
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div className="relative overflow-hidden mb-3 md:mb-6 w-full flex justify-start">
                            <h2 className="relative text-[12vw] sm:text-6xl md:text-[4rem] lg:text-[5rem] font-normal tracking-tight whitespace-nowrap m-0 leading-[1.1] block w-full text-left">
                                <span ref={text1SpanRef} className="inline-block">Meet Our Team</span>
                            </h2>

                            <h2 className="absolute top-0 left-0 text-[12vw] sm:text-6xl md:text-[4rem] lg:text-[5rem] font-normal tracking-tight whitespace-nowrap m-0 leading-[1.1] w-full text-left block">
                                <span ref={text2SpanRef} className="inline-block">The Backbone</span>
                            </h2>
                        </div>

                        <div
                            ref={lineRef}
                            className="absolute bottom-0 h-[1.5px] md:h-0.5 bg-black origin-left"
                            style={{ left: 0 }}
                        />
                    </div>
                </div>

                <div className="mt-12">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="team-member-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-32 last:mb-0 relative"
                        >

                            <div className="hidden lg:block lg:col-span-2">
                                <div className="sticky top-10">
                                    <div className="overflow-hidden pb-2">
                                        <span className="text-reveal-target block text-xl tracking-tight text-gray-900">
                                            {member.roleLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="lg:col-span-6 w-full h-[60vh] lg:h-[85vh] bg-[#f4f4f4] relative">
                                <div className="image-reveal-wrapper w-full h-full relative overflow-hidden">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="team-image absolute top-[-15%] left-0 w-full h-[130%] object-cover object-center grayscale hover:grayscale-0 transition-colors duration-700"
                                    />
                                </div>
                            </div>

                            <div className="lg:col-span-4 flex flex-col justify-start self-start lg:pl-8 right-column-parallax">
                                <div className="overflow-hidden lg:hidden mb-6 pb-2">
                                    <span className="text-reveal-target block text-lg text-gray-500">
                                        {member.roleLabel}
                                    </span>
                                </div>

                                <div className="overflow-hidden mb-16 max-w-md pb-2">
                                    <p className="text-reveal-target block m-0 text-2xl lg:text-[28px] font-light leading-[1.3] tracking-tight text-gray-900">
                                        {member.quote}
                                    </p>
                                </div>

                                <div>
                                    <div className="overflow-hidden pb-1">
                                        <h3 className="text-reveal-target block m-0 text-xl font-normal text-gray-900">
                                            {member.name}
                                        </h3>
                                    </div>

                                    <div className="overflow-hidden mb-8 pb-1">
                                        <p className="text-reveal-target block m-0 text-xl font-light text-gray-400">
                                            {member.title}
                                        </p>
                                    </div>

                                    <div className="overflow-hidden pt-2 pr-2">
                                        <a
                                            href={member.social.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-reveal-target inline-flex items-center gap-1 group text-lg text-gray-900 underline decoration-1 underline-offset-[6px] hover:text-gray-500 transition-colors"
                                        >
                                            {member.social.platform}
                                            <span className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                                                ↗
                                            </span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* ── Tech Team ── */}
                <div ref={techSectionRef} className="mt-40">

                    <div className="mb-16 overflow-hidden">
                        <div className="overflow-hidden">
                            <p ref={techLabelRef} className="text-sm tracking-[0.2em] uppercase text-gray-400 m-0">
                                Department
                            </p>
                        </div>
                        <div className="overflow-hidden mt-3">
                            <h3 ref={techHeadingRef} className="text-4xl md:text-5xl font-normal tracking-tight text-gray-900 m-0">
                                Tech Team
                            </h3>
                        </div>
                        <div className="overflow-hidden mt-4">
                            <div ref={techRuleRef} className="h-px bg-black w-16" />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                        {techTeam.map((member) => (
                            <div
                                key={member.id}
                                className="tech-card group relative flex flex-col"
                            >
                                {/* Photo Container */}
                                <div className="tech-placeholder w-full aspect-[3/4] bg-[#f4f4f4] overflow-hidden mb-5 relative">
                                    {member.image ? (
                                        /* Added tech-image class, set height to 120% and offset top by -10% so the image has room to move inside the wrapper */
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="tech-image absolute w-full h-[120%] -top-[10%] object-cover object-top grayscale group-hover:grayscale-0 transition-[filter] duration-700"
                                        />
                                    ) : (
                                        /* Same treatment applied to placeholder */
                                        <div className="tech-image absolute w-full h-[120%] -top-[10%] flex items-end p-5">
                                            <span className="text-7xl font-light text-gray-200 leading-none select-none">
                                                {member.name.charAt(0)}
                                            </span>
                                        </div>
                                    )}
                                    {/* Hover overlay */}
                                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-[0.04] transition-opacity duration-500" />
                                </div>

                                {/* Text section stays completely static now */}
                                <div className="overflow-hidden pb-1">
                                    <p className="tech-text-reveal m-0 text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">
                                        {member.roleLabel}
                                    </p>
                                </div>
                                <div className="overflow-hidden pb-1">
                                    <h4 className="tech-text-reveal m-0 text-lg font-normal text-gray-900 leading-snug">
                                        {member.name}
                                    </h4>
                                </div>
                                <div className="overflow-hidden pt-3">
                                    <a
                                        href={member.social.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="tech-text-reveal inline-flex items-center gap-1 group/link text-sm text-gray-900 underline decoration-1 underline-offset-4 hover:text-gray-500 transition-colors"
                                    >
                                        {member.social.platform}
                                        <span className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform duration-300">
                                            ↗
                                        </span>
                                    </a>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </section>
    );
}