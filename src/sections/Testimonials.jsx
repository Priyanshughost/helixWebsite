import React, { useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
    { name: "Kiran", role: "B.TECH CSE • 2ND YEAR", quote: "Working alongside seniors on complex coding challenges has not only sharpened my technical skills but also fostered a mindset of continuous innovation. Helix is more than a club; it’s a community." },
    { name: "Shivam Kumar", role: "B.TECH CSE • 4TH YEAR", quote: "Being a member of Helix has been a defining part of my college life. The club exposed me to trending AI technologies and played a pivotal role in mentoring our team for the SIH Grand Finale." },
    { name: "Priyanshu Ghosh", role: "B.TECH CSE • 3RD YEAR", quote: "Representing RVSCET as a finalist at RanchiHacks 2026 with Team reKurzion was a defining moment. Helix has consistently provided the mentorship needed to compete on such prestigious stages." },
    { name: "Sumit Ghosh", role: "BCA • 2ND YEAR", quote: "Joining Helix gave me the unique opportunity to blend creativity with technology. From designing for HackQubit to managing our digital presence, it gave me creative freedom to experiment and lead." },
    { name: "Mou Samaddar", role: "B.TECH CSE • 4TH YEAR", quote: "My journey to becoming a Smart India Hackathon (SIH) Finalist was heavily supported by the guidance and mentorship I received here. Helix truly fosters a culture of creativity." },
    { name: "Nitish Sharma", role: "B.TECH CSE • 4TH YEAR", quote: "As the Creative Lead for HackQubit, I discovered the joy of event management. Furthermore, conducting AI workshops for juniors significantly refined my own technical and communication skills." },
    { name: "Nandani Kumari", role: "B.TECH CSE • 3RD YEAR", quote: "From organizing initial orientation sessions to managing large-scale workshops, every step has been filled with continuous learning." },
    { name: "Archit Kumar", role: "B.TECH CSE • 4TH YEAR", quote: "Orchestrating our flagship national event, HackQubit, and collaborating with GDG Ranchi for RanchiHacks gave me invaluable professional exposure." },
];

const colors = [
    'from-pink-500 to-rose-500',
    'from-purple-500 to-indigo-500',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-fuchsia-500 to-pink-500',
    'from-violet-500 to-purple-500',
    'from-cyan-500 to-blue-500'
];

function Testimonials() {
    const sectionRef = useRef(null);
    const scrollContainerRef = useRef(null);

    useGSAP(() => {
        // Entrance animation for header
        gsap.from('.header-elem', {
            y: 40,
            opacity: 0,
            duration: 1,
            stagger: 0.15,
            ease: 'power3.out',
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
            }
        });

        // Native scroll handled by CSS
    }, { scope: sectionRef });

    const renderTestimonials = () => (
        <div className="flex gap-6 md:gap-8 px-6 md:px-12 lg:px-20 w-max">
            {testimonials.map((t, i) => {
                const getInitials = (name) => name.split(' ').map(n => n[0]).join('').substring(0, 2);
                const gradient = colors[i % colors.length];

                return (
                    <div
                        key={i}
                        className="testimonial-card snap-center w-[85vw] sm:w-[400px] md:w-[450px] h-[380px] md:h-[420px] shrink-0 bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-[2rem] flex flex-col justify-between hover:bg-zinc-800/80 hover:border-white/30 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(255,255,255,0.05)] transition-all duration-500 group relative overflow-hidden shadow-2xl"
                    >
                        {/* Glow Effect on hover */}
                        <div className="absolute -inset-px bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-[2rem] pointer-events-none"></div>

                        {/* Giant quote mark decoration */}
                        <div className="absolute -top-6 right-4 text-[180px] font-serif text-white/[0.03] group-hover:text-white/[0.08] group-hover:-translate-y-2 transition-all duration-700 select-none pointer-events-none leading-none">
                            "
                        </div>

                        <p className="text-zinc-300 text-lg md:text-xl leading-relaxed relative z-10 font-light tracking-wide group-hover:text-white transition-colors duration-300 pointer-events-none">
                            "{t.quote}"
                        </p>

                        <div className="flex items-center gap-5 mt-8 relative z-10 pointer-events-none">
                            <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center text-white font-semibold text-lg shadow-inner ring-4 ring-black/20 group-hover:scale-110 transition-transform duration-500`}>
                                {getInitials(t.name)}
                            </div>
                            <div>
                                <h4 className="font-medium text-white text-lg tracking-wide group-hover:text-[#e5d9c5] transition-colors duration-300">{t.name}</h4>
                                <p className="text-xs text-zinc-400 mt-1.5 tracking-[0.2em] font-semibold uppercase">{t.role}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );

    return (
        <section id="testimonials" ref={sectionRef} className="relative w-full min-h-screen py-32 bg-[#050505] text-white overflow-hidden flex flex-col justify-center font-sans">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-900/40 via-[#050505] to-[#050505] pointer-events-none"></div>

            <div className="px-6 md:px-12 lg:px-20 mb-12 md:mb-20 w-full shrink-0 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-3xl">
                        <div className="header-elem inline-block px-4 py-1.5 mb-6 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-xs font-semibold tracking-widest uppercase text-zinc-300">
                            Testimonials
                        </div>
                        <h2 className="header-elem text-5xl md:text-6xl lg:text-7xl font-light tracking-tight mb-6 leading-tight">
                            Student <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600 italic">Voices</span>
                        </h2>
                        <p className="header-elem text-lg md:text-xl text-zinc-400 font-light max-w-2xl leading-relaxed">
                            Discover what our members have to say about their journey, learning experiences, and growth within the Helix community.
                        </p>
                    </div>
                    <div className="header-elem hidden lg:flex items-center gap-3 text-zinc-500 mb-2">
                        <span className="uppercase tracking-widest text-xs font-semibold">Scroll to explore</span>
                        <div className="w-12 h-[1px] bg-zinc-700 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full bg-white animate-[slideRight_2s_ease-in-out_infinite]"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="relative w-full z-10 overflow-hidden group">
                {/* Left/Right Fades for Marquee effect */}
                <div className="absolute top-0 left-0 w-16 md:w-32 h-full bg-gradient-to-r from-[#050505] to-transparent z-20 pointer-events-none"></div>
                <div className="absolute top-0 right-0 w-16 md:w-32 h-full bg-gradient-to-l from-[#050505] to-transparent z-20 pointer-events-none"></div>
                
                {/* Scroll Track */}
                <div 
                    ref={scrollContainerRef} 
                    className="flex overflow-x-auto snap-x snap-mandatory pb-10 hide-scrollbar"
                >
                    {renderTestimonials()}
                </div>
            </div>

            <style jsx>{`
                @keyframes slideRight {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                }
            `}</style>
        </section>
    );
}

export default Testimonials;
