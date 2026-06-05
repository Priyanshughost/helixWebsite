import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const teamMembers = [
    {
        id: 1,
        roleLabel: "President",
        image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1287&auto=format&fit=crop",
        quote: "\"We've streamlined the outdated and layered agency model to give you direct access to the best global talent. No wasted time, no empty promises. Just impactful results.\"",
        name: "Guillaume Hamon",
        title: "Founding Partner",
        social: {
            platform: "LinkedIn",
            url: "#"
        }
    },
    {
        id: 2,
        roleLabel: "Vice President",
        image: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=1287&auto=format&fit=crop",
        quote: "\"Our partnership model ensures that every project is handled by specialists who treat your brand as their own.\"",
        name: "Jane Doe",
        title: "Design Partner",
        social: {
            platform: "LinkedIn",
            url: "#"
        }
    }
];

export default function TeamSection() {
    const containerRef = useRef(null);

    // Refs for the animated heading
    const headingTriggerRef = useRef(null);
    const text1SpanRef = useRef(null);
    const text2SpanRef = useRef(null);
    const lineRef = useRef(null);
    const split1Ref = useRef(null);
    const split2Ref = useRef(null);

    // GSAP Setup
    const { contextSafe } = useGSAP(() => {
        let mm = gsap.matchMedia();

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            let { isMobile } = context.conditions;

            // --- HEADING ANIMATION ---
            const split1 = new SplitText(text1SpanRef.current, { type: 'chars' });
            const split2 = new SplitText(text2SpanRef.current, { type: 'chars' });

            split1Ref.current = split1;
            split2Ref.current = split2;

            gsap.set(split2.chars, { yPercent: 120 });
            gsap.set(lineRef.current, { width: text1SpanRef.current.offsetWidth });

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

            // --- TEAM MEMBERS ANIMATIONS (Reveal + Parallax) ---
            const memberCards = gsap.utils.toArray('.team-member-card');

            memberCards.forEach((card) => {
                const revealTargets = card.querySelectorAll('.text-reveal-target');
                const imgWrapper = card.querySelector('.image-reveal-wrapper');
                const imgTarget = card.querySelector('.team-image');
                const rightColumn = card.querySelector('.right-column-parallax');

                // 1. Image Wrapper Reveal (Runs Once)
                gsap.fromTo(
                    imgWrapper,
                    {
                        clipPath: "inset(25% 20% 0% 20% round 100px)",
                        yPercent: 15,
                    },
                    {
                        clipPath: "inset(0% 0% 0% 0% round 0px)",
                        yPercent: 0,
                        duration: 2.5,
                        ease: "expo.out",
                        scrollTrigger: {
                            trigger: card,
                            start: isMobile ? "top 80%" : "top 95%",
                            once: true,
                        }
                    }
                );

                // 2. Image Parallax (Continuous Scrub)
                gsap.fromTo(
                    imgTarget,
                    { yPercent: -15 },
                    {
                        yPercent: 15,
                        ease: "none",
                        scrollTrigger: {
                            trigger: imgWrapper,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        }
                    }
                );

                // 3. Text Column Parallax (Continuous Scrub)
                gsap.fromTo(
                    rightColumn,
                    { y: isMobile ? 20 : 50 },
                    {
                        y: isMobile ? -20 : -50,
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true,
                        }
                    }
                );

                // 4. Text Content Reveal (Runs Once)
                gsap.fromTo(revealTargets,
                    { y: '110%' },
                    {
                        y: '0%',
                        duration: 1,
                        stagger: 0.2,
                        ease: 'power4.out',
                        scrollTrigger: {
                            trigger: card,
                            start: 'top 60%',
                            once: true // Added once: true so it doesn't re-trigger abruptly during parallax
                        }
                    }
                );
            });
        });

        return () => {
            mm.revert();
            if (split1Ref.current) split1Ref.current.revert();
            if (split2Ref.current) split2Ref.current.revert();
        };
    }, { scope: containerRef });

    // Hover Interaction Handlers
    const handleMouseEnter = contextSafe(() => {
        if (!split1Ref.current || !split2Ref.current) return;

        gsap.to(split1Ref.current.chars, { yPercent: -120, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });
        gsap.to(split2Ref.current.chars, { yPercent: 0, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });

        if (text1SpanRef.current && text2SpanRef.current && lineRef.current) {
            const targetScale = text2SpanRef.current.offsetWidth / text1SpanRef.current.offsetWidth;
            gsap.to(lineRef.current, { scaleX: targetScale, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
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
        <section ref={containerRef} className="w-full bg-white pb-36 overflow-x-hidden">
            <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16">

                {/* Animated Heading Section */}
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
                            className="absolute bottom-0 h-[1.5px] md:h-0.5 bg-black origin-left will-change-transform"
                            style={{ left: 0 }}
                        />
                    </div>
                </div>

                {/* Dynamic Sticky Team Layout */}
                <div className="mt-12">
                    {teamMembers.map((member) => (
                        <div
                            key={member.id}
                            className="team-member-card grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-32 last:mb-0 relative"
                        >

                            {/* Left Column: Dynamically Moving Label (Sticky) */}
                            <div className="hidden lg:block lg:col-span-2">
                                <div className="sticky top-10">
                                    <div className="overflow-hidden">
                                        <span className="text-reveal-target block text-xl tracking-tight text-gray-900">
                                            {member.roleLabel}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Center Column: Portrait Image with Parallax Wrapper */}
                            <div className="lg:col-span-6 w-full h-[60vh] lg:h-[85vh] bg-[#f4f4f4] relative">
                                {/* The wrapper handles the clip-path intro */}
                                <div className="image-reveal-wrapper w-full h-full relative overflow-hidden">
                                    {/* The image handles the continuous scrub parallax */}
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        // Notice the height is 130% and positioned top-[-15%] to allow room for the parallax travel
                                        className="team-image absolute top-[-15%] left-0 w-full h-[130%] object-cover object-center grayscale hover:grayscale-0 transition-colors duration-700 will-change-transform"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Quote & Info (Now with Parallax Wrapper) */}
                            <div className="lg:col-span-4 flex flex-col justify-start self-start lg:pl-8 right-column-parallax">

                                <div className="overflow-hidden lg:hidden mb-6">
                                    <span className="text-reveal-target block text-lg text-gray-500">
                                        {member.roleLabel}
                                    </span>
                                </div>

                                <div className="overflow-hidden mb-16 max-w-md">
                                    <p className="text-reveal-target block m-0 text-2xl lg:text-[28px] font-light leading-[1.3] tracking-tight text-gray-900">
                                        {member.quote}
                                    </p>
                                </div>

                                <div>
                                    <div className="overflow-hidden">
                                        <h3 className="text-reveal-target block m-0 text-xl font-normal text-gray-900">
                                            {member.name}
                                        </h3>
                                    </div>

                                    <div className="overflow-hidden mb-8">
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

            </div>
        </section>
    );
}