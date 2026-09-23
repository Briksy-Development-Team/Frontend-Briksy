import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import { CARDS } from "./communityData";

gsap.registerPlugin(ScrollTrigger);

const MobileCommunity = () => {
  const container = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current.filter(Boolean);
      if (!cards.length) return;

      gsap.set(cards, {
        transformOrigin: "center center",
        y: (i) => (i === 0 ? 0 : "100vh"), // Keeps incoming cards safely off-screen
        scale: 1,
        rotationZ: 0,
        zIndex: (i) => i + 1,
      });

      const tl = gsap.timeline();

      // 1. Build the scroll timeline for cards
      cards.forEach((card, i) => {
        if (i === 0) return;

        const prevCard = cards[i - 1];
        const rotationAngle = i % 2 === 0 ? -3 : 3;

        tl.to(
          prevCard,
          {
            scale: 0.9,
            rotationZ: rotationAngle,
            opacity: 0.8,
            ease: "none",
          },
          i
        ).to(
          card,
          {
            y: 0,
            ease: "none",
          },
          i
        );
      });

      // 2. Pin the section in the center of the screen
      ScrollTrigger.create({
        trigger: container.current,
        start: "center center", // Changed from "top top" to center the 70vh section
        end: `+=${(CARDS.length - 1) * 60}%`,
        pin: true,
        scrub: 2,
        animation: tl,
      });
    },
    { scope: container }
  );

  return (
    <section
      ref={container}
      // Changed h-[100vh] to h-[70vh] (or h-[75vh] if you need slightly more breathing room)
      className="relative w-full h-[100vh] overflow-hidden flex flex-col justify-center items-center font-helvetica"
    >
      {CARDS.map((card, index) => (
        <div
          key={card.title}
          ref={(el) => (cardRefs.current[index] = el)}
          className="absolute inset-0 m-auto h-fit w-[calc(100%-2rem)] max-w-[26rem] flex flex-col gap-6 rounded-[1.25rem] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] border border-gray-100 will-change-transform"
        >
          <div className="flex items-start justify-between">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center md:h-12 md:w-12">
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