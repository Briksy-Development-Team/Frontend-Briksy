import Community from "./community/Community";
import Contact from "../../components/contact/Contact";
import Blogs from "./blogs/Blogs";
import ImageAnimation from "./imageanimation/ImageAnimation";
import {
  BuilderListSection,
  PropertyListSection,
  AgentListSection,
  ServiceListSection,
} from "../v2/HomeListSwiper";
import AppPreview from "../../components/app-preview/AppPreview";
import Heroone from "../../components/hero/Heroone";
import { useIsMobileApp } from "../../utils/platform";
import AppHome from "../../mobile_app/pages/home/AppHome";
import { ShortsSection } from "../../components/shorts";

const Home = () => {
  const isApp = useIsMobileApp();

  if (isApp) {
    return <AppHome />;
  }

  return (
    <div className="min-h-screen overflow-hidden  space-y-20 ">
      <Heroone />

      <ImageAnimation />

      <Community />
      <BuilderListSection />
      <PropertyListSection />
      <AgentListSection />
      <ServiceListSection />
      <ShortsSection />
      <Blogs />
      <Contact />
      <AppPreview />
    </div>
  );
};

export default Home;
