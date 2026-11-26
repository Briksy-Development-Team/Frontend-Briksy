import { useRef } from "react";
import LeftVisual from "./Transition";
import { lenisInstance } from "../../../lenis";
import BuyIcon from "../../../assets/icons/category/houselightbrown.svg";
import BuildIcon from "../../../assets/icons/category/build.svg";
import ConnectIcon from "../../../assets/icons/category/connectlightbrown.svg";

interface JourneyStep {
  key: string;
  icon: string;
  title: string;
  desc: string;
  action: string;
  categoryId: string;
}

const JOURNEY_STEPS: JourneyStep[] = [
  {
    key: "BUY",
    icon: BuyIcon,
    title: "Find your place.",
    desc: "Discover properties that fit your lifestyle and next move.",
    action: "Start Searching",
    categoryId: "buy",
  },
  {
    key: "BUILD",
    icon: BuildIcon,
    title: "Bring your plans to life.",
    desc: "Explore builders to turn your vision into reality.",
    action: "Explore Builders",
    categoryId: "builders",
  },
  {
    key: "CONNECT",
    icon: ConnectIcon,
    title: "Find your people.",
    desc: "Connect with agents, trades and property professionals.",
    action: "Find Professionals",
    categoryId: "traders",
  },
];

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
      className="relative flex flex-col lg:flex-row min-h-screen mx-auto w-full max-w-[1400px] items-center font-helvetica overflow-hidden"
    >
      <div className="mt-10 lg:mt-0 flex w-full lg:w-1/2 items-center z-40 justify-center px-4 lg:px-8">
        <div className="w-full flex justify-center">
          <LeftVisual trackRef={sectionRef} />
        </div>
      </div>

      <div className="flex w-full lg:w-1/2 flex-col justify-center py-12 z-40 lg:py-0 px-4 lg:px-8 min-w-0">
        <div className="mx-auto flex w-full max-w-[660px] flex-col gap-7 text-left">
          <div className="flex flex-col gap-2.5">
            <p className="text-sm font-medium uppercase tracking-[0.03em] text-[#7C5F42]">
              HOW BRIKSY WORKS
            </p>
            <h2 className="text-[2.25rem] sm:text-[2.75rem] lg:text-[3rem] font-normal leading-[1.08] tracking-[-0.03em] text-primary-brown text-balance">
              One journey.
              <br />
              Three simple ways to start.
            </h2>
          </div>

          <div className="flex flex-col gap-3.5">
            {JOURNEY_STEPS.map((step) => (
              <div
                key={step.key}
                onClick={() => handleSelectTabAndScroll(step.categoryId)}
                className="group flex flex-col sm:flex-row sm:items-center gap-3.5 sm:gap-4 rounded-[20px] border border-[#EBEBEB]/60 bg-white p-4 sm:p-5 shadow-[0_4px_20px_rgba(52,37,17,0.03)] hover:border-[#E2CBB3] hover:shadow-sm transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-center gap-3.5 shrink-0">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#F4EAE3]">
                    <img src={step.icon} alt="" className="h-6 w-6 object-contain" />
                  </div>
                  <div className="w-[96px] text-[18px] sm:text-[20px] font-medium tracking-tight text-primary-brown leading-none">
                    <p>{step.key}</p>
                  </div>
                </div>

                <div className="hidden sm:block h-11 w-px bg-[#EBEBEB] shrink-0" />

                <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                  <h3 className="text-[16px] sm:text-[17px] font-medium text-primary-brown leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-[13px] sm:text-[13.5px] text-[#7C5F42] leading-snug">
                    {step.desc}
                  </p>
                </div>

                <span className="inline-flex w-fit items-center gap-2 whitespace-nowrap rounded-full border border-[#E2CBB3] bg-white px-4 py-2.5 text-[13.5px] font-medium text-primary-brown transition-colors group-hover:border-[#342511] group-hover:bg-[#342511] group-hover:text-white shrink-0">
                  <svg width="16" height="16" viewBox="0 0 20 20" fill="none" className="shrink-0 text-[#7C5F42] transition-colors group-hover:text-white">
                    <path d="M8.335 2.5C5.87917 2.52667 4.50917 2.68333 3.59833 3.59333C2.5 4.69167 2.5 6.46 2.5 9.9975C2.5 13.535 2.5 15.3025 3.59833 16.4017C4.69667 17.5008 6.46667 17.5 10.0025 17.5C13.5383 17.5 15.3075 17.5 16.4067 16.4008C17.3175 15.4908 17.4733 14.12 17.5 11.6633M11.6667 2.5H15C16.1783 2.5 16.7675 2.5 17.1333 2.86667C17.5 3.23167 17.5 3.82083 17.5 5V8.33333M16.6667 3.33333L9.16667 10.8333" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span>{step.action}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageAnimation;