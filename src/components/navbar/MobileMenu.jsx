import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import icon from '../../assets/logo/Helix-Icon-Logo-Blue.png'
import text from '../../assets/logo/Helix-Text-Logo-Blue.png'
import { navLinks } from "./navLink.js";

// ==========================================
// SVG PATH STATES (100x100 viewBox)
// ==========================================
const pathBottomHidden  = "M 0 100 Q 50 100 100 100 L 100 100 Q 50 100 0 100 Z"
const pathBottomCurveUp = "M 0 60 Q 50 -20 100 60 L 100 100 Q 50 100 0 100 Z" 
const pathFilled        = "M 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z"
const pathTopCurveUp    = "M 0 0 Q 50 0 100 0 L 100 60 Q 50 -20 0 60 Z" 
const pathTopHidden     = "M 0 0 Q 50 0 100 0 L 100 0 Q 50 0 0 0 Z"

const pathTopCurveDown    = "M 0 0 Q 50 0 100 0 L 100 40 Q 50 120 0 40 Z" 
const pathBottomCurveDown = "M 0 40 Q 50 120 100 40 L 100 100 Q 50 100 0 100 Z" 

function MobileMenu({ lenisRef, loading }) {

    const [menuOpen, setMenuOpen] = useState(false);

    // Overlay Refs (Untouched)
    const overlayRef = useRef(null);
    const linksRef = useRef([]);
    const ctaRef = useRef(null);
    const socialRefs = useRef([]);
    const tl = useRef(null);

    // Navbar Refs
    const navRef = useRef(null);
    const navBgRef = useRef(null);
    const contentRef = useRef(null);
    const blackWipeRef = useRef(null);
    const limeWipeRef = useRef(null);

    // ==========================================
    // 1. NAVBAR LOAD & SCROLL ANIMATION (WIPE)
    // ==========================================
    useGSAP(() => {
        // INITIAL STATES
        gsap.set([limeWipeRef.current, blackWipeRef.current], {
            attr: { d: pathBottomHidden }
        })
        
        gsap.set(contentRef.current, {
            autoAlpha: 0 
        })

        if (loading) return;

        let isIntroComplete = false;

        // ONLOAD ANIMATION
        const introTl = gsap.timeline({
            onComplete: () => {
                isIntroComplete = true; // Unlock scroll animations
            }
        })

        introTl
            .to(limeWipeRef.current, {
                keyframes: [
                    { attr: { d: pathBottomCurveUp }, duration: 0.3, ease: 'power2.in' },
                    { attr: { d: pathFilled }, duration: 0.3, ease: 'power2.out' }
                ]
            }, "in")
            .to(blackWipeRef.current, {
                keyframes: [
                    { attr: { d: pathBottomCurveUp }, duration: 0.3, ease: 'power2.in' },
                    { attr: { d: pathFilled }, duration: 0.3, ease: 'power2.out' }
                ]
            }, "in+=0.15")
            .set(contentRef.current, { autoAlpha: 1 }, "out")
            .to(blackWipeRef.current, {
                keyframes: [
                    { attr: { d: pathTopCurveUp }, duration: 0.3, ease: 'power2.in' },
                    { attr: { d: pathTopHidden }, duration: 0.3, ease: 'power2.out' }
                ]
            }, "out+=0.1")
            .to(limeWipeRef.current, {
                keyframes: [
                    { attr: { d: pathTopCurveUp }, duration: 0.3, ease: 'power2.in' },
                    { attr: { d: pathTopHidden }, duration: 0.3, ease: 'power2.out' }
                ]
            }, "out+=0.25")

        // SCROLL NAVBAR LOGIC
        const scrollTl = gsap.timeline({ paused: true })

        scrollTl
            .to(limeWipeRef.current, {
                keyframes: [
                    { attr: { d: pathTopCurveDown }, duration: 0.25, ease: 'power2.in' },
                    { attr: { d: pathFilled }, duration: 0.25, ease: 'power2.out' }
                ]
            }, "hide")
            .to(blackWipeRef.current, {
                keyframes: [
                    { attr: { d: pathTopCurveDown }, duration: 0.25, ease: 'power2.in' },
                    { attr: { d: pathFilled }, duration: 0.25, ease: 'power2.out' }
                ]
            }, "hide+=0.1")
            .set([contentRef.current, navBgRef.current], { autoAlpha: 0 }, "exit")
            .to(blackWipeRef.current, {
                keyframes: [
                    { attr: { d: pathBottomCurveDown }, duration: 0.25, ease: 'power2.in' },
                    { attr: { d: pathBottomHidden }, duration: 0.25, ease: 'power2.out' }
                ]
            }, "exit")
            .to(limeWipeRef.current, {
                keyframes: [
                    { attr: { d: pathBottomCurveDown }, duration: 0.25, ease: 'power2.in' },
                    { attr: { d: pathBottomHidden }, duration: 0.25, ease: 'power2.out' }
                ]
            }, "exit+=0.1")

        scrollTl.set(navRef.current, { pointerEvents: "none" })

        let lastScroll = 0

        ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
                if (!isIntroComplete) return;

                const current = self.scroll()

                if (current > lastScroll && current > 100) {
                    scrollTl.play()
                } else if (current < lastScroll) {
                    scrollTl.reverse()
                }

                lastScroll = current
            },
        })
    }, {
        scope: navRef,
        dependencies: [loading]
    })


    // ==========================================
    // 2. OVERLAY MENU TIMELINE (UNTOUCHED)
    // ==========================================
    useGSAP(() => {
        // INITIAL STATES
        gsap.set(linksRef.current, { yPercent: -120 });
        gsap.set([ctaRef.current, ...socialRefs.current], { yPercent: -120 });
        gsap.set(overlayRef.current, { clipPath: "inset(0 0 100% 0)", autoAlpha: 0 });

        // TIMELINE
        tl.current = gsap.timeline({ paused: true });

        tl.current
            .to(navBgRef.current, { // <-- Applied your transparent bg target to the new navBgRef
                backgroundColor: "rgba(255,255,255,0)",
                borderColor: "rgba(255,255,255,0)",
                duration: 0.35,
                ease: "power2.out",
            }, 0)
            .to(overlayRef.current, {
                autoAlpha: 1,
                pointerEvents: "auto",
                duration: 0,
            })
            .to(overlayRef.current, {
                clipPath: "inset(0 0 0% 0)",
                duration: 0.4,
                ease: "power4.inOut",
            })
            .to(linksRef.current, {
                yPercent: 0,
                duration: 0.8,
                ease: "power4.out",
            }, "-=0.2")
            .to([ctaRef.current, ...socialRefs.current], {
                yPercent: 0,
                duration: 0.5,
                ease: "power4.out",
            }, "-=0.6")
    }, []);

    // OPEN / CLOSE CONTROL (UNTOUCHED)
    useGSAP(() => {
        if (!tl.current) return;

        if (menuOpen) {
            gsap.set(overlayRef.current, { display: "flex" });
            tl.current.play();
            lenisRef.current?.lenis?.stop()
        } else {
            tl.current.reverse();
            tl.current.eventCallback("onReverseComplete", () => {
                gsap.set(overlayRef.current, { display: "none" });
            });
            lenisRef.current?.lenis?.start()
        }
    }, [menuOpen]);

    const closeMenu = () => setMenuOpen(false);

    return (
        <>
            {/* MOBILE NAVBAR */}
            <nav ref={navRef} className="fixed top-2 w-full z-[105]">
                
                <div className="relative max-w-[95%] mx-auto rounded-3xl overflow-hidden shadow-sm">
                    
                    {/* NAV BACKGROUND */}
                    <div
                        ref={navBgRef}
                        className="
                            absolute inset-0 
                            bg-white backdrop-blur-sm 
                            border border-zinc-300 
                            rounded-3xl transition-colors
                        "
                    />

                    {/* FLUID MORPHING SVG OVERLAYS */}
                    <svg 
                        className="absolute inset-0 w-full h-full pointer-events-none z-100"
                        viewBox="0 0 100 100"
                        preserveAspectRatio="none"
                    >
                        <path ref={limeWipeRef} d={pathBottomHidden} fill="#a3e635" />
                        <path ref={blackWipeRef} d={pathBottomHidden} fill="#161616" />
                    </svg>

                    {/* CONTENT CONTAINER */}
                    <div 
                        ref={contentRef} 
                        className="relative z-50 flex items-center justify-between px-4 py-[0.1rem]"
                    >
                        {/* LOGO */}
                        <div className="overflow-hidden">
                            <div className="flex items-center">
                                <img src={icon} alt="" className='h-10' />
                                <img src={text} alt="" className='h-18' />
                            </div>
                        </div>

                        {/* TOGGLE BUTTON */}
                        <div className="overflow-hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="relative flex items-center justify-center overflow-hidden px-4 py-2 text-sm tracking-[-0.03em]"
                            >
                                {/* PLACEHOLDER */}
                                <span className="invisible">Close</span>

                                {/* MENU */}
                                <span
                                    className={`absolute transition-all duration-500 ease-in-out ${
                                        menuOpen ? "translate-y-[150%] opacity-0" : "translate-y-0 opacity-100"
                                    }`}
                                >
                                    Menu
                                </span>

                                {/* CLOSE */}
                                <span
                                    className={`absolute transition-all duration-500 ease-in-out text-white ${
                                        menuOpen ? "translate-y-0 opacity-100" : "translate-y-[-150%] opacity-0"
                                    }`}
                                >
                                    Close
                                </span>
                            </button>
                        </div>
                    </div>

                </div>
            </nav>

            {/* FULLSCREEN OVERLAY (UNTOUCHED HTML) */}
            <div
                ref={overlayRef}
                className="fixed pl-4 inset-0 z-100 flex flex-col justify-between pt-20 bg-[#111111] will-change-[clip-path]"
            >
                {/* TOP CONTENT */}
                <div>
                    {/* CTA */}
                    <div className="px-4 overflow-hidden">
                        <button 
                            ref={ctaRef} 
                            onClick={closeMenu} 
                            className="flex items-center gap-1.5 text-2xl font-medium tracking-tight text-white"
                        >
                            Join Helix
                            <span>↗</span>
                        </button>
                    </div>

                    {/* NAV LINKS */}
                    <div className="px-4 pt-12 flex flex-col">
                        {navLinks.map((link, index) => (
                            <div key={index} className="overflow-hidden">
                                <Link
                                    ref={(el) => (linksRef.current[index] = el)}
                                    to={link.path}
                                    onClick={closeMenu}
                                    className="will-change-transform block text-[13vw] sm:text-[4rem] leading-tight font-extralight tracking-tighter text-white py-1"
                                >
                                    {link.label}
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* FOOTER */}
                <div className="px-4 pb-6 flex flex-col text-blue-100 text-[1.2rem] tracking-[-0.04em] leading-[1.15]">
                    <div className="overflow-hidden">
                        <a
                            ref={(el) => (socialRefs.current[0] = el)}
                            href="#"
                            onClick={closeMenu}
                            className="block"
                        >
                            Instagram
                        </a>
                    </div>
                    <div className="overflow-hidden">
                        <a
                            ref={(el) => (socialRefs.current[1] = el)}
                            href="#"
                            onClick={closeMenu}
                            className="block"
                        >
                            LinkedIn
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}

export default MobileMenu;