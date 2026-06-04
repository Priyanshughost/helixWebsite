import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import icon from '../../assets/logo/Helix-Icon-Logo-Blue.png'
import text from '../../assets/logo/Helix-Text-Logo-Blue.png'
import { navLinks } from "./navLink.js";

function MobileMenu({ lenisRef, loading }) {

    const [menuOpen, setMenuOpen] = useState(false);

    const overlayRef = useRef(null);
    const linksRef = useRef([]);
    const ctaRef = useRef(null);
    const socialRefs = useRef([]);
    const navInnerRef = useRef(null)
    const navRef = useRef(null)
    const textRef = useRef([])

    const tl = useRef(null);

    useGSAP(() => {
        // Set initial states using autoAlpha instead of opacity
        gsap.set(navInnerRef.current, {
            scaleX: 1,
            scaleY: 1,
            autoAlpha: 1, // Handles both opacity and visibility efficiently
        })

        if (loading) return;

        // 1. Create a SINGLE paused timeline (fixes the memory leak)
        const scrollTl = gsap.timeline({
            paused: true,
            defaults: { transformOrigin: 'center center' }
        });

        // STEP 1 — text hides upward
        scrollTl.to(textRef.current, {
            yPercent: -120,
            duration: 0.28,
            ease: 'power2.inOut',
        });

        // STEP 2 — navbar collapses (autoAlpha handles hiding it from the DOM)
        scrollTl.to(navInnerRef.current, {
            scaleX: 0.75,
            scaleY: 0.2,
            autoAlpha: 0,
            duration: 0.32,
            ease: 'power3.inOut',
        }, '-=0.08');

        let lastScroll = 0

        ScrollTrigger.create({
            start: 0,
            end: "max",
            onUpdate: (self) => {
                const current = self.scroll()

                // 2. Play or Reverse the single timeline (no new timelines created)
                if (current > lastScroll && current > 100) {
                    // SCROLL DOWN -> Hide Nav
                    scrollTl.play()
                } else if (current < lastScroll) {
                    // SCROLL UP -> Show Nav
                    scrollTl.reverse()
                }

                lastScroll = current
            },
        })
    }, {
        scope: navRef,
        dependencies: [loading]
    })

    // TIMELINE CREATION
    useGSAP(() => {

        // INITIAL STATES
        gsap.set(linksRef.current, {
            yPercent: -120,
        });

        gsap.set([ctaRef.current, ...socialRefs.current], {
            yPercent: -120,
        });

        gsap.set(overlayRef.current, {
            clipPath: "inset(0 0 100% 0)",
            autoAlpha: 0
        });

        // TIMELINE
        tl.current = gsap.timeline({
            paused: true,
        });

        tl.current
        tl.current
            .to(navInnerRef.current, {
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

            // LINKS REVEAL
            .to(
                linksRef.current,
                {
                    yPercent: 0,
                    duration: 0.8,
                    ease: "power4.out",
                },
                "-=0.2"
            )
            .to(
                [ctaRef.current, ...socialRefs.current],
                {
                    yPercent: 0,
                    // stagger: 0.06,
                    duration: 0.5,
                    ease: "power4.out",
                },
                "-=0.6"
            )
    }, []);

    // OPEN / CLOSE CONTROL
    useGSAP(() => {

        if (!tl.current) return;

        if (menuOpen) {
            gsap.set(overlayRef.current, {
                display: "flex",
            });
            // gsap.set(navInnerRef.current, {
            //     background: "transparent",
            //     borderColor: "transparent"
            // })

            tl.current.play();
            lenisRef.current?.lenis?.stop()

        } else {

            tl.current.reverse();

            tl.current.eventCallback("onReverseComplete", () => {

                gsap.set(overlayRef.current, {
                    display: "none",
                });
                // gsap.set(navInnerRef.current, {
                //     background: "white",
                //     borderColor: "#d4d4d8",
                // })

            });
            lenisRef.current?.lenis?.start()
        }

    }, [menuOpen]);

    return (
        <>
            {/* MOBILE NAVBAR */}
            <nav ref={navRef} className="fixed top-2 w-full z-105">

                <div
                    ref={navInnerRef}
                    className="max-w-[95%] mx-auto flex items-center justify-between px-4 border border-zinc-300 rounded-3xl bg-white"
                >

                    {/* LOGO */}
                    <div className="overflow-hidden">
                        <div ref={(el) => (textRef.current[0] = el)} className="flex items-center">
                            <img src={icon} alt="" className='h-10 ' />
                            <img src={text} alt="" className='h-18  ' />
                        </div>
                    </div>

                    {/* TOGGLE BUTTON */}
                    <div className="overflow-hidden">
                        <button
                            ref={(el) => (textRef.current[1] = el)}
                            onClick={() => setMenuOpen(!menuOpen)}
                            className="relative flex items-center justify-center overflow-hidden px-4 py-2 text-sm tracking-[-0.03em] "
                        >

                            {/* PLACEHOLDER */}
                            <span className="invisible">
                                Close
                            </span>

                            {/* MENU */}
                            <span
                                className={`absolute transition-all duration-500 ease-in-out ${menuOpen
                                    ? "translate-y-[150%] opacity-0"
                                    : "translate-y-0 opacity-100"
                                    }`}
                            >
                                Menu
                            </span>

                            {/* CLOSE */}
                            <span
                                className={`absolute transition-all duration-500 ease-in-out ${menuOpen
                                    ? "translate-y-0 opacity-100"
                                    : "translate-y-[-150%] opacity-0"
                                    }`}
                            >
                                Close
                            </span>

                        </button>
                    </div>

                </div>

            </nav>

            {/* FULLSCREEN OVERLAY */}
            <div
                ref={overlayRef}
                className="fixed inset-0 z-100 flex flex-col justify-between pt-20 to-blue-100 to-100% bg-linear-to-t via-blue-500 via-40% from-black from-1% will-change-[clip-path]"
            >

                {/* TOP CONTENT */}
                <div>

                    {/* CTA */}
                    <div className="px-4 overflow-hidden">

                        <button ref={ctaRef} className="flex items-center gap-1 text-[1.65rem] tracking-[-0.06em] font-light">
                            Sign Up
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
                                    className="will-change-transform block text-[4rem] leading-[0.94] font-light"
                                >
                                    {link.label}
                                </Link>
                            </div>
                        ))}
                    </div>

                </div>

                {/* FOOTER */}
                <div
                    className="px-4 pb-6 flex flex-col text-blue-100 text-[1.2rem] tracking-[-0.04em] leading-[1.15]"
                >

                    <div className="overflow-hidden">
                        <a
                            ref={(el) => (socialRefs.current[0] = el)}
                            href="#"
                            className="block"
                        >
                            Instagram
                        </a>
                    </div>

                    <div className="overflow-hidden">
                        <a
                            ref={(el) => (socialRefs.current[1] = el)}
                            href="#"
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