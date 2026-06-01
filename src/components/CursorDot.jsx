import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useCursor } from "../context/CursorContext";

function CursorDot() {
    const dotRef = useRef(null);
    const { cursorVariant, cursorImage } = useCursor();
    const [hasMouse, setHasMouse] = useState(false);

    const variantRef = useRef(cursorVariant);

    useEffect(() => {
        variantRef.current = cursorVariant;
    }, [cursorVariant]);

    useEffect(() => {
        const hasPointer = window.matchMedia("(pointer: fine)").matches;
        setHasMouse(hasPointer);
    }, []);

    // Morphing shape effect
    useEffect(() => {
        if (!hasMouse || !dotRef.current) return;

        if (cursorVariant === 'reel-hover') {
            gsap.to(dotRef.current, {
                width: 300,
                height: 200,
                borderRadius: "0px",
                backgroundColor: "transparent",
                duration: 0.4,
                ease: "power3.inOut",
                overwrite: "auto"
            });
        } else {
            gsap.to(dotRef.current, {
                width: 12,
                height: 12,
                borderRadius: "50%",
                backgroundColor: "black",
                duration: 0.4,
                ease: "power3.out",
                overwrite: "auto"
            });
        }
    }, [cursorVariant, hasMouse]);

    // Movement ticker effect
    useEffect(() => {
        if (!hasMouse || !dotRef.current) return;

        let mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
        let current = { x: mouse.x, y: mouse.y };
        let speed = 0;
        let targetVisibility = 0;
        let currentVisibility = 0;

        // NEW: Keep track of the current smoothed tilt
        let currentTilt = 0;

        const setX = gsap.quickSetter(dotRef.current, "x", "px");
        const setY = gsap.quickSetter(dotRef.current, "y", "px");
        const setRotation = gsap.quickSetter(dotRef.current, "rotation", "deg");
        const setScaleX = gsap.quickSetter(dotRef.current, "scaleX");
        const setScaleY = gsap.quickSetter(dotRef.current, "scaleY");

        const moveMouse = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
            targetVisibility = 1;
        };

        const handleMouseLeave = () => targetVisibility = 0;
        const handleMouseEnter = () => targetVisibility = 1;

        window.addEventListener("mousemove", moveMouse);
        document.addEventListener("mouseleave", handleMouseLeave);
        document.addEventListener("mouseenter", handleMouseEnter);

        gsap.ticker.add(update);

        function update() {
            const lerp = 0.1;
            const visibilityLerp = 0.15;
            const tiltLerp = 0.1;

            current.x += (mouse.x - current.x) * lerp;
            current.y += (mouse.y - current.y) * lerp;
            currentVisibility += (targetVisibility - currentVisibility) * visibilityLerp;

            // --- THE THRESHOLD FIX ---
            // Prevent floating-point underflow by snapping to 0 or 1
            if (currentVisibility < 0.001) currentVisibility = 0;
            if (currentVisibility > 0.999) currentVisibility = 1;
            // -------------------------

            const deltaX = mouse.x - current.x;
            const deltaY = mouse.y - current.y;

            speed = Math.min(
                Math.sqrt(deltaX * deltaX + deltaY * deltaY) * 0.35,
                35
            );

            // Angle for the stretchy circular dot
            const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);

            // Calculate the TARGET tilt for the rectangle
            const maxTilt = 15;
            const tiltMultiplier = 0.15;
            const targetTilt = Math.max(-maxTilt, Math.min(maxTilt, deltaX * tiltMultiplier));

            // NEW: Smoothly interpolate the current tilt towards the target tilt
            currentTilt += (targetTilt - currentTilt) * tiltLerp;

            const isHovering = variantRef.current === 'reel-hover';
            const intensity = 45;

            const baseScaleX = isHovering ? 1 : 1 + speed / intensity;
            const baseScaleY = isHovering ? 1 : 1 - speed / (intensity * 2.5);

            const finalScaleX = baseScaleX * currentVisibility;
            const finalScaleY = baseScaleY * currentVisibility;

            setX(current.x);
            setY(current.y);

            // Output the smoothed 'currentTilt' instead of the raw 'targetTilt'
            setRotation(isHovering ? currentTilt : angle);
            setScaleX(finalScaleX);
            setScaleY(finalScaleY);
        }

        return () => {
            window.removeEventListener("mousemove", moveMouse);
            document.removeEventListener("mouseleave", handleMouseLeave);
            document.removeEventListener("mouseenter", handleMouseEnter);
            gsap.ticker.remove(update);
        };
    }, [hasMouse]);

    if (!hasMouse) return null;

    return (
        <div
            ref={dotRef}
            className="fixed top-0 left-0 pointer-events-none z-1000 overflow-hidden flex items-center justify-center will-change-transform"
            style={{
                transform: "translate(-50%, -50%)",
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#1d4ed8'
            }}
        >
            {cursorImage && (
                <img
                    src={cursorImage}
                    alt="Cursor Preview"
                    className="w-full h-full object-cover transition-opacity duration-300"
                    style={{
                        opacity: cursorVariant === 'reel-hover' ? 1 : 0
                    }}
                />
            )}
        </div>
    );
}

export default CursorDot;