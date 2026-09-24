import { useOutletContext } from "react-router-dom";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import HeroSearchBar from "../search/HeroSearchBar";
import { useReady } from "../utils/ReadyContext"; // adjust path if needed

import House from "../../assets/hero/houses.svg";
import HeroM from "../../assets/hero/HeroM.svg";

gsap.registerPlugin(useGSAP);

const AVATARS = [
    "https://randomuser.me/api/portraits/women/44.jpg",
    "https://randomuser.me/api/portraits/men/32.jpg",
    "https://randomuser.me/api/portraits/women/68.jpg",
];

const Heroone = () => {
    const { mode, setMode } = useOutletContext<{
        mode: "collapsed" | "search" | "ai";
        setMode: (m: "collapsed" | "search" | "ai") => void;
    }>();
    const sectionRef = useRef<HTMLElement | null>(null);
    const houseRef = useRef<HTMLImageElement | null>(null);
    const avatarsRef = useRef<HTMLDivElement | null>(null);
    const { ready } = useReady();

    useGSAP(() => {
        if (!ready) return;

        gsap.fromTo(
            houseRef.current,
            { yPercent: 100, scale: 1.05, opacity: 0, filter: "blur(6px)" },
            {
                yPercent: 0,
                scale: 1,
                opacity: 1,
                filter: "blur(0px)",
                duration: 1.6,
                ease: "power3.out",
            },
        );

        if (avatarsRef.current) {
            gsap.fromTo(
                avatarsRef.current.children,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 1,
                    ease: "back.out(1.7)",
                    stagger: 0.5,
                },
            );
        }
    }, { scope: sectionRef, dependencies: [ready] });

    return (
        <>
            <section
                ref={sectionRef}
                className="relative h-screen overflow-clip bg-[#C2B4AA]  lg:px-0 font-helvetica"
            >
                <div className="relative z-20 flex flex-col items-center pt-28 lg:pt-28">
                    <div className="mb-6 flex items-center gap-2">
                        <div ref={avatarsRef} className="flex -space-x-3">
                            {AVATARS.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    className="  h-6 w-6 md:h-10 md:w-10 rounded-lg md:rounded-xl border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <span className="lg:text-[0.875rem] text-[0.75rem]   ">
                            Trusted by 108+ clients across industries
                        </span>
                    </div>

                    <h1 className="max-w-4xl text-center mt-5 lg:mt-0  text-[2.5rem] sm:text-[4rem] lg:text-[3.25rem] font-medium leading-[0.9] text-primary-brown">
                        Find your place for
                        <br />
                        you and yours
                    </h1>

                    <p className="mt-6 max-w-2xl text-center text-[0.875rem] lg:text-[1rem]  text-black">
                        We partner with leadership teams to <br className="block md:hidden" /> simplify complex challenges.
                    </p>
                </div>

                <div className="absolute  inset-x-0 bottom-0 z-10 pointer-events-none overflow-visible">
                    <img ref={houseRef} src={House} alt="" className="hidden sm:block w-full" />
                    <img src={HeroM} alt="" className="block sm:hidden w-full" />

                    <div
                        className="
            absolute hidden md:flex
            left-[-10%]
            right-[-10%]
            bottom-[-50px]
            h-[120px]
            bg-[#F0EAE5]
            blur-[25px]
        "
                    />
                </div>
                <div className="absolute left-1/2 bottom-1/3 sm:bottom-36 lg:bottom-25  z-30 w-full max-w-5xl -translate-x-1/2 px-6">
                    <HeroSearchBar mode={mode} setMode={setMode} />
                </div>
            </section>
        </>
    );
};

export default Heroone;