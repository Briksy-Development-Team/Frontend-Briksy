import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";

export type DropdownKey = "agents" | "trades" | null;
type MenuKey = NonNullable<DropdownKey>;

type NavLink = { label: string; to: string };
type Card = { label: string; to: string; bg: string };
type Menu = { title: string; columns: NavLink[][]; cards: Card[] };
import Randomone from "../../assets/navbar/randomone.svg"
import Randomtwo from "../../assets/navbar/Randomtwo.svg"
import { getAgentTypes, type PublicAgentType } from "../../api/agentTypes.api";
import { getServiceCategories, type PublicServiceCategory } from "../../api/serviceCategories.api";

const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const SHOWN_CLIP = "inset(0% 0% 0% 0%)";

const MENUS: Record<MenuKey, Menu> = {
  agents: {
    title: "Agents",
    columns: [[]],
    cards: [
      { label: "Find an Agent", to: "/agents", bg: Randomone },
      { label: "List Your Business", to: "/subs", bg: Randomtwo },
    ],
  },
  trades: {
    title: "Trades & Professionals",
    columns: [[]],
    cards: [
      { label: "Find a Professional", to: "/professionals", bg: Randomone },
      { label: "List Your Business", to: "/subs", bg: Randomtwo },
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
  const [agentTypes, setAgentTypes] = useState<PublicAgentType[]>([]);
  const [serviceCategories, setServiceCategories] = useState<PublicServiceCategory[]>([]);

  useEffect(() => {
    void getAgentTypes().then(setAgentTypes).catch(() => undefined);
    void getServiceCategories().then(setServiceCategories).catch(() => undefined);
  }, []);

  // Keep showing the last menu while the close animation plays
  if (open) lastKey.current = open;
  const baseMenu = MENUS[open ?? lastKey.current];
  const activeMenu = open ?? lastKey.current;
  const serviceLinks = serviceCategories.map((category) => ({
    label: category.label,
    to: `/professionals?tab=${encodeURIComponent(category.slug)}&service_slug=${encodeURIComponent(category.slug)}`,
  }));
  const serviceMidpoint = Math.ceil(serviceLinks.length / 2);
  const menu = activeMenu === "agents"
    ? { ...baseMenu, columns: [agentTypes.map((type) => ({ label: type.label, to: `/agents?tab=${encodeURIComponent(type.slug)}` }))] }
    : activeMenu === "trades"
      ? { ...baseMenu, columns: [serviceLinks.slice(0, serviceMidpoint), serviceLinks.slice(serviceMidpoint)] }
      : baseMenu;

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
        <div className="mx-auto flex  gap-10 px-12 py-12">
          <div className={`flex flex-col justify-start  gap-6 w-[50%] `}>
            <p className="dd-item text-[11px] font-semibold uppercase tracking-[0.1364em] text-black/50">
              {menu.title}
            </p>
            <div className="grid  grid-cols-2  w-full ">
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
