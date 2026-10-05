import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { CARDS, FRAME_COUNT, SCROLL_PER_CARD, getFrame } from "./communityData";

gsap.registerPlugin(ScrollTrigger);

const DesktopCommunity = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const currentFrameRef = useRef(0);
  const currentStepRef = useRef(0);

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

    const animateCards = (step: number) => {
      if (step === currentStepRef.current) return;

      const previousStep = currentStepRef.current;
      currentStepRef.current = step;

      const distance = getHiddenDistance();

      gsap.killTweensOf(cards);

      if (previousStep === 0 && step === 1) {
        const card = cards[0];

        if (!card) return;

        gsap.set(card, {
          y: distance,
        });

        gsap.to(card, {
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        });

        return;
      }

      if (step > previousStep) {
        const leavingIndex = step - 2;
        const enteringIndex = step - 1;

        const leavingCard = cards[leavingIndex];
        const enteringCard = cards[enteringIndex];

        if (!leavingCard || !enteringCard) return;

        gsap.set(enteringCard, {
          y: distance,
        });

        gsap.to(leavingCard, {
          y: -distance,
          duration: 0.45,
          ease: "power3.out",
        });

        gsap.to(enteringCard, {
          y: 0,
          duration: 0.45,
          ease: "power3.out",
        });

        return;
      }
      if (step < previousStep) {
        const leavingIndex = previousStep - 1;
        const enteringIndex = step - 1;

        const leavingCard = cards[leavingIndex];
        const enteringCard = cards[enteringIndex];

        if (!leavingCard) return;

        gsap.to(leavingCard, {
          y: distance,
          duration: 0.45,
          ease: "power3.out",
        });

        if (enteringCard) {
          gsap.set(enteringCard, {
            y: -distance,
          });

          gsap.to(enteringCard, {
            y: 0,
            duration: 0.45,
            ease: "power3.out",
          });
        }
      }
    };

    const totalScroll = SCROLL_PER_CARD * cards.length;

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: `+=${totalScroll}`,
      pin: true,

      scrub: 0.15,

      snap: {
        snapTo: 1 / cards.length,
        duration: {
          min: 0.25,
          max: 0.45,
        },
        ease: "power2.out",
      },

      onUpdate: (self) => {
        const frame = Math.round(self.progress * (FRAME_COUNT - 1));

        if (frame !== currentFrameRef.current) {
          currentFrameRef.current = frame;
          draw(frame);
        }

        const step = Math.min(
          cards.length,
          Math.round(self.progress * cards.length),
        );

        animateCards(step);
      },
    });

    const handleResize = () => {
      resize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      trigger.kill();
      gsap.killTweensOf(cards);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden"
    >
      <div className="relative mx-auto h-full w-full">
        <div className="absolute inset-0 flex items-center justify-center mix-blend-darken">
          <canvas
            ref={canvasRef}
            className="aspect-[56.75/37.5625] w-[max(54.75rem,60vw)] max-h-[90vh] shrink-0"
          />
        </div>

        {CARDS.map((card, index) => (
          <div
            key={`${card.title}-${index}`}
            ref={(el) => {
              cardRefs.current[index] = el;
            }}
            style={{ willChange: "transform" }}
            className={`absolute z-10 ${card.position} flex w-[15rem] flex-col gap-3 overflow-hidden rounded-[1.25rem] bg-white p-4 xl:w-[25.3125rem] xl:gap-[1.5rem] xl:p-[1.75rem]`}
          >
            <div className="flex items-start justify-between gap-[1.25rem]">
              <span className="flex h-[2rem] w-[2rem] shrink-0 items-center justify-center xl:h-[3rem] xl:w-[3rem]">
                <img src={card.icon} alt="" className="h-full w-full" />
              </span>

              <img
                src={card.img}
                alt=""
                className="h-[6rem] w-[8rem] shrink-0 rounded-[0.375rem] object-cover xl:h-[9.25rem] xl:w-[12.75rem]"
              />
            </div>

            <div className="flex flex-col items-start">
              <p
                className="whitespace-nowrap text-sm leading-6 text-primary-brown xl:text-[1rem]"
                style={{
                  fontFamily: "'Helvetica Neue', sans-serif",
                  fontWeight: 700,
                }}
              >
                {card.title}
              </p>

              <p
                className="mt-[0.375rem] text-xs text-primary-light-brown xl:text-[0.875rem]"
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
