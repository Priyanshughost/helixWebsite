import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText'; // Premium Plugin
import { useGSAP } from '@gsap/react';
import StringPluck from '../components/StringPluck';

// Register all required plugins
gsap.registerPlugin(ScrollTrigger, SplitText);

const Tagline = () => {
    const containerRef = useRef(null);
    const headlineRef = useRef(null);

    const headlineText =
        "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ab similique assumenda excepturi minima odit in velit eum vitae nesciunt! Voluptatem eum amet aut rerum delectus fugiat deleniti tempora enim velit.";

    useGSAP(() => {
        // 1. Split the text into words and characters
        const splitHeadline = new SplitText(headlineRef.current, {
            type: 'words,chars'
        });

        // Set the initial opacity of all individual characters to 20%
        gsap.set(splitHeadline.chars, { opacity: 0.2 });

        // 2. Scrubbing text animation (Character by Character)
        gsap.to(splitHeadline.chars, {
            opacity: 1,
            stagger: 1, // This stagger creates the 100 -> 70 -> 20 trailing opacity gradient!
            ease: 'none',
            scrollTrigger: {
                trigger: headlineRef.current,
                start: 'top 80%',
                end: 'top 20%',
                scrub: 1, // Adds a slight smoothing delay to the scroll tie
            },
        });

        // 3. Clip reveal animation from upwards for the paragraphs
        gsap.from('.clip-text', {
            clipPath: 'inset(0% 0% 100% 0%)',
            y: -20,
            opacity: 0,
            duration: 1.2,
            stagger: 0.2,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: '.clip-container',
                start: 'top 65%',
            },
        });

        // Cleanup: Revert the split text on component unmount (Crucial for React Strict Mode)
        return () => {
            splitHeadline.revert();
        };
    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="min-h-screen bg-white text-neutral-900 pt-16 md:pt-32 px-6 sm:px-12 lg:px-20 flex flex-col justify-center selection:bg-neutral-900 selection:text-white"
        >
            <div className="max-w-7xl mx-auto w-full">

                {/* Main Headline (Cleaned up, SplitText handles the rest) */}
                <h1
                    ref={headlineRef}
                    className="text-2xl sm:text-3xl md:text-4xl lg:text-[3rem] leading-[1.05] tracking-tight font-medium mb-0 md:mb-24"
                >
                    {headlineText}
                </h1>

                {/* Horizontal Divider */}
                <StringPluck/>

                {/* Bottom Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-start">

                    {/* Left Column */}
                    <div className="text-xl md:text-2xl tracking-tight">
                        <p>Tomorrow’s brands, today.</p>
                    </div>

                    {/* Right Column */}
                    <div className="clip-container flex flex-col gap-8 text-lg md:text-xl tracking-tight md:max-w-md">
                        <p className="clip-text">
                            Since 2013, we have been recognized globally for helping founders
                            build market-defining brands.
                        </p>
                        <p className="clip-text">
                            We partner with five clients a year to give each one the focus and
                            care they deserve.
                        </p>
                        <div className="clip-text">
                            <a
                                href="#learn-more"
                                className="inline-flex items-center underline decoration-1 underline-offset-8 hover:text-neutral-500 transition-colors duration-300"
                            >
                                Learn more
                                {/* Top-Right Arrow SVG */}
                                <svg
                                    className="w-5 h-5 ml-1 mt-1"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <line x1="7" y1="17" x2="17" y2="7"></line>
                                    <polyline points="7 7 17 7 17 17"></polyline>
                                </svg>
                            </a>
                        </div>
                    </div>

                </div>
            </div>
            <StringPluck/>
        </section>
    );
};

export default Tagline;