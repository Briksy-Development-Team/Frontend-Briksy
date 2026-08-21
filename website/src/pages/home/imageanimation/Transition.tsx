import { forwardRef } from "react";

const Transition = forwardRef<HTMLDivElement>((_, ref) => (
  <div
    ref={ref}
    className="pointer-events-none absolute inset-0 z-30 h-full w-full will-change-transform"
  >
    
    <div
      className="absolute inset-0"
      style={{
        background: `linear-gradient(
          to bottom,
          rgba(248, 244, 238, 0) 0%,
          rgba(248, 244, 238, 0.013) 5%,
          rgba(248, 244, 238, 0.049) 10%,
          rgba(248, 244, 238, 0.104) 14%,
          rgba(248, 244, 238, 0.175) 18%,
          rgba(248, 244, 238, 0.259) 22%,
          rgba(248, 244, 238, 0.352) 26%,
          rgba(248, 244, 238, 0.452) 30%,
          rgba(248, 244, 238, 0.556) 33%,
          rgba(248, 244, 238, 0.661) 37%,
          rgba(248, 244, 238, 0.762) 40%,
          rgba(248, 244, 238, 0.855) 43%,
          rgba(248, 244, 238, 0.935) 46%,
          rgba(248, 244, 238, 0.985) 49%,
          #F8F4EE 52%,
          #F8F4EE 100%
        )`,
      }}
    />

    
    <div
      className="absolute top-[5%] left-[-20%] h-[50%] w-[80%] mix-blend-screen opacity-60"
      style={{ background: 'radial-gradient(ellipse at center, rgba(248,244,238,0.4) 0%, rgba(248,244,238,0) 70%)' }}
    />
    <div
      className="absolute top-[10%] right-[-10%] h-[45%] w-[70%] mix-blend-screen opacity-70"
      style={{ background: 'radial-gradient(ellipse at center, rgba(248,244,238,0.5) 0%, rgba(248,244,238,0) 70%)' }}
    />
    <div
      className="absolute top-[0%] left-[20%] h-[40%] w-[60%] mix-blend-screen opacity-50"
      style={{ background: 'radial-gradient(ellipse at center, rgba(248,244,238,0.3) 0%, rgba(248,244,238,0) 65%)' }}
    />

    
    <div
      className="absolute inset-0 opacity-[0.04] mix-blend-overlay"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  </div>
));

Transition.displayName = "Transition";

export default Transition;