import { useEffect, useRef, useState } from "react";
import MobileMenu from "../components/navbar/MobileMenu.jsx";
import Navbar from "../components/navbar/Navbar.jsx";
import { Outlet } from "react-router-dom";
import ReactLenis from "lenis/react";
import Footer from "../sections/Footer.jsx";

function MainLayout({ loading }) {
    const lenisRef = useRef()
    const [isMobile, setIsMobile] = useState(
        window.innerWidth < 768
    );

    useEffect(() => {

        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };

    }, []);

    return (
        <ReactLenis
            ref={lenisRef}
            root
            options={{
                lerp: isMobile ? 0.15 : 0.08,
                smoothWheel: true,
                smoothTouch: true,
                syncTouch: false,
                touchMultiplier: 1,
                wheelMultiplier: 1.1
            }}
        >
            {isMobile ? (
                <MobileMenu lenisRef={lenisRef} loading={loading} />
            ) : (
                <Navbar loading={loading} />
            )}
            <>
                <Outlet context={{ loading }} />
            </>
            <Footer />
        </ReactLenis>
    );
}

export default MainLayout;