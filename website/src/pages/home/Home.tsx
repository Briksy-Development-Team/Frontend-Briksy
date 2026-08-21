import About from "./about/About";
import Community from "./community/Community";

import Contact from "../../components/contact/Contact";
import Blogs from "./blogs/Blogs";

import ImageAnimation from "./imageanimation/ImageAnimation";
import BuilderList from "../v2/builderlist/BuilderList";
import TrendingProperty from "../v2/trendingproperty/TrendingProperty";
import ServiceList from "../v2/servicelist/ServiceList";
import AppPreview from "../../components/app-preview/AppPreview";
import Heroone from "../../components/hero/Heroone";
import { useLocation } from "react-router-dom";
import Navbar from "../../components/nav/Navbar";
import { useState } from "react";

const Home = () => {
  const [mode, setMode] = useState<"collapsed" | "search" | "ai">("collapsed");

  const location = useLocation();
  const hasHero = location.pathname === "/" || location.pathname === "/home";
  return (
    <div className="min-h-screen">
      <Navbar mode={mode} setMode={setMode} hasHero={hasHero} />
      <Heroone />
      <div className="flex h-screen w-screen items-center justify-center ">
        <video
          src="/try.mp4"
          className="h-[300px]  mix-blend-color-burn"
          autoPlay
          muted
          loop
          playsInline
        />
      </div>
      <ImageAnimation />

      <Community />
      <About />
      <BuilderList />
      <TrendingProperty />
      <ServiceList />

      <Blogs />
      <Contact />
      <AppPreview />
    </div>
  );
};

export default Home;
