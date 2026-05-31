import { useEffect, useRef } from "react";
import gsap from "gsap";

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

    // 1. Setup Document-Relative Variables (The Lag Fix)
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
    // NOTICE: No scroll event listener here!

    const setPath = gsap.quickSetter(path, "attr");

    const draw = () => {
      const cx = controlPoint.x.toFixed(1);
      const cy = (VB_CENTER_Y + controlPoint.y * 2).toFixed(1);
      
      setPath({
        d: `M 0 ${VB_CENTER_Y} Q ${cx} ${cy} ${VB_WIDTH} ${VB_CENTER_Y}`
      });
    };

    const xTo = gsap.quickTo(controlPoint, "x", { duration: 0.2, ease: "power3.out", onUpdate: draw });
    const yTo = gsap.quickTo(controlPoint, "y", { duration: 0.2, ease: "power3.out", onUpdate: draw });

    const releaseString = () => {
      if (!isGrabbed) return;
      isGrabbed = false;
      
      bounceTween = gsap.to(controlPoint, {
        x: VB_WIDTH / 2,
        y: 0,
        duration: 1,
        ease: "elastic.out(2, 0.1)",
        onUpdate: draw
      });
    };

    const handleMove = (e) => {
      // 2. Using pageX/pageY so we don't have to recalculate layout on scroll
      const mouseX = ((e.pageX - docLeft) / svgWidth) * VB_WIDTH;
      const mouseY = ((e.pageY - docTop) / svgHeight) * VB_HEIGHT;
      const distanceY = mouseY - VB_CENTER_Y;

      // 3. Your awesome fast-swipe detection logic
      if (!isGrabbed && prevMouseY !== null) {
        const crossedDown = prevMouseY < VB_CENTER_Y && mouseY > VB_CENTER_Y;
        const crossedUp = prevMouseY > VB_CENTER_Y && mouseY < VB_CENTER_Y;

        if (crossedDown || crossedUp) {
          const swipeVelocity = mouseY - prevMouseY; 

          if (bounceTween) bounceTween.kill();

          controlPoint.x = mouseX;
          controlPoint.y = Math.max(Math.min(swipeVelocity * 1.5, THRESHOLD), -THRESHOLD);

          bounceTween = gsap.to(controlPoint, {
            x: VB_WIDTH / 2,
            y: 0,
            duration: 1,
            ease: "elastic.out(2, 0.1)",
            onUpdate: draw
          });

          prevMouseY = mouseY;
          return; 
        }
      }

      // Standard grab and drag logic for slower movements
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