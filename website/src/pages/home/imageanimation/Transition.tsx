import { useEffect, useRef, type RefObject } from "react";
import gsap from "gsap";
import { Loader, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import CARD_IMAGE from "../../../assets/about/electrician.svg"
import ImageBigone from "../../../assets/about/imagebigone.svg"
import ImageBigTwo from "../../../assets/about/imagebigtwo.svg"
import ImageSmallOne from "../../../assets/about/imagesmallone.svg"
import ImageSmallTwo from "../../../assets/about/imagesmalltwo.svg"

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

// ── tuning knobs ──
const PERSPECTIVE = 900; // lower = stronger 3D
const MAX_TILT_Y = 25; // degrees, left/right
const MAX_TILT_X = 16; // degrees, up/down
const MAX_TILT_Z = 3; // slight roll
const RANGE_X = 0.6; // full tilt when the cursor is this far from the card centre (x stage width)
const RANGE_Y = 0.55; // same, vertical (x stage height). Lower = more sensitive
const SMOOTHING_MS = 150; // higher = floatier follow
const PARALLAX = 0.08; // extra sideways shift per px of depth
const INFO_CARD_Z = 150; // px in front of the photo
const ASK_BUTTON_Z = 110;
// const SHADOW_Z = -50; // px behind the photo


const RINGS = [
  { rx: 390, ry: 400, seconds: 24, tiles: [{ w: 180, phase: 0 }, { w: 180, phase: Math.PI }] },
  { rx: 250, ry: 280, seconds: 40, tiles: [{ w: 54, phase: 0.9 }, { w: 46, phase: Math.PI + 0.9 }] },
];

const ORBIT_TILES = RINGS.flatMap(({ tiles, ...ring }) => tiles.map((tile) => ({ ...ring, ...tile })));


function InfoCard({ title, rows, className }: { title: string; rows: Row[]; className: string }) {
  return (
    <div
      data-z={INFO_CARD_Z}
      className={`float-layer absolute w-[219.5px] overflow-hidden rounded-[9px] border-[0.76px] border-[#07172a]/10 bg-[#fffefa]/[0.86] text-[#07172a] shadow-[0_10.7px_27.4px_rgba(7,23,42,0.09),inset_0_0.76px_0_rgba(255,255,255,0.72)] backdrop-blur-[10.7px] ${className}`}
    >
      <p className="px-3 py-[9px] text-[12.2px] leading-[18.3px]">{title}</p>
      {rows.map(({ icon: Icon, iconClass, label, meta }) => (
        <div
          key={label}
          className="flex items-center justify-between border-t-[0.76px] border-[#07172a]/5 bg-[#07172a]/[0.02] px-3 py-2 text-[10.7px] leading-[15.2px] tracking-[0.32px]"
        >
          <span className="flex items-center gap-1.5 text-[#07172a]/80">
            <Icon size={15} strokeWidth={1.75} className={iconClass} />
            {label}
          </span>
          {meta && <span className="text-[#07172a]/45">{meta}</span>}
        </div>
      ))}
    </div>
  );
}

// ───────────────────────── visual ─────────────────────────

// trackRef = the section whose pointer position drives the tilt
export default function LeftVisual({ trackRef }: { trackRef: RefObject<HTMLDivElement | null> }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const tilt = tiltRef.current;
    const area = trackRef.current;
    if (!stage || !tilt || !area) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(stage);

      // Depth layers: push each one toward the viewer (scale cancels the perspective growth)
      const layers = q(".float-layer").map((el) => {
        const z = Number((el as HTMLElement).dataset.z);
        gsap.set(el, { z, scale: (PERSPECTIVE - z) / PERSPECTIVE });
        return { el, z };
      });

      // Two rings of blurred photos, each ring at its own speed
      const tiles = q(".orbit-tile");
      const startTime = gsap.ticker.time;
      const orbit = (time: number) => {
        tiles.forEach((tile: Element, i: number) => {
          const { rx, ry, seconds, phase } = ORBIT_TILES[i];
          const a = phase + ((time - startTime) / seconds) * Math.PI * 2;
          const depth = (Math.sin(a) + 1) / 2; // 0 = back, 1 = front
          gsap.set(tile, {
            x: Math.cos(a) * rx,
            y: Math.sin(a) * ry,
            scale: 0.85 + depth * 0.3,
            opacity: 0.55 + depth * 0.45,
            filter: `blur(${3 + (1 - depth) * 4}px)`,
          });
        });
      };
      orbit(startTime);
      gsap.ticker.add(orbit);

      // Loading icons
      gsap.to(q(".spin-icon"), { rotation: 360, duration: 1, ease: "steps(8)", repeat: -1 });

      // ── Cursor → tilt ──
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

        if (
          e.clientX >= a.left &&
          e.clientX <= a.right &&
          e.clientY >= a.top &&
          e.clientY <= a.bottom
        ) {
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

      const apply = () => {
        gsap.set(tilt, {
          rotationY: current.x * MAX_TILT_Y,
          rotationX: -current.y * MAX_TILT_X,
          rotationZ: current.x * MAX_TILT_Z,
        });
        layers.forEach(({ el, z }) =>
          gsap.set(el, { x: current.x * z * PARALLAX, y: current.y * z * PARALLAX }),
        );
      };

      const tick = (_time: number, deltaMs: number) => {
        const dx = target.x - current.x;
        const dy = target.y - current.y;
        if (Math.abs(dx) < 0.0005 && Math.abs(dy) < 0.0005) {
          if (current.x === target.x && current.y === target.y) return; // at rest
          current.x = target.x;
          current.y = target.y;
        } else {
          const k = 1 - Math.exp(-deltaMs / SMOOTHING_MS); // frame-rate independent easing
          current.x += dx * k;
          current.y += dy * k;
        }
        apply();
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
    <div ref={stageRef} className="relative h-[720px] w-[620px]" style={{ perspective: PERSPECTIVE }}>
      {ORBIT_TILES.map((t, i) => (
        <div
          key={i}
          className="orbit-tile absolute left-1/2 top-1/2 overflow-hidden rounded-lg bg-[#e3d9cd]"
          style={{ width: t.w, height: t.w * 0.75, marginLeft: -t.w / 2, marginTop: -(t.w * 0.75) / 2 }}
        >
          <img src={ORBIT_IMAGES[i % ORBIT_IMAGES.length]} alt="" className="h-full w-full object-cover" />
        </div>
      ))}

      <div
        ref={tiltRef}
        className="absolute left-[103px] top-[80px] z-10 h-[559px] w-[413px] [transform-style:preserve-3d]"
      >
        {/* <div
          data-z={SHADOW_Z}
          className="float-layer absolute inset-3 rounded-[17px] bg-[#342511]/30 blur-2xl"
        /> */}

        <img
          src={CARD_IMAGE}
          alt="Tradespeople at work"
          className="h-full w-full rounded-[17px] object-cover"
        />

        <InfoCard {...VERIFIED_CARD} className="left-[288px] top-[20px]" />
        <InfoCard {...CHECKS_CARD} className="left-[-88px] bottom-[-10px]" />

        <button
          type="button"
          data-z={ASK_BUTTON_Z}
          className="float-layer absolute right-[-40px] bottom-[100px] flex items-center gap-1.5 whitespace-nowrap rounded-full border-[3px]
           border-[#F5551A]/80 bg-white px-6 py-3 text-base leading-7 text-[#F5551A] shadow-[0_12px_28px_rgba(245,85,26,0.22),inset_0_0_20px_rgba(245,85,26,0.5)]"
        >
          <Sparkles size={24} />
          Ask Ai
        </button>
      </div>
    </div>
  );
}