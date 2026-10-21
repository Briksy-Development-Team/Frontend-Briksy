import { useLayoutEffect, useRef } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import type { NavCard, NavItem } from "../../hooks/useNavMenu";

const HIDDEN_CLIP = "inset(0% 0% 100% 0%)";
const SHOWN_CLIP = "inset(0% 0% 0% 0%)";

function ImageCard({ label, to, bg }: NavCard) {
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

type NavDropdownProps = {
  item: NavItem | null;
  onClose: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
};

export default function NavDropdown({ item, onClose, onMouseEnter, onMouseLeave }: NavDropdownProps) {
  const panelRef = useRef<HTMLDivElement>(null);

  // Keep the last item so its content stays visible while the panel animates out
  const lastItem = useRef<NavItem | null>(item);
  if (item) lastItem.current = item;
  const content = item ?? lastItem.current;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (item) {
      gsap.to(panel, { clipPath: SHOWN_CLIP, opacity: 1, duration: 0.4, ease: "power3.out", overwrite: true });
      gsap.fromTo(
        panel.querySelectorAll(".dd-item"),
        { y: 12, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.1, ease: "power2.out", overwrite: true },
      );
    } else {
      gsap.to(panel, { clipPath: HIDDEN_CLIP, opacity: 0, duration: 0.25, ease: "power2.in", overwrite: true });
    }
  }, [item?.label]);

  if (!content) return null;

  const hasCards = content.cards.length > 0;
  const isMultiColumn = content.children.length > 8;
  const midpoint = Math.ceil(content.children.length / 2);
  const columns = isMultiColumn
    ? [content.children.slice(0, midpoint), content.children.slice(midpoint)]
    : [content.children];

  return (
    <div
      ref={panelRef}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed left-0 right-0 top-20 z-50 w-full max-w-[2000px] mx-auto overflow-hidden bg-[#F8F4EE] ${item ? "" : "pointer-events-none"
        }`}
      style={{ clipPath: HIDDEN_CLIP, opacity: 0 }}
    >
      <div className="mx-auto flex gap-10 px-40 py-12">
        <div className={`flex flex-col justify-start gap-6 ${hasCards ? "w-[50%]" : "w-full"}`}>
          <p className="dd-item text-[11px] font-semibold uppercase tracking-[0.1364em] text-black/50">
            {content.label}
          </p>
          <div className={`grid ${isMultiColumn ? "grid-cols-2" : "grid-cols-1"} w-full`}>
            {columns.map((links, i) => (
              <div key={i} className="flex flex-col gap-2">
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

        {hasCards && (
          <div className="flex w-[50%] gap-5">
            {content.cards.map((c) => (
              <ImageCard key={c.label} {...c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}