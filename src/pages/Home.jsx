import React, { useState, useEffect } from 'react';
import Hero from '../sections/Hero';
import { useOutletContext } from 'react-router-dom';
import Reel from '../sections/Reel';
import Tagline from '../sections/Tagline';
import About from '../sections/About';
import ImageGallery from '../sections/ImageGallery/ImageGallery';
import collection from '../sections/ImageGallery/collection';
import EventSection from '../sections/Events/EventSection';
import Fader from '../sections/Fader';
import Fader2 from '../sections/Fader2';
import TeamsV2 from '../sections/TeamsV2';
import HallOfFame from '../sections/HallOfFame';
import Testimonials from '../sections/Testimonials';
import Partnerships from '../sections/Partnerships';

function Home() {
  const { loading } = useOutletContext();

  // // 1. Initialize state (default to false or true based on your preference for initial load)
  // const [isDesktop, setIsDesktop] = useState(true);

  // // 2. Run effect once on mount to handle window sizing
  // useEffect(() => {
  //   // Target the Tailwind 'md' breakpoint (768px)
  //   const media = window.matchMedia('(min-width: 768px)');

  //   // Set the exact initial value immediately
  //   setIsDesktop(media.matches);

  //   // Update state if the user resizes their browser window
  //   const listener = (e) => setIsDesktop(e.matches);
  //   media.addEventListener('change', listener);

  //   // Cleanup listener when component unmounts
  //   return () => media.removeEventListener('change', listener);
  // }, []); // Empty dependency array ensures this only binds once

  return (
    <>
      <Hero loading={loading} />
      <Reel />
      <Tagline />
      <About />

      <Fader />
      {/* {isDesktop && (
        <> */}
          <ImageGallery items={collection} />
          <Fader2 />
        {/* </>
      )} */}

      <EventSection />
      
      <HallOfFame />
      <Partnerships />
      
      <TeamsV2 />
      
      <Testimonials />
    </>
  );
}

export default Home;