import React, { useRef, useState, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture, useCursor } from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { eventList } from "./eventList";
import { useIsMobile } from "../../hooks/useIsMobile";

gsap.registerPlugin(ScrollTrigger);

// --- 1. CONFIGURATION ---
const getLayoutConfig = (isMobile) => ({
    cardsPerLoop: 12,
    cardHeight: 2.8,
    loopGap: 0.15,
    baseRadius: isMobile ? 5.5 : 7.5,
    cameraZ: isMobile ? 22 : 14,
    taperFactor: 0.08,
});

// --- 2. INDIVIDUAL CARD COMPONENT ---
function CurvedCard({ url, index, config }) {
    const meshRef = useRef();
    const [hovered, setHovered] = useState(false);

    useCursor(hovered);

    const texture = useTexture(url);
    texture.colorSpace = THREE.SRGBColorSpace;

    const { cardsPerLoop, cardHeight, loopGap, baseRadius, taperFactor } = config;
    const yStep = (cardHeight + loopGap) / cardsPerLoop;
    const angle = index * ((Math.PI * 2) / cardsPerLoop);
    const yPos = -(index * yStep);

    const rTop = Math.max(0.1, baseRadius + (yPos + cardHeight / 2) * taperFactor);
    const rBottom = Math.max(0.1, baseRadius + (yPos - cardHeight / 2) * taperFactor);
    const thetaLength = (Math.PI * 2) / cardsPerLoop;

    const geometry = useMemo(() => {
        const geom = new THREE.CylinderGeometry(rTop, rBottom, cardHeight, 32, 1, true, 0, thetaLength);
        const positions = geom.attributes.position;

        for (let i = 0; i < positions.count; i++) {
            const x = positions.getX(i);
            const z = positions.getZ(i);
            let theta = Math.atan2(x, z);
            if (theta < -0.0001) theta += Math.PI * 2;

            const yShift = -(theta / thetaLength) * yStep;
            positions.setY(i, positions.getY(i) + yShift);
        }

        geom.computeVertexNormals();
        return geom;
    }, [rTop, rBottom, cardHeight, thetaLength, yStep]);

    // Only calculating target scale now, colors remain fully bright
    const targetScale = hovered ? 1.06 : 1.0;

    useFrame((state, delta) => {
        if (meshRef.current) {
            const currentScale = meshRef.current.scale.x;
            const newScale = THREE.MathUtils.lerp(currentScale, targetScale, delta * 8);
            meshRef.current.scale.setScalar(newScale);
        }
    });

    return (
        <mesh
            ref={meshRef}
            position={[0, yPos, 0]}
            rotation={[0, angle, 0]}
            onPointerOver={(e) => {
                e.stopPropagation();
                setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
            geometry={geometry}
        >
            <meshStandardMaterial
                map={texture}
                side={THREE.DoubleSide}
                roughness={0.3}
                metalness={0.2}
                color="#ffffff"
            />
        </mesh>
    );
}

// --- 3. SCENE COMPONENT ---
function Scene({ config, scrollData }) {
    const groupRef = useRef();
    const parallaxRef = useRef();
    const idleRot = useRef(0);

    useFrame((state, delta) => {
        if (groupRef.current) {
            idleRot.current += delta * 0.05;
            groupRef.current.position.y = scrollData.current.y;
            groupRef.current.rotation.y = scrollData.current.rotY + idleRot.current;
        }

        if (parallaxRef.current) {
            const targetX = state.pointer.y * 0.1;
            const targetY = state.pointer.x * 0.1;
            parallaxRef.current.rotation.x = THREE.MathUtils.lerp(parallaxRef.current.rotation.x, targetX, delta * 3);
            parallaxRef.current.rotation.y = THREE.MathUtils.lerp(parallaxRef.current.rotation.y, targetY, delta * 3);
        }
    });

    return (
        <group ref={parallaxRef}>
            <group ref={groupRef} position={[0, 1, 0]} rotation={[0.15, 0, 0]}>
                {eventList.map((event, index) => (
                    <CurvedCard key={index} url={event.img} index={index} config={config} />
                ))}
            </group>
        </group>
    );
}

// --- 4. MAIN COMPONENT ---
export default function EventSection() {
    const containerRef = useRef(null);
    const [inView, setInView] = useState(false); // Add visibility state

    const numCards = eventList?.length || 0;
    const isMobile = useIsMobile();

    const config = useMemo(() => getLayoutConfig(isMobile), [isMobile]);
    const scrollData = useRef({ y: 0, rotY: 0 });

    // 1. native Intersection Observer to detect if section is on screen
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            // Trigger 200px before it comes into view to prevent loading pops
            { rootMargin: "200px" }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useGSAP(() => {
        if (numCards === 0) return;

        const yStep = (config.cardHeight + config.loopGap) / config.cardsPerLoop;
        const totalYMovement = (numCards * yStep) - (yStep * 4);
        const totalRotation = (numCards / config.cardsPerLoop) * (Math.PI * 2);

        scrollData.current = { y: 0, rotY: 0 };

        const tl = gsap.to(scrollData.current, {
            y: totalYMovement,
            rotY: -totalRotation,
            ease: "none",
            scrollTrigger: {
                trigger: containerRef.current,
                scrub: 1,
                start: "top top",
                end: "bottom bottom",
                invalidateOnRefresh: true,
            },
        });

        return () => {
            tl.kill();
        };
    }, { scope: containerRef, dependencies: [config, numCards] });

    if (numCards === 0) return null;

    const trackHeight = `calc(100vh + ${numCards * 300}px)`;

    return (
        <section
            ref={containerRef}
            className="relative w-full bg-[#0c0c0c]"
            style={{ height: trackHeight }}
        >
            <div className="sticky top-0 w-full h-screen overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
                    <h1 className="text-[15vw] font-black tracking-tighter leading-none text-white text-center">
                        Events By HELIX
                    </h1>
                </div>

                <div className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing">
                    {/* 2. Dynamically pause frameloop & strictly cap DPR */}
                    <Canvas
                        frameloop={inView ? "always" : "never"}
                        dpr={[1, 1.5]}
                        camera={{ position: [0, -2, config.cameraZ], fov: 45 }}
                    >
                        <ambientLight intensity={1.5} />
                        <directionalLight position={[10, 10, 10]} intensity={2} />
                        <directionalLight position={[-10, -10, -10]} intensity={0.5} />

                        <Suspense fallback={null}>
                            {/* The scene will completely freeze when out of view, saving massive CPU/GPU */}
                            <Scene config={config} scrollData={scrollData} />
                        </Suspense>
                    </Canvas>
                </div>
            </div>
        </section>
    );
}