import Community from "./community/Community";
import Contact from "../../components/contact/Contact";
import Blogs from "./blogs/Blogs";
import ImageAnimation from "./imageanimation/ImageAnimation";
import BuilderList from "../v2/builderlist/BuilderList";
import TrendingProperty from "../v2/trendingproperty/TrendingProperty";
import ServiceList from "../v2/servicelist/ServiceList";
import AppPreview from "../../components/app-preview/AppPreview";
import Heroone from "../../components/hero/Heroone";
import { useIsMobileApp } from "../../utils/platform";
import AppHome from "../../mobile_app/pages/home/AppHome";

const Home = () => {
  const isApp = useIsMobileApp();

  if (isApp) {
    return <AppHome />;
  }

  return (
    <div className="min-h-screen overflow-hidden space-y-20 ">
      <Heroone />

      <ImageAnimation />

      <Community />
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
