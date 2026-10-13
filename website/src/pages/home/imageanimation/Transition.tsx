import { useEffect, useRef, useState, type RefObject } from "react";
import gsap from "gsap";
import { Loader, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import CARD_IMAGE from "../../../assets/about/electrician.svg";
import ImageBigone from "../../../assets/about/imagebigone.svg";
import ImageBigTwo from "../../../assets/about/imagebigtwo.svg";
import ImageSmallOne from "../../../assets/about/imagesmallone.svg";
import ImageSmallTwo from "../../../assets/about/imagesmalltwo.svg";

const ORBIT_IMAGES = [
  ImageBigone,
  ImageBigTwo,
  ImageSmallOne,
  ImageSmallTwo,
];

type Row = { icon: LucideIcon; iconClass?: string; label: string; meta?: string };

const VERIFIED_CARD: { title: string; rows: Row[] } = {
  title: "Electrician in Footscray",
  rows: [{ icon: ShieldCheck, iconClass: "text-[#342511]", label: "Licence verified", meta: "Doyle Electrical" }],
};

const CHECKS_CARD: { title: string; rows: Row[] } = {
  title: "Electrician in Footscray",
  rows: ["ABN verified", "Licence current — REC 18422", "Insurance current"].map((label) => ({
    icon: Loader,
    iconClass: "spin-icon text-[#07172a]/50",
    label,
  })),
};

const STAGE_W = 620;
const STAGE_H = 720;


const PERSPECTIVE = 1000; // Slightly higher than 900 to flatten the distortion just a bit
const MAX_TILT_Y = 13;    // Down from 22 (a gentle reduction in left/right tilt)
const MAX_TILT_X = 6;    // Down from 14 (a gentle reduction in up/down tilt)
const MAX_TILT_Z = 1.6;   // Down from 2.5
const RANGE_X = 0.6;
const RANGE_Y = 0.50;
const SMOOTHING_MS = 120;
const PARALLAX = 0.08;    // Down from 0.08 (keeps the floating tags closer to their anchors)
const INFO_CARD_Z = 150;  // Down from 150
const ASK_BUTTON_Z = 100;  // Down from 110

const RINGS = [
  { rx: 360, ry: 380, seconds: 24, tiles: [{ w: 150, phase: 0 }, { w: 150, phase: Math.PI }] },
  { rx: 240, ry: 260, seconds: 38, tiles: [{ w: 40, phase: 0.9 }, { w: 40, phase: Math.PI + 0.9 }] },
];

const ORBIT_TILES = RINGS.flatMap(({ tiles, ...ring }) => tiles.map((tile) => ({ ...ring, ...tile })));

function InfoCard({ title, rows, className }: { title: string; rows: Row[]; className: string }) {
  return (
    <div
      data-z={INFO_CARD_Z}
      className={`float-layer absolute w-[215px] overflow-hidden rounded-[10px] border border-[#07172a]/10 bg-[#fffefa]/90 text-[#07172a]
         shadow-[0_12px_28px_rgba(7,23,42,0.1),inset_0_1px_0_rgba(255 ,255,255,0.7)] backdrop-blur-md ${className}`}
    >
      <p className="px-3 py-2 text-[12px] font-medium leading-tight">{title}</p>
      {rows.map(({ icon: Icon, iconClass, label, meta }) => (
        <div
          key={label}
          className="flex items-center justify-between border-t border-[#07172a]/5 bg-[#07172a]/[0.02] px-3 py-2 text-[10.5px] leading-tight"
        >
          <span className="flex items-center gap-1.5 text-[#07172a]/85">
            <Icon size={14} strokeWidth={1.8} className={iconClass} />
            {label}
          </span>
          {meta && <span className="text-[#07172a]/45 text-[10px]">{meta}</span>}
        </div>
      ))}
    </div>
  );
}

export default function LeftVisual({ trackRef }: { trackRef: RefObject<HTMLDivElement | null> }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.85);

  // ── Viewport Locked Scaling ──
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      let newScale = 1;

      if (vw >= 1024) {
      
        const targetW = vw * 0.35; // Target 35% of screen width
        const targetH = vh * 0.65; // Target 65% of screen height

        const scaleW = targetW / STAGE_W;
        const scaleH = targetH / STAGE_H;

        newScale = Math.min(scaleW, scaleH);
      } else {
        const targetW = vw * 0.90;
        newScale = targetW / STAGE_W;
      }

      setScale(Math.max(0.4, Math.min(newScale, 1.15)));
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const area = trackRef.current;
    if (!stage || !tilt || !area) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);

      const layers = q(".float-layer").map((el) => {
        const z = Number((el as HTMLElement).dataset.z);
        gsap.set(el, { z, scale: (PERSPECTIVE - z) / PERSPECTIVE });
        return { el, z };
      });

      const tiles = q(".orbit-tile");
      const startTime = gsap.ticker.time;
      const orbit = (time: number) => {
        tiles.forEach((tile: Element, i: number) => {
          const { rx, ry, seconds, phase } = ORBIT_TILES[i];
          const a = phase + ((time - startTime) / seconds) * Math.PI * 2;
          const depth = (Math.sin(a) + 1) / 2;
          gsap.set(tile, {
            x: Math.cos(a) * rx,
            y: Math.sin(a) * ry,
            scale: 0.85 + depth * 0.3,
            opacity: 0.5 + depth * 0.5,
            filter: `blur(${2.5 + (1 - depth) * 4}px)`,
          });
        });
      };
      orbit(startTime);
      gsap.ticker.add(orbit);

      gsap.to(q(".spin-icon"), { rotation: 360, duration: 1.2, ease: "steps(8)", repeat: -1 });

      const clamp = gsap.utils.clamp(-1, 1);
      const pointer = { x: 0, y: 0, active: false };
      const target = { x: 0, y: 0 };
      const current = { x: 0, y: 0 };
      let tracking = false;

      const updateTarget = () => {
        if (!tracking || !pointer.active) return;
        const s = stage.getBoundingClientRect();
        target.x = clamp((pointer.x - (s.left + s.width / 2)) / (s.width * RANGE_X));
        target.y = clamp((pointer.y - (s.top + s.height / 2)) / (s.height * RANGE_Y));
      };

      const onMove = (e: PointerEvent) => {
        if (e.pointerType === "touch") return;
        pointer.x = e.clientX;
        pointer.y = e.clientY;

        const a = area.getBoundingClientRect();
        if (e.clientX >= a.left && e.clientX <= a.right && e.clientY >= a.top && e.clientY <= a.bottom) {
          tracking = true;
        }

        pointer.active = true;
        updateTarget();
      };
      const onOut = () => {
        pointer.active = false;
        tracking = false;
        target.x = 0;
        target.y = 0;
      };

      const applyTilt = () => {
        gsap.set(tilt, {
          rotationY: current.x * MAX_TILT_Y,
          rotationX: -current.y * MAX_TILT_X,
          rotationZ: current.x * MAX_TILT_Z,
        });
        layers.forEach(({ el, z }) =>
          gsap.set(el, { x: current.x * z * PARALLAX, y: current.y * z * PARALLAX })
        );
      };

      const tick = (_time: number, deltaMs: number) => {
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) {
          if (current.x === target.x && current.y === target.y) return;
          current.x = target.x;
          current.y = target.y;
        } else {
          const k = 1 - Math.exp(-deltaMs / SMOOTHING_MS);
          current.x += dx * k;
          current.y += dy * k;
        }
        applyTilt();
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("scroll", updateTarget, { passive: true });
      window.addEventListener("blur", onOut);
      document.documentElement.addEventListener("mouseleave", onOut);
      gsap.ticker.add(tick);

      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("scroll", updateTarget);
        window.removeEventListener("blur", onOut);
        document.documentElement.removeEventListener("mouseleave", onOut);
        gsap.ticker.remove(tick);
        gsap.ticker.remove(orbit);
      };
    }, stage);

    return () => ctx.revert();
  }, [trackRef]);

  return (
    <div
      ref={containerRef}
      className="relative w-full flex items-center justify-center pointer-events-none"
      style={{ height: STAGE_H * scale }}
    >
      <div
        ref={stageRef}
        className="pointer-events-auto origin-center transition-transform duration-100 ease-out flex items-center justify-center"
        style={{
          width: STAGE_W,
          height: STAGE_H,
          perspective: PERSPECTIVE,
          transform: `scale(${scale})`,
        }}
      >
        {ORBIT_TILES.map((t, i) => (
          <div
            key={i}
            className="orbit-tile absolute left-1/2 top-1/2 overflow-hidden rounded-xl  shadow-lg pointer-events-none"
            style={{ width: t.w, height: t.w * 0.75, marginLeft: -t.w / 2, marginTop: -(t.w * 0.75) / 2 }}
          >
            <img src={ORBIT_IMAGES[i % ORBIT_IMAGES.length]} alt="" className="h-full w-full object-cover" />
          </div>
        ))}

        <div
          ref={tiltRef}
          className="relative z-10 h-[650px] w-[450px] [transform-style:preserve-3d]"
        >
          <img
            src={CARD_IMAGE}
            alt="Tradespeople at work"
            className="h-full w-full rounded-[18px] object-cover shadow-[0_20px_45px_rgba(0,0,0,0.22)]"
          />

          <InfoCard {...VERIFIED_CARD} className="-right-14 top-6" />
          <InfoCard {...CHECKS_CARD} className="-left-12 -bottom-4" />

          <button
            type="button"
            data-z={ASK_BUTTON_Z}
            className="float-layer absolute -right-10 bottom-24 flex items-center gap-1.5 whitespace-nowrap rounded-full border-[3px] border-[#F5551A] bg-white px-5 py-2.5 text-sm leading-none font-semibold text-[#F5551A] shadow-[0_12px_24px_rgba(245,85,26,0.22),inset_0_0_16px_rgba(245,85,26,0.35)] cursor-pointer"
          >
            <Sparkles size={18} />
            Ask Ai
          </button>
        </div>
      </div>
    </div>
  );
}