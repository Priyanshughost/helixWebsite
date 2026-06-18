import React, { lazy, Suspense } from 'react';
import Hero from '../sections/Hero';
import { useOutletContext } from 'react-router-dom';
import collection from '../sections/ImageGallery/collection';

// Lazy load heavy components below the fold
const Reel = lazy(() => import('../sections/Reel'));
const Tagline = lazy(() => import('../sections/Tagline'));
const About = lazy(() => import('../sections/About'));
const ImageGallery = lazy(() => import('../sections/ImageGallery/ImageGallery'));
const EventSection = lazy(() => import('../sections/Events/EventSection'));
const Fader = lazy(() => import('../sections/Fader'));
const Fader2 = lazy(() => import('../sections/Fader2'));
const TeamsV2 = lazy(() => import('../sections/TeamsV2'));
const HallOfFame = lazy(() => import('../sections/HallOfFame'));
const Testimonials = lazy(() => import('../sections/Testimonials'));
const Partnerships = lazy(() => import('../sections/Partnerships'));

function Home() {
  const { loading } = useOutletContext();

  return (
    <>
      <Hero loading={loading} />
      <Suspense fallback={<div className="w-full h-screen bg-black"></div>}>
        <Reel />
        <Tagline />
        <About />

        <Fader />
        <ImageGallery items={collection} />
        <Fader2 />

        <EventSection />
        <HallOfFame />
        <Partnerships />
        <TeamsV2 />
        <Testimonials />
      </Suspense>
    </>
  );
}

export default Home;