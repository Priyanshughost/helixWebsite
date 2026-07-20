import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import icon from '../../assets/logo/Helix-Icon-Logo-Blue.png'
import text from '../../assets/logo/Helix-Text-Logo-Blue.png'
import { navLinks } from './navLink.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

function Navbar({ loading }) {

  const navRef = useRef(null)
  const navInnerRef = useRef(null)
  const revealItemsRef = useRef([])

  useGSAP(() => {

    // -----------------------------------
    // INITIAL STATES
    // -----------------------------------

    gsap.set(revealItemsRef.current, {
      yPercent: 120,
    })

    gsap.set(navInnerRef.current, {
      borderColor: 'transparent',
      autoAlpha: 1, // Start fully visible and interactive
    })

    // -----------------------------------
    // ONLOAD ANIMATION
    // -----------------------------------

    if (loading) return;

    const introTl = gsap.timeline({
      defaults: {
        ease: 'power3.out',
      }
    })

    // CONTENT REVEALS THROUGH LINE
    introTl.to(revealItemsRef.current, {
      yPercent: 0,
      duration: 1.2,
      stagger: 0.04,
    })

    // BORDER APPEARS LAST
    introTl.to(navInnerRef.current, {
      borderColor: '#d4d4d8',
      duration: 0.35,
      ease: 'power2.out',
    }, '-=0.08')

    // -----------------------------------
    // SCROLL NAVBAR LOGIC
    // -----------------------------------

    // Create ONE single paused timeline
    const scrollTl = gsap.timeline({
      paused: true,
      defaults: { transformOrigin: 'center center' }
    })

    scrollTl.to(revealItemsRef.current, {
      yPercent: -120,
      duration: 0.5,
      ease: 'power2.inOut',
    })

    // Use autoAlpha to handle opacity and visibility without layout reflows
    scrollTl.to(navInnerRef.current, {
      scaleX: 0.75,
      scaleY: 0.2,
      autoAlpha: 0,
      duration: 0.32,
      ease: 'power3.inOut',
    }, '-=0.08')
    scrollTl.to(navRef.current, {
      pointerEvents: "none"
    })

    let lastScroll = 0

    ScrollTrigger.create({
      start: 0,
      end: 'max',

      onUpdate: (self) => {
        const current = self.scroll()

        // SCROLL DOWN - Hide
        if (current > lastScroll && current > 100) {
          scrollTl.play()
        }
        // SCROLL UP - Show
        else if (current < lastScroll) {
          scrollTl.reverse()
        }

        lastScroll = current
      },
    })

  }, {
    scope: navRef,
    dependencies: [loading]
  })

  return (
    <nav
      ref={navRef}
      className="fixed top-6 w-full z-110 overflow-hidden"
    >

      <div
        ref={navInnerRef}
        className="
          relative
          max-w-[96%]
          mx-auto
          flex
          items-center
          justify-between
          px-8
          bg-white
          border
          border-zinc-300
          rounded-3xl
          origin-top
        "
      >

        {/* LOGO */}
        <div
          ref={(el) => (revealItemsRef.current[0] = el)}
          className="flex items-center"
        >
          <img
            src={icon}
            alt=""
            className="h-10"
          />

          <img
            src={text}
            alt=""
            className="h-18"
          />
        </div>

        {/* NAV LINKS */}
        <div className="flex items-center gap-4 text-sm font-medium tracking-[-0.02em]">

          {navLinks.map((link, index) => (

            <div
              key={index}
              className="relative overflow-hidden w-max"
            >

              <Link
                to={link.path}
                ref={(el) => (revealItemsRef.current[index + 1] = el)}
                className="group relative block"
              >
                {link.label}

                <span
                  className="
                    absolute
                    left-0
                    bottom-0
                    h-0.5
                    w-full
                    origin-right
                    scale-x-0
                    bg-current
                    transition-transform
                    duration-300
                    ease-out
                    group-hover:origin-left
                    group-hover:scale-x-100
                  "
                />
              </Link>

            </div>

          ))}

        </div>

        {/* CTA */}
        <div className="relative overflow-hidden">

          <button
            ref={(el) => (revealItemsRef.current[6] = el)}
            className="
              flex
              items-center
              gap-1
              text-[0.95rem]
              font-normal
              tracking-[-0.02em]
            "
          >
            Join Helix
            <span>↗</span>
          </button>
        </div>

      </div>

    </nav>
  )
}

export default Navbar
