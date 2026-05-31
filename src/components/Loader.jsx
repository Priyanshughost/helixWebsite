import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";

export default function Loader({ onComplete }) {
    const loaderRef = useRef(null);
    const textWrapperRef = useRef(null);
    const sweepRef = useRef(null);

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
                    className="relative text-center text-[min(2rem,5vw)] font-extralight"
                >
                    <span className="text-white opacity-20 whitespace-nowrap">
                        Helix - The Tech Club of RVSCET
                    </span>

                    <span
                        ref={sweepRef}
                        className="absolute left-0 top-0 text-white whitespace-nowrap font-extralight"
                        style={{
                            clipPath: "inset(0 100% 0 0)",
                        }}
                    >
                        Helix - The Tech Club of RVSCET
                    </span>
                </div>
            </div>
        </div>
    );
}