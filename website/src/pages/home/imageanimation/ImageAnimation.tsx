import { Autoplay } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import WholeBg from "../../../assets/about/about.svg";
import shake from "../../../assets/about/shake.svg";
import comp from "../../../assets/about/comp.svg";
import home from "../../../assets/about/home.svg";
import local from "../../../assets/about/local.svg";
import tick from "../../../assets/about/tick.svg";
import tool from "../../../assets/about/tool.svg";
import one from "../../../assets/about/one.svg";

import "swiper/css";

// import Transition from "./Transition";

type Card = {
  title: string;
  text: string;
  icon: string;
};

const cards: Card[] = [
  {
    title: "Find trusted professionals",
    text: "Connect with verified property experts and service providers.",
    icon: comp,
  },
  {
    title: "Explore properties",
    text: "Discover properties that match your needs and preferences.",
    icon: local,
  },
  {
    title: "Connect with builders",
    text: "Find experienced builders for your next property project.",
    icon: home,
  },
  {
    title: "Manage your property journey",
    text: "Keep your buying, building, selling, and service needs connected.",
    icon: tool,
  },
  {
    title: "Verified businesses & professionals",
    text: "Discover trusted providers with verified profiles and experience.",
    icon: tick,
  },
  {
    title: "Everything in one place",
    text: "Access property, construction, and essential services through one platform.",
    icon: one,
  },
  {
    title: "Connect with the right people",
    text: "Find, compare, and connect with the right professionals for your project.",
    icon: shake,
  },
];

const ImageAnimation = () => {
  return (
    <div className="relative flex h-screen w-full font-helvetica overflow-hidden  ">
      <div className="relative my-auto ml-auto h-[80vh] w-[40vw] overflow-hidden bg-[#6D6D6D] px-12">
        <img
          src={WholeBg}
          alt=""
          className="absolute inset-0 h-full w-full scale-110 object-cover blur-xl"
          draggable={false}
        />

        <div className="absolute inset-0 " />

        <Swiper
          direction="vertical"
          loop={true}
          centeredSlides={true}
          slidesPerView={5}
          spaceBetween={10}
          speed={2500}
          allowTouchMove={false}
          autoplay={{
            delay: 0,   
            disableOnInteraction: false,
          }}
          modules={[Autoplay]}
          className="relative z-10 h-full w-[90%] continuous-swiper"
        >
          {[...cards, ...cards].map((card, index) => (
            <SwiperSlide
              key={index}
              className="transition-all duration-500 [&.swiper-slide-active>div]:bg-[#F8F4EE] [&.swiper-slide-active>div]:opacity-100
                [&.swiper-slide-active>div]:shadow-xl [&>div]:bg-[#EBE5E0A3]/64 [&>div]:opacity-70"
            >
              <div className="grid h-[80%] w-full grid-cols-[48px_1fr] items-center gap-4 rounded-lg px-6 transition-all duration-500">
                <div className="flex h-10 w-10 items-center justify-center rounded bg-[#F4EFEB]">
                  <img
                    src={card.icon}
                    alt=""
                    className="h-5 w-5 object-contain"
                  />
                </div>

                <div>
                  <h3 className="mb-1 text-[0.9rem] font-bold leading-tight text-primary-brown">
                    {card.title}
                  </h3>
                  <p className="text-[0.68rem] leading-4 text-black">
                    {card.text}
                  </p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* RIGHT */}
      <div className="h-full w-1/2 bg-red-600" />

      {/* TRANSITION */}
      {/* <Transition /> */}
    </div>
  );
};

export default ImageAnimation;
