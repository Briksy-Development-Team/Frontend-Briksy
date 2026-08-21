import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 170;
const TRANSITION_FRAMES = 26;

const getFrame = (i: number) =>
    `/frames-webp/frame_${String(i).padStart(4, "0")}.webp`;

const sections = [
    {
        title: "For Builders",
        description:
            "List your projects, get discovered by serious buyers, and build trust through verified credentials and real reviews.",
        frameStart: 0,
        frameEnd: 37,
    },
    {
        title: "For Traders Professionals",
        description:
            "Grow your client base, manage enquiries, and stand out in a verified marketplace built for Australian professionals.",
        frameStart: 38,
        frameEnd: 60,
    },
    {
        title: "For Buyers/Sellers",
        description:
            "Manage your business, showcase your expertise, and connect with qualified property buyers through a verified business profile.",
        frameStart: 61,
        frameEnd: 169,
    },
];

const Community = () => {
    const sectionRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const titleRefs = useRef<(HTMLHeadingElement | null)[]>([]);
    const descRefs = useRef<(HTMLParagraphElement | null)[]>([]);
    const currentFrameRef = useRef(0);

    useGSAP(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext("2d");

        if (!canvas || !ctx) return;

        const images: HTMLImageElement[] = new Array(FRAME_COUNT);
        let loadedCount = 0;

        const draw = (frame: number) => {
            const img = images[frame];

            if (img?.complete && img.naturalWidth > 0) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    img,
                    0,
                    0,
                    canvas.width,
                    canvas.height,
                );
            }
        };

        const resize = () => {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;

            draw(currentFrameRef.current);
        };

        
        for (let i = 0; i < FRAME_COUNT; i++) {
            const img = new Image();

            img.onload = () => {
                loadedCount++;

                if (i === 0) {
                    resize();
                }

                if (loadedCount === FRAME_COUNT) {
                    ScrollTrigger.refresh();
                }
            };

            img.src = getFrame(i + 1);
            images[i] = img;
        }

        window.addEventListener("resize", resize);

        
        gsap.set(titleRefs.current, {
            opacity: 0,
            y: "-100",
        });

        gsap.set(descRefs.current, {
            opacity: 0,
            y: "100",
        });

        
        gsap.set(titleRefs.current[0], {
            opacity: 1,
            y: 0,
        });

        gsap.set(descRefs.current[0], {
            opacity: 1,
            y: 0,
        });

        const tl = gsap.timeline({
            paused: true,
        });

        
        for (let i = 1; i < sections.length; i++) {
            const prevTitle = titleRefs.current[i - 1];
            const prevDesc = descRefs.current[i - 1];

            const nextTitle = titleRefs.current[i];
            const nextDesc = descRefs.current[i];

            if (
                !prevTitle ||
                !prevDesc ||
                !nextTitle ||
                !nextDesc
            ) {
                continue;
            }

            const boundary = sections[i].frameStart;

            const start =
                Math.max(
                    0,
                    boundary - TRANSITION_FRAMES / 2,
                ) /
                (FRAME_COUNT - 1);

            const end =
                Math.min(
                    FRAME_COUNT - 1,
                    boundary + TRANSITION_FRAMES / 2,
                ) /
                (FRAME_COUNT - 1);

            const dur = end - start;

            tl.to(
                prevTitle,
                {
                    opacity: 0,
                    y: "-200",
                    duration: dur,
                    ease: "power2.out",
                },
                start,
            )
                .to(
                    prevDesc,
                    {
                        opacity: 0,
                        y: "200",
                        duration: dur,
                        ease: "power2.out",
                    },
                    start,
                )
                .fromTo(
                    nextTitle,
                    {
                        opacity: 0,
                        y: "200",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: dur,
                        ease: "power2.out",
                    },
                    start,
                )
                .fromTo(
                    nextDesc,
                    {
                        opacity: 0,
                        y: "-200",
                    },
                    {
                        opacity: 1,
                        y: 0,
                        duration: dur,
                        ease: "power2.out",
                    },
                    start,
                );
        }

        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: "top top",
            end: "+=8000",
            pin: true,
            scrub: 1.2,

            onUpdate: (self) => {
                
                tl.time(self.progress);

                
                const frame = Math.round(
                    self.progress * (FRAME_COUNT - 1),
                );

                if (
                    frame !== currentFrameRef.current
                ) {
                    currentFrameRef.current = frame;
                    draw(frame);
                }
            },
        });

        return () => {
            window.removeEventListener(
                "resize",
                resize,
            );

            trigger.kill();
            tl.kill();
        };
    }, []);

    return (
        <div
            ref={sectionRef}
            className="w-full h-screen flex flex-col lg:flex-row items-center justify-center px-6 lg:px-16 gap-4 lg:gap-8"
        >
            
            <div className="order-1 lg:order-1 relative w-full lg:w-1/4 h-16 lg:h-[70%] flex items-center lg:items-start justify-center overflow-hidden shrink-0">
                {sections.map((item, i) => (
                    <h2
                        key={item.title}
                        ref={(el) => {
                            titleRefs.current[i] = el;
                        }}
                        className="absolute w-full text-start text-[2.25rem] font-medium lg:text-[2.75rem] text-primary-brown"
                    >
                        {item.title}
                    </h2>
                ))}
            </div>

            
            <div className="order-2 lg:order-2 w-full max-w-[37.5rem] lg:w-[37.5rem] aspect-73/41 h-auto lg:h-[21.0625rem] flex items-center justify-center shrink-0 mx-auto">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                />
            </div>

            
            <div className="order-3 lg:order-3 relative w-full lg:w-1/4 h-24 lg:h-[70%] flex items-center lg:items-end justify-center overflow-hidden shrink-0">
                {sections.map((item, i) => (
                    <p
                        key={item.title}
                        ref={(el) => {
                            descRefs.current[i] = el;
                        }}
                        className="absolute w-full text-primary text-base lg:text-[1.25rem] leading-relaxed"
                    >
                        {item.description}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Community;