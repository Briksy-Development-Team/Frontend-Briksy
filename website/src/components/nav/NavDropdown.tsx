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

export default function NavDropdown({ item, onClose }: { item: NavItem | null; onClose: () => void }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!item || !panel) return;
    gsap.to(panel, { clipPath: SHOWN_CLIP, opacity: 1, duration: 0.4, ease: "power3.out", overwrite: true });
    if (backdropRef.current) gsap.to(backdropRef.current, { opacity: 1, duration: 0.3, overwrite: true });
    gsap.fromTo(
      panel.querySelectorAll(".dd-item"),
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, stagger: 0.04, delay: 0.1, ease: "power2.out", overwrite: true },
    );
  }, [item?.label]);

  if (!item) return null;

  const hasCards = item.cards.length > 0;
  const isMultiColumn = item.children.length > 8;
  const midpoint = Math.ceil(item.children.length / 2);
  const columns = isMultiColumn
    ? [item.children.slice(0, midpoint), item.children.slice(midpoint)]
    : [item.children];

  return (
    <>
      {/* <div
        ref={backdropRef}
        onClick={onClose}
        aria-hidden
        className="fixed inset-0 top-20 z-40 bg-black/20 "
        style={{ opacity: 0 }}
      /> */}

      <div
        ref={panelRef}
        className="fixed left-0 right-0 top-20 z-50 w-full max-w-[2000px] mx-auto overflow-hidden bg-[#F8F4EE]"
        style={{ clipPath: HIDDEN_CLIP, opacity: 0 }}
      >
        <div className="mx-auto flex gap-10 px-40 py-12">
          <div className={`flex flex-col justify-start gap-6 ${hasCards ? "w-[50%]" : "w-full"}`}>
            <p className="dd-item text-[11px] font-semibold uppercase tracking-[0.1364em] text-black/50">
              {item.label}
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
              {item.cards.map((c) => (
                <ImageCard key={c.label} {...c} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}