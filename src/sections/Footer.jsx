import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

function Footer() {
    const footerRef = useRef(null);
    const textRef = useRef(null);
    const headingRef = useRef(null);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            // Parallax reveal of the footer container
            gsap.fromTo(
                footerRef.current,
                { yPercent: -30 },
                {
                    yPercent: 0,
                    ease: "none",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top bottom",
                        end: "bottom bottom",
                        scrub: true,
                    }
                }
            );

            // Dramatic SplitText Animation for Main Heading
            const splitHeading = new SplitText(headingRef.current, { type: "chars, words" });

            gsap.fromTo(splitHeading.chars,
                { opacity: 0.1, y: 30, rotationX: -90 },
                {
                    opacity: 1,
                    y: 0,
                    rotationX: 0,
                    stagger: 0.05,
                    transformOrigin: "0% 50% -50",
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: headingRef.current,
                        start: "top 90%",
                        end: "top 40%",
                        scrub: 1,
                    }
                }
            );

            // Stagger reveal of general text blocks (excluding the heading now)
            gsap.fromTo(".reveal-elem:not(.main-heading)",
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1.2,
                    stagger: 0.1,
                    ease: "power4.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 85%",
                    }
                }
            );

            // Stagger reveal of list links with a slight horizontal slide
            gsap.fromTo(".reveal-link",
                { opacity: 0, x: -20 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.8,
                    stagger: 0.05,
                    ease: "power3.out",
                    scrollTrigger: {
                        trigger: footerRef.current,
                        start: "top 75%",
                    }
                }
            );

            // Dramatic SplitText Giant Logo Animation
            const splitLogo = new SplitText(textRef.current, { type: "chars" });

            gsap.fromTo(splitLogo.chars,
                {
                    yPercent: 130,
                    rotationZ: 10,
                    opacity: 0,
                },
                {
                    yPercent: 0,
                    rotationZ: 0,
                    opacity: 1,
                    duration: 1.5,
                    ease: "expo.out",
                    stagger: 0.06,
                    scrollTrigger: {
                        trigger: textRef.current,
                        start: "top 95%",
                    }
                }
            );

            // Interactive hover effect for giant text letters
            splitLogo.chars.forEach((char) => {
                char.addEventListener("mouseenter", () => {
                    gsap.to(char, {
                        yPercent: -20,
                        color: "#e5d9c5",
                        scale: 1.05,
                        duration: 0.3,
                        ease: "power2.out"
                    });
                });
                char.addEventListener("mouseleave", () => {
                    gsap.to(char, {
                        yPercent: 0,
                        color: "white",
                        scale: 1,
                        duration: 0.6,
                        ease: "elastic.out(1, 0.4)"
                    });
                });
            });

        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-[#050505] text-white font-sans h-auto flex flex-col justify-end antialiased overflow-hidden relative">
            {/* Subtle Gradient Background for Premium Look */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_center,_var(--tw-gradient-stops))] from-[#1a1814] via-[#050505] to-[#050505] opacity-60 pointer-events-none"></div>

            <footer
                ref={footerRef}
                className="pt-[6vw] pb-0 flex flex-col gap-10 justify-between h-auto relative z-10"
            >
                {/* Top Section */}
                <div className="flex px-[4vw] w-full md:flex-nowrap justify-between flex-wrap gap-12">

                    {/* Left Column */}
                    <div className="flex flex-col justify-between w-full md:w-1/2" style={{ perspective: "1000px" }}>
                        <h2 ref={headingRef} className="reveal-elem main-heading text-[clamp(2.5rem,4vw,5rem)] font-light tracking-tight mb-16 leading-tight">
                            Team HELIX <br />
                            <span className="font-medium text-[#e5d9c5]">
                                Ready To Innovate.
                            </span>
                        </h2>

                        <div className="reveal-elem mb-16 text-lg text-gray-300 leading-relaxed font-light">
                            <p className="text-gray-300 mb-4">
                                Join The Helix Network 🚀
                            </p>
                            p className="text-gray-300 mb-4">
                                Feel free to reach out to  us
                            </p>
                            <div className="flex gap-10 items-center">
                                {/* Gmail */}
                               <a
                                   href="mailto:hello@example.com"
                                   className="flex flex-col items-center text-white hover:text-[#EA4335]">
                                   <svg
                                       className="w-6 h-6"
                                       fill="currentColor"
                                       viewBox="0 0 24 24"
                                       >
                                       <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                                   </svg>
                                   <span className="text-xs mt-1">
                                    Gmail
                                   </span>
                               </a>
                                {/* Instagram */}
                                <a
                                    href="https://www.instagram.com/helix.rvscet?igsh=c2hpenlyNWtzZTZ1"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center text-white hover:text-[#E1306C]">
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm5.5-2.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z"/>
                                    </svg>
                                    <span className="text-xs mt-1">
                                        Instagram
                                    </span>
                                </a>
                                {/* Facebook */}
                                <a
                                    href="https://www.facebook.com/helix.rvscet"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center text-white hover:text-[#1877F2]"
                                    >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.1v8h3.4z"/>
                                    </svg>
                                    <span className="text-xs mt-1">
                                        Facebook
                                    </span>
                                </a>
                                {/* LinkedIn */}
                                <a
                                    href="https://www.linkedin.com/company/helixrvscet/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center text-white hover:text-[#0A66C2]"
                                    >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M6.5 8.5H3V21h3.5V8.5zM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3zM21 13.7c0-3.8-2-5.5-4.7-5.5-2.1 0-3 .9-3.5 1.6V8.5H9.5V21H13v-6.2c0-1.6.3-3.1 2.2-3.1 1.8 0 1.8 1.8 1.8 3.2V21H21v-7.3z"/>
                                    </svg>
                                    <span className="text-xs mt-1">
                                        LinkedIn
                                    </span>
                                </a>
                                {/* Discord */}
                                <a
                                    href="https://discord.gg/mJTjbsTwV"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center text-white hover:text-[#5865F2]"
                                    >
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M19.5 5.5a16 16 0 0 0-4-1.2l-.5 1a14 14 0 0 0-6 0l-.5-1a16 16 0 0 0-4 1.2C2.7 9 2 12.3 2 15.5c1.5 1.1 3 1.8 4.5 2.2l1.1-1.5c-.6-.2-1.1-.5-1.6-.8l.4-.3c3 1.4 6.2 1.4 9.1 0l.4.3c-.5.3-1 .6-1.6.8l1.1 1.5c1.5-.4 3-1.1 4.5-2.2 0-3.2-.7-6.5-2.5-10z"/>
                                    </svg>
                                    <span className="text-xs mt-1">
                                        Discord
                                    </span>
                                </a>
                                {/* YouTube */}
                                <a
                                    href="www.youtube.com/@helix.rvscet"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex flex-col items-center text-white hover:text-[#FF0000]">
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5V8.5L16 12l-6.4 3.5z"/>
                                    </svg>
                                    <span className="text-xs mt-1">
                                        YouTube
                                    </span>
                                </a>
                            </div>
                        </div>

                        <div className="reveal-elem text-base">
                            <p className="mb-4 text-gray-400">Sign up for our newsletter (No spam)</p>
                            <form
                                className="flex items-center border-b border-gray-600 pb-3 max-w-md group"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    required
                                    className="bg-transparent border-none text-white text-lg grow outline-none placeholder:text-gray-500 transition-all duration-300 focus:placeholder-opacity-0"
                                />
                                <button
                                    type="submit"
                                    className="bg-transparent border-none text-gray-400 text-2xl cursor-pointer pl-4 transition-all duration-300 group-hover:text-[#e5d9c5] group-hover:translate-x-2"
                                >
                                    &#8594;
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col justify-between w-full md:w-max gap-12 md:gap-0 mt-8 md:mt-0">
                        <div className="flex gap-[8vw] md:justify-end">
                            <ul className="flex flex-col gap-3">
                                {["Home", "Work", "About", "Services", "Contact"].map((item, i) => (
                                    <li key={i} className="reveal-link text-lg font-light">
                                        <a href="#" className="relative overflow-hidden inline-block group text-gray-300 hover:text-white transition-colors duration-300">
                                            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">{item}</span>
                                            <span className="inline-block absolute top-0 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[#e5d9c5]">{item}</span>
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="flex gap-[8vw] mt-auto md:pt-16 md:justify-end text-sm text-gray-500 font-light">
                            <div className="reveal-elem leading-relaxed">
                                 {/* Location */}
                                <a
                                    href="https://www.rvscollege.ac.in/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center gap-3 text-gray-300 hover:text-white transition">
                                    {/* Location SVG */}
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24">
                                        <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z"/>
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium"> • RVSCET, Jamshedpur
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Visit Website
                                        </p>
                                    </div>
                                </a>
                                {/* RVSCET Email */}
                                <a
                                    href="mailto:info@rvscollege.ac.in"
                                    className="flex items-center gap-3 mt-4 text-gray-300 hover:text-white transition"
                                    >
                                    {/* Mail SVG */}
                                    <svg
                                        className="w-6 h-6"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                        >
                                        <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/>
                                    </svg>
                                    <div>
                                        <p className="text-sm font-medium">
                                            RVSCET Email
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            info@rvscollege.ac.in
                                        </p>
                                    </div>
                                </a>
                            </div>
                            <div className="reveal-elem leading-relaxed">
                                <p>Privacy Policy<br />©2026—HELIX</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Giant Logo Section */}
                <div className="w-full overflow-hidden flex justify-center items-end mt-[4vw] pointer-events-auto">
                    <h1
                        ref={textRef}
                        className="text-[18vw] text-white font-black tracking-tighter leading-[0.8] m-0 select-none cursor-default"
                        style={{ textShadow: "0 20px 40px rgba(0,0,0,0.5)" }}
                    >
                        RVSCET
                    </h1>
                </div>
            </footer>
        </div>
    );
}

export default Footer;
