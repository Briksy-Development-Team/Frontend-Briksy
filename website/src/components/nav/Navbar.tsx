import { useState, useRef, useEffect } from "react";
import { Globe, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavSearchButton, SearchOverlay } from "./NavSearchBar";
import { SCROLL_THRESHOLD } from "../search/FloatingSearch";
import LanguageModal from "./LanguageModal.tsx";
import ProfileDropdown from "./ProfileDropdown.tsx";
import Briskybrown from "../../assets/logo/briskybrown.svg";
import { useAuth } from "../../auth/AuthContext";
import NavDropdown from "./NavDropdown";
import { useNavMenu } from "../../hooks/useNavMenu";

type NavbarProps = {
  mode: "collapsed" | "search" | "ai";
  setMode: (mode: "collapsed" | "search" | "ai") => void;
  hasHero?: boolean;
  hideOnMobile?: boolean;
};

type Lang = { label: string; region: string };

const Navbar = ({ mode, setMode, hasHero = true, hideOnMobile = false }: NavbarProps) => {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<Lang>({ label: "English", region: "UK" });
  const [pastHero, setPastHero] = useState(!hasHero);
  const pastHeroRef = useRef(pastHero);

  const navMenu = useNavMenu();
  const openItem = navMenu.find((i) => i.label === openLabel) ?? null;

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const isSearchOpen = mode !== "collapsed";

  useEffect(() => {
    setMobileOpen(false);
    setOpenLabel(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!hasHero) return;
    const onScroll = () => {
      if (document.body.style.position === "fixed") return;
      const isPast = window.scrollY > SCROLL_THRESHOLD;
      if (isPast !== pastHeroRef.current) {
        setMode("collapsed");
        pastHeroRef.current = isPast;
        setPastHero(isPast);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasHero, setMode]);

  const isNavItemActive = (to: string) => {
    const url = new URL(to, window.location.origin);
    if (location.pathname !== url.pathname) return false;
    if (to === "/builders" && new URLSearchParams(location.search).get("tab") === "agents") return false;
    for (const [k, v] of new URLSearchParams(url.search).entries()) {
      if (!location.search.includes(`${k}=${v}`)) return false;
    }
    return true;
  };

  const goMobile = (path: string) => {
    setMobileOpen(false);
    navigate(path);
  };

  return (
    <>
      <nav
        className={`fixed left-0 right-0 top-0 z-50 h-20 border-b border-[#d8d8d8] bg-primary-brown text-white ${
          hideOnMobile ? "hidden md:block" : ""
        }`}
      >
        <div className="flex h-20 items-center justify-between px-2 sm:px-4 lg:px-6">
          <Link to="/" onClick={() => setOpenLabel(null)} className="shrink-0 lg:w-[13.75rem]">
            <img loading="eager" src={Briskybrown} alt="Briksy" className="h-12 w-auto" />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-4 lg:flex">
            {navMenu.map((item) => (
              <div key={item.label} className="relative">
                {item.children.length > 0 ? (
                  <button
                    type="button"
                    onClick={() => setOpenLabel((prev) => (prev === item.label ? null : item.label))}
                    className={`flex items-center gap-1 whitespace-nowrap py-1 text-sm font-normal text-white/90 transition hover:text-white cursor-pointer ${
                      openLabel === item.label ||
                      isNavItemActive(item.to) ||
                      item.children.some((c) => isNavItemActive(c.to))
                        ? "border-b border-white text-white font-medium"
                        : ""
                    }`}
                  >
                    <span>{item.label}</span>
                    <span className="text-xs">{openLabel === item.label ? "−" : "+"}</span>
                  </button>
                ) : (
                  <Link
                    to={item.to}
                    onClick={() => setOpenLabel(null)}
                    className={`whitespace-nowrap py-1 text-sm font-normal text-white/90 transition hover:text-white ${
                      isNavItemActive(item.to) ? "border-b border-white text-white font-medium" : ""
                    }`}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-5 lg:w-[13.75rem]">
            {pastHero && !isSearchOpen && (
              <>
                <div className="md:hidden">
                  <NavSearchButton onClick={() => navigate("/result?type=real-estate")} />
                </div>
                <div className="hidden md:block">
                  <NavSearchButton onClick={() => setMode("search")} />
                </div>
              </>
            )}
            <button
              onClick={() => {
                setOpenLabel(null);
                setLangModalOpen(true);
              }}
              className="hidden transition hover:opacity-70 lg:block"
              aria-label="Language and region"
            >
              <Globe size={18} color="white" />
            </button>
            <div className="hidden lg:block">
              <ProfileDropdown />
            </div>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="p-1.5 text-white transition hover:opacity-70 lg:hidden"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mounted outside <nav> so it escapes the navbar stacking context */}
      <NavDropdown item={openItem} onClose={() => setOpenLabel(null)} />

      {/* Mobile drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${
          mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed left-0 top-0 z-40 flex h-full w-full transform flex-col bg-[#f5f2ed] transition-transform duration-300 ease-in-out lg:hidden ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-20 shrink-0 items-center justify-between bg-primary-brown px-5">
          <Link to="/" onClick={() => setMobileOpen(false)}>
            <img src={Briskybrown} alt="Briksy" className="h-12 w-auto" />
          </Link>
          <button
            onClick={() => setMobileOpen(false)}
            className="p-1.5 text-white transition hover:opacity-70"
            aria-label="Close menu"
          >
            <X size={26} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-6 py-4">
          {navMenu.map((item) => (
            <div key={item.label} className="border-b border-[#e5e0d8]">
              {item.children.length > 0 ? (
                <div>
                  <button
                    onClick={() =>
                      setMobileExpanded((prev) => (prev === item.label ? null : item.label))
                    }
                    className="w-full text-left py-4 text-[1.0625rem] font-medium text-[#342511] hover:text-[#6b4c2a] transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <span className="text-sm font-semibold text-gray-500">
                      {mobileExpanded === item.label ? "−" : "+"}
                    </span>
                  </button>
                  {mobileExpanded === item.label && (
                    <div className="pb-3 pl-4 flex flex-col gap-2">
                      {item.children.map((child) => (
                        <button
                          key={child.label}
                          onClick={() => goMobile(child.to)}
                          className="w-full text-left py-1.5 text-[0.9375rem] text-[#5c4a36] hover:text-[#342511] transition-colors"
                        >
                          {child.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => goMobile(item.to)}
                  className="w-full text-left py-4 text-[1.0625rem] font-medium text-[#342511] hover:text-[#6b4c2a] transition-colors"
                >
                  {item.label}
                </button>
              )}
            </div>
          ))}

          <button
            onClick={() => {
              setMobileOpen(false);
              setLangModalOpen(true);
            }}
            className="w-full text-left py-4 text-[1.0625rem] font-medium text-[#342511] border-b border-[#e5e0d8] hover:text-[#6b4c2a] transition-colors"
          >
            Language
          </button>

          {isAuthenticated ? (
            <button
              onClick={() => goMobile("/profile")}
              className="w-full text-left py-4 text-[1.0625rem] font-medium text-[#342511] border-b border-[#e5e0d8] hover:text-[#6b4c2a] transition-colors"
            >
              Profile
            </button>
          ) : (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={() => goMobile("/login")}
                className="rounded-2xl bg-primary-brown px-[3rem] py-3.5 font-medium text-white transition hover:opacity-90"
              >
                Login
              </button>
              <button
                onClick={() => goMobile("/register")}
                className="rounded-2xl border border-gray-300 bg-white px-[3rem] py-3.5 font-medium text-primary-brown transition hover:border-gray-400"
              >
                Register
              </button>
            </div>
          )}
        </nav>
      </div>

      <SearchOverlay open={isSearchOpen} onClose={() => setMode("collapsed")} />
      <LanguageModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        selectedLang={selectedLang}
        onSelect={setSelectedLang}
      />
    </>
  );
};

export default Navbar;