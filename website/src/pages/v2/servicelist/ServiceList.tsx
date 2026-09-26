import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrganizations, type PublicOrganization } from "../../../api/seeker/organization.api";
import { SERVICE_CATEGORIES } from "../../../constants/serviceCategories";
import { Mousewheel } from "swiper/modules";

import { organizationToTrader } from "../../../api/public.mappers";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import TraderGridCard from "../../../components/cards/trader/TraderGridCard";

const ServiceList = () => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [items, setItems] = useState<PublicOrganization[]>([]);
  const navigate = useNavigate();
  const categories = SERVICE_CATEGORIES;

  useEffect(() => {
    const category = categories[activeIdx];

    getOrganizations({ type: "trades-professionals", service_slug: category.slug, verified_only: 1 })
      .then((response) => setItems(response.data)).catch(console.error);
  }, [activeIdx]);

  return (
    <section className=" font-helvetica">
      <div className="lg:w-full  pl-[5%] lg:px-0  lg:ml-10">
        <div className="relative mb-10 lg:mr-14  flex flex-col text-primary-brown items-stat justify-end lg:justify-center">
          <h2 className="text-[30px] font-medium  lg:text-[44px]">
            Trades & Professionals
          </h2>
          <p className="text-[0.875rem] lg:text-[1rem]">Verified solo traders and specialists</p>

          <button
            onClick={() => navigate("/professionals")}
            className="absolute right-0 cursor-pointer hidden md:flex items-center gap-3 text-lg font-medium text-[#562F00] transition-all hover:gap-3"
          >
            View All
            <span>↗</span>
          </button>
        </div>

        <div className="flex flex-wrap justify-center  hidden md:flex gap-4 pb-6 text-[1rem] sm:justify-start">
          {categories.map((tab, i) => (
            <button
              key={tab.slug}
              onClick={() => setActiveIdx(i)}
              className={`min-w-[140px] rounded-xl border  hover:border hover:border-primary border-[#DBDAD3] py-2 transition ${activeIdx === i ? "bg-[#242424] text-white" : "bg-white"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div key={activeIdx} className="animate-fade-in gap-3">
          <Swiper
            modules={[Mousewheel]}
            spaceBetween={12}
            slidesPerView="auto"
            watchOverflow={false}
            grabCursor={true}
            mousewheel={{
              forceToAxis: true,
              sensitivity: 1,
              releaseOnEdges: true,
            }}
            className="[overscroll-behavior-x:contain] touch-pan-y"
          >
            {items.map((item) => (
              <SwiperSlide key={item.id} className="!w-[19.4375rem]">
                <TraderGridCard item={organizationToTrader(item)} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default ServiceList;
