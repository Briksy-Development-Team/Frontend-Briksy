import { useState, useEffect, useRef } from "react";
import { Bell, ChevronDown, Globe, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NavSearchButton, SearchOverlay } from "./NavSearchBar";
import LanguageModal from "./LanguageModal.tsx";
import ProfileDropdown from "./ProfileDropdown.tsx";
import Briskybrown from "../../assets/logo/briskybrown.svg";
import { useAuth } from "../../auth/AuthContext";
import NavDropdown from "./NavDropdown";
import { useNavMenu } from "../../hooks/useNavMenu";
import { getSeekerNotificationUnreadCount } from "../../api/seeker/seeker.api";

type NavbarProps = {
  mode: "collapsed" | "search" | "ai";
  setMode: (mode: "collapsed" | "search" | "ai") => void;
  hasHero?: boolean;
  hideOnMobile?: boolean;
  visibilityClass?: string;
};

type Lang = { label: string; region: string };

const Navbar = ({ mode, setMode, hideOnMobile = false, visibilityClass }: NavbarProps) => {
  const [langModalOpen, setLangModalOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const [selectedLang, setSelectedLang] = useState<Lang>({ label: "English", region: "UK" });
  const closeTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const navMenu = useNavMenu();
  const openItem = navMenu.find((i) => i.label === openLabel) ?? null;

  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const isSearchOpen = mode !== "collapsed";

  // Hover helpers: small delay so the dropdown doesn't flicker when the mouse moves between tab and panel
  const cancelClose = () => clearTimeout(closeTimer.current);
  const openMenu = (label: string | null) => {
    cancelClose();
    setOpenLabel(label);
  };
  const closeMenu = () => {
    cancelClose();
    closeTimer.current = setTimeout(() => setOpenLabel(null), 150);
  };

  useEffect(() => {
    setMobileOpen(false);
    openMenu(null);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!isAuthenticated) {
      setUnreadNotifications(0);
      return;
    }
    getSeekerNotificationUnreadCount()
      .then((response) => setUnreadNotifications(response.data?.count ?? 0))
      .catch(() => setUnreadNotifications(0));
  }, [isAuthenticated, location.pathname]);

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
        className={`fixed left-0 right-0 top-0 z-50 h-20 border-b w-full border-[#d8d8d8] bg-primary-brown text-white ${visibilityClass ?? (hideOnMobile ? "hidden md:block" : "")
          }`}
      >
        <div className="mx-auto flex h-20 w-full max-w-[1530px] items-center justify-between px-2 sm:px-4 lg:px-6">
          <Link to="/" onClick={() => openMenu(null)} className="shrink-0 lg:w-[13.75rem]">
            <img loading="eager" src={Briskybrown} alt="Briksy" className="h-12 w-auto" />
          </Link>

          <div className="hidden flex-1 items-center justify-center gap-4 lg:flex">
            {navMenu.map((item) => {
              const hasChildren = item.children.length > 0;
              const isActive = isNavItemActive(item.to) || item.children.some((c) => isNavItemActive(c.to));

              return (
                <div
                  key={item.label}
                  className="relative flex h-20 items-center"
                  onMouseEnter={() => openMenu(hasChildren ? item.label : null)}
                  onMouseLeave={closeMenu}
                >
                  {hasChildren ? (
                    <div
                      className={`flex cursor-default items-center gap-1 whitespace-nowrap py-1 text-sm font-normal text-white/90 transition hover:text-white ${openLabel === item.label || isActive ? "border-b border-white text-white font-medium" : ""
                        }`}
                    >
                      <span>{item.label}</span>
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 ${openLabel === item.label ? "rotate-180" : ""}`}
                      />
                    </div>
                  ) : (
                    <Link
                      to={item.to}
                      className={`whitespace-nowrap py-1 text-sm font-normal text-white/90 transition hover:text-white ${isActive ? "border-b border-white text-white font-medium" : ""
                        }`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex shrink-0 items-center justify-end gap-5 lg:w-[13.75rem]">
            {!isSearchOpen && (
              <>
                <div className="lg:hidden">
                  <NavSearchButton onClick={() => navigate("/result?type=real-estate")} />
                </div>
                <div className="hidden lg:block">
                  <NavSearchButton onClick={() => setMode("search")} />
                </div>
              </>
            )}
            <button
              onClick={() => {
                openMenu(null);
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
            {/* {isAuthenticated && (
              <button type="button" onClick={() => navigate("/profile/notifications")} className="relative hidden lg:block text-white transition hover:opacity-70" aria-label="Notifications">
                <Bell size={18} />
                {unreadNotifications > 0 && <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#E86749] px-1 text-[10px] font-bold text-white">{unreadNotifications > 9 ? "9+" : unreadNotifications}</span>}
              </button>
            )} */}
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
      <NavDropdown
        item={openItem}
        onMouseEnter={cancelClose}
        onMouseLeave={closeMenu}
        onClose={() => openMenu(null)}
      />

      {/* Mobile drawer */}
      <div
        onClick={() => setMobileOpen(false)}
        aria-hidden
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 lg:hidden ${mobileOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
          }`}
      />
      <div
        className={`fixed left-0 top-0 z-40 flex h-full w-full transform flex-col bg-[#f5f2ed] transition-transform duration-300 ease-in-out lg:hidden ${mobileOpen ? "translate-x-0" : "-translate-x-full"
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