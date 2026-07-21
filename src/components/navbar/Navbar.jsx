import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import icon from '../../assets/logo/Helix-Icon-Logo-Blue.png'
import text from '../../assets/logo/Helix-Text-Logo-Blue.png'
import { navLinks } from './navLink.js'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// ==========================================
// SVG PATH STATES (100x100 viewBox)
// ==========================================

// UPWARD MOVEMENT (Intro Load)
const pathBottomHidden = "M 0 100 Q 50 100 100 100 L 100 100 Q 50 100 0 100 Z"
const pathBottomCurveUp = "M 0 60 Q 50 -20 100 60 L 100 100 Q 50 100 0 100 Z"
const pathFilled = "M 0 0 Q 50 0 100 0 L 100 100 Q 50 100 0 100 Z"
const pathTopCurveUp = "M 0 0 Q 50 0 100 0 L 100 60 Q 50 -20 0 60 Z"
const pathTopHidden = "M 0 0 Q 50 0 100 0 L 100 0 Q 50 0 0 0 Z"

// DOWNWARD MOVEMENT (Scroll Hide)
const pathTopCurveDown = "M 0 0 Q 50 0 100 0 L 100 40 Q 50 120 0 40 Z"
const pathBottomCurveDown = "M 0 40 Q 50 120 100 40 L 100 100 Q 50 100 0 100 Z"

function Navbar({ loading }) {
  const navRef = useRef(null)
  const navBgRef = useRef(null)
  const contentRef = useRef(null)

  const blackWipeRef = useRef(null)
  const limeWipeRef = useRef(null)

  useGSAP(() => {
    // -----------------------------------
    // INITIAL STATES
    // -----------------------------------
    gsap.set([limeWipeRef.current, blackWipeRef.current], {
      attr: { d: pathBottomHidden }
    })

    gsap.set(contentRef.current, {
      autoAlpha: 0
    })

    if (loading) return;

    let isIntroComplete = false;

    // -----------------------------------
    // ONLOAD ANIMATION
    // -----------------------------------
    const introTl = gsap.timeline({
      onComplete: () => {
        isIntroComplete = true; // Unlock scroll animations
      }
    })

    // Using explicit labels ("in", "out") instead of staggers ensures zero glitches
    introTl
      // 1. LIME WIPE IN
      .to(limeWipeRef.current, {
        keyframes: [
          { attr: { d: pathBottomCurveUp }, duration: 0.3, ease: 'power2.in' },
          { attr: { d: pathFilled }, duration: 0.3, ease: 'power2.out' }
        ]
      }, "in")

      // 2. BLACK WIPE IN (Follows closely behind)
      .to(blackWipeRef.current, {
        keyframes: [
          { attr: { d: pathBottomCurveUp }, duration: 0.3, ease: 'power2.in' },
          { attr: { d: pathFilled }, duration: 0.3, ease: 'power2.out' }
        ]
      }, "in+=0.15")

      // 3. REVEAL CONTENT (Instantly, safely hidden behind the solid black wipe)
      .set(contentRef.current, { autoAlpha: 1 }, "out")

      // 4. BLACK WIPE OUT (Moves toward the top)
      .to(blackWipeRef.current, {
        keyframes: [
          { attr: { d: pathTopCurveUp }, duration: 0.3, ease: 'power2.in' },
          { attr: { d: pathTopHidden }, duration: 0.3, ease: 'power2.out' }
        ]
      }, "out+=0.1")

      // 5. LIME WIPE OUT (Follows closely behind, revealing content)
      .to(limeWipeRef.current, {
        keyframes: [
          { attr: { d: pathTopCurveUp }, duration: 0.3, ease: 'power2.in' },
          { attr: { d: pathTopHidden }, duration: 0.3, ease: 'power2.out' }
        ]
      }, "out+=0.25")


    // -----------------------------------
    // SCROLL NAVBAR LOGIC
    // -----------------------------------
    const scrollTl = gsap.timeline({ paused: true })

    scrollTl
      // 1. LIME WIPE DOWN FROM TOP
      .to(limeWipeRef.current, {
        keyframes: [
          { attr: { d: pathTopCurveDown }, duration: 0.25, ease: 'power2.in' },
          { attr: { d: pathFilled }, duration: 0.25, ease: 'power2.out' }
        ]
      }, "hide")

      // 2. BLACK WIPE DOWN FROM TOP
      .to(blackWipeRef.current, {
        keyframes: [
          { attr: { d: pathTopCurveDown }, duration: 0.25, ease: 'power2.in' },
          { attr: { d: pathFilled }, duration: 0.25, ease: 'power2.out' }
        ]
      }, "hide+=0.1")

      // 3. HIDE CONTENT
      .set([contentRef.current, navBgRef.current], { autoAlpha: 0 }, "exit")

      // 4. BLACK WIPE EXITS DOWN
      .to(blackWipeRef.current, {
        keyframes: [
          { attr: { d: pathBottomCurveDown }, duration: 0.25, ease: 'power2.in' },
          { attr: { d: pathBottomHidden }, duration: 0.25, ease: 'power2.out' }
        ]
      }, "exit")

      // 5. LIME WIPE EXITS DOWN
      .to(limeWipeRef.current, {
        keyframes: [
          { attr: { d: pathBottomCurveDown }, duration: 0.25, ease: 'power2.in' },
          { attr: { d: pathBottomHidden }, duration: 0.25, ease: 'power2.out' }
        ]
      }, "exit+=0.1")

    scrollTl.set(navRef.current, { pointerEvents: "none" })

    let lastScroll = 0;
    let isNavHidden = false; // 1. Track the state

    ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        if (!isIntroComplete) return;

        const current = self.scroll();
        const delta = current - lastScroll;

        // 2. Always show the nav if we bounce back to the absolute top
        if (current < 50 && isNavHidden) {
          scrollTl.reverse();
          isNavHidden = false;
          lastScroll = current;
          return;
        }

        // 3. Ignore tiny micro-scrolls (solves the smooth-scroll jitter)
        if (Math.abs(delta) < 10) return;

        // 4. Only trigger if the state actually needs to change
        if (delta > 0 && current > 100 && !isNavHidden) {
          // Scrolling DOWN (Hide)
          scrollTl.play();
          isNavHidden = true;
        } else if (delta < 0 && isNavHidden) {
          // Scrolling UP (Show)
          scrollTl.reverse();
          isNavHidden = false;
        }

        lastScroll = current;
      },
    })

  }, {
    scope: navRef,
    dependencies: [loading]
  })

  return (
    <nav
      ref={navRef}
      className="fixed top-6 w-full z-[110]"
    >
      <div className="relative max-w-[96%] mx-auto rounded-3xl overflow-hidden">

        {/* NAV BACKGROUND */}
        <div
          ref={navBgRef}
          className="
            absolute inset-0 
            bg-white/95 backdrop-blur-sm 
            border border-zinc-300 
            rounded-3xl
          "
        />

        {/* FLUID MORPHING SVG OVERLAYS */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-100"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <path
            ref={limeWipeRef}
            d={pathBottomHidden}
            fill="#a3e635"
          />
          <path
            ref={blackWipeRef}
            d={pathBottomHidden}
            fill="#161616"
          />
        </svg>

        {/* CONTENT CONTAINER */}
        <div
          ref={contentRef}
          className=" relative z-50 flex items-center justify-between px-8 py-3.5"
        >
          {/* LOGO */}
          <div className="flex items-center gap-3">
            <img
              src={icon}
              alt="Helix Icon"
              className="h-10 w-auto"
            />
            <img
              src={text}
              alt="Helix Text"
              className="h-18 w-auto"
            />
          </div>

          {/* NAV LINKS */}
          <div className="flex items-center gap-8 text-[0.95rem] font-medium text-zinc-500 tracking-tight">
            {navLinks.map((link, index) => (
              <div
                key={index}
                className="relative overflow-hidden w-max"
              >
                <Link
                  to={link.path}
                  className="group relative block py-1 hover:text-zinc-950 transition-colors duration-200"
                >
                  {link.label}
                  <span
                    className="
                      absolute left-0 bottom-0
                      h-[2px] w-full
                      origin-right scale-x-0
                      bg-zinc-900
                      transition-transform duration-300 ease-out
                      group-hover:origin-left group-hover:scale-x-100
                    "
                  />
                </Link>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="relative overflow-hidden">
            <button
              className="
                group flex items-center gap-1.5 py-1
                text-[0.95rem] font-medium text-zinc-950 tracking-tight
                transition-colors
              "
            >
              Join Helix
              <span className="text-zinc-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-200">
                ↗
              </span>
            </button>
          </div>
        </div>

      </div>
    </nav>
  )
}

export default Navbar