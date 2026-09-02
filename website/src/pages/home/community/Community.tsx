import { useRef } from "react";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

import Stars from "../../../assets/icons/search/star.svg";
import Leaf from "../../../assets/icons/search/leaf.svg";
import Property from "../../../assets/icons/search/property.svg";
import Traders from "../../../assets/icons/search/trades.svg";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 174;

const getFrame = (i: number) =>
  `/frames-webp/frame_${String(i).padStart(4, "0")}.webp`;

type CardData = {
  side: "left" | "right";
  anchor: "top" | "bottom";
  offset: string;
  icon: string;
  img: string;
  title: string;
  desc: string;
};

const CARDS: CardData[] = [
  {
    side: "right",
    anchor: "top",
    offset: "12%",
    icon: Property,
    img: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=240&fit=crop",
    title: "For Professionals & Trades",
    desc: "Showcase your services, experience, and past work while connecting with people actively looking for trusted property professionals.",
  },
  {
    side: "left",
    anchor: "bottom",
    offset: "2rem",
    icon: Stars,
    img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=240&fit=crop",
    title: "For Mortgage Brokers",
    desc: "Connect with property buyers and sellers who need trusted financial guidance throughout their property journey.",
  },
  {
    side: "right",
    anchor: "top",
    offset: "12%",
    icon: Leaf,
    img: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400&h=240&fit=crop",
    title: "For Buyers & Sellers",
    desc: "Find verified properties and professionals, compare your options, and connect with the right people for your next property move.",
  },
  {
    side: "left",
    anchor: "bottom",
    offset: "2rem",
    icon: Traders,
    img: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=240&fit=crop",
    title: "For BRIKSY Teams",
    desc: "Get support throughout your property journey with guidance from the BRIKSY team, from finding the right professional to navigating your next step.",
  },
];

const Community = () => {
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

    // Load frames
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();

      img.onload = () => {
        if (i === 0) resize();
        if (i === FRAME_COUNT - 1) ScrollTrigger.refresh();
      };

      img.src = getFrame(i + 1);
      images[i] = img;
    }

    const [cardA, cardB, cardC, cardD] = cardRefs.current;

    if (!cardA || !cardB || !cardC || !cardD) return;

    // All cards start below
    gsap.set([cardA, cardB, cardC, cardD], {
      y: "110vh",
    });

    const updateCards = (progress: number) => {
      // Cards 1 + 2
      const first = gsap.utils.clamp(0, 1, progress / 0.5);

      gsap.set([cardA, cardB], {
        y: `${gsap.utils.interpolate(110, -110, first)}vh`,
      });

      // Cards 3 + 4
      const second = gsap.utils.clamp(
        0,
        1,
        (progress - 0.5) / 0.5
      );

      gsap.set([cardC, cardD], {
        y: `${gsap.utils.interpolate(110, -110, second)}vh`,
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "+=2000",
      pin: true,
      scrub: 0.6,

      onUpdate: (self) => {
        // Frame
        const frame = Math.round(
          self.progress * (FRAME_COUNT - 1)
        );

        if (frame !== currentFrameRef.current) {
          currentFrameRef.current = frame;
          draw(frame);
        }

        // Cards
        updateCards(self.progress);
      },
    });

    updateCards(0);

    window.addEventListener("resize", resize);

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
      <div className="relative h-full w-full">

        {/* Canvas */}
        <div className="absolute inset-0 mt-10 flex items-center justify-center mix-blend-darken">
          <canvas
            ref={canvasRef}
            className="h-[32.5625rem] w-[54.75rem]"
          />
        </div>

        {/* Cards */}
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
                <img
                  src={card.icon}
                  alt=""
                  className="h-full w-full"
                />
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

export default Community;