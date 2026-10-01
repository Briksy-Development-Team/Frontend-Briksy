import { useRef } from "react";
import { useNavigate } from "react-router-dom";

import LeftVisual from "./Transition";
import Imges from "../../../assets/dummy/Image.svg";

const ImageAnimation = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col lg:flex-row h-auto min-h-screen lg:h-screen w-full font-helvetica overflow-hidden"
    >
      {/* LEFT: the visual is 620x720, so scale it down on smaller screens */}
      <div className="mt-10 lg:mt-0 flex w-full lg:w-1/2 items-center justify-center">
        <div className="relative h-[432px] w-[372px] sm:h-[540px] sm:w-[465px] xl:h-[720px] xl:w-[620px]">
          <div className="absolute left-0 top-0 origin-top-left scale-[0.6] sm:scale-75 xl:scale-100">
            <LeftVisual trackRef={sectionRef} />
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="my-auto h-auto lg:h-[65vh] w-full lg:w-1/2 flex flex-col justify-center items-start lg:justify-evenly gap-12 lg:gap-0 pt-12 md:py-12 lg:py-0">
        <div className="flex flex-col justify-center space-y-4 lg:space-y-[1rem] w-[90%] xl:w-[70%] mx-auto text-center lg:text-left items-center lg:items-start">
          <p className="text-[0.875rem] text-primary-brown uppercase tracking-wide">HOW BRIKSY WORKS</p>
          <div className="text-[1.875rem] text-primary-brown flex flex-col lg:[2rem]  xl:text-[3rem] leading-tight lg:leading-8 xl:leading-12 font-medium">
            <div className="flex flex-col">
              <span className="text-nowrap">Find the property.</span>
              <span className="text-nowrap">Find the people to build it.</span>
            </div>
          </div>
          <p className="text-primary-light-brown text-[1rem] text-gray-700">
            From finding a property to building, improving,
            and managing it connect with the right people
            and services in one place.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-primary-brown text-nowrap text-[0.875rem] text-white w-fit px-6 py-3 rounded-4xl hover:bg-[#463116] transition-colors"
          >
            Get Started Now
          </button>
        </div>

        <div className="flex flex-col-reverse lg:flex-row items-center lg:items-end justify-between w-[90%] xl:w-[70%] mx-auto gap-6 xl:gap-[1rem]">
          <div className="w-full xl:w-[70%] space-y-4 xl:space-y-[1rem] text-center lg:text-left">
            <p className="italic text-[1rem] text-gray-700">
              "Briksy made it easier to find the right professionals and manage
              everything around our property without jumping between different
              platforms."
            </p>

            <div className="flex items-center lg:items-start gap-2 justify-center lg:justify-start">
              <p className="text-[0.875rem] text-primary-brown font-medium">Briksy Member</p>
              <p className="text-[0.8rem] text-black">—</p>
              <p className="text-[0.875rem] text-primary-light-brown">Property & Project User</p>
            </div>
          </div>

          <img
            src={Imges}
            alt=""
            className="xl:h-[5.5625rem] w-[4.5rem] rounded-[67.5rem] bg-gray-100"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageAnimation;