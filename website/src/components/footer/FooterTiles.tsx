import { useEffect, useRef } from "react";
import Matter from "matter-js";
import gsap from "gsap";
import { Home, LandPlot, Hammer, Zap, Building, Hospital, Building2, Store, Sprout } from "lucide-react";

const W = 92; // tile size at full desktop width (from Figma)
const H = 72;
const STEP = 1000 / 60;

const TILES = [
    { label: "Penthouse", icon: Home, color: "#7a5640" },
    { label: "Land/Plot", icon: LandPlot, color: "#d5cfc3", text: "#3a2f2a" },
    { label: "Carpenters", icon: Hammer, color: "#564846" },
    { label: "Electricians", icon: Zap, color: "#b58c62" },
    { label: "Duplex", icon: Building, color: "#a35b42" },
    { label: "Medical", icon: Hospital, color: "#b4a59b" },
    { label: "Townhouse", icon: Building2, color: "#b8a194" },
    { label: "Retail", icon: Store, color: "#b0864d" },
    { label: "Landscaper", icon: Sprout, color: "#a58f6e" },
];

// every tile twice
const ALL = [...TILES, ...TILES];

export default function FooterTiles() {
    const area = useRef<HTMLDivElement>(null);
    const tiles = useRef<HTMLDivElement[]>([]);

    useEffect(() => {
        const el = area.current;
        if (!el) return;

        const { Engine, Bodies, Body, Composite, Constraint, Vector } = Matter;
        let { width, height } = el.getBoundingClientRect();

        const getScale = () => Math.max(0.6, Math.min(1, width / 1400));
        let s = getScale();

        const engine = Engine.create();

        const makeWalls = () => [
            Bodies.rectangle(width / 2, height - 10 * s + 50, width * 3, 100, { isStatic: true }), // sits a little above the bottom edge
        ];
        let walls = makeWalls();

        const cw = W * s + 12;
        const ch = H * s + 8;
        const cols = Math.min(6, Math.floor((width - 20) / cw));
        const rows = Math.ceil(ALL.length / cols);
        const bodies = ALL.map((_, i) =>
            Bodies.rectangle(
                width - 20 - (W * s) / 2 - (i % cols) * cw,
                height - 20 - (rows - Math.floor(i / cols)) * ch,
                W * s,
                H * s,
                {
                    angle: (Math.random() - 0.5) * 0.8,
                    chamfer: { radius: 8 * s },
                    restitution: 0.3,
                    frictionAir: 0.02,
                }
            )
        );
        Composite.add(engine.world, [...walls, ...bodies]);

      
        let z = 1;
        const grabs: (Matter.Constraint | null)[] = ALL.map(() => null);
        const shifts = ALL.map(() => 0);
        const toPoint = (e: PointerEvent, i: number) => {
            const r = el.getBoundingClientRect();
            return { x: e.clientX - r.left + shifts[i], y: Math.min(e.clientY - r.top, height) };
        };
        tiles.current.forEach((tile, i) => {
            tile.onpointerdown = (e) => {
                tile.setPointerCapture(e.pointerId);
                tile.style.zIndex = String(++z);
                shifts[i] = 0;
                const p = toPoint(e, i);
                const b = bodies[i];
                grabs[i] = Constraint.create({
                    pointA: p,
                    bodyB: b,
                    pointB: Vector.rotate(Vector.sub(p, b.position), -b.angle),
                    stiffness: 0.2,
                    damping: 0.1,
                    length: 0,
                });
                Composite.add(engine.world, grabs[i]!);
            };
            tile.onpointermove = (e) => {
                const g = grabs[i];
                if (g) g.pointA = toPoint(e, i);
            };
            tile.onpointerup = tile.onpointercancel = () => {
                const g = grabs[i];
                if (g) Composite.remove(engine.world, g);
                grabs[i] = null;
            };
        });

        const ro = new ResizeObserver(() => {
            ({ width, height } = el.getBoundingClientRect());
            const next = getScale();
            bodies.forEach((b) => {
                Body.scale(b, next / s, next / s);
                Body.setPosition(b, { x: b.position.x, y: Math.min(b.position.y, height - H * next) });
            });
            s = next;
            Composite.remove(engine.world, walls);
            walls = makeWalls();
            Composite.add(engine.world, walls);
        });
        ro.observe(el);

        let acc = 0;
        const tick = (_: number, dt: number) => {
            acc += Math.min(dt, 100);
            for (; acc >= STEP; acc -= STEP) Engine.update(engine, STEP);

            bodies.forEach((b, i) => {
             
                const jump = b.bounds.max.x < 0 ? width - b.bounds.min.x : b.bounds.min.x > width ? -b.bounds.max.x : 0;
                if (jump) {
                    Body.setPosition(b, { x: b.position.x + jump, y: b.position.y });
                    shifts[i] += jump;
                    const g = grabs[i];
                    if (g) g.pointA = { x: g.pointA.x + jump, y: g.pointA.y };
                }

                if (b.position.y > height) Body.setPosition(b, { x: b.position.x, y: height - H * s });

                gsap.set(tiles.current[i], {
                    x: b.position.x - W / 2,
                    y: b.position.y - H / 2,
                    rotation: (b.angle * 180) / Math.PI,
                    scale: s,
                });
            });
        };
        tick(0, 0);
        gsap.ticker.add(tick);

        return () => {
            gsap.ticker.remove(tick);
            ro.disconnect();
            Composite.clear(engine.world);
            Engine.clear(engine);
        };
    }, []);

    return (
        <div ref={area} className="pointer-events-none absolute inset-0 select-none overflow-hidden">
            {ALL.map(({ label, icon: Icon, color, text }, i) => (
                <div
                    key={i}
                    ref={(n) => {
                        if (n) tiles.current[i] = n;
                    }}
                    className="pointer-events-auto absolute left-0 top-0 flex cursor-grab touch-none flex-col items-center justify-center gap-2 rounded-lg text-[12px] active:cursor-grabbing"
                    style={{ width: W, height: H, background: color, color: text ?? "#fff" }}
                >
                    <Icon size={22} strokeWidth={1.5} />
                    {label}
                </div>
            ))}
        </div>
    );
}