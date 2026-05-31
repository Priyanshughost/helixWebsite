import React from 'react'
import Hero from '../sections/Hero'
import { useOutletContext } from 'react-router-dom';
import Reel from '../sections/Reel';
import Tagline from '../sections/Tagline';
import About from '../sections/About';

function Home() {
  const { loading } = useOutletContext();
  return (
    <>
      <Hero loading={loading} />
      <Reel />
      <Tagline/>
      <About/>
    </>
  )
}

export default Home