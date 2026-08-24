import { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Swiper as SwiperType } from "swiper";

import "swiper/css";

const reviews = [
  {
    id: 1,
    title: [
      "Brisky brings together the best of property search, professional services, and verified trust into a single, editorial digital experience. Think Domain meets Airbnb — clean, structured, and built for the Australian market.",
      "Every agent, agency, and builder on Brisky is ABN-verified. Every listing goes through our multi-stage verification process before going live.",
    ],
    name: "John Carter",
    role: "Property Investor",
    company: "Brisbane Realty",
    image: "https://i.pravatar.cc/100?img=1",
  },
  {
    id: 2,
    title: [
      "As a first-time home owner, I was overwhelmed by how many platforms I had to juggle just to find a trustworthy agent. Brisky changed that completely.",
      "Having every professional ABN-verified gave me real peace of mind before I signed anything. It's the kind of transparency the industry has needed for years.",
    ],
    name: "Sarah Wilson",
    role: "Home Owner",
    company: "Wilson Homes",
    image: "https://i.pravatar.cc/100?img=5",
  },
  {
    id: 3,
    title: [
      "We list every new development on Brisky before anywhere else. The verification process builds instant credibility with buyers who are comparing dozens of builders.",
      "It's rare to find a platform that treats builders and agents with the same level of professionalism as buyers. Brisky gets that balance right.",
    ],
    name: "Michael Brown",
    role: "Builder",
    company: "Brown Projects",
    image: "https://i.pravatar.cc/100?img=12",
  },
  {
    id: 4,
    title: [
      "My clients expect a polished, editorial experience when they're browsing properties, and Brisky delivers exactly that. The design feels premium without being complicated.",
      "I regularly recommend Brisky to homeowners looking to renovate or furnish, since the verified professional network saves everyone time and guesswork.",
    ],
    name: "Emily Davis",
    role: "Interior Designer",
    company: "Studio Form",
    image: "https://i.pravatar.cc/100?img=20",
  },
  {
    id: 5,
    title: [
      "Brisky's structured layout makes it easy to showcase architectural details that usually get lost on generic listing sites. Photography and floor plans finally get the space they deserve.",
      "The verification standard has quietly raised the bar for what clients expect from every professional they work with on a project.",
    ],
    name: "James Walker",
    role: "Architect",
    company: "Walker Design",
    image: "https://i.pravatar.cc/100?img=30",
  },
];

const Review = () => {
  const swiperRef = useRef<SwiperType | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="py-20 font-helvetica overflow-hidden">
      <div className="lg:mx-[5%] px-4 lg:px-8">
        <div className="pt-20 grid lg:grid-cols-2 gap-10 lg:gap-24">
          <div>
            <h2 className="text-[2.25rem] sm:text-[1.875rem] font-medium lg:font-normal mb-6">
              Why Thousands Choose Brisky
            </h2>

            <p className="text-[1rem] w-full sm:w-[90%] text-primary-light-brown leading-8">
              From first search to final settlement, Briksy connects you with
              verified builders, agents, and trades. Every profile is
              ABN-checked. Every review is from a real customer.
            </p>
          </div>

          <div className="flex flex-col justify-evenly min-h-[450px] min-w-0">
            <div className="text-xl font-semibold text-[#4E3728] mb-5">
              {String(activeIndex + 1).padStart(2, "0")}
              <span className="text-[#B9916D]">
                {" "}
                / {String(reviews.length).padStart(2, "0")}
              </span>
            </div>

            <Swiper
              slidesPerView={1}
              spaceBetween={
                30
              } 
              speed={600}
              grabCursor={true}
              className="w-full"
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            >
              {reviews.map((review) => (
                <SwiperSlide key={review.id}>
                  <div className="flex flex-col gap-6  rounded-2xl lg:p-8 ">
                    {review.title.map((paragraph, i) => (
                      <p
                        key={i}
                        className=" text-[1.25rem] lg:text-[1.125rem] leading-snug lg:leading-loose text-[#6B6B6B] whitespace-normal break-words"
                      >
                        "{paragraph}"
                      </p>
                    ))}
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="flex items-center justify-between mt-8 lg:mt-16">
              <div className="flex items-center gap-4">
                <img loading="lazy"
                  src={reviews[activeIndex].image}
                  alt=""
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h4 className="text-xl font-medium">
                    {reviews[activeIndex].name}
                  </h4>

                  <p className="text-neutral-500">
                    {reviews[activeIndex].role}
                  </p>

                  <p className="text-sm">{reviews[activeIndex].company}</p>
                </div>
              </div>

              <div className="flex gap-3 px-2 ">
                <button
                  onClick={() => swiperRef.current?.slidePrev()}
                  className="w-8 h-8 font-bold rounded-full border border-primary-light-brown/60 text-primary-light-brown/60 flex items-center justify-center transition hover:bg-primary-light-brown/60 hover:text-white"
                >
                  <ArrowLeft size={18} />
                </button>

                <button
                  onClick={() => swiperRef.current?.slideNext()}
                  className="w-8 h-8 font-bold rounded-full border border-[#3A2B20] text-[#3A2B20] flex items-center justify-center transition hover:bg-[#3A2B20] hover:text-white"
                >
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Review;
