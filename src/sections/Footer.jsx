import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, SplitText);

function Footer() {
    const footerRef = useRef(null);
    const textRef = useRef(null);
    
    // Newsletter State
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) return;

        setStatus('loading');

        // Note: For real backend, replace this setTimeout with a fetch call
        setTimeout(() => {
            setStatus('success');
            setEmail('');
            
            // Reset status after 3 seconds
            setTimeout(() => {
                setStatus('idle');
            }, 3000);
        }, 1500);
    };

    useGSAP(() => {
        const ctx = gsap.context(() => {
            // Parallax reveal of the footer container (KEPT)
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

            // Sliced 3D Glass Setup (Hover Effect Kept, Scroll Reveal Removed)
            gsap.set(textRef.current, { perspective: 1500, transformStyle: "preserve-3d" });
            const layers = gsap.utils.toArray('.glass-layer', textRef.current);
            const splits = layers.map(layer => new SplitText(layer, { type: "chars" }));

            // Set initial 3D resting states instantly
            splits.forEach((split, i) => {
                const isFront = i === 2;
                const isMiddle = i === 1;
                const baseZ = isFront ? 0 : (isMiddle ? -40 : -80);

                gsap.set(split.chars, {
                    z: baseZ,
                });
            });

            // Hover: Sliced Glass Spread Effect
            const frontChars = splits[2].chars; // Index 2 is the front layer
            frontChars.forEach((char, index) => {
                char.addEventListener("mouseenter", () => {
                    gsap.to(char, { yPercent: -10, z: 80, scale: 1.02, color: "#e5d9c5", textShadow: "0px 30px 40px rgba(229, 217, 197, 0.4)", duration: 0.4, ease: "back.out(2)", overwrite: "auto" });
                    gsap.to(splits[1].chars[index], { yPercent: -5, z: -20, scale: 1, color: "rgba(255,255,255,0.5)", duration: 0.4, ease: "back.out(2)", overwrite: "auto" });
                    gsap.to(splits[0].chars[index], { yPercent: 0, z: -100, scale: 0.98, color: "rgba(255,255,255,0.15)", duration: 0.4, ease: "back.out(2)", overwrite: "auto" });
                });

                char.addEventListener("mouseleave", () => {
                    gsap.to(char, { yPercent: 0, z: 0, scale: 1, color: "white", textShadow: "0 20px 40px rgba(0,0,0,0.5)", duration: 0.6, ease: "power2.out", overwrite: "auto" });
                    gsap.to(splits[1].chars[index], { yPercent: 0, z: -40, scale: 1, color: "rgba(255,255,255,0.2)", duration: 0.6, ease: "power2.out", overwrite: "auto" });
                    gsap.to(splits[0].chars[index], { yPercent: 0, z: -80, scale: 1, color: "rgba(255,255,255,0.05)", duration: 0.6, ease: "power2.out", overwrite: "auto" });
                });
            });

        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-[#111111] text-white font-sans h-auto flex flex-col justify-end antialiased overflow-hidden relative">
            {/* Subtle Gradient Background for Premium Look */}
            <div className="absolute inset-0 pointer-events-none"></div>

            <footer
                ref={footerRef}
                className="pt-[6vw] pb-0 flex flex-col gap-10 justify-between h-auto relative z-10"
            >
                {/* Top Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 px-[4vw] w-full">

                    {/* Column 1: Brand & Newsletter */}
                    <div className="flex flex-col gap-12 lg:pr-8" style={{ perspective: "1000px" }}>
                        <h2 className="text-[clamp(2.5rem,4vw,5rem)] font-light tracking-tight leading-tight">
                            Team HELIX <br />
                            <span className="font-medium text-[#e5d9c5]">
                                Ready To Innovate.
                            </span>
                        </h2>

                        <div className="text-base mt-auto">
                            <p className="mb-4 text-gray-400">Sign up for our newsletter (No spam)</p>
                            <form
                                className="flex items-center border-b border-gray-600 pb-3 w-full group relative"
                                onSubmit={handleSubscribe}
                            >
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    disabled={status === 'loading' || status === 'success'}
                                    className="bg-transparent border-none text-white text-lg grow outline-none placeholder:text-gray-500 transition-all duration-300 focus:placeholder-opacity-0 disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={status === 'loading' || status === 'success'}
                                    className="bg-transparent border-none text-gray-400 text-2xl cursor-pointer pl-4 transition-all duration-300 hover:text-[#e5d9c5] disabled:opacity-50"
                                >
                                    {status === 'loading' ? (
                                        <span className="inline-block animate-spin text-sm">↻</span>
                                    ) : status === 'success' ? (
                                        <span className="text-green-500 text-xl">✓</span>
                                    ) : (
                                        <span className="group-hover:translate-x-2 inline-block transition-transform duration-300">&#8594;</span>
                                    )}
                                </button>
                                
                                {/* Status Message Popup */}
                                {status === 'success' && (
                                    <div className="absolute -bottom-8 left-0 text-green-400 text-sm font-medium animate-pulse">
                                        Thanks for subscribing!
                                    </div>
                                )}
                            </form>
                        </div>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="flex flex-col md:items-center lg:items-start lg:pl-[6vw]">
                        <h3 className="text-xl text-gray-500 mb-8 font-medium">Quick Links</h3>
                        <ul className="flex flex-col gap-2">
                            {[
                                { name: "Home", link: "#home" },
                                { name: "About Us", link: "#about" },
                                { name: "Gallery", link: "#gallery" },
                                { name: "Events", link: "#events" },
                                { name: "Hall of Fame", link: "#hall-of-fame" },
                                { name: "Partnerships", link: "#partnerships" },
                                { name: "Testimonials", link: "#testimonials" }
                            ].map((item, i) => (
                                <li key={i} className="text-lg font-light">
                                    <a href={item.link} className="relative overflow-hidden inline-block group text-gray-300 hover:text-white transition-colors duration-300">
                                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">{item.name}</span>
                                        <span className="inline-block absolute top-0 left-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[#e5d9c5]">{item.name}</span>
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Column 3: Contact & Socials */}
                    <div className="flex flex-col gap-16 lg:items-end">

                        {/* Contact Info */}
                        <div className="flex flex-col gap-4 lg:items-end text-sm text-gray-500 font-light w-full">
                            <h3 className="text-xl text-gray-500 mb-2 font-medium lg:text-right">Contact Us</h3>
                            <div className="flex flex-col gap-4 w-full lg:items-end">
                                {/* Location */}
                                <a
                                    href="https://www.rvscollege.ac.in/"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex items-center lg:flex-row-reverse gap-4 text-gray-300 hover:text-white transition w-max">
                                    <div className="p-3 rounded-full bg-white/5 shrink-0">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6a2.5 2.5 0 0 1 0 5.5z" />
                                        </svg>
                                    </div>
                                    <div className="lg:text-right">
                                        <p className="text-sm font-medium">RVSCET, Jamshedpur</p>
                                        <p className="text-xs text-gray-400">Visit Website</p>
                                    </div>
                                </a>
                                {/* Email */}
                                <a
                                    href="info@rvscet.com"
                                    className="flex items-center lg:flex-row-reverse gap-4 text-gray-300 hover:text-white transition w-max"
                                >
                                    <div className="p-3 rounded-full bg-white/5 shrink-0">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" />
                                        </svg>
                                    </div>
                                    <div className="lg:text-right">
                                        <p className="text-sm font-medium">RVSCET Email</p>
                                        <p className="text-xs text-gray-400">info@rvscollege.ac.in</p>
                                    </div>
                                </a>
                            </div>
                        </div>

                        {/* Social Icons */}
                        <div className="text-lg text-gray-300 font-light w-full lg:flex lg:flex-col lg:items-end">
                            <p className="text-gray-400 mb-6 lg:text-right">Join The Helix Network 🚀</p>
                            <div className="flex flex-wrap gap-4 md:gap-5 items-center lg:justify-end">
                                <a href="mailto:hello@example.com" title="Gmail" className="text-white hover:text-[#EA4335] transition-colors hover:scale-110">
                                    <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z" /></svg>
                                    </div>
                                </a>
                                <a href="https://www.instagram.com/helix.rvscet?igsh=c2hpenlyNWtzZTZ1" target="_blank" rel="noreferrer" title="Instagram" className="text-white hover:text-[#E1306C] transition-colors hover:scale-110">
                                    <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5a4.25 4.25 0 0 0 4.25 4.25h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5a4.25 4.25 0 0 0-4.25-4.25h-8.5zM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10zm0 1.7a3.3 3.3 0 1 0 0 6.6 3.3 3.3 0 0 0 0-6.6zm5.5-2.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z" /></svg>
                                    </div>
                                </a>
                                <a href="https://www.facebook.com/helix.rvscet" target="_blank" rel="noreferrer" title="Facebook" className="text-white hover:text-[#1877F2] transition-colors hover:scale-110">
                                    <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M13.5 22v-8h2.7l.4-3h-3.1V9.1c0-.9.3-1.5 1.6-1.5h1.7V5a23 23 0 0 0-2.5-.1c-2.5 0-4.2 1.5-4.2 4.3V11H8v3h2.1v8h3.4z" /></svg>
                                    </div>
                                </a>
                                <a href="https://www.linkedin.com/company/helixrvscet/" target="_blank" rel="noreferrer" title="LinkedIn" className="text-white hover:text-[#0A66C2] transition-colors hover:scale-110">
                                    <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M6.5 8.5H3V21h3.5V8.5zM4.75 3A2.05 2.05 0 1 0 4.75 7.1 2.05 2.05 0 0 0 4.75 3zM21 13.7c0-3.8-2-5.5-4.7-5.5-2.1 0-3 .9-3.5 1.6V8.5H9.5V21H13v-6.2c0-1.6.3-3.1 2.2-3.1 1.8 0 1.8 1.8 1.8 3.2V21H21v-7.3z" /></svg>
                                    </div>
                                </a>
                                <a href="https://discord.gg/mJTjbsTwV" target="_blank" rel="noreferrer" title="Discord" className="text-white hover:text-[#5865F2] transition-colors hover:scale-110">
                                    <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.5 5.5a16 16 0 0 0-4-1.2l-.5 1a14 14 0 0 0-6 0l-.5-1a16 16 0 0 0-4 1.2C2.7 9 2 12.3 2 15.5c1.5 1.1 3 1.8 4.5 2.2l1.1-1.5c-.6-.2-1.1-.5-1.6-.8l.4-.3c3 1.4 6.2 1.4 9.1 0l.4.3c-.5.3-1 .6-1.6.8l1.1 1.5c1.5-.4 3-1.1 4.5-2.2 0-3.2-.7-6.5-2.5-10z" /></svg>
                                    </div>
                                </a>
                                <a href="www.youtube.com/@helix.rvscet" target="_blank" rel="noreferrer" title="YouTube" className="text-white hover:text-[#FF0000] transition-colors hover:scale-110">
                                    <div className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.5V8.5L16 12l-6.4 3.5z" /></svg>
                                    </div>
                                </a>
                            </div>
                        </div>

                    </div>
                </div>

                {/* Bottom Divider & Copyright */}
                <div className="flex px-[4vw] w-full justify-between items-center mt-16 mb-4 text-sm text-gray-500 font-light border-t border-white/10 pt-8 relative z-20">
                    <p>© 2026 HELIX</p>
                    <p>RVSCET</p>
                </div>

                {/* Bottom Giant Logo Section: Sliced 3D Glass */}
                <div
                    ref={textRef}
                    className="w-full flex justify-center items-end mt-[4vw] pb-[2vw] pointer-events-auto relative group"
                >
                    {/* Layer 3 (Back) */}
                    <h1 className="glass-layer text-[18vw] text-white/5 font-black tracking-tighter leading-[0.8] m-0 select-none absolute bottom-[2vw] left-0 w-full text-center pointer-events-none">
                        RVSCET
                    </h1>
                    {/* Layer 2 (Middle) */}
                    <h1 className="glass-layer text-[18vw] text-white/20 font-black tracking-tighter leading-[0.8] m-0 select-none absolute bottom-[2vw] left-0 w-full text-center pointer-events-none">
                        RVSCET
                    </h1>
                    {/* Layer 1 (Front) */}
                    <h1 className="glass-layer text-[18vw] text-white font-black tracking-tighter leading-[0.8] m-0 select-none cursor-default relative z-10 w-full text-center pointer-events-auto" style={{ textShadow: "0 20px 40px rgba(0,0,0,0.5)" }}>
                        RVSCET
                    </h1>
                </div>
            </footer>
        </div>
    );
}

export default Footer;