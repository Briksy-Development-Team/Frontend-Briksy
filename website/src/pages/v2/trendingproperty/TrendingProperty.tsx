import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getProperties, type PublicProperty } from "../../../api/property/property.api";
import { propertyToCard } from "../../../api/public.mappers";
import PropertyGridCard from "../../../components/cards/property/PropertyGridCard";
import SwiperScroll from "../../../components/swiper/SwiperScroll";

const TrendingProperty = () => {
    const navigate = useNavigate();
    const [items, setItems] = useState<PublicProperty[]>([]);
    useEffect(() => { getProperties({ verified_only: 1, sort: "rating" }).then((r) => setItems(r.data)).catch(console.error); }, []);
    return (
        <section className=" font-helvetica">
            <div className="lg:w-full pl-[5%] lg:px-0  lg:ml-10">
                <div className="relative mb-10 lg:mr-14  flex flex-col text-primary-brown items-stat justify-end lg:justify-center">
                    <h2 className="text-[30px] font-medium  lg:text-[44px]">
                        Featured Properties
                    </h2>
                    <p className="text-[0.875rem] lg:text-[1rem]">Trusted agencies and builders</p>

                    <button
                        onClick={() => navigate("/buy")}
                        className="absolute right-0 cursor-pointer hidden md:flex items-center gap-3 text-lg font-medium text-[#562F00] transition-all hover:gap-3"
                    >
                        View All
                        <span>↗</span>
                    </button>
                </div>
                <SwiperScroll
                    items={items.slice(0, 5)}
                    renderItem={(item) => <PropertyGridCard item={propertyToCard(item)} />}
                />
            </div>
        </section>
    );
};

export default TrendingProperty;
