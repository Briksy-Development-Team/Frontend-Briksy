import Imgone from "../../../assets/reviews/img1.svg";
import Imgtwo from "../../../assets/reviews/img2.svg";
import Imgthree from "../../../assets/reviews/img3.svg";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useNavigate } from "react-router-dom";
import type { CSSProperties } from "react";

import "swiper/css";
import "swiper/css/pagination";

type Review = {
  image: string;
  imagePosition: "top" | "bottom";
  quote: string;
  name: string;
  company: string;
};

const reviews: Review[] = [
  {
    image: Imgone,
    imagePosition: "top",
    quote:
      "Exceptional service and deep local knowledge: [Link]. Seamless process, highly recommend: [Link].",
    name: "Pankit Patel",
    company: "ELsolveIT",
  },
  {
    image: Imgtwo,
    imagePosition: "bottom",
    quote:
      "Outstanding support and personalized attention: [Link]. Truly a game-changer for my project: [Link].",
    name: "Sarah Johnson",
    company: "TechSphere",
  },
  {
    image: Imgthree,
    imagePosition: "top",
    quote:
      "Remarkable expertise and quick turnaround: [Link]. Their insights were invaluable: [Link].",
    name: "Michael Chen",
    company: "InnovateNow",
  },
];

type ReviewCardProps = Review;

const ReviewCard = ({
  image,
  imagePosition,
  quote,
  name,
  company,
}: ReviewCardProps) => {
  const imageElement = (
    <img loading="lazy"
      src={image}
      alt={name}
      className="h-64 w-full object-cover"
    />
  );

  const content = (
    <div className="flex flex-1 flex-col justify-between p-6">
      <p className="text-lg font-medium text-[#222]">
        “ {quote} ”
      </p>

      <div className={imagePosition === "top" ? "mt-12" : "mt-10"}>
        <h4 className="text-base font-medium">{name}</h4>
        <p className="mt-1 text-gray-500">from {company}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-130 flex-col overflow-hidden rounded-3xl border border-[#ddd8cf] bg-white">
      {imagePosition === "top" ? (
        <>
          {imageElement}
          {content}
        </>
      ) : (
        <>
          {content}
          {imageElement}
        </>
      )}
    </div>
  );
};

const Blogs = () => {
  const navigate = useNavigate();
  return (
    <section className="w-full font-helvetica">
      <div className="flex flex-col gap-8 px-[5%] py-20 xl:flex-row">
        <div className="flex flex-col items-center pt-8 xl:w-[24%] lg:items-start">
          <p className="mb-2 text-[0.75rem] font-medium uppercase tracking-[1px] text-yellowgray-50">
            BLOGS
          </p>

          <h2 className="text-center text-[2.25rem] font-medium leading-snug lg:text-start">
            Latest Property <br />
            Insights & <br className="hidden lg:flex" />
            Resources
          </h2>

          <button onClick={() => navigate("/coming-soon")} className="mt-10 w-36 rounded-xl bg-primary-brown px-5 py-3 text-sm font-medium text-white">
            View All Articles
          </button>
        </div>

        <div className="w-full xl:w-[76%]">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              640: {
                slidesPerView: 1.4,
              },
              768: {
                slidesPerView: 2,
              },
              1280: {
                slidesPerView: 3,
              },
            }}
            style={
              {
                "--swiper-pagination-color": "#562F00",
                "--swiper-pagination-bullet-inactive-color": "#562F00",
                "--swiper-pagination-bullet-inactive-opacity": "0.3",
              } as CSSProperties
            }
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.name} className="pb-12">
                <ReviewCard {...review} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default Blogs;