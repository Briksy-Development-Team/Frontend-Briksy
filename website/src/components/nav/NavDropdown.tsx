import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export type DropdownKey = "agents" | "trades" | null;
type MenuKey = NonNullable<DropdownKey>;

type NavLink = { label: string; to: string };
type Card = { label: string; to: string; bg: string };
type Menu = { title: string; columns: NavLink[][]; cards: Card[] };

const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const SHOWN_CLIP = "inset(0% 0% 0% 0%)";

const MENUS: Record<MenuKey, Menu> = {
  agents: {
    title: "Agents",
    columns: [
      [
        { label: "Buyer Agents", to: "/agents?tab=Agents" },
        { label: "Seller Agents", to: "/agents?tab=Agents" },
        { label: "Leasing Agents", to: "/agents?tab=Agents" },
        { label: "Property Managers", to: "/agents?tab=Agents" },
        { label: "Commercial Agents", to: "/agents?tab=Agents" },
      ],
    ],
    cards: [
      { label: "Find an Agent", to: "/agents", bg: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80" },
      { label: "List Your Business", to: "/register", bg: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=80" },
    ],
  },
  trades: {
    title: "Trades & Professionals",
    columns: [
      [
        { label: "Electricians", to: "/professionals?tab=Electricians" },
        { label: "Plumbers", to: "/professionals?tab=Plumbers" },
        { label: "Carpenters", to: "/professionals?tab=Carpenters" },
        { label: "Painters", to: "/professionals?tab=Painters" },
        { label: "Tilers", to: "/professionals?tab=Tilers" },
      ],
      [
        { label: "Roofers", to: "/professionals?tab=Roofers" },
        { label: "HVAC Technicians", to: "/professionals?tab=HVAC" },
        { label: "Handyman Services", to: "/professionals?tab=Handyman" },
        { label: "Architects", to: "/professionals?tab=Architects" },
        { label: "Surveyors", to: "/professionals?tab=Surveyors" },
      ],
    ],
    cards: [
      { label: "Find a Professional", to: "/professionals", bg: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80" },
      { label: "List Your Business", to: "/register", bg: "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&q=80" },
    ],
  },
};

function ImageCard({ label, to, bg }: Card) {
  return (
    <Link to={to} className="dd-item group relative block min-h-[300px] flex-1 overflow-hidden rounded-2xl">
      <img
        src={bg}
        alt={label}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent" />
      <span className="absolute bottom-6 left-6 text-xl font-medium leading-[30px] text-white drop-shadow">
        {label}
      </span>
    </Link>
  );
}

export default function NavDropdown({ open, onClose }: { open: DropdownKey; onClose: () => void }) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const lastKey = useRef<MenuKey>("agents");

  // Keep showing the last menu while the close animation plays
  if (open) lastKey.current = open;
  const menu = MENUS[open ?? lastKey.current];

  // Open: mount. Close: animate out, then unmount.
  useEffect(() => {
    if (open) {
      setMounted(true);
      return;
    }
    if (!panelRef.current) return;
    gsap.to(panelRef.current, {
      clipPath: HIDDEN_CLIP,
      opacity: 0,
      duration: 0.25,
      ease: "power2.in",
      overwrite: true,
      onComplete: () => setMounted(false),
    });
    gsap.to(backdropRef.current, { opacity: 0, duration: 0.25, overwrite: true });
  }, [open]);

  // Animate in whenever the dropdown opens or switches menu
  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!open || !mounted || !panel) return;
    gsap.to(panel, { clipPath: SHOWN_CLIP, opacity: 1, duration: 0.4, ease: "power3.out", overwrite: true });
    gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, overwrite: true });
    gsap.fromTo(
      panel.querySelectorAll(".dd-item"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.1, ease: "power2.out", overwrite: true },
    );
  }, [open, mounted]);

  if (!mounted) return null;

  return (
    <>
      <div
        ref={backdropRef}
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 top-20 z-40 bg-black/20"
        style={{ opacity: 0, pointerEvents: open ? "auto" : "none" }}
      />

      <div
        ref={panelRef}
        onMouseLeave={onClose}
        className="fixed left-0 right-0 top-20 z-50 w-full overflow-hidden bg-[#F8F4EE]"
        style={{ clipPath: HIDDEN_CLIP, opacity: 0 }}
      >
        <div className="mx-auto flex justify-between gap-10 px-12 py-12">
          <div className={`flex flex-col gap-6 w-[50%]`}>
            <p className="dd-item text-[11px] font-semibold uppercase tracking-[0.1364em] text-black/50">
              {menu.title}
            </p>
            <div className="flex  w-full justify-around">
              {menu.columns.map((links, i) => (
                <div key={i} className="flex flex-col gap-3">
                  {links.map((l) => (
                    <Link
                      key={l.label}
                      to={l.to}
                      onClick={onClose}
                      className="dd-item text-[1rem] font-medium leading-6 text-black transition-colors duration-150 hover:text-[#7C5F42]"
                    >
                      {l.label}
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="flex w-[50%] gap-5">
            {menu.cards.map((c) => (
              <ImageCard key={c.label} {...c} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}