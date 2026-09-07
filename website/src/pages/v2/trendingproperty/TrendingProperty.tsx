import { Swiper, SwiperSlide } from "swiper/react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProperties, type PublicProperty } from "../../../api/property/property.api";
import { propertyToCard } from "../../../api/public.mappers";
import PropertyGridCard from "../../../components/cards/property/PropertyGridCard";
import "swiper/css";

const TrendingProperty = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<PublicProperty[]>([]);
    useEffect(() => { getProperties({ verified_only: true, sort: "rating" }).then((r) => setItems(r.data)).catch(console.error); }, []);
    return (
        <section className="py-20 font-helvetica">
            <div className="lg:w-full px-[5%] lg:px-0  lg:ml-10">
                <div className="relative mb-10 lg:mr-14  flex flex-col text-primary-brown items-stat justify-end lg:justify-center">
                    <h2 className="text-[30px] font-medium  lg:text-[44px]">
                        Featured Properties
                    </h2>
                    <p className="text-[0.875rem] lg:text-[1rem]">Trusted agencies and builders</p>

                    <button
                        onClick={() => navigate("/result?type=property")}
                        className="absolute right-0 flex items-center gap-3 text-lg font-medium text-[#562F00] transition-all hover:gap-3"
                    >
                        View All
                        <span>↗</span>
                    </button>
                </div>
                <Swiper
                    spaceBetween={12}
                    slidesPerView={1}
                    breakpoints={{
                        480: {
                            slidesPerView: 1.2,
                        },
                        640: {
                            slidesPerView: 1.9,
                        },
                        768: {
                            slidesPerView: 2.6,
                        },
                        1024: {
                            slidesPerView: 4.2,
                        },
                        1440: {
                            slidesPerView: 4.6,
                        },
                    }}
                    className="[overscroll-behavior-x:contain] touch-pan-y"

                >
                    {items.map((item) => (
                        <SwiperSlide key={item.id}>
                            <PropertyGridCard item={propertyToCard(item)} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default TrendingProperty;
