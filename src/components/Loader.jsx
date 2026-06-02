import { useEffect, useRef } from "react"; // Added useEffect import
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useLenis } from 'lenis/react';

export default function Loader({ onComplete }) {
    const loaderRef = useRef(null);
    const textWrapperRef = useRef(null);
    const sweepRef = useRef(null);
    const lenis = useLenis();

    // useEffect(() => {
    //     // 1. Lock scrolling when the loader mounts
    //     document.body.style.overflow = 'hidden';
    //     if (lenis) lenis.stop();

    //     // 2. Unlock scrolling when the loader unmounts
    //     return () => {
    //         document.body.style.overflow = '';
    //         if (lenis) lenis.start();
    //     };
    // }, [lenis]);

    useGSAP(() => {
        const tl = gsap.timeline({
            defaults: {
                ease: "expo.inOut",
            },
            onComplete: () => {
                onComplete?.();
            },
        });

        // Intro state
        gsap.set(textWrapperRef.current, {
            y: 20,
            opacity: 0,
        });

        tl.to(textWrapperRef.current, {
            y: 0,
            opacity: 1,
            duration: 0.8,
        })

            // Sweep reveal
            .to(
                sweepRef.current,
                {
                    clipPath: "inset(0 0% 0 0)",
                    duration: 1.8,
                    ease: "power3.inOut",
                },
                "-=0.3"
            )

            // Hold briefly
            .to({}, { duration: 0.25 })

            // Text exit
            .to(
                textWrapperRef.current,
                {
                    yPercent: -130,
                    duration: 1,
                    ease: "expo.inOut",
                },
                "+=0.15"
            )

            // Loader panel reveal
            .to(
                loaderRef.current,
                {
                    yPercent: -100,
                    duration: 1.4,
                    ease: "expo.inOut",
                },
                "<"
            );
    }, { scope: loaderRef });

    return (
        <div
            ref={loaderRef}
            className="fixed inset-0 z-9999 flex items-center justify-center bg-[#0a0a0a]"
        >
            <div className="overflow-hidden">
                <div
                    ref={textWrapperRef}
                    className="relative text-center text-[min(2rem,5vw)] font-extralight will-change-transform"
                >
                    <span className="text-white opacity-20 whitespace-nowrap">
                        Helix - The Tech Club of RVSCET
                    </span>

                    <span
                        ref={sweepRef}
                        className="absolute left-0 top-0 text-white whitespace-nowrap font-extralight"
                        style={{
                            clipPath: "inset(0 100% 0 0)",
                            willChange: "clip-path"
                        }}
                    >
                        Helix - The Tech Club of RVSCET
                    </span>
                </div>
            </div>
        </div>
    );
}
