import { useLayoutEffect, useRef, type MouseEvent } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import RollText from "../../utils/RollText";
import type { NavCard, NavItem } from "../../hooks/useNavMenu";

const zoom = (e: MouseEvent<HTMLElement>, scale: number) =>
  gsap.to(e.currentTarget.querySelector("img"), { scale, duration: 0.6, ease: "power2.out" });

function ImageCard({ label, to, bg }: NavCard) {
  return (
    <Link
      to={to}
      onMouseEnter={(e) => zoom(e, 1.12)}
      onMouseLeave={(e) => zoom(e, 1)}
      className="dd-card relative block h-[230px] w-[245px] shrink-0 overflow-hidden rounded-xl"
    >
      <img src={bg} alt={label} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
      <span className="absolute bottom-4 left-4 right-4 text-[15.3px] xl:text-md font-medium leading-[22px] text-white drop-shadow">
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

  const lastItem = useRef<NavItem | null>(item);
  if (item) lastItem.current = item;
  const content = item ?? lastItem.current;

  useLayoutEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (item) {
      gsap.to(panel, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.25,
        ease: "power2.out",
        overwrite: true,
      });
      gsap.fromTo(
        panel.querySelectorAll(".dd-item"),
        { y: 6, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.25, stagger: 0.03, delay: 0.04, ease: "power2.out", overwrite: true },
      );
      // curtain open: reveal from bottom to top
      gsap.fromTo(
        panel.querySelectorAll(".dd-card"),
        { clipPath: "inset(100% 0% 0% 0%)" },
        { clipPath: "inset(0% 0% 0% 0%)", duration: 0.7, stagger: 0.12, delay: 0.1, ease: "power3.out", overwrite: true },
      );
    } else {
      gsap.to(panel, {
        opacity: 0,
        y: -6,
        scale: 0.98,
        duration: 0.18,
        ease: "power2.in",
        overwrite: true,
      });
    }
  }, [item?.label]);

  if (!content) return null;

  const hasCards = content.cards.length > 0;
  const isMultiColumn = content.children.length > 5;
  const midpoint = Math.ceil(content.children.length / 2);
  const columns = isMultiColumn
    ? [content.children.slice(0, midpoint), content.children.slice(midpoint)]
    : [content.children];

  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`fixed left-0 right-0 top-20 z-50 hidden lg:flex justify-center pt-2.5 px-4 pointer-events-none ${item ? "pointer-events-auto" : ""
        }`}
    >
      <div
        ref={panelRef}
        className="pointer-events-auto relative flex items-start justify-between gap-20 rounded-2xl bg-[#F8F4EE] p-6 shadow-[0_16px_40px_rgba(0,0,0,0.12)] border border-[#EDE8E4]/70"
        style={{ opacity: 0, transform: "translateY(-6px) scale(0.98)" }}
      >
        <div className="absolute -top-3 left-0 right-0 h-3" />

        <div className="flex items-start gap-6">
          {columns.map((links, i) => (
            <div key={i} className="flex w-[215px] flex-col">
              <p className="dd-item mb-3 text-sm xl:text-md font-medium uppercase tracking-wider text-primary-light-brown">
                {content.label}
              </p>
              <div className="flex flex-col gap-1 ">
                {links.map((l) => (
                  <Link
                    key={l.label}
                    to={l.to}
                    onClick={onClose}
                    className="group dd-item py-1 text-base xl:text-md font-normal leading-5 text-black transition-colors duration-150 hover:text-[#8B6F54]"
                  >
                    <RollText text={l.label} />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {hasCards && (
          <div className="flex items-center gap-3">
            {content.cards.map((c) => (
              <ImageCard key={c.label} {...c} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}