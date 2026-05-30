import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

// Register the plugins outside the component to avoid registering them on every render
gsap.registerPlugin(ScrollTrigger, SplitText);

function Footer() {
    const footerRef = useRef(null);
    const textRef = useRef(null);

    useGSAP(() => {
        const ctx = gsap.context(() => {

            gsap.fromTo(
                footerRef.current,
                { yPercent: -25 },
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

            const splitLogo = new SplitText(textRef.current, { type: "chars" });

            gsap.from(splitLogo.chars, {
                yPercent: -120,
                duration: 1,
                ease: "expo.out",
                stagger: 0.08,
                scrollTrigger: {
                    trigger: footerRef.current,
                    start: "top top",
                    // markers: true,
                }
            });

        }, footerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="bg-black text-white font-sans min-h-screen flex flex-col justify-end antialiased overflow-hidden">
            <footer
                ref={footerRef}
                className="pt-[4vw] pb-0 flex flex-col gap-10 justify-between h-auto"
            >
                {/* Top Section */}
                <div className="flex px-[2vw] w-full md:flex-nowrap justify-between flex-wrap gap-10">

                    {/* Left Column */}
                    <div className="flex flex-col justify-between w-full md:w-1/2">
                        <h2 className="text-[clamp(2rem,3.5vw,4rem)] font-normal tracking-tight mb-15">
                            We Build once. <span className="text-[#e5d9c5]">And DOMINATE forever.</span>
                        </h2>

                        <div className="mb-15 text-base leading-snug">
                            <p>
                                New Business:<br />
                                <a href="mailto:hello@example.com" className="transition-opacity duration-200 hover:opacity-70">
                                    hello@example.com
                                </a>
                            </p>
                        </div>

                        <div className="text-base">
                            <p className="mb-3">Sign up for our newsletter (No spam)</p>
                            <form
                                className="flex items-center border-b border-[#444] pb-2 max-w-88"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <input
                                    type="email"
                                    placeholder="Email"
                                    required
                                    className="bg-transparent border-none text-white text-base grow outline-none placeholder:text-[#555]"
                                />
                                <button
                                    type="submit"
                                    className="bg-transparent border-none text-[#888] text-xl cursor-pointer pl-2.5 transition-opacity duration-200 hover:opacity-70"
                                >
                                    &#8594;
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col justify-between w-full md:w-max gap-10 md:gap-0">
                        <div className="flex gap-[8vw]">
                            <ul className="flex flex-col">
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">Home</a></li>
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">Work</a></li>
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">About</a></li>
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">Services</a></li>
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">Contact</a></li>
                            </ul>
                            <ul className="flex flex-col">
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">Instagram &#8599;</a></li>
                                <li className="mb-1.5 text-base"><a href="#" className="transition-opacity duration-200 hover:opacity-70">LinkedIn &#8599;</a></li>
                            </ul>
                        </div>

                        <div className="flex gap-[8vw] mt-auto md:pt-15">
                            <div className="text-base leading-snug">
                                <p>San Diego—USA<br />Paris—France</p>
                            </div>
                            <div className="text-base leading-snug">
                                <p>Terms of use<br />©13—26</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Giant Logo Section */}
                {/* overflow-hidden here is crucial so the text "hides" beneath the bounding box before sliding up */}
                <div className="w-full overflow-hidden flex justify-center items-end m-0 p-0">
                    <h1
                        ref={textRef}
                        className="text-[20vw] text-white font-extrabold tracking-widest leading-none m-0"
                    >
                        RVSCET
                    </h1>
                </div>
            </footer>
        </div>
    );
}

export default Footer;