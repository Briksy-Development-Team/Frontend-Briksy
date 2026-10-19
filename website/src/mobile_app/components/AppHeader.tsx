import { Link, useNavigate } from "react-router-dom";
import { Bell, MapPin } from "lucide-react";
import Briskybrown from "../../assets/logo/briskybrown.svg";

interface AppHeaderProps {
  title?: string;
  showLocation?: boolean;
  subLocation?: string;
  showNotification?: boolean;
}

export default function AppHeader({
  title,
  showLocation = true,
  subLocation = "Melbourne, VIC",
  showNotification = true,
}: AppHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#EDE8E4] px-4 py-3 flex items-center justify-between transition-all">
      <div className="flex items-center gap-3">
        {title ? (
          <h1 className="text-lg font-bold text-[#342511] tracking-tight">{title}</h1>
        ) : (
          <Link to="/" className="flex items-center gap-2">
            <img src={Briskybrown} alt="Briksy" className="h-8 w-auto object-contain" />
          </Link>
        )}

        {showLocation && !title && (
          <button
            type="button"
            onClick={() => navigate("/result")}
            className="flex items-center gap-1 text-xs text-[#6B5A45] hover:text-[#342511] bg-[#F8F4EE] px-2.5 py-1 rounded-full transition-colors ml-1"
          >
            <MapPin size={12} className="text-[#342511]" />
            <span className="font-medium truncate max-w-[120px]">{subLocation}</span>
          </button>
        )}
      </div>

      <div className="flex items-center gap-2">
        {showNotification && (
          <button
            type="button"
            onClick={() => navigate("/notification")}
            className="relative p-2 rounded-full text-[#342511] hover:bg-[#F8F4EE] transition-colors cursor-pointer"
            aria-label="Notifications"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#DF4235]" />
          </button>
        )}
      </div>
    </header>
  );
}
