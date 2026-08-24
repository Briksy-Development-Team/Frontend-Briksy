import { useEffect, useRef, useState } from "react";

const stats = [
  { end: 340,  suffix: "+",  decimals: 0, comma: false, label: "Verified builders on platform" },
  { end: 1200, suffix: "+",  decimals: 0, comma: true,  label: "Properties Listed" },
  { end: 15,   suffix: "+",  decimals: 0, comma: false, label: "Property Services Available" },
  { end: 4.8,  suffix: "",   decimals: 1, comma: false, label: "Average Platform Rating" },
];

const StatCounter = ({
  end,
  suffix,
  decimals,
  comma,
  label,
}: (typeof stats)[number]) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;

        const duration = 1600;
        const startTime = performance.now();

        const tick = (now: number) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); 
          const current = parseFloat((eased * end).toFixed(decimals));
          setCount(current);
          if (progress < 1) requestAnimationFrame(tick);
        };

        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [end, decimals]);

  const display = comma
    ? Math.round(count).toLocaleString()
    : decimals > 0
      ? count.toFixed(decimals)
      : Math.round(count).toString();

  return (
    <div ref={ref} className="leading-tight">
      <p className="text-[3rem] font-normal text-[#3D2A0B] sm:text-[3.75rem] lg::text-[5.125rem]  xl:text-[5.125rem]">
        {display}
        {suffix}
      </p>
      <p className="mt-0 text-[0.875rem] text-primary-light-brown sm:text-[1rem] xl:text-[1.125rem]">
        {label}
      </p>
    </div>
  );
};

const About = () => {
  return (
    <section className="pb-20 font-helvetica">
      <div className="mx-auto w-full -translate-y-16 rounded-3xl bg-white px-10 py-14 xl:w-[90%]">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-gray-400">
          PLATFORM OVERVIEW
        </p>

        <p className="mx-auto mt-4 w-full text-center leading-tight tracking-tight text-gray-800 sm:text-[1.875rem] xl:w-[70%] xl:text-[2.25rem]">
          Briksy connects buyers, builders, agents, and trusted property
          professionals in one seamless platform. Every profile is verified,
          and every listing is reviewed before it goes live.
        </p>

        <div className="mt-10 border-t border-gray-200" />

        <div className="mt-10   grid w-full grid-cols-2 gap-y-8 text-center items-center xl:grid-cols-4 xl:text-center">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
