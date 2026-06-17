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

    const cardCentersRef = useRef([]);
    const mousePosRef = useRef({ x: -1000, y: -1000 });
    const containerBaseYRef = useRef(0);

    const numItems = items.length;
    const dynamicRadius = Math.max(config.baseRadius, (numItems * 45) / (2 * Math.PI));

    const galleryData = useMemo(() => {
        return items.map((item, i) => {
            const angle = (i / numItems) * Math.PI * 2;
            const cylAngle = (i / numItems) * Math.PI * 2 - Math.PI;

            return {
                id: i,
                angle,
                x: dynamicRadius * Math.cos(angle),
                y: dynamicRadius * Math.sin(angle),
                cylX: dynamicRadius * Math.sin(cylAngle),
                cylZ: dynamicRadius * Math.cos(cylAngle) - dynamicRadius,
                cylRotationY: (cylAngle * 180) / Math.PI,
                item,
            };
        });
    }, [items, numItems, dynamicRadius]);

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

    useEffect(() => {
        return () => {
            document.body.style.overflow = '';
            if (lenis) lenis.start();
        };
    }, [lenis]);

    const updateCardCenters = useCallback(() => {
        if (mainWrapperRef.current) {
            containerBaseYRef.current = mainWrapperRef.current.getBoundingClientRect().top;
        }

        cardCentersRef.current = cardsRef.current.map(card => {
            if (!card) return { x: 0, y: 0 };
            const rect = card.getBoundingClientRect();
            return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
        });
    }, []);

    useGSAP(() => {
        const st = stateRef.current;
        gsap.set(headingWrapperRef.current, { opacity: 0, scale: 0.8 });

        cardsRef.current.forEach((card) => {
            if (!card) return;
            const rect = card.getBoundingClientRect();
            const x = gsap.utils.random(-window.innerWidth / 2 + rect.width, window.innerWidth / 2 - rect.width);
            const y = gsap.utils.random(-window.innerHeight / 2 + rect.height, window.innerHeight / 2 - rect.height);

            gsap.set(card, {
                x, y, z: 0,
                rotation: 0,
                scale: gsap.utils.random(1, 1.5),
                opacity: 0,
                transformPerspective: 1500,
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
                end: "+=2500",
                scrub: 1,
                pin: true,
                anticipatePin: 1,
                onUpdate: (self) => {
                    if (self.progress > 0.85) {
                        if (!st.hasIntroCompleted) {
                            st.hasIntroCompleted = true;
                            gsap.killTweensOf(cardsRef.current, "rotationY,rotationX,z");
                            if (galleryContainerRef.current) {
                                gsap.killTweensOf(galleryContainerRef.current);
                            }
                            updateCardCenters();
                        }
                    } else {
                        if (st.hasIntroCompleted) {
                            st.hasIntroCompleted = false;

                            cardsStateRef.current.forEach(cs => {
                                cs.currentX = 0; cs.targetX = 0;
                                cs.currentY = 0; cs.targetY = 0;
                                cs.currentRotation = 0; cs.targetRotation = 0;
                                cs.currentScale = 1; cs.targetScale = 1;
                            });

                            st.parallax.currentX = 0; st.parallax.targetX = 0;
                            st.parallax.currentY = 0; st.parallax.targetY = 0;
                            st.parallax.currentZ = 0; st.parallax.targetZ = 0;

                            gsap.to(cardsRef.current, {
                                rotationY: 0,
                                rotationX: 0,
                                z: 0,
                                duration: 0.5,
                                ease: "power2.out",
                                overwrite: "auto"
                            });

                            if (galleryContainerRef.current) {
                                gsap.to(galleryContainerRef.current, {
                                    rotateX: 0,
                                    rotateY: 0,
                                    rotation: 0,
                                    duration: 0.5,
                                    ease: "power2.out",
                                    overwrite: "auto"
                                });
                            }
                        }
                    }
                }
            }
        });

        const bandSpacing = window.innerWidth < 768 ? 40 : 80;

        tl.to(cardsRef.current, {
            x: (i) => (i - numItems / 2) * bandSpacing,
            y: 0, z: 0, rotation: 0, rotationX: 0, rotationY: 0, scale: 1,
            duration: 2, ease: "power2.inOut", stagger: { amount: 0.5, from: "edges" }
        }, "band");

        tl.to(cardsRef.current, {
            x: (i) => galleryData[i].cylX,
            y: 0,
            z: (i) => galleryData[i].cylZ,
            rotationY: (i) => galleryData[i].cylRotationY,
            rotationX: 0, rotation: 0,
            duration: 2.5, ease: "power3.inOut",
        }, "cylinder");

        tl.to(cardsRef.current, {
            x: (i) => galleryData[i].x,
            y: (i) => galleryData[i].y,
            z: 0, rotationY: 0, rotationX: 0,
            rotation: (i) => (galleryData[i].angle * 180) / Math.PI + 90,
            duration: 2.5, ease: "power3.inOut",
        }, "circle");

        tl.to(headingWrapperRef.current, {
            opacity: 1, scale: 1, duration: 1.5, ease: "power3.out"
        }, "circle+=1.5");

        tl.set({}, {}, "+=1");

    }, { scope: mainWrapperRef, dependencies: [galleryData, numItems, updateCardCenters] });

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
            // OPTIMIZATION: Early exit kills the math loop instantly on mobile devices or during transitions
            if (!st.hasIntroCompleted || st.isPreviewing || st.isTransitioning || st.isMobile) return;

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

    }, []);

    // OPTIMIZATION: Debounced resize listener to prevent layout thrashing
    useEffect(() => {
        let resizeTimer;
        const debouncedResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(updateCardCenters, 200);
        };

        window.addEventListener('resize', debouncedResize);
        return () => {
            window.removeEventListener('resize', debouncedResize);
            clearTimeout(resizeTimer);
        };
    }, [updateCardCenters]);

    const calculateHover = useCallback(() => {
        const st = stateRef.current;
        // OPTIMIZATION: Double-check mobile exit
        if (!st.hasIntroCompleted || st.isPreviewing || st.isTransitioning || st.isMobile) return;

        const { x: clientX, y: clientY } = mousePosRef.current;
        if (clientX === -1000) return;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const percentX = (clientX - centerX) / centerX;
        const percentY = (clientY - centerY) / centerY;

        st.parallax.targetY = percentX * 15;
        st.parallax.targetX = -percentY * 15;
        st.parallax.targetZ = (percentX + percentY) * 5;

        let yOffset = 0;
        if (mainWrapperRef.current) {
            const currentTop = mainWrapperRef.current.getBoundingClientRect().top;
            yOffset = currentTop - containerBaseYRef.current;
        }

        cardsStateRef.current.forEach((cardState, index) => {
            const cachedCenter = cardCentersRef.current[index];
            if (!cachedCenter) return;

            const dynamicCenterY = cachedCenter.y + yOffset;
            const dx = clientX - cachedCenter.x;
            const dy = clientY - dynamicCenterY;
            const distSquared = dx * dx + dy * dy;
            const sensitivitySquared = config.sensitivity * config.sensitivity;

            if (distSquared < sensitivitySquared) {
                const distance = Math.sqrt(distSquared);
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

    const handleMouseMove = useCallback((e) => {
        mousePosRef.current = { x: e.clientX, y: e.clientY };
        calculateHover();
    }, [calculateHover]);

    // OPTIMIZATION: Only bind mouse/scroll tracking if NOT on mobile
    useEffect(() => {
        if (stateRef.current.isMobile) return;

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', calculateHover, { passive: true });

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', calculateHover);
        };
    }, [handleMouseMove, calculateHover]);

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
                z: 0,
                rotationY: 0,
                rotationX: 0,
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
                updateCardCenters();
            },
        });

        if (titleSplitRef.current) {
            tl.to(titleSplitRef.current.words, { y: '125%', duration: 0.75, stagger: 0.1, ease: 'power4.out' }, 0);
        }

        if (exitTitle.current) {
            tl.to(exitTitle.current.words, { y: '125%', duration: 0.75, stagger: 0.1, ease: 'power4.out' }, 0);
        }

        const viewportWidth = window.innerWidth;
        let targetScale = viewportWidth < 768 ? 0.6 : viewportWidth < 1200 ? 0.8 : 1;

        tl.to(galleryRef.current, {
            scale: targetScale,
            y: 0, x: 0, rotation: 0,
            duration: 2.5, ease: 'power4.inOut',
        }, 0.5);
    });

    const handleCardClick = (index, e) => {
        e.stopPropagation();
        if (!stateRef.current.isPreviewing && !stateRef.current.isTransitioning && stateRef.current.hasIntroCompleted) {
            togglePreview(index);
        }
    };

    const handleDocumentClick = () => {
        const st = stateRef.current;

        if (st.isTransitioning) return;

        if (st.isPreviewing) {
            resetGallery();
        }
    };

    return (
        <div id="gallery" ref={mainWrapperRef} onClick={handleDocumentClick} className="w-full h-screen overflow-hidden relative select-none bg-black">
            <div
                ref={headingWrapperRef}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 transition-opacity duration-300"
                style={{
                    opacity: previewContent ? 0 : 1,
                    pointerEvents: previewContent ? 'none' : 'auto'
                }}
            >
                <h1 className="text-4xl md:text-7xl font-black tracking-tight uppercase text-center text-transparent bg-clip-text bg-linear-to-b from-white to-white/40 drop-shadow-2xl">
                    <span ref={text1SpanRef} className="inline-block">Gallery</span>
                </h1>
            </div>

            <div className="relative w-full h-full overflow-visible">
                <div
                    ref={galleryContainerRef}
                    className="relative w-full h-full flex justify-center items-center transform-3d perspective-[2000px] will-change-transform"
                    style={{ transformStyle: 'preserve-3d' }}
                >
                    <div
                        ref={galleryRef}
                        className="relative w-full h-full flex justify-center items-center origin-center will-change-transform"
                        style={{ transformStyle: 'preserve-3d' }}
                    >
                        {galleryData.map((data, i) => (
                            <div
                                key={data.id}
                                title={data.item.title}
                                ref={(el) => (cardsRef.current[i] = el)}
                                onClick={(e) => handleCardClick(i, e)}
                                className="absolute w-11.25 h-15 rounded-sm origin-center will-change-transform overflow-hidden cursor-pointer opacity-0"
                                style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'visible' }}
                            >
                                <img src={data.item.img} alt={data.item.title} className="w-full h-full object-cover" loading="lazy" style={{ backfaceVisibility: 'visible' }} />
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