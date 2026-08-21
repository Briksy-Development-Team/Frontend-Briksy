import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import gsap from "gsap";
import { ArrowUpRight } from "lucide-react";
import Overone from "../../../assets/home/overone.svg";
import OverTwo from "../../../assets/home/overtwo.svg";
import OverThree from "../../../assets/home/overthree.svg";

type Tab = "Buying" | "Renting" | "Selling" | "Researching";

type CardData = {
  image: string;
  title: string;
  description: string;
};

const TABS: Tab[] = ["Buying", "Renting", "Selling", "Researching"];

const DATA: Record<Tab, CardData[]> = {
  Buying: [
    {
      image: Overone,
      title: "Get estimated property price",
      description:
        "See how much your property is worth, whether you own it or want to buy it.",
    },
    {
      image: OverTwo,
      title: "Need help with mortgage?",
      description:
        "Compare home loans and estimate repayments before buying your dream home.",
    },
    {
      image: OverThree,
      title: "Explore suburb profiles",
      description:
        "Discover schools, transport, safety and amenities before purchasing.",
    },
  ],

  Renting: [
    {
      image: Overone,
      title: "Find rental homes",
      description:
        "Browse apartments and houses that fit your budget and lifestyle.",
    },
    {
      image: OverTwo,
      title: "Rental price insights",
      description:
        "Compare rent prices across suburbs to make informed decisions.",
    },
    {
      image: OverThree,
      title: "Tenant resources",
      description:
        "Understand lease agreements, inspections and moving checklists.",
    },
  ],

  Selling: [
    {
      image: Overone,
      title: "Estimate selling price",
      description:
        "Know what your property could sell for using recent market data.",
    },
    {
      image: OverTwo,
      title: "Find top agents",
      description:
        "Connect with experienced local agents to maximize your sale.",
    },
    {
      image: OverThree,
      title: "Market trends",
      description: "Track buyer demand and recent sales in your neighbourhood.",
    },
  ],

  Researching: [
    {
      image: Overone,
      title: "Property market reports",
      description:
        "Stay updated with the latest market movements and insights.",
    },
    {
      image: OverTwo,
      title: "Investment calculator",
      description:
        "Estimate rental yield and long-term investment performance.",
    },
    {
      image: OverThree,
      title: "Compare suburbs",
      description: "Compare schools, transport, crime rates and future growth.",
    },
  ],
};

const OverLook = () => {
  const [activeTab, setActiveTab] = useState<Tab>("Buying");
  const navigate = useNavigate();
  const cardsRef = useRef<HTMLDivElement>(null);

  const changeTab = (tab: Tab) => {
    if (tab === activeTab) return;

    const cards = cardsRef.current?.children;
    if (!cards) return;
    gsap.to(cards, {
      opacity: 0,
      y: 20,
      duration: 0.2,
      stagger: 0.05,
      ease: "power2.out",
      onComplete: () => {
        setActiveTab(tab);

        requestAnimationFrame(() => {
          gsap.fromTo(
            cardsRef.current?.children ?? [],
            {
              opacity: 0,
              y: 20,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.08,
              ease: "power3.out",
            },
          );
        });
      },
    });
  };

  return (
    <section className="w-[95%] mx-auto rounded-3xl bg-white p-8 font-helvetica">
      <h2 className="text-[2rem] font-medium text-center">
        Explore all things property
      </h2>

      <div className="flex justify-center gap-5 mt-8 flex-wrap">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => changeTab(tab)}
            className={`px-8 py-2 rounded-xl border transition-all duration-300 ${
              activeTab === tab
                ? "bg-[#222222] text-white border-[#222222]"
                : "border-[#DBDAD3] hover:bg-gray-100"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div
        ref={cardsRef}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-14"
      >
        {DATA[activeTab].map((item) => (
          <div
            key={item.title}
            className="flex flex-col items-center text-center"
          >
            <img loading="lazy"
              src={item.image}
              alt={item.title}
              className="w-52 h-52 object-contain"
            />

            <h3 className="text-[1.8rem] font-medium mt-5">{item.title}</h3>

            <p className="text-[#666] leading-7 mt-3 max-w-[320px]">
              {item.description}
            </p>

            <button onClick={() => navigate("/coming-soon")} className="flex items-center gap-2 mt-5 font-medium hover:gap-3 transition-all">
              Know more
              <ArrowUpRight size={18} />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OverLook;
