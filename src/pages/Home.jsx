import React from 'react'
import Hero from '../sections/Hero'
import { useOutletContext } from 'react-router-dom';
import Reel from '../sections/Reel';
import Tagline from '../sections/Tagline';
import About from '../sections/About';
import ImageGallery from '../sections/ImageGallery/ImageGallery';
import collection from '../sections/ImageGallery/collection';
import EventSection from '../sections/Events/EventSection';

function Home() {
  const { loading } = useOutletContext();
  return (
    <>
      <Hero loading={loading} />
      <Reel />
      <Tagline/>
      <About/>
      <ImageGallery items={collection}/>
      <EventSection/>
    </>
  )
}

export default Home