import React from 'react';

const About = () => {
  return (
    <div className="w-full min-h-screen border bg-white text-black font-sans px-4 sm:px-6 md:px-12 lg:px-20 py-16 md:py-12 overflow-x-hidden">
      
      {/* Top Heading Section */}
      <div className="flex justify-center items-center mb-24 md:mb-40 lg:mb-56 pt-10 md:pt-20">
        <h1 className="text-5xl sm:text-6xl md:text-[6rem] lg:text-[8rem] font-normal tracking-tight underline decoration-[1.5px] md:decoration-2 underline-offset-[12px] md:underline-offset-[24px]">
          Get to know us
        </h1>
      </div>

      {/* Main Content Container */}
      <div className="max-w-[1600px] mx-auto w-full">
        
        {/* Large Typography Statement */}
        <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[5.5rem] leading-[1.05] tracking-tight font-normal mb-16 md:mb-24 lg:mb-32 pr-0 lg:pr-10">
          We are a collective of seasoned creatives, 
          strategists, growth marketers, and technologists, 
          dedicated to transforming ambitious visions into 
          category leaders.
        </h2>

        {/* Divider */}
        <hr className="border-t border-gray-300 mb-8 md:mb-12 w-full" />

        {/* Principles Layout (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-4">
          
          {/* Left Column - Heading */}
          <div className="md:col-span-5 lg:col-span-6">
            <h3 className="text-base sm:text-lg md:text-xl leading-tight font-normal">
              We operate on<br />
              simple principles
            </h3>
          </div>

          {/* Right Column - List and Paragraph */}
          <div className="md:col-span-7 lg:col-span-6 flex flex-col">
            
            {/* Numbered List */}
            <ul className="text-base sm:text-lg md:text-xl space-y-1 md:space-y-2 mb-12 md:mb-24">
              <li className="flex gap-4 md:gap-6">
                <span className="text-gray-500">(01)</span>
                <span>Put people first</span>
              </li>
              <li className="flex gap-4 md:gap-6">
                <span className="text-gray-500">(02)</span>
                <span>Pursue excellence</span>
              </li>
              <li className="flex gap-4 md:gap-6">
                <span className="text-gray-500">(03)</span>
                <span>Embrace challenges</span>
              </li>
            </ul>

            {/* Context Paragraph */}
            <p className="text-sm sm:text-base md:text-lg text-black leading-snug max-w-[420px]">
              These three principles have earned us 
              numerous awards. While we don't chase 
              accolades, they are proof of our dedication 
              to impact, quality, and innovation.
            </p>
          </div>
        </div>
      </div>
      
    </div>
  );
};

export default About;