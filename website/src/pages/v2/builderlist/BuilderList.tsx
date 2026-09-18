import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getOrganizations, type PublicOrganization } from "../../../api/seeker/organization.api";
import { organizationToBuilder } from "../../../api/public.mappers";
import "swiper/css";
import BuilderGridCard from "../../../components/cards/builder/BuilderGridCard";

const BuilderList = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<PublicOrganization[]>([]);
    useEffect(() => { getOrganizations({ type: "builders", verified_only: 1 }).then((r) => setItems(r.data)).catch(console.error); }, []);
    return (
        <section className="py-20 font-helvetica">
            <div className="lg:w-full pl-[5%] lg:px-0 lg:ml-10">
                <div className="relative mb-10 lg:mr-14  flex flex-col text-primary-brown items-stat justify-end lg:justify-center">
                    <h2 className="text-[30px] font-medium  lg:text-[44px]">
                        Featured Businesses
                    </h2>
                    <p className="text-[0.875rem] lg:text-[1rem]">Trusted agencies and builders</p>

                    <button
                        onClick={() => navigate("/builders")}
                        className="absolute right-0  items-center gap-3 text-lg hidden md:flex font-medium text-[#562F00] transition-all hover:gap-3"
                    >
                        View All
                        <span>↗</span>
                    </button>
                </div>

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
                            <BuilderGridCard item={organizationToBuilder(item)} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default BuilderList;
