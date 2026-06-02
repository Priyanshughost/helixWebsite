import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import SplitText from 'gsap/SplitText';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useLenis } from 'lenis/react';

import defaultCollection from './collection.js';

gsap.registerPlugin(SplitText, ScrollTrigger);

const defaultConfig = {
    baseRadius: 275,
    sensitivity: 220,
    effectFalloff: 250,
    cardMoveAmount: 50,
    lerpFactor: 0.15,
};

function ImageGallery({ items = defaultCollection, config = defaultConfig }) {
    const mainWrapperRef = useRef(null);
    const lenis = useLenis();
    const galleryRef = useRef(null);
    const galleryContainerRef = useRef(null);
    const cardsRef = useRef([]);
    const titleSplitRef = useRef(null);
    const exitTitle = useRef(null);
    const titleContainerRef = useRef(null);
    const headingWrapperRef = useRef(null);
    const text1SpanRef = useRef(null);
    const exit = useRef(null);

    const [previewContent, setPreviewContent] = useState(null);

    const stateRef = useRef({
        parallax: { targetX: 0, targetY: 0, targetZ: 0, currentX: 0, currentY: 0, currentZ: 0 },
        isTransitioning: false,
        isPreviewing: false,
        hasIntroCompleted: false,
        isMobile: typeof window !== 'undefined' ? window.innerWidth < 1000 : false,
    });

    // 1. PERFORMANCE: Cache card centers to prevent layout thrashing on mousemove
    const cardCentersRef = useRef([]);

    const numItems = items.length;
    const dynamicRadius = Math.max(config.baseRadius, (numItems * 45) / (2 * Math.PI));

    const galleryData = useMemo(() => {
        return items.map((item, i) => {
            const angle = (i / numItems) * Math.PI * 2;
            return {
                id: i,
                angle,
                x: dynamicRadius * Math.cos(angle),
                y: dynamicRadius * Math.sin(angle),
                item,
            };
        });
    }, [items, numItems, dynamicRadius]);

    // 2. PERFORMANCE: Lazy initialize the cards state so it doesn't run on every render
    const cardsStateRef = useRef(null);
    if (!cardsStateRef.current) {
        cardsStateRef.current = galleryData.map((data) => ({
            currentRotation: 0, targetRotation: 0,
            currentX: 0, targetX: 0,
            currentY: 0, targetY: 0,
            currentScale: 1, targetScale: 1,
            angle: data.angle,
        }));
    }

    const settersRef = useRef([]);

    // Safety cleanup for body scroll
    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
            if (lenis) lenis.start(); // <-- Add this
        };
    }, [lenis]);

    // Helper to calculate card centers without causing layout thrashing
    const updateCardCenters = useCallback(() => {
        cardCentersRef.current = cardsRef.current.map(card => {
            if (!card) return { x: 0, y: 0 };
            const rect = card.getBoundingClientRect();
            // Store the "base" center of the card
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });
    }, []);

    // 3. INTRO ANIMATIONS (Upgraded to useGSAP)
    useGSAP(() => {
        const st = stateRef.current;
        gsap.set(headingWrapperRef.current, { opacity: 0, scale: 0.8 });

        cardsRef.current.forEach((card) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const x = gsap.utils.random(-window.innerWidth / 2 + rect.width, window.innerWidth / 2 - rect.width);
            const y = gsap.utils.random(-window.innerHeight / 2 + rect.height, window.innerHeight / 2 - rect.height);

            gsap.set(card, {
                x, y,
                rotation: 0,
                scale: gsap.utils.random(0.6, 1),
                opacity: 0,
                transformPerspective: 800,
                transformOrigin: 'center center',
            });
        });

        gsap.to(cardsRef.current, {
            opacity: 1,
            duration: 1,
            stagger: { amount: 1.5, from: "random" },
            ease: "power2.out",
            scrollTrigger: {
                trigger: mainWrapperRef.current,
                start: "top 80%",
                once: true
            }
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: mainWrapperRef.current,
                start: "top top",
                end: "+=1500",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    if (self.progress > 0.85) {
                        // Once the circle forms, cache the screen positions for the mouse interaction!
                        if (!st.hasIntroCompleted) {
                            st.hasIntroCompleted = true;
                            updateCardCenters();
                        }
                    } else {
                        st.hasIntroCompleted = false;
                        cardsStateRef.current.forEach(cs => {
                            cs.currentX = 0; cs.targetX = 0;
                            cs.currentY = 0; cs.targetY = 0;
                            cs.currentRotation = 0; cs.targetRotation = 0;
                            cs.currentScale = 1; cs.targetScale = 1;
                        });
                    }
                }
            }
        });

        const bandSpacing = window.innerWidth < 768 ? 40 : 80;

        tl.to(cardsRef.current, {
            x: (i) => (i - numItems / 2) * bandSpacing,
            y: 0,
            scale: 1,
            duration: 2,
            ease: "power2.inOut",
            stagger: { amount: 0.5, from: "edges" }
        }, "band");

        tl.to(cardsRef.current, {
            x: (i) => galleryData[i].x,
            y: (i) => galleryData[i].y,
            rotation: (i) => (galleryData[i].angle * 180) / Math.PI + 90,
            duration: 2,
            ease: "power3.inOut",
        }, "circle");

        tl.to(headingWrapperRef.current, {
            opacity: 1,
            scale: 1,
            duration: 1.5,
            ease: "power3.out"
        }, "circle+=1.2");

        tl.set({}, {}, "+=1");

    }, { scope: mainWrapperRef, dependencies: [galleryData, numItems, updateCardCenters] });


    // HIGH-PERFORMANCE GSAP TICKER
    useGSAP(() => {
        settersRef.current = cardsRef.current.map((card) => {
            if (!card) return null;
            return {
                x: gsap.quickSetter(card, 'x', 'px'),
                y: gsap.quickSetter(card, 'y', 'px'),
                rotationY: gsap.quickSetter(card, 'rotationY', 'deg'),
                scale: gsap.quickSetter(card, 'scale'),
            };
        });

        const tick = () => {
            const st = stateRef.current;
            if (!st.hasIntroCompleted || st.isPreviewing || st.isTransitioning) return;

            const p = st.parallax;
            p.currentX += (p.targetX - p.currentX) * config.lerpFactor;
            p.currentY += (p.targetY - p.currentY) * config.lerpFactor;
            p.currentZ += (p.targetZ - p.currentZ) * config.lerpFactor;

            if (galleryContainerRef.current) {
                gsap.set(galleryContainerRef.current, {
                    rotateX: p.currentX,
                    rotateY: p.currentY,
                    rotation: p.currentZ,
                });
            }

            cardsStateRef.current.forEach((cardState, i) => {
                const setters = settersRef.current[i];
                if (!setters) return;

                cardState.currentRotation += (cardState.targetRotation - cardState.currentRotation) * config.lerpFactor;
                cardState.currentScale += (cardState.targetScale - cardState.currentScale) * config.lerpFactor;
                cardState.currentX += (cardState.targetX - cardState.currentX) * config.lerpFactor;
                cardState.currentY += (cardState.targetY - cardState.currentY) * config.lerpFactor;

                setters.x(galleryData[i].x + cardState.currentX);
                setters.y(galleryData[i].y + cardState.currentY);
                setters.rotationY(cardState.currentRotation);
                setters.scale(cardState.currentScale);
            });
        };

        gsap.ticker.add(tick);
        return () => gsap.ticker.remove(tick);
    }, [galleryData, config.lerpFactor]);


    // RESPONSIVE DESIGN
    useGSAP(() => {
        let mm = gsap.matchMedia();

        mm.add('(max-width: 767px)', () => {
            stateRef.current.isMobile = true;
            gsap.to(galleryRef.current, { scale: 0.6, duration: 0.5, ease: 'power2.out' });
        });

        mm.add('(min-width: 768px) and (max-width: 1199px)', () => {
            stateRef.current.isMobile = false;
            gsap.to(galleryRef.current, { scale: 0.8, duration: 0.5, ease: 'power2.out' });
        });

        mm.add('(min-width: 1200px)', () => {
            stateRef.current.isMobile = false;
            gsap.to(galleryRef.current, { scale: 1, duration: 0.5, ease: 'power2.out' });
        });

        // Update cached centers when resizing
        window.addEventListener('resize', updateCardCenters);
        return () => window.removeEventListener('resize', updateCardCenters);
    }, [updateCardCenters]);

    // OPTIMIZED MOUSE MOVE 
    const handleMouseMove = useCallback((e) => {
        const st = stateRef.current;
        if (!st.hasIntroCompleted || st.isPreviewing || st.isTransitioning || st.isMobile) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const percentX = (e.clientX - centerX) / centerX;
        const percentY = (e.clientY - centerY) / centerY;

        st.parallax.targetY = percentX * 15;
        st.parallax.targetX = -percentY * 15;
        st.parallax.targetZ = (percentX + percentY) * 5;

        // Use cached coordinates instead of getBoundingClientRect()!
        cardsStateRef.current.forEach((cardState, index) => {
            const cachedCenter = cardCentersRef.current[index];
            if (!cachedCenter) return;

            const dx = e.clientX - cachedCenter.x;
            const dy = e.clientY - cachedCenter.y;

            // Using squared distances avoids the CPU-heavy Math.sqrt() calculation
            const distSquared = dx * dx + dy * dy;
            const sensitivitySquared = config.sensitivity * config.sensitivity;

            if (distSquared < sensitivitySquared) {
                const distance = Math.sqrt(distSquared); // Only calculate if inside threshold
                const flipFactor = Math.max(0, 1 - distance / config.effectFalloff);
                const moveAmount = config.cardMoveAmount * flipFactor;

                cardState.targetRotation = 180 * flipFactor;
                cardState.targetScale = 1 + 0.3 * flipFactor;
                cardState.targetX = moveAmount * Math.cos(cardState.angle);
                cardState.targetY = moveAmount * Math.sin(cardState.angle);
            } else {
                cardState.targetRotation = 0;
                cardState.targetScale = 1;
                cardState.targetX = 0;
                cardState.targetY = 0;
            }
        });
    }, [config]);

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [handleMouseMove]);


    // PREVIEW TIMELINES
    const { contextSafe } = useGSAP({ scope: mainWrapperRef });

    const togglePreview = contextSafe((index) => {
        const st = stateRef.current;
        if (!st.hasIntroCompleted || st.isPreviewing || st.isTransitioning) return;

        st.isPreviewing = true;
        st.isTransitioning = true;
        document.body.style.overflow = 'hidden';
        if (lenis) lenis.stop();
        setPreviewContent({ title: galleryData[index].item.title, index });

        const angle = cardsStateRef.current[index].angle;
        const targetPosition = (Math.PI * 3) / 2;
        let rotationRadians = targetPosition - angle;

        if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;
        else if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;

        cardsStateRef.current.forEach((cardState) => {
            cardState.targetRotation = cardState.currentRotation = 0;
            cardState.targetScale = cardState.currentScale = 1;
            cardState.targetX = cardState.currentX = 0;
            cardState.targetY = cardState.currentY = 0;
        });

        const tl = gsap.timeline({ onComplete: () => { st.isTransitioning = false; } });

        cardsRef.current.forEach((card, i) => {
            if (!card) return;
            tl.to(card, {
                x: galleryData[i].x,
                y: galleryData[i].y,
                rotationY: 0,
                scale: 1,
                duration: 1.25,
                ease: 'power4.out',
            }, 0);
        });

        tl.to(galleryRef.current, {
            scale: 5,
            y: 1300,
            rotation: (rotationRadians * 180) / Math.PI + 360,
            duration: 2,
            ease: 'power4.inOut',
        }, 0);

        tl.to(st.parallax, {
            currentX: 0, currentY: 0, currentZ: 0,
            duration: 0.5,
            ease: 'power2.out',
            onUpdate: () => {
                if (galleryContainerRef.current) {
                    gsap.set(galleryContainerRef.current, {
                        rotateX: st.parallax.currentX,
                        rotateY: st.parallax.currentY,
                        rotateZ: st.parallax.currentZ,
                        transformOrigin: 'center center',
                    });
                }
            }
        }, 0);
    });

    // 4. MEMORY LEAK FIX: Revert SplitText when preview unmounts
    useEffect(() => {
        if (previewContent && titleContainerRef.current) {
            titleSplitRef.current = new SplitText(titleContainerRef.current, {
                type: 'words',
                wordsClass: 'word relative inline-block',
            });

            gsap.fromTo(titleSplitRef.current.words,
                { y: '125%' },
                { y: '0%', duration: 0.75, delay: 1.25, stagger: 0.1, ease: 'power4.out' }
            );
        }

        if (previewContent && exit.current) {
            exitTitle.current = new SplitText(exit.current, {
                type: 'words',
                wordsClass: 'word relative inline-block',
            });

            gsap.fromTo(exitTitle.current.words,
                { y: '125%' },
                { y: '0%', duration: 0.75, delay: 1.25, stagger: 0.1, ease: 'power4.out' }
            );
        }

        return () => {
            if (titleSplitRef.current) {
                titleSplitRef.current.revert();
            }
            if (exitTitle.current) {
                exitTitle.current.revert();
            }
        }
    }, [previewContent]);

    const resetGallery = contextSafe(() => {
        const st = stateRef.current;
        if (st.isTransitioning) return;
        st.isTransitioning = true;

        const tl = gsap.timeline({
            onComplete: () => {
                st.isPreviewing = false;
                st.isTransitioning = false;
                document.body.style.overflow = '';
                if (lenis) lenis.start();
                setPreviewContent(null);
                Object.assign(st.parallax, { targetX: 0, targetY: 0, targetZ: 0, currentX: 0, currentY: 0, currentZ: 0 });
                // Refresh our caches once everything is settled back in place!
                updateCardCenters();
            },
        });

        if (titleSplitRef.current) {
            tl.to(titleSplitRef.current.words, {
                y: '125%',
                duration: 0.75,
                stagger: 0.1,
                ease: 'power4.out',
            }, 0);
        }

        if (exitTitle.current) {
            tl.to(exitTitle.current.words, {
                y: '125%',
                duration: 0.75,
                stagger: 0.1,
                ease: 'power4.out',
            }, 0);
        }

        const viewportWidth = window.innerWidth;
        let targetScale = viewportWidth < 768 ? 0.6 : viewportWidth < 1200 ? 0.8 : 1;

        tl.to(galleryRef.current, {
            scale: targetScale,
            y: 0,
            x: 0,
            rotation: 0,
            duration: 2.5,
            ease: 'power4.inOut',
        }, 0.5);
    });

    const handleCardClick = (index, e) => {
        e.stopPropagation();
        if (!stateRef.current.isPreviewing && !stateRef.current.isTransitioning && stateRef.current.hasIntroCompleted) {
            togglePreview(index);
        }
    };

    const handleDocumentClick = () => {
        if (stateRef.current.isPreviewing && !stateRef.current.isTransitioning) {
            resetGallery();
        }
    };

    return (
        <div ref={mainWrapperRef} onClick={handleDocumentClick} className="w-full h-[110svh] overflow-hidden relative select-none bg-white">

            {/* 5. CONDITIONAL MOUNT FIX: Using CSS to hide instead of removing from DOM */}
            <div
                ref={headingWrapperRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-opacity duration-300"
                style={{
                    opacity: previewContent ? 0 : 1,
                    pointerEvents: previewContent ? 'none' : 'auto'
                }}
            >
                <h1 className="relative text-4xl sm:text-5xl md:text-6xl font-medium tracking-tight whitespace-nowrap m-0 leading-normal block text-center">
                    <span ref={text1SpanRef} className="inline-block">Gallery</span>
                </h1>
            </div>

            <div className="relative w-full h-full overflow-visible">
                <div ref={galleryContainerRef} className="relative w-full h-full flex justify-center items-center transform-3d perspective-[2000px] will-change-transform">
                    <div ref={galleryRef} className="relative w-full h-full flex justify-center items-center origin-center will-change-transform">
                        {galleryData.map((data, i) => (
                            <div
                                key={data.id}
                                title={data.item.title}
                                ref={(el) => (cardsRef.current[i] = el)}
                                onClick={(e) => handleCardClick(i, e)}
                                className="absolute w-11.25 h-15 rounded-sm origin-center will-change-transform transform-3d backface-visible overflow-hidden cursor-pointer opacity-0"
                            >
                                <img src={data.item.img} alt={data.item.title} className="w-full h-full object-cover backface-hidden" />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 w-full leading-normal h-auto pointer-events-none z-40 overflow-hidden">
                    {previewContent && (
                        <div ref={titleContainerRef} className="w-full text-center text-[36px] font-semibold tracking-[-0.05rem] text-[#1f1f1f] font-sans">
                            {previewContent.title}
                        </div>
                    )}
                    {previewContent && (
                        <div ref={exit} className="w-full text-center text-[18px] tracking-[-0.05rem] text-[#1f1f1f] font-sans">
                            Click here to exit
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImageGallery;
