import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { CheckCircle2, ThumbsUp } from "lucide-react";

import People from "../../assets/home/process/perople.png";

import Hand from "../../assets/utils/Hand.svg";
import Tick from "../../assets/utils/Tick.svg";
import Search from "../../assets/utils/Search.svg";

const features = [
    {
        icon: Tick,
        title: "Verified Professionals",
        description:
            "Every builder, broker, and agent is ABN-verified before they can list on BRIKSY.",
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
            "Connect directly with builders, agents, and organizations without unnecessary intermediaries.",
    },
];

const Process = () => {
    const leftBubble = useRef<HTMLDivElement>(null);
    const rightBubble = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        gsap.to(leftBubble.current, {
            y: -14,
            x: 4,
            rotation: -2,
            duration: 2.2,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
        });

        gsap.to(rightBubble.current, {
            y: -10,
            x: -3,
            rotation: 2,
            duration: 2.6,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
            delay: 0.4,
        });
    });

    return (
        <section className="w-[95%] mx-auto py-16 md:py-20 lg:py-24 font-helvetica">
            <h2 className="text-center text-[2rem] sm:text-[2.5rem] lg:text-[3.625rem] leading-tight font-medium text-primary-brown">
                Trust and safety features
                <br />
                for your protection
            </h2>

            <p className="mt-3 text-sm sm:text-[1rem] text-center text-primary-brown px-4">
                Every interaction on BRIKSY is designed to keep you safe and informed
            </p>

            <div className="mt-12 md:mt-16 lg:mt-24 flex flex-col lg:flex-row items-center justify-center gap-16 lg:gap-32">
                <div className="relative w-full max-w-[420px] lg:w-[420px]">
                    <img loading="lazy"
                        src={People}
                        alt="Professionals"
                        className="h-[380px] sm:h-[460px] lg:h-[520px] w-full object-cover rounded-2xl"
                    />

                    <div
                        ref={leftBubble}
                        className="absolute left-2 sm:-left-8 lg:-left-24 bottom-24 flex items-center gap-2 sm:gap-3 rounded-full bg-white px-4 sm:px-6 py-2 shadow-xl max-w-[80%] sm:max-w-none"
                    >
                        <CheckCircle2
                            size={20}
                            className="shrink-0 text-[#F97316]"
                            strokeWidth={2}
                        />

                        <span className="font-medium text-primary-brown text-xs sm:text-sm lg:text-base">
                            Job Assigned Successfully
                        </span>
                    </div>

                    <div
                        ref={rightBubble}
                        className="absolute right-2 sm:-right-4 lg:-right-16 bottom-8 flex items-center gap-2 sm:gap-3 rounded-full bg-white px-4 sm:px-6 py-2 shadow-xl"
                    >
                        <ThumbsUp size={18} className="shrink-0 text-[#F97316]" strokeWidth={2} />

                        <span className="font-medium text-primary-brown text-xs sm:text-sm lg:text-base">
                            Job Completed
                        </span>
                    </div>
                </div>

                <div className="grid w-full max-w-[560px] grid-cols-1 sm:grid-cols-2 gap-x-16 gap-y-8 sm:gap-y-10 px-4 lg:px-0">
                    {features.map(({ icon, title, description }) => (
                        <div key={title}>
                            <img loading="lazy" src={icon} alt={title} className="mb-2 h-14 w-14 sm:h-20 sm:w-20" />

                            <h3 className="text-lg sm:text-[1.5rem] font-medium text-primary-brown">
                                {title}
                            </h3>

                            <p className="mt-2 text-[0.875rem] leading-snug text-primary-brown">
                                {description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Process;