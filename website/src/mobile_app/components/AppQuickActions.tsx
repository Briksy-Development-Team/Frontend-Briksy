import { useNavigate } from "react-router-dom";
import { Building2, Home, Gavel, Users, Wrench, Hammer, Briefcase } from "lucide-react";

interface ActionItem {
  id: string;
  label: string;
  to: string;
  icon: typeof Home;
}

const quickActions: ActionItem[] = [
  { id: "buy", label: "Buy", to: "/buy", icon: Home },
  { id: "rent", label: "Rent", to: "/rent", icon: Building2 },
  { id: "auctions", label: "Auctions", to: "/auctions", icon: Gavel },
  { id: "commercial", label: "Commercial", to: "/commercials", icon: Briefcase },
  { id: "agents", label: "Agents", to: "/agents", icon: Users },
  { id: "trades", label: "Trades", to: "/professionals", icon: Wrench },
  { id: "builders", label: "Builders", to: "/builders", icon: Hammer },
];

export default function AppQuickActions() {
  const navigate = useNavigate();

  return (
    <div className="py-2">
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide px-4">
        {quickActions.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => navigate(item.to)}
              className="flex flex-col items-center gap-1.5 shrink-0 group focus:outline-none"
            >
              <div className="w-13 h-13 rounded-2xl bg-white border border-[#EDE8E4] flex items-center justify-center text-[#342511] shadow-xs group-hover:bg-[#F8F4EE] group-active:scale-95 transition-all">
                <Icon size={20} strokeWidth={1.8} />
              </div>
              <span className="text-[11px] font-medium text-[#342511] whitespace-nowrap">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
