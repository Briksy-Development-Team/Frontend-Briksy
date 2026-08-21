import { useNavigate } from "react-router-dom";
import Hand from "../../../../../assets/utils/Hand.svg";
import Tick from "../../../../../assets/utils/Tick.svg";
import Search from "../../../../../assets/utils/Search.svg";

const features = [
  {
    icon: Tick,
    title: "Verified Professionals",
    description: "Every service provider is verified before joining Briksy.",
  },
  {
    icon: Search,
    title: "Smart Discovery",
    description:
      "Search properties and professionals using powerful filters and location-based results.",
  },
  {
    icon: Hand,
    title: "Trusted Connections",
    description:
      "Connect directly with builders, agents, and organizations—without unnecessary intermediaries.",
  },
];

const Process = () => {
  const navigate = useNavigate();
  return (
    <section className=" font-helvetica py-24 px-6">
      <div className="mx-auto text-center">
        <h2 className=" text- lg:text-[2.25rem] md:text-5xl text-primary-brown">
          Everything You Need in One Platform
        </h2>
        <p className="mt-4 text-primary-light-brown text-[1rem] lg:text-[1rem] max-w-2xl mx-auto leading-relaxed">
          Frontier models trained across medical imaging, pathology, genomics,
          and clinical text, designed for medicine. Built in kaiko's AI research
          lab.
        </p>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {features.map(({ icon, title, description }) => (
            <div key={title} className="flex flex-col items-center sm:items-start lg:items-center text-center sm:text-start lg:text-center">
              <img loading="lazy" src={icon} alt={title} className="w-40  mb-6" />
              <h3 className="lg:text-[1.25rem] font-semibold text-center sm:text-start lg:text-center text-primary-brown mb-3">
                {title}
              </h3>
              <p className="text-primary-light-brown  leading-relaxed max-w-sm lg:text-[1rem] ">
                {description}
              </p>
            </div>
          ))}
        </div>

        <button onClick={() => navigate("/coming-soon")} className="mt-14 inline-flex items-center gap-2 border border-primary-light-brown text-primary-light-brown px-6 py-3 rounded-xl lg:text-[0.875rem] font-medium hover:bg-[#EFE9DD] transition-colors">
          See How it works
          <span aria-hidden="true">→</span>
        </button>
      </div>
    </section>
  );
};

export default Process;
