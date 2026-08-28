import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import AppRouter from "./routes/AppRouter";
import ScrollToTop from "./components/utils/ScrollToTop";
import Loader from "./components/loader/Loader";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

export const lenisInstance: { current: Lenis | null } = { current: null };

const AppContent = () => {
  const { pathname } = useLocation();
  const [appReady, setAppReady] = useState(false);
  const [showLoader, setShowLoader] = useState(pathname === "/");

  useEffect(() => {
    if (pathname !== "/") { setShowLoader(false); return; }
    setShowLoader(true);
    setAppReady(false);
    const t = setTimeout(() => setAppReady(true), 3000);
    return () => clearTimeout(t);
  }, [pathname]);

  return (
    <>
      {showLoader && (
        <Loader
          appReady={appReady}
          onComplete={() => {
            setShowLoader(false);
            window.dispatchEvent(new Event("hero-loader-complete"));
          }}
        />
      )}
      <ScrollToTop />
      <AppRouter />
    </>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true, autoRaf: false });
    lenisInstance.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();
    return () => { gsap.ticker.remove(raf); lenis.destroy(); lenisInstance.current = null; };
  }, []);

  return <BrowserRouter><AppContent /></BrowserRouter>;
}

export default App;