import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, SplitText);

const AboutSection = () => {
    const containerRef = useRef(null);
    const headingTriggerRef = useRef(null);
    const text1SpanRef = useRef(null);
    const text2SpanRef = useRef(null);
    const lineRef = useRef(null);
    const split1Ref = useRef(null);
    const split2Ref = useRef(null);
    const descriptionContainerRef = useRef(null);
    const revealTextRef = useRef(null);
    const principlesTriggerRef = useRef(null);

    const { contextSafe } = useGSAP(() => {
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

        gsap.to(revealTextRef.current, {
            clipPath: 'inset(-20% -20% -20% -20%)',
            ease: 'none',
            scrollTrigger: {
                trigger: descriptionContainerRef.current,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 0.5,
            }
        });

        gsap.fromTo('.principle-mask-item',
            { y: '100%' },
            {
                y: '0%',
                duration: 1,
                stagger: 0.15,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: principlesTriggerRef.current,
                    start: 'top 85%',
                }
            }
        );

        return () => {
            if (split1Ref.current) split1Ref.current.revert();
            if (split2Ref.current) split2Ref.current.revert();
        };
    }, { scope: containerRef });

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
        <div ref={containerRef} className="w-full min-h-screen bg-white text-black font-sans px-4 sm:px-6 md:px-12 lg:px-20 py-0 md:py-12 overflow-x-hidden">

            <div ref={headingTriggerRef} className="flex justify-start items-center mb-20 md:mb-28 lg:mb-38 pt-0 md:pt-0">
                <div
                    className="relative inline-flex flex-col items-center cursor-pointer"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <div className="relative overflow-hidden mb-3 md:mb-6 w-full flex justify-center">
                        <h1 className="relative text-[12vw] sm:text-6xl md:text-[4rem] lg:text-[5rem] font-normal tracking-tight whitespace-nowrap m-0 leading-[1.1] block w-full text-left">
                            <span ref={text1SpanRef} className="inline-block">Get to know us</span>
                        </h1>

                        <h1 className="absolute top-0 left-0 text-[12vw] sm:text-6xl md:text-[4rem] lg:text-[5rem] font-normal tracking-tight whitespace-nowrap m-0 leading-[1.1] w-full text-left block">
                            <span ref={text2SpanRef} className="inline-block">About Us</span>
                        </h1>
                    </div>

                    <div
                        ref={lineRef}
                        className="absolute bottom-0 h-[1.5px] md:h-0.5 bg-black origin-left will-change-transform"
                        style={{ left: 0, right: 0, margin: '0 auto' }}
                    />
                </div>
            </div>

            <div className="max-w-400 mx-auto w-full">

                {/* --- FIX APPLIED HERE --- */}
                {/* Outer wrapper handles the spacing and padding safely */}
                <div className="mb-16 md:mb-24 lg:mb-32 pr-0 lg:pr-10">

                    {/* Inner wrapper is strictly for layout overlay (relative positioning without padding) */}
                    <div ref={descriptionContainerRef} className="relative w-full">
                        {/* Note: You can remove 'border border-red-600' when you're done debugging */}
                        <h2 className="w-full text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] leading-[1.05] tracking-tight font-normal text-black/20">
                            Bluid a collaborative tech ecosystem where students connect , learn , innovate , and grow through hands-on 
                            projects , AI-Driven solutions , Teamwork and industry-focused skills to become future-ready
                            technology leaders.
                        </h2>
                        <h2
                            ref={revealTextRef}
                            className="absolute top-0 left-0 w-full text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] leading-[1.05] font-normal tracking-tight text-black"
                            style={{ clipPath: 'inset(-20% 100% -20% -20%)' }}
                            aria-hidden="true"
                        >
                            Bluid a collaborative tech ecosystem where students connect , learn , innovate , grow through hands-on
                            projects , AI-Driven solutions , Teamwork , and industry-focused skills to become future-ready
                            technology leaders.
                        </h2>
                    </div>
                </div>
                {/* ------------------------ */}

                <hr className="border-t border-gray-300 mb-8 md:mb-12 w-full" />

                <div ref={principlesTriggerRef} className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4">
                    <div className="md:col-span-5 lg:col-span-6">
                        <div className="overflow-hidden">
                            <h3 className="principle-mask-item text-base sm:text-lg md:text-xl leading-tight font-normal block">
                                We operate on<br />
                                simple principles
                            </h3>
                        </div>
                    </div>

                    <div className="md:col-span-7 lg:col-span-6 flex flex-col">
                        <ul className="text-base sm:text-lg md:text-xl space-y-1 md:space-y-2 mb-12 md:mb-24">
                            <li className="overflow-hidden">
                                <div className="principle-mask-item flex gap-4 md:gap-6">
                                    <span className="text-gray-500">(01)</span>
                                    <span>Put people first</span>
                                </div>
                            </li>
                            <li className="overflow-hidden">
                                <div className="principle-mask-item flex gap-4 md:gap-6">
                                    <span className="text-gray-500">(02)</span>
                                    <span>Pursue excellence</span>
                                </div>
                            </li>
                            <li className="overflow-hidden">
                                <div className="principle-mask-item flex gap-4 md:gap-6">
                                    <span className="text-gray-500">(03)</span>
                                    <span>Embrace challenges</span>
                                </div>
                            </li>
                        </ul>

                        <div className="overflow-hidden">
                            <p className="principle-mask-item text-sm sm:text-base md:text-lg text-black leading-snug max-w-105 block">
                                These three principles have earned us
                                numerous awards. While we don't chase
                                accolades, they are proof of our dedication
                                to impact, quality, and innovation.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutSection;
