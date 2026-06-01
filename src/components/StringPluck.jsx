import { useEffect, useRef } from "react";
import gsap from "gsap";

// ==========================================
// 1. GLOBAL WEB AUDIO ENGINE (Zero Latency)
// Defined outside the component so it only initializes once per page load.
// ==========================================
let audioCtx = null;
let bufferDown = null;
let bufferUp = null;

const initAudio = async () => {
  if (audioCtx) return;

  // Fallback for older Safari versions
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  audioCtx = new AudioContext();

  const loadSound = async (url) => {
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      return await audioCtx.decodeAudioData(arrayBuffer);
    } catch (e) {
      console.error("Audio failed to load:", e);
      return null;
    }
  };

  // Pre-load and decode the audio files into memory
  [bufferDown, bufferUp] = await Promise.all([
    loadSound("/mixkit-guitar-stroke-down-slow-2339.wav"),
    loadSound("/mixkit-guitar-stroke-up-slow-2338.wav")
  ]);
};

// Fire initialization immediately (it's async, so it won't block rendering)
if (typeof window !== "undefined") {
  initAudio();
}

export default function StringPluck() {
  const svgRef = useRef(null);
  const pathRef = useRef(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;

    if (!svg || !path) return;

    const VB_WIDTH = 1200;
    const VB_HEIGHT = 200;
    const VB_CENTER_Y = VB_HEIGHT / 2;
    const THRESHOLD = 500;

    let isGrabbed = false;
    const controlPoint = { x: VB_WIDTH / 2, y: 0 };
    let bounceTween = null;
    let prevMouseY = null;

    // =========================
    // AUDIO PLAYBACK LOGIC
    // =========================
    const playPluck = (direction, strength = 1) => {
      if (!audioCtx) return;

      // Browser policy check: Resume audio context if user hasn't interacted yet
      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      const buffer = direction === "down" ? bufferDown : bufferUp;
      if (!buffer) return;

      // Create an audio source node (extremely cheap, designed to be thrown away)
      const source = audioCtx.createBufferSource();
      source.buffer = buffer;

      // Create a gain node for volume control
      const gainNode = audioCtx.createGain();

      // Normalize volume based on pluck strength (0.1 to 1.0)
      const normalized = Math.min(Math.abs(strength) / 150, 1);
      gainNode.gain.value = 0.1 + normalized * 0.9;

      // Connect nodes and play
      source.connect(gainNode);
      gainNode.connect(audioCtx.destination);
      source.start(0);
    };

    // =========================
    // RESPONSIVE LOGIC
    // =========================
    let stretchMultiplier = 2;
    const mm = gsap.matchMedia();

    mm.add(
      {
        isMobile: "(max-width: 768px)",
        isDesktop: "(min-width: 769px)",
      },
      (context) => {
        const { isMobile } = context.conditions;
        stretchMultiplier = isMobile ? 0.2 : 2;
      }
    );

    // =========================
    // DRAWING LOGIC
    // =========================
    let docLeft = 0;
    let docTop = 0;
    let svgWidth = 0;
    let svgHeight = 0;

    const updateRect = () => {
      const rect = svg.getBoundingClientRect();
      docLeft = rect.left + window.scrollX;
      docTop = rect.top + window.scrollY;
      svgWidth = rect.width;
      svgHeight = rect.height;
    };

    updateRect();
    window.addEventListener("resize", updateRect);

    const setPath = gsap.quickSetter(path, "attr");

    const draw = () => {
      const cx = controlPoint.x.toFixed(1);
      const cy = (VB_CENTER_Y + controlPoint.y * stretchMultiplier).toFixed(1);

      setPath({
        d: `M 0 ${VB_CENTER_Y} Q ${cx} ${cy} ${VB_WIDTH} ${VB_CENTER_Y}`,
      });
    };

    const xTo = gsap.quickTo(controlPoint, "x", { duration: 0.2, ease: "power3.out", onUpdate: draw });
    const yTo = gsap.quickTo(controlPoint, "y", { duration: 0.2, ease: "power3.out", onUpdate: draw });

    const releaseString = () => {
      if (!isGrabbed) return;

      playPluck(controlPoint.y > 0 ? "down" : "up", controlPoint.y);
      isGrabbed = false;

      bounceTween = gsap.to(controlPoint, {
        x: VB_WIDTH / 2,
        y: 0,
        duration: 1,
        ease: "elastic.out(2, 0.1)",
        onUpdate: draw,
      });
    };

    const handleMove = (e) => {
      const mouseX = ((e.pageX - docLeft) / svgWidth) * VB_WIDTH;
      const mouseY = ((e.pageY - docTop) / svgHeight) * VB_HEIGHT;
      const distanceY = mouseY - VB_CENTER_Y;

      // Swipe Detection
      if (!isGrabbed && prevMouseY !== null) {
        const crossedDown = prevMouseY < VB_CENTER_Y && mouseY > VB_CENTER_Y;
        const crossedUp = prevMouseY > VB_CENTER_Y && mouseY < VB_CENTER_Y;

        if (crossedDown || crossedUp) {
          const swipeVelocity = mouseY - prevMouseY;
          if (bounceTween) bounceTween.kill();

          controlPoint.x = mouseX;
          controlPoint.y = Math.max(Math.min(swipeVelocity * 1.5, THRESHOLD), -THRESHOLD);

          playPluck(crossedDown ? "down" : "up", swipeVelocity);

          bounceTween = gsap.to(controlPoint, {
            x: VB_WIDTH / 2,
            y: 0,
            duration: 1,
            ease: "elastic.out(2, 0.1)",
            onUpdate: draw,
          });

          prevMouseY = mouseY;
          return;
        }
      }

      // Drag & Release Mode
      if (isGrabbed) {
        if (Math.abs(distanceY) > THRESHOLD) {
          releaseString();
        } else {
          xTo(mouseX);
          yTo(distanceY);
        }
      } else {
        if (Math.abs(mouseY - (VB_CENTER_Y + controlPoint.y)) < 20) {
          isGrabbed = true;
          if (bounceTween) bounceTween.kill();
        }
      }

      prevMouseY = mouseY;
    };

    const handleLeave = () => {
      releaseString();
      prevMouseY = null;
    };

    svg.addEventListener("pointermove", handleMove);
    svg.addEventListener("pointerleave", handleLeave);

    draw();

    return () => {
      mm.revert();
      window.removeEventListener("resize", updateRect);
      svg.removeEventListener("pointermove", handleMove);
      svg.removeEventListener("pointerleave", handleLeave);
      if (bounceTween) bounceTween.kill();
      xTo.tween.kill();
      yTo.tween.kill();
    };
  }, []);

  return (
    <div className="w-full pt-8 pb-12">
      <svg
        ref={svgRef}
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="w-full h-32 mx-auto overflow-visible cursor-crosshair touch-none"
      >
        <path
          ref={pathRef}
          d="M 0 100 Q 600 100 1200 100"
          fill="none"
          stroke="#111"
          strokeWidth="1"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}