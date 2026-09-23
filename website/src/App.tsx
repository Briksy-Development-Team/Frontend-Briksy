import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

import AppRouter from "./routes/AppRouter";
import ScrollToTop from "./components/utils/ScrollToTop";
import Loader from "./components/loader/Loader";
import { lenisInstance } from "./lenis";
import { ReadyProvider, useReady } from "./components/utils/ReadyContext";

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const EXIT_PATHS = new Set(["/", "/login", "/register"]);

const AndroidBackButtonHandler = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!Capacitor.isNativePlatform()) {
      return;
    }

    const listener = CapacitorApp.addListener("backButton", ({ canGoBack }) => {
      if (EXIT_PATHS.has(location.pathname)) {
        CapacitorApp.exitApp();
        return;
      }

      if (canGoBack) {
        navigate(-1);
        return;
      }

      navigate("/");
    });

    return () => {
      listener.then((handle) => handle.remove());
    };
  }, [location.pathname, navigate]);

  return null;
};

const AppContent = () => {
  const [appReady, setAppReady] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const { setReady } = useReady();

  useEffect(() => {
    const t = setTimeout(() => {
      setAppReady(true);
    }, 3000);

    return () => clearTimeout(t);
  }, []);

  return (
    <>
      {showLoader && (
        <Loader
          appReady={appReady}
          onComplete={() => {
            setShowLoader(false);
            setReady(true);
          }}
        />
      )}

      <ScrollToTop />
      <AndroidBackButtonHandler />
      <AppRouter />
    </>
  );
};

function App() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.4,
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.2,
      autoRaf: false,
    });

    lenisInstance.current = lenis;

    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);

    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisInstance.current = null;
    };
  }, []);

  return (
    <ReadyProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ReadyProvider>
  );
}

export default App;