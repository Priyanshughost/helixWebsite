// import React, { useRef } from 'react';
// import gsap from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
// import { useGSAP } from '@gsap/react';
// import { eventList } from './Events/eventList';

// import { SplitText } from 'gsap/SplitText';

// gsap.registerPlugin(ScrollTrigger, SplitText);

// const RecentEvent = () => {
//     const containerRef = useRef(null);
//     const imageRef = useRef(null);
//     const textRef = useRef(null);

//     const headingRef = useRef(null);
//     const imageContainerRef = useRef(null);

//     const text1SpanRef = useRef(null);
//     const text2SpanRef = useRef(null);
//     const lineRef = useRef(null);
//     const split1Ref = useRef(null);
//     const split2Ref = useRef(null);

//     const featuredEvent = {
//         title: "Hack Qubit 26",
//         date: "October",
//         img: "https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?q=80&w=1000&auto=format&fit=crop"
//     };

//     const { contextSafe } = useGSAP(() => {
//         let splitTitle;

//         // Hover text setup
//         if (text1SpanRef.current && text2SpanRef.current) {
//             const split1 = new SplitText(text1SpanRef.current, { type: 'chars' });
//             const split2 = new SplitText(text2SpanRef.current, { type: 'chars' });

//             split1Ref.current = split1;
//             split2Ref.current = split2;

//             gsap.set(split2.chars, { yPercent: 120 });
//             gsap.set(lineRef.current, { width: text1SpanRef.current.offsetWidth });
//         }

//         // Advanced Text reveal animation using SplitText
//         if (headingRef.current) {
//             splitTitle = new SplitText(headingRef.current, { type: 'words,chars' });
//             gsap.from(splitTitle.chars, {
//                 y: 100,
//                 opacity: 0,
//                 duration: 1,
//                 stagger: 0.05,
//                 ease: "back.out(1.5)",
//                 scrollTrigger: {
//                     trigger: headingRef.current,
//                     start: "top 80%",
//                 }
//             });
//         }

//         // Image Mask Reveal
//         if (imageContainerRef.current) {
//             gsap.fromTo(imageContainerRef.current, 
//                 { clipPath: "inset(100% 0% 0% 0%)" },
//                 { 
//                     clipPath: "inset(0% 0% 0% 0%)", 
//                     duration: 1.5, 
//                     ease: "power4.inOut",
//                     scrollTrigger: {
//                         trigger: imageContainerRef.current,
//                         start: "top 85%",
//                     }
//                 }
//             );
//         }

//         // Image Parallax Effect
//         if (imageRef.current && imageContainerRef.current) {
//             gsap.fromTo(imageRef.current, 
//                 { scale: 1.2, yPercent: -10 },
//                 {
//                     scale: 1,
//                     yPercent: 10,
//                     ease: "none",
//                     scrollTrigger: {
//                         trigger: imageContainerRef.current,
//                         start: "top bottom",
//                         end: "bottom top",
//                         scrub: true,
//                     }
//                 }
//             );
//         }

//         // Details reveal animation
//         if (textRef.current) {
//             gsap.fromTo(textRef.current.children,
//                 { x: 50, opacity: 0 },
//                 {
//                     x: 0,
//                     opacity: 1,
//                     duration: 1,
//                     stagger: 0.15,
//                     ease: "power3.out",
//                     scrollTrigger: {
//                         trigger: textRef.current,
//                         start: "top 75%",
//                     }
//                 }
//             );
//         }

//         return () => {
//             // Cleanup split text properly
//             if (splitTitle) {
//                 splitTitle.revert();
//             }
//             if (split1Ref.current) split1Ref.current.revert();
//             if (split2Ref.current) split2Ref.current.revert();
//         };
//     }, { scope: containerRef });

//     const handleMouseEnter = contextSafe(() => {
//         if (!split1Ref.current || !split2Ref.current) return;

//         gsap.to(split1Ref.current.chars, { yPercent: -120, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });
//         gsap.to(split2Ref.current.chars, { yPercent: 0, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });

//         if (text1SpanRef.current && text2SpanRef.current && lineRef.current) {
//             const targetScale = text2SpanRef.current.offsetWidth / text1SpanRef.current.offsetWidth;
//             gsap.to(lineRef.current, { scaleX: targetScale, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
//         }
//     });

//     const handleMouseLeave = contextSafe(() => {
//         if (!split1Ref.current || !split2Ref.current) return;

//         gsap.to(split1Ref.current.chars, { yPercent: 0, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });
//         gsap.to(split2Ref.current.chars, { yPercent: 120, duration: 0.6, stagger: 0.02, ease: 'power3.inOut', overwrite: 'auto' });

//         if (lineRef.current) {
//             gsap.to(lineRef.current, { scaleX: 1, duration: 0.6, ease: 'power3.inOut', overwrite: 'auto' });
//         }
//     });

//     return (
//         <section ref={containerRef} className="w-full bg-white text-black py-16 md:py-32 px-4 sm:px-6 md:px-12 lg:px-20 overflow-hidden">
//             <div className="max-w-[1400px] mx-auto">
//                 <div className="flex flex-col items-start mb-12">
//                     <h2 className="text-sm md:text-base uppercase tracking-[0.2em] text-gray-500 mb-2 font-semibold">Flagship Event</h2>
                    
//                     <div 
//                         className="relative inline-flex flex-col items-start cursor-pointer mt-1"
//                         onMouseEnter={handleMouseEnter}
//                         onMouseLeave={handleMouseLeave}
//                     >
//                         <div className="relative overflow-hidden pb-1 w-full flex justify-start">
//                             <h1 className="relative text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight whitespace-nowrap m-0 leading-[1.1] block w-full text-left">
//                                 <span ref={text1SpanRef} className="inline-block">Upcoming Hackathon</span>
//                             </h1>

//                             <h1 className="absolute top-0 left-0 text-4xl md:text-6xl lg:text-7xl font-normal tracking-tight whitespace-nowrap m-0 leading-[1.1] w-full text-left block">
//                                 <span ref={text2SpanRef} className="inline-block text-blue-600">Hack Qubit 26</span>
//                             </h1>
//                         </div>

//                         <div 
//                             ref={lineRef}
//                             className="absolute bottom-0 h-[2px] bg-black origin-left will-change-transform"
//                             style={{ left: 0 }}
//                         />
//                     </div>
//                 </div>

//                 <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
//                     {/* Left side: Image */}
//                     <div ref={imageContainerRef} className="lg:col-span-7 h-[40vh] md:h-[60vh] rounded-3xl overflow-hidden relative shadow-2xl">
//                         <div className="absolute inset-0 bg-black/20 z-10 rounded-3xl mix-blend-overlay"></div>
//                         <img 
//                             ref={imageRef}
//                             src={featuredEvent.img} 
//                             alt={featuredEvent.title}
//                             className="w-full h-full object-cover rounded-3xl origin-center"
//                         />
//                     </div>

//                     {/* Right side: Details */}
//                     <div ref={textRef} className="lg:col-span-5 flex flex-col justify-center">
//                         <div className="inline-block px-4 py-2 bg-black text-white text-xs md:text-sm uppercase tracking-widest rounded-full w-max mb-6">
//                             {featuredEvent.date}
//                         </div>
//                         <h3 ref={headingRef} className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight overflow-hidden pb-2">
//                             {featuredEvent.title}
//                         </h3>
//                         <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
//                             Get ready for {featuredEvent.title}, our signature 24-hour national-level hackathon coming this {featuredEvent.date}. Join us for a marathon of coding, innovation, and collaboration as we build the future. Stay tuned for the biggest tech showdown of the year!
//                         </p>
                        
//                         <button className="group relative inline-flex items-center justify-center px-8 py-4 font-medium text-white transition-all duration-300 bg-black rounded-full hover:bg-gray-800 hover:scale-105 w-max overflow-hidden">
//                             <span className="relative z-10 flex items-center gap-2">
//                                 Register Now
//                                 <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
//                             </span>
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </section>
//     );
// };

// export default RecentEvent;
