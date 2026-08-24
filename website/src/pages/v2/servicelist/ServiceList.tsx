import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { mockTraders } from "../../../data/mockTraders";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TraderGridCard from "../../../components/cards/trader/TraderGridCard";

const TABS = [
  "Electrical",
  "Plumbing",
  "Fencing",
  "Landscapers",
  "Conveyancers",
];

const rotate = <T,>(arr: T[], n: number): T[] => [
  ...arr.slice(n % arr.length),
  ...arr.slice(0, n % arr.length),
];

const ServiceList = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const navigate = useNavigate();

  const items = rotate(mockTraders, activeIdx);

  return (
    <section className="py-20 font-helvetica">
      <div className="lg:w-full  px-[5%] lg:px-0  lg:ml-10">
        <div className="relative mb-10 lg:mr-14  flex flex-col text-primary-brown items-stat justify-end lg:justify-center">
          <h2 className="text-[30px] font-medium  lg:text-[44px]">
            Top Professionals
          </h2>
          <p className="text-[0.875rem] lg:text-[1rem]">Trusted agencies and builders</p>

          <button
            onClick={() => navigate("/result?type=trader")}
            className="absolute right-0 flex items-center gap-3 text-lg font-medium text-[#562F00] transition-all hover:gap-3"
          >
            View All
            <span>↗</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center  gap-4 pb-6 text-[1rem] sm:justify-start">
          {TABS.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveIdx(i)}
              className={`min-w-[140px] rounded-xl border  hover:border hover:border-primary border-[#DBDAD3] py-2 transition ${activeIdx === i ? "bg-[#242424] text-white" : "bg-white"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div key={activeIdx} className="animate-fade-in gap-3">
          <Swiper
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              480: {
                slidesPerView: 1.2,
              },
              640: {
                slidesPerView: 1.5,
              },
              768: {
                slidesPerView: 2.1,
              },
              1024: {
                slidesPerView: 3.2,
              },
              1440: {
                slidesPerView: 4,
              },
            }}
            className="[overscroll-behavior-x:contain] touch-pan-y"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id}>
                <TraderGridCard item={item} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
