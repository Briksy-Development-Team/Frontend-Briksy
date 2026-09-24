import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import {
  CARDS,
  FRAME_COUNT,
  SCROLL_PER_CARD,
  getFrame,
} from "./communityData";

gsap.registerPlugin(ScrollTrigger);

const DesktopCommunity = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentFrameRef = useRef(0);

  useGSAP(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");

    if (!canvas || !ctx || !sectionRef.current) return;

    const images: HTMLImageElement[] = Array(FRAME_COUNT);

    const draw = (frame: number) => {
      const img = images[frame];

      if (!img?.complete || !img.naturalWidth) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };

    const resize = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;

      draw(currentFrameRef.current);
    };

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();

      img.onload = () => {
        if (i === 0) resize();
        if (i === FRAME_COUNT - 1) {
          ScrollTrigger.refresh();
        }
      };

      img.src = getFrame(i + 1);
      images[i] = img;
    }

    const cards = cardRefs.current;

    if (cards.some((card) => !card)) return;

    const getHiddenDistance = () => window.innerHeight + 100;

    gsap.set(cards, {
      y: getHiddenDistance(),
    });

    const totalScroll = SCROLL_PER_CARD * cards.length;
    const CARD_DURATION = 1 / cards.length;

    const updateCards = (progress: number) => {
      const hiddenDistance = window.innerHeight + 100;
      const overlaps = [0, 0.12, 0, 0.12];

      cards.forEach((card, i) => {
        if (!card) return;

        const start = i === 0 ? 0 : i * CARD_DURATION - overlaps[i];
        const end = (i + 1) * CARD_DURATION;
        const t = gsap.utils.clamp(0, 1, (progress - start) / (end - start));

        let y: number;

        if (t < 0.5) {
          y = gsap.utils.interpolate(hiddenDistance, 0, t / 0.5);
        } else {
          y = gsap.utils.interpolate(0, -hiddenDistance, (t - 0.5) / 0.5);
        }

        gsap.set(card, { y });
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${totalScroll}`,
      pin: true,
      scrub: 0.15,
      onUpdate: (self) => {
        const frame = Math.round(self.progress * (FRAME_COUNT - 1));

        if (frame !== currentFrameRef.current) {
          currentFrameRef.current = frame;
          draw(frame);
        }
        updateCards(self.progress);
      },
    });

    updateCards(0);

    window.addEventListener("resize", resize);
    window.addEventListener("resize", () => updateCards(trigger.progress));

    return () => {
      window.removeEventListener("resize", resize);
      trigger.kill();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="relative mx-auto h-full w-full max-w-[100rem]">
        <div className="absolute inset-0 mt-10 flex items-center justify-center mix-blend-darken">
          <canvas ref={canvasRef} className="h-[32.5625rem] w-[54.75rem]" />
        </div>

        {CARDS.map((card, index) => (
          <div
            key={card.title}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{
              [card.anchor]: card.offset,
              [card.side]: "6.75rem",
              willChange: "transform",
            }}
            className="absolute z-10 flex w-[23.3125rem] flex-col gap-[1.5rem] overflow-hidden rounded-[1.25rem] bg-white p-[1.75rem]"
          >
            <div className="flex items-start justify-between gap-[1.25rem]">
              <span className="flex h-[3rem] w-[3rem] shrink-0 items-center justify-center">
                <img src={card.icon} alt="" className="h-full w-full" />
              </span>
              <img
                src={card.img}
                alt=""
                className="h-[9.25rem] w-[12.75rem] shrink-0 rounded-[0.375rem] object-cover"
              />
            </div>
            <div className="flex flex-col items-start">
              <p
                className="whitespace-nowrap text-[1rem] leading-6 text-primary-brown"
                style={{
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontWeight: 700,
                }}
              >
                {card.title}
              </p>
              <p
                className="mt-[0.375rem] text-[0.875rem] text-primary-light-brown"
                style={{
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontWeight: 400,
                  lineHeight: "1.25rem",
                  letterSpacing: "0.02625rem",
                }}
              >
                {card.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DesktopCommunity;
