import React from 'react'
import Hero from '../sections/Hero'
import { useOutletContext } from 'react-router-dom';
import Reel from '../sections/Reel';
import Tagline from '../sections/Tagline';
import About from '../sections/About';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import collection from '../components/ImageGallery/collection.js';

function Home() {
  const { loading } = useOutletContext();
  return (
    <>
      <Hero loading={loading} />
      <Reel />
      <Tagline/>
      <About/>
      <ImageGallery items={collection}/>
    </>
  )
}

export default Home