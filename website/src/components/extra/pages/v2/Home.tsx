import Process from "../home/process/Process";
import Community from "./communityv2/Community";

import Blogs from "../../../../pages/home/blogs/Blogs";
import AppPreview from "../../../app-preview/AppPreview";
import { Contact } from "lucide-react";
import Review from "../home/reviews/Review";
import About from "../../../../pages/home/about/About";
import Heroone from "../../../hero/Heroone";

const HomeA = () => {
  return (
    <div className=" min-h-screen">
      <Heroone />
      <Community />
      <About />
      <Process />
      <Review />
      <Blogs />
      <Contact />

      <AppPreview />
    </div>
  );
};

export default HomeA;
