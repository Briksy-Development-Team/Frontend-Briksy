import  { useRef } from "react";
import gsap from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const sections = [
    {
        id: "acceptance",
        number: "01",
        title: "Acceptance of Terms",
        content:
            'By accessing or using the Brisky platform ("Platform"), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Platform. These terms apply to all users including seekers, agents, agencies, and builders.',
    },
    {
        id: "platform",
        number: "02",
        title: "Platform Description",
        content:
            "Brisky is an ABN-anchored property marketplace connecting property seekers with verified agents, agencies, and builders across Australia. We provide search, verification, and connection services. We are not a party to any transaction between users.",
    },
    {
        id: "registration",
        number: "03",
        title: "User Registration",
        content:
            "To access certain features, you must register an account. You agree to provide accurate information and to update it as necessary. Agencies and agents must complete ABN verification via the Australian Business Register before listing on the Platform.",
    },
    {
        id: "plans",
        number: "04",
        title: "Subscription Plans",
        content:
            "Paid plans are billed monthly via Stripe. You may cancel at any time, with access continuing until the end of the billing period. Brisky reserves the right to change pricing with 30 days notice. Refunds are assessed on a case-by-case basis.",
    },
    {
        id: "verification",
        number: "05",
        title: "Verification & Listings",
        content:
            "All listings and professional profiles must pass our multi-stage verification process before going live. Brisky reserves the right to reject, suspend, or remove any listing or profile that violates our guidelines or appears fraudulent.",
    },
    {
        id: "conduct",
        number: "06",
        title: "Prohibited Conduct",
        content:
            "You agree not to misrepresent your identity or qualifications, submit false or misleading listings, attempt to circumvent our verification process, harass other users, or use the Platform for any unlawful purpose.",
    },
    {
        id: "liability",
        number: "07",
        title: "Limitation of Liability",
        content:
            "To the maximum extent permitted by Australian law, Brisky is not liable for any indirect, incidental, or consequential damages arising from your use of the Platform. Our total liability shall not exceed the amount you paid us in the preceding 12 months.",
    },
    {
        id: "law",
        number: "08",
        title: "Governing Law",
        content:
            "These Terms are governed by the laws of New South Wales, Australia. Any disputes shall be resolved in the courts of New South Wales. If any provision is found invalid, the remaining provisions continue in full force.",
    },
];

const Terms = () => {
    const container = useRef<HTMLDivElement>(null);

    const scrollToSection = (id: string) => {
        gsap.to(window, {
            duration: 1.2,
            scrollTo: `#${id}`,
            ease: "power3.inOut",
        });
    };

    useGSAP(
        () => {
            const sectionsEl = gsap.utils.toArray(".term-section");

            sectionsEl.forEach((section: any) => {
                ScrollTrigger.create({
                    trigger: section,
                    start: "top center",

                    onEnter: () => {
                        gsap.to(".nav-item", {
                            opacity: 0.4,
                            duration: 0.3,
                        });

                        const id = section.getAttribute("id");

                        gsap.to(`.nav-${id}`, {
                            opacity: 1,
                            duration: 0.3,
                        });
                    },

                    onEnterBack: () => {
                        gsap.to(".nav-item", {
                            opacity: 0.4,
                            duration: 0.3,
                        });

                        const id = section.getAttribute("id");

                        gsap.to(`.nav-${id}`, {
                            opacity: 1,
                            duration: 0.3,
                        });
                    },
                });
            });
        },
        { scope: container },
    );

    return (
        <section
            ref={container}
            className="w-full  font-helvetica pt-48  py-[4rem]"
        >
            
            <div className="flex justify-between  px-[4%]  pb-[2rem]">
                <h1 className="text-8xl font-inter  leading-[6rem] text-[#24391F]">
                    <span className="flex"> <p>TERMS</p> <p className="font-instrument ">&</p></span>

                    <p>CONDITIONS</p>
                </h1>

                <p className="w-[30%] text-[#777] leading-[1.7rem]">
                    These terms govern your use of the Brisky platform. Please read them
                    carefully before registering.{" "}
                </p>
            </div>
            <div className="py-8 bg-[#F5F4EE]">
                <p className="text-[0.9rem] px-[4%] text-[#8A8A84] tracking-[0.01rem]">
                    Last updated: April 2026
                    <span className="mx-[0.8rem]">·</span>
                    Effective: April 2026
                    <span className="mx-[0.8rem]">·</span>
                    Version 1.0
                </p>
            </div>
            <div className="flex gap-[5rem]  px-[4%] pt-[4rem]">
                <div className="w-[22%] sticky top-[8rem] py-10 h-fit border-r-[1px] border-r-[#E5E3D8]">
                    <div className="flex flex-col gap-6">
                        {sections.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => scrollToSection(item.id)}
                                className={` nav-item nav-${item.id} text-left font-medium space-x-2 bg-transparent 
                                    transition-all duration-300 opacity-40 flex hover:bg-[#E8E8E1]
                `}
                            >
                                <span className="text-[#2C3F24] text-xl block">
                                    {item.number}
                                </span>

                                <span className="text-[#2C3F24] text-xl">{item.title}</span>
                            </button>
                        ))}
                    </div>
                </div>

                
                <div className="w-[78%] ">
                    {sections.map((item) => (
                        <div
                            key={item.id}
                            id={item.id}
                            className=" term-section border-b pt-10 pb-20  font-medium border-[#e4e4dd]
              "
                        >
                            <div className="flex flex-col ">
                                <span className="text-[1.5rem]    flex ">
                                    <p className="mr-2">{item.number}</p>
                                    <h2 className="text-[1.6rem] ">{item.title}</h2>
                                </span>

                                <div>

                                    <p className="mt-4 text-xl text-[#666] leading-[2rem]">
                                        {item.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Terms;
