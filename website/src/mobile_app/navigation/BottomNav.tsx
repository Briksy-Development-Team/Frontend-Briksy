import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, MessageCircle, Heart, User } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  to: string;
  icon: typeof Home;
  isActive: (pathname: string) => boolean;
}

const navItems: NavItem[] = [
  {
    id: "home",
    label: "Home",
    to: "/",
    icon: Home,
    isActive: (pathname) => pathname === "/" || pathname === "/home",
  },
  {
    id: "explore",
    label: "Explore",
    to: "/result",
    icon: Compass,
    isActive: (pathname) =>
      pathname.startsWith("/result") ||
      pathname.startsWith("/buy") ||
      pathname.startsWith("/rent") ||
      pathname.startsWith("/sold") ||
      pathname.startsWith("/commercial") ||
      pathname.startsWith("/auction") ||
      pathname.startsWith("/agents") ||
      pathname.startsWith("/builders") ||
      pathname.startsWith("/professionals"),
  },
  {
    id: "enquiries",
    label: "Enquiries",
    to: "/enquiries",
    icon: MessageCircle,
    isActive: (pathname) => pathname.startsWith("/enquiries"),
  },
  {
    id: "saved",
    label: "Saved",
    to: "/saved",
    icon: Heart,
    isActive: (pathname) =>
      pathname.startsWith("/profile/collections") ||
      pathname.startsWith("/saved") ||
      pathname.startsWith("/collections"),
  },
  {
    id: "profile",
    label: "Profile",
    to: "/profile",
    icon: User,
    isActive: (pathname) =>
      pathname === "/profile" ||
      (pathname.startsWith("/profile") &&
        !pathname.includes("/calendar") &&
        !pathname.includes("/collections")),
  },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      aria-label="Mobile App Navigation"
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EDE8E4] shadow-[0_-2px_10px_rgba(0,0,0,0.03)] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 h-[58px] max-w-md mx-auto">
        {navItems.map((item) => {
          const active = item.isActive(location.pathname);
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className="relative flex flex-col items-center justify-between pt-0 pb-1.5 px-1 cursor-pointer transition-colors"
            >
              {/* Active top indicator bar */}
              <div
                className={`w-7 h-[3px] rounded-full transition-all duration-200 ${
                  active ? "bg-[#342511] opacity-100" : "bg-transparent opacity-0"
                }`}
              />

              {/* Icon */}
              <div className="flex items-center justify-center pt-1">
                <Icon
                  size={22}
                  strokeWidth={active ? 2 : 1.75}
                  className={`transition-colors duration-200 ${
                    active ? "text-[#342511]" : "text-[#5C4A36]"
                  }`}
                  fill={active ? "currentColor" : "none"}
                />
              </div>

              {/* Label */}
              <span
                className={`text-[11px] tracking-tight transition-all duration-200 ${
                  active
                    ? "font-semibold text-[#342511]"
                    : "font-normal text-[#5C4A36]"
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
