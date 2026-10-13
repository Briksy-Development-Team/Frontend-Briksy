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
      className="relative flex flex-col lg:flex-row min-h-screen w-full items-center font-helvetica overflow-hidden"
    >
      {/* LEFT: Pinned container space for the visual */}
      <div className="mt-10 lg:mt-0 flex w-full lg:w-1/2 items-center justify-center px-4 lg:px-8">
        <div className="w-full flex justify-center">
          <LeftVisual trackRef={sectionRef} />
        </div>
      </div>

      {/* RIGHT: Text content that reflows seamlessly with zoom */}
      <div className="flex w-full lg:w-1/2 flex-col justify-center gap-10 lg:gap-14 py-12 lg:py-0 px-4 lg:px-8 min-w-0">
        <div className="mx-auto flex w-full max-w-[560px] flex-col items-center lg:items-start gap-4 text-center lg:text-left">
          <p className="text-sm uppercase tracking-wide text-primary-brown">HOW BRIKSY WORKS</p>

          <h2 className="text-[clamp(1.75rem,2.8vw,3rem)] font-medium leading-[1.15] text-balance text-primary-brown">
            Find the property. Find the people to build it.
          </h2>

          <p className="text-sm sm:text-base text-gray-700 leading-relaxed [text-wrap:pretty]">
            From finding a property to building, improving, and managing it connect with the right
            people and services in one place.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-2 w-fit whitespace-nowrap rounded-full bg-primary-brown px-7 py-3.5 text-sm text-white transition-colors hover:bg-[#463116]"
          >
            Get Started Now
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-[560px] flex-col-reverse sm:flex-row items-center sm:items-end justify-between gap-6 pt-4">
          <div className="space-y-3 text-center sm:text-left flex-1 min-w-0">
            <p className="italic text-sm sm:text-base text-gray-700 leading-relaxed [text-wrap:pretty]">
              "Briksy made it easier to find the right professionals and manage everything around
              our property without jumping between different platforms."
            </p>

            <div className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <p className="text-sm font-medium text-primary-brown">Briksy Member</p>
              <span className="text-xs text-black/40">—</span>
              <p className="text-sm text-primary-light-brown">Property & Project User</p>
            </div>
          </div>

          <img
            src={Imges}
            alt="User profile"
            className="h-[5.5rem] w-[4.5rem] shrink-0 rounded-full bg-gray-100 object-cover"
          />
        </div>
      </div>
    </div>
  );
};

export default ImageAnimation;