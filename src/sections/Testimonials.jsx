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

function Testimonials() {
    const sectionRef = useRef(null);

    useGSAP(() => {
        const cards = gsap.utils.toArray('.testimonial-card');

        gsap.fromTo(cards,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out',
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top 80%'
                }
            }
        );
    }, { scope: sectionRef });

    return (
        <section ref={sectionRef} className="w-full bg-[#f4f4f4] py-24 md:py-32 px-6 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-4xl md:text-6xl font-normal tracking-tight text-black mb-4">Student Voices</h2>
                    <p className="text-lg md:text-xl text-gray-500 max-w-2xl">Discover what our members have to say about their journey, learning experiences, and growth within the Helix community.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {testimonials.map((t, i) => (
                        <div key={i} className="testimonial-card bg-white p-8 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
                            <p className="text-gray-700 text-lg mb-8 leading-relaxed">"{t.quote}"</p>
                            <div>
                                <h4 className="font-semibold text-black text-lg">{t.name}</h4>
                                <p className="text-xs text-gray-400 mt-1 tracking-wider">{t.role}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default Testimonials;
