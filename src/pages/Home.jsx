import React from 'react'
import Hero from '../sections/Hero'
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

function Home() {
  const { loading } = useOutletContext();
  return (
    <>
      <Hero loading={loading} />
      <Reel />
      <Tagline/>
      <About/>
      <Fader />
      <ImageGallery items={collection}/>
      <Fader2 />
      <EventSection/>
      <TeamsV2/>
    </>
  )
}

export default Home