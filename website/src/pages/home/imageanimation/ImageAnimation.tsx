import { useRef } from "react";
import { ExternalLink } from "lucide-react";
import LeftVisual from "./Transition";
import { lenisInstance } from "../../../lenis";

interface JourneyStep {
  key: string;
  title: string;
  desc: string;
  action: string;
  categoryId: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    key: "BUY",
    title: "Find your place.",
    desc: "Search properties that match your next move.",
    action: "Start Searching",
    categoryId: "real-estate",
  },
  {
    key: "BUILD",
    title: "Bring your plans to life.",
    desc: "Find builders for your next project.",
    action: "Explore Builders",
    categoryId: "builders",
  },
  {
    key: "CONNECT",
    title: "Find your people.",
    desc: "Discover agents, trades and property professionals.",
    action: "Find Professionals",
    categoryId: "traders",
  },
];

const roll = "block transition-transform duration-300 ease-out group-hover:-translate-y-full";

const RollText = ({ text }: { text: string }) => (
  <span className="flex">
    {text.split("").map((char, i) => {
      const delay = { transitionDelay: `${i * 30}ms` };
      return (
        <span key={i} className="relative block overflow-hidden">
          <span className={roll} style={delay}>{char}</span>
          <span className={`${roll} absolute left-0 top-full`} style={delay}>{char}</span>
        </span>
      );
    })}
  </span>
);

const ImageAnimation = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const handleSelectTabAndScroll = (categoryId: string) => {
    window.dispatchEvent(
      new CustomEvent("briksy:select-hero-tab", { detail: { categoryId } })
    );

    if (lenisInstance.current) {
      lenisInstance.current.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div
      ref={sectionRef}
      className="relative flex flex-col lg:flex-row min-h-screen mx-auto w-full max-w-[2000px] items-center font-helvetica overflow-hidden"
    >
      <div className="mt-10 lg:mt-0 flex w-full lg:w-1/2 items-center justify-center px-4 lg:px-8">
        <div className="w-full flex justify-center">
          <LeftVisual trackRef={sectionRef} />
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-center py-12 lg:py-0 px-4 lg:px-8 min-w-0">
        <div className="mx-auto flex w-full max-w-[589px] flex-col gap-8 lg:gap-9 text-left">
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium uppercase tracking-[0.03em] text-primary-brown">
              HOW BRIKSY WORKS
            </p>
            <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3rem] font-normal leading-[1.05] tracking-[-0.03em] text-primary-brown text-balance">
              One journey.
              <br />
              Three simple ways to start.
            </h2>
          </div>

          <div className="flex flex-col gap-6">
            {JOURNEY_STEPS.map((step) => (
              <div
                key={step.key}
                onClick={() => handleSelectTabAndScroll(step.categoryId)}
                className="group flex items-start gap-3.5 sm:gap-4 pl-3.5 sm:pl-4 pr-3 py-2.5 sm:py-3 border-l-4 border-[#f0eae5] hover:border-[#BF9F7D] transition-all duration-200 cursor-pointer"
              >
                <div className="w-[100px] sm:w-[130px] lg:w-[150px] shrink-0 text-[24px] sm:text-[28px] lg:text-[30px] font-medium tracking-tight text-primary-brown leading-none">
                  <RollText text={step.key} />
                </div>

                {/* Step details */}
                <div className="flex flex-1 flex-col gap-1 min-w-0">
                  <h3 className="text-[18px] sm:text-[20px] font-medium text-primary-brown leading-7">
                    {step.title}
                  </h3>
                  <p className="text-[14px] sm:text-[16px] text-primary-brown/80 leading-6">
                    {step.desc}
                  </p>
                  <div className="pt-1.5">
                    <span className="inline-flex items-center gap-1.5 text-[15px] sm:text-[16px] text-primary-brown font-normal group-hover:text-[#BF9F7D] transition-colors">
                      <ExternalLink
                        size={18}
                        className="shrink-0 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      />
                      <span>{step.action}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnimation;