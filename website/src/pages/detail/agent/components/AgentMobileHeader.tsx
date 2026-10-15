import { Star, ChevronLeft, Share } from "lucide-react";
import { useNavigate } from "react-router-dom";
import FavoriteButton from "../../../../components/custom/FavoriteButton";
import { SafeImage } from "../../../../components/custom/SafeImage";
import Verify from "../../../../assets/icons/verify.svg";
import defaultBanner from "../../../../assets/agent/agent_banner.png";
import defaultAvatar from "../../../../assets/agent/agent_avatar.png";

export interface AgentMobileHeaderProps {
  agent: {
    id?: string;
    name: string;
    role?: string;
    agencyName?: string;
    bannerImage?: string;
    avatar?: string;
    rating?: number;
    reviewsCount?: number;
    is_favourite?: boolean;
    is_verified?: boolean;
  };
}

const circleBtn =
  "w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[#342511] hover:bg-gray-50 transition-colors";

export function AgentMobileHeader({ agent }: AgentMobileHeaderProps) {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: agent.name,
          url: window.location.href,
        });
      } catch {
        // user cancelled
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="w-full md:hidden mb-8">
      {/* Banner */}
      <div
        className="relative h-[240px] -mx-[3%] bg-[#E2CBB3]"
        style={{ width: "calc(100% + 6%)" }}
      >
        <SafeImage
          src={agent.bannerImage || defaultBanner}
          alt={agent.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-4 inset-x-0 px-[3%] flex justify-between z-10">
          <button
            onClick={() => {
              if (window.history.length > 1) {
                navigate(-1);
              } else {
                navigate("/");
              }
            }}
            className={circleBtn}
          >
            <ChevronLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <button onClick={handleShare} className={circleBtn}>
              <Share size={18} />
            </button>
            <FavoriteButton
              variant="icon-only"
              showText={false}
              iconSize={18}
              className={circleBtn}
              targetId={agent.id}
              targetType="organization"
              initialIsFavourite={Boolean(agent.is_favourite)}
            />
          </div>
        </div>
      </div>

      {/* Avatar & Info */}
      <div className="relative px-4 pt-4 flex flex-col items-center text-center">
        <div className="relative -mt-16 w-24 h-24 rounded-full overflow-hidden border-4 border-white bg-white shadow-md">
          <SafeImage
            src={agent.avatar || defaultAvatar}
            alt={agent.name}
            className="w-full h-full object-cover"
          />
        </div>

        <h1 className="text-[1.375rem] font-medium text-[#342511] mt-3">
          {agent.name}
        </h1>
        <p className="text-[0.875rem] text-[#7C5F42]">
          {agent.role || "Selling Principal"} at {agent.agencyName || "Ray White - Hervey Bay"}
        </p>

        <div className="flex items-center gap-1.5 mt-2">
          <Star size={16} className="fill-[#F5551A] text-[#F5551A]" />
          <span className="font-medium text-[0.875rem] text-[#342511]">
            {agent.rating || 4.9}
          </span>
          <span className="text-[0.875rem] text-[#8B6F54]">
            ({agent.reviewsCount || 64} reviews)
          </span>
        </div>

        <div className="flex items-center gap-1.5 mt-3 py-1 px-3 rounded-full bg-white shadow-sm border border-[#EDE8E4]">
          <img src={Verify} alt="Verified" className="h-4 w-auto" />
          <span className="text-[0.75rem] font-medium text-[#342511]">
            Verified by Briksy
          </span>
        </div>
      </div>
    </div>
  );
}

export default AgentMobileHeader;
