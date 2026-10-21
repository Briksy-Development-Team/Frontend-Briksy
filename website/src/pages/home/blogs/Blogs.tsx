import Imgone from "../../../assets/reviews/img1.svg";
import Imgtwo from "../../../assets/reviews/img2.svg";
import Imgthree from "../../../assets/reviews/img3.svg";
import { SwiperSection } from "../../../components/swiper";

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
      "Exceptional service and deep local knowledge. Seamless process, highly recommend.",
    name: "Pankit Patel",
    company: "ELsolveIT",
  },
  {
    image: Imgtwo,
    imagePosition: "bottom",
    quote:
      "Outstanding support and personalized attention. Truly a game-changer for my project.",
    name: "Sarah Johnson",
    company: "TechSphere",
  },
  {
    image: Imgthree,
    imagePosition: "top",
    quote:
      "Remarkable expertise and quick turnaround. Their insights were invaluable.",
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
    <img
      loading="lazy"
      src={image}
      alt={name}
      className="h-60 w-full object-cover"
    />
  );

  const content = (
    <div className="flex flex-1 flex-col justify-between p-6">
      <p className="text-lg font-medium text-[#222]">“ {quote} ”</p>

      <div className={imagePosition === "top" ? "mt-10" : "mt-8"}>
        <h4 className="text-base font-medium">{name}</h4>
        <p className="mt-1 text-gray-500">from {company}</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-[28rem] w-[20rem] md:w-[22rem] flex-col overflow-hidden rounded-3xl border border-[#ddd8cf] bg-white text-primary-brown">
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
  return (
    <SwiperSection
      title="Latest Property Insights & Resources"
      subtitle="Read expert guides, market trends, and property advice"
      viewAllHref="/blogs"
      viewAllText="View All Articles"
      items={reviews}
      slideClassName="!w-[20rem] md:!w-[22rem]"
      spaceBetween={20}
      renderItem={(review) => <ReviewCard {...review} />}
    />
  );
};

export default Blogs;