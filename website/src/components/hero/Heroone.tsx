import { useOutletContext } from "react-router-dom";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import HeroSearchBar from "../search/HeroSearchBar";
import Blur from "../../assets/hero/blur.svg"

import House from "../../assets/hero/house.svg";

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

    useEffect(() => {
        const playHero = () => {
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
        };

        window.addEventListener("hero-loader-complete", playHero);
        return () => window.removeEventListener("hero-loader-complete", playHero);
    }, []);

    return (
        <>
            <section
                ref={sectionRef}
                className="relative h-screen overflow-clip bg-[#C2B4AA] font-helvetica"
            >
                <div className="relative z-20 flex flex-col items-center pt-20">
                    <div className="mb-6 flex items-center gap-2">
                        <div className="flex -space-x-3">
                            {AVATARS.map((src, i) => (
                                <img
                                    key={i}
                                    src={src}
                                    alt=""
                                    className="h-10 w-10 rounded-xl border-2 border-white object-cover"
                                />
                            ))}
                        </div>
                        <span className="text-[0.875rem]  ">
                            Trusted by 108+ clients across industries
                        </span>
                    </div>

                    <h1 className="max-w-4xl text-center text-[3rem] sm:text-[4rem] lg:text-[3.25rem] font-medium leading-[0.9] text-primary-brown">
                        Find your place for
                        <br />
                        you and yours
                    </h1>

                    <p className="mt-6 max-w-2xl text-center text-[1rem]  text-primary-brown">
                        We partner with leadership teams to simplify complex challenges.
                    </p>
                </div>

                <div className="absolute inset-x-0 bottom-0 z-10 overflow-hidden pointer-events-none">
                    <img
                        ref={houseRef}
                        src={House}
                        alt="Modern house exterior at dusk"
                        className="w-full h-[50vh] xl:h-[55vh]  mb-10 object-cover pointer-events-none select-none"
                    />
                    <img
                        src={Blur}
                        alt=""
                        aria-hidden="true"
                        className="absolute inset-x-0 -bottom-10 m-0 w-[120vw] pointer-events-none select-none"
                    />
                </div>
                <div className="absolute left-1/2 bottom-20 z-30 w-full max-w-5xl -translate-x-1/2 px-6">
                    <HeroSearchBar mode={mode} setMode={setMode} />
                </div>
            </section>
        </>
    );
};

export default Heroone;
