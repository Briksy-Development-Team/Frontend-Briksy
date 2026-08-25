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

const Home = () => {
  return (
    <div className="min-h-screen">
      <Heroone />
   
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
