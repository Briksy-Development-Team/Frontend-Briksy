import { useRef, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import WholeBg from "../../../assets/about/wholeBg.svg";
import Hand from "../../../assets/utils/Hand.svg";
import Contacts from "../../../assets/utils/contact.svg";
import House from "../../../assets/utils/house.svg";
import Tick from "../../../assets/utils/Tick.svg";
import Transition from "./Transition";

gsap.registerPlugin(ScrollTrigger);

type Badge = {
    id: string;
    image: string;
    title: string;
    text: string;
    className: string;
    dotClassName: string;
    panelClassName: string;
};

const badges: Badge[] = [
    {
        id: "verified",
        image: Tick,
        title: "Verified Professionals",
        text: "Every builder, agent, organisation, and service provider is carefully verified to help you connect with trusted industry professionals.",
        className: "left-[45%] top-[45%]",
        dotClassName: "-top-4 -left-4",
        panelClassName: "top-8 left-1/2 -translate-x-1/2 mt-3",
    },
    {
        id: "platform",
        image: Contacts,
        title: "One Platform, Every Service",
        text: "Discover properties, builders, trades, brokers, and property services all in one place without switching between multiple platforms.",
        className: "left-[2%] bottom-[20%]",
        dotClassName: "-top-4 -right-4",
        panelClassName: "bottom-8 left-8 mb-3",
    },
    {
        id: "search",
        image: House,
        title: "Smart Search & Matching",
        text: "Use advanced filters to quickly find the right property or professional based on location, budget, expertise, and project needs.",
        className: "right-[8%] top-[25%]",
        dotClassName: "-top-10 left-1/2 -translate-x-1/2",
        panelClassName: "right-8 top-8  mr-3",
    },
    {
        id: "connections",
        image: Hand,
        title: "Direct & Secure Connections",
        text: "Contact verified businesses directly through BRIKSY with confidence, knowing every profile has passed our verification process.",
        className: "right-[0%] bottom-[20%]",
        dotClassName: "-top-10 left-12",
        panelClassName: "bottom-8 right-8 mb-3",
    },
    {
        id: "industry",
        image: Tick,
        title: "Built for the Property Industry",
        text: "Whether you're buying, building, renovating, or investing, BRIKSY connects you with the right people and services in one trusted platform.",
        className: "-left-[15%] bottom-[50%]",
        dotClassName: "-top-4 -right-4",
        panelClassName: "left-8 top-8 ",
    },
];

const GlowDot = ({
    className = "",
    children,
}: {
    className?: string;
    children?: React.ReactNode;
}) => {
    return (
        <span className={`group absolute z-20 h-10 w-10 ${className}`}>
            <span className="absolute inset-0 rounded-full bg-white/20 animate-[aura-pulse_1.8s_ease-out_infinite]" />
            <span className="absolute inset-[8px] rounded-full bg-white/40 animate-[aura-pulse_1.8s_ease-out_infinite] [animation-delay:300ms]" />
            <span className="absolute inset-[14px] rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.5)]" />

            {children}
        </span>
    );
};

const ImageAnimation = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const imgWrapRef = useRef<HTMLDivElement>(null);
    const badgeRefs = useRef<Array<HTMLDivElement | null>>([]);
    const fogRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: "top top",
                    end: "+=250%",
                    scrub: 1,
                    pin: true,
                    anticipatePin: 1,
                },
            });

            
            tl.fromTo(
                imgWrapRef.current,
                { scale: 0.8 },
                { scale: 1, ease: "power2.out", duration: 0.4 },
                0,
            );

            tl.fromTo(
                badgeRefs.current,
                { autoAlpha: 0, y: 16 },
                {
                    autoAlpha: 1,
                    y: 0,
                    stagger: 0.04,
                    duration: 0.2,
                    ease: "power2.out",
                },
                0.15,
            );

            
            
            tl.fromTo(
                fogRef.current,
                { yPercent: 100, opacity: 0 },
                { yPercent: 0, opacity: 1, duration: 0.6, ease: "none" },
                0.4,
            );
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={sectionRef}
            className="relative h-screen w-full overflow-hidden bg-[#C2B4AA] font-helvetica"
        >
            <div
                ref={imgWrapRef}
                className="absolute inset-0 h-full w-full origin-center overflow-hidden will-change-transform"
            >
                <img
                    loading="lazy"
                    src={WholeBg}
                    alt=""
                    className="h-full w-full object-cover"
                    draggable={false}
                />
                <div className="absolute inset-0 h-full w-full bg-black/40 z-10" />
                {badges.map((b, i) => (
                    <div
                        key={b.id}
                        ref={(el) => {
                            badgeRefs.current[i] = el;
                        }}
                        className={`absolute ${b.className} w-[30rem] z-20 opacity-0`}
                    >
                        <GlowDot className={b.dotClassName}>
                            <div
                                className={`pointer-events-none absolute flex w-[30rem] items-center gap-4 rounded-xl bg-[#F8F3EC] px-5 py-4 opacity-0 shadow-lg scale-95 transition-all duration-300 ease-out group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100 ${b.panelClassName}`}
                            >
                                <img
                                    loading="lazy"
                                    src={b.image}
                                    alt={b.title}
                                    className="h-20 w-20 shrink-0"
                                />

                                <div className="flex-1">
                                    <h3 className="mb-1 text-[1.25rem] font-semibold leading-tight text-[#3B2A18]">
                                        {b.title}
                                    </h3>
                                    <p className="text-[0.9rem] leading-6 text-[#4D3B29]">
                                        {b.text}
                                    </p>
                                </div>
                            </div>
                        </GlowDot>
                    </div>
                ))}
            </div>

            
            <Transition ref={fogRef} />
        </div>
    );
};

export default ImageAnimation;