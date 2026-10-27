import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { CARDS } from "./communityData";

gsap.registerPlugin(ScrollTrigger);

const MobileCommunity = () => {
  const container = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.utils.toArray<HTMLElement>(".community-card").forEach((card, i) => {
        gsap.from(card, {
          xPercent: i % 2 === 0 ? -120 : 120,
          opacity: 0,
          ease: "bounce.out",
          scrollTrigger: {
            trigger: card,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        });
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      className="w-full mt-28 px-4 overflow-x-hidden flex flex-col items-center gap-6 font-helvetica"
    >
      {CARDS.map((card) => (
        <div
          key={card.title}
          className="community-card w-full max-w-[26rem] flex flex-col gap-6 rounded-[1.25rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] will-change-transform"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center md:h-12 md:w-12">
              <img src={card.icon} alt="" className="h-full w-full" />
            </span>

            <img
              src={card.img}
              alt={card.title}
              className="h-[9.25rem] w-[12.75rem] shrink-0 rounded-[0.375rem] object-cover"
            />
          </div>

          <div className="flex flex-col gap-2">
            <p className="text-base font-bold leading-6 text-primary-brown">
              {card.title}
            </p>

            <p
              className="text-sm text-primary-light-brown"
              style={{
                lineHeight: "1.25rem",
                letterSpacing: "0.02625rem",
              }}
            >
              {card.desc}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
};

export default MobileCommunity;