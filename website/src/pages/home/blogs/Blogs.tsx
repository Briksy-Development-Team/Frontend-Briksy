import { Link } from "react-router-dom";
import Blog1 from "../../../assets/reviews/blog1.png";
import Blog2 from "../../../assets/reviews/blog2.png";
import Blog3 from "../../../assets/reviews/blog3.png";

type BlogCard = {
  image: string;
  imagePosition: "top" | "bottom";
  quote: string;
  name: string;
  company: string;
};

const blogCards: BlogCard[] = [
  {
    image: Blog1,
    imagePosition: "top",
    quote: "Exceptional service and deep local knowledge. Seamless process, highly recommend.",
    name: "Pankit Patel",
    company: "ELsolveIT",
  },
  {
    image: Blog2,
    imagePosition: "bottom",
    quote: "How to Choose a Mortgage Broker in 2026: 5 Questions to Ask",
    name: "Sarah Johnson",
    company: "TechSphere",
  },
  {
    image: Blog3,
    imagePosition: "top",
    quote: "Remarkable expertise and quick turnaround. Their insights were invaluable.",
    name: "Michael Chen",
    company: "InnovateNow",
  },
];

const Blogs = () => {
  return (
    <section className="w-full font-helvetica">
      <div className="mx-auto w-full max-w-[2000px] px-4 md:px-8 xl:px-14">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6 lg:gap-[18px]">
          {/* Left Header Block (Figma node 4604:915) */}
          <div className="flex flex-col justify-between py-2 lg:py-6 lg:pl-4 w-full lg:w-[310px] shrink-0 gap-6">
            <div className="flex flex-col gap-3 lg:gap-4">
              <span className="text-[11px] font-medium tracking-[0.14em] text-yellowgray-50 uppercase">
                INSIGHTS
              </span>
              <h2 className="text-[1.875rem] sm:text-[2.25rem] font-normal leading-[1.25] text-primary-brown tracking-tight">
                Latest Property Insights &amp; Resources
              </h2>
            </div>

            <Link
              to="/blogs"
              className="inline-flex items-center justify-center h-[44px] px-5 rounded-lg bg-primary-brown text-white text-[14px] font-normal hover:opacity-90 transition-opacity w-fit"
            >
              View All Articles
            </Link>
          </div>

          {/* Cards Row (Figma nodes 4604:919, 4604:926, 4604:933) */}
          <div className="flex gap-[18px] overflow-x-auto pb-4 pt-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            {blogCards.map((card) => {
              const imageElement = (
                <img
                  loading="lazy"
                  src={card.image}
                  alt={card.name}
                  className={`h-[232px] w-full object-cover ${
                    card.imagePosition === "top"
                      ? "rounded-t-[12px]"
                      : "rounded-b-[12px]"
                  }`}
                />
              );

              const contentElement = (
                <div className="flex flex-1 flex-col justify-between p-5">
                  <p className="text-[18px] font-medium leading-[1.25] text-primary-brown">
                    “ {card.quote} ”
                  </p>

                  <div className="mt-4">
                    <h4 className="text-[16px] text-[#98928E] font-normal leading-relaxed">
                      {card.name}
                    </h4>
                    <p className="text-[16px] text-[#98928E] font-normal leading-relaxed">
                      from {card.company}
                    </p>
                  </div>
                </div>
              );

              return (
                <Link
                  key={card.name}
                  to="/blogs"
                  className="flex h-[464px] w-[320px] min-w-[320px] shrink-0 flex-col justify-between overflow-hidden rounded-[12px] border border-[#EDE8E4] bg-white transition-all hover:shadow-md cursor-pointer"
                >
                  {card.imagePosition === "top" ? (
                    <>
                      {imageElement}
                      {contentElement}
                    </>
                  ) : (
                    <>
                      {contentElement}
                      {imageElement}
                    </>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Blogs;