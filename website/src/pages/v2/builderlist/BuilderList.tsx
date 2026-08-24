import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { mockBuilders } from "../../../data/mockBuilders";
import "swiper/css";
import BuilderGridCard from "../../../components/cards/builder/BuilderGridCard";

const BuilderList = () => {
    const navigate = useNavigate();
    return (
        <section className="py-20 font-helvetica">
            <div className="lg:w-full px-[5%] lg:px-0 lg:ml-10">
                <div className="relative mb-10 lg:mr-14  flex flex-col text-primary-brown items-stat justify-end lg:justify-center">
                    <h2 className="text-[30px] font-medium  lg:text-[44px]">
                        Featured Businesses
                    </h2>
                    <p className="text-[0.875rem] lg:text-[1rem]">Trusted agencies and builders</p>

                    <button
                        onClick={() => navigate("/result?type=builder")}
                        className="absolute right-0 flex items-center gap-3 text-lg font-medium text-[#562F00] transition-all hover:gap-3"
                    >
                        View All
                        <span>↗</span>
                    </button>
                </div>

                <Swiper
                    modules={[Mousewheel]}
                    spaceBetween={24}
                    slidesPerView={1}
                    watchOverflow={false}
                    grabCursor={true}
                    mousewheel={{
                        forceToAxis: true,
                        sensitivity: 1,
                        releaseOnEdges: true,
                    }}
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
                    {mockBuilders.map((item) => (
                        <SwiperSlide key={item.id}>
                            <BuilderGridCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BuilderList;