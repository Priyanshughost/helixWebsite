import React from 'react'
import Hero from '../sections/Hero'
import { useOutletContext } from 'react-router-dom';
import Reel from '../sections/Reel';
import Tagline from '../sections/Tagline';
import StringPluck from '../components/StringPluck';

function Home() {
  const { loading } = useOutletContext();
  return (
    <>
      <Hero loading={loading} />
      <Reel />
      <Tagline/>
      <StringPluck/>
    </>
  )
}

export default Home