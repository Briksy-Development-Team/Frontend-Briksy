import { Star, Share, Award, Phone } from "lucide-react";
import FavoriteButton from "../../../../components/custom/FavoriteButton";
import { SafeImage } from "../../../../components/custom/SafeImage";
import Verify from "../../../../assets/icons/verify.svg";
import defaultBanner from "../../../../assets/agent/agent_banner.png";
import defaultAvatar from "../../../../assets/agent/agent_avatar.png";

export interface AgentSidebarProps {
  agent: {
    id?: string;
    name: string;
    role?: string;
    agencyName?: string;
    agencyUrl?: string;
    bannerImage?: string;
    avatar?: string;
    rating?: number;
    reviewsCount?: number;
    badges?: string[];
    phone?: string | null;
    email?: string | null;
    is_favourite?: boolean;
    is_verified?: boolean;
  };
  onRequestAppraisal: () => void;
  onEnquiry: () => void;
  onCallAgency: () => void;
}

/**
 * Left side Agent Sidebar matching Traders architecture & Figma node 4359-2061.
 * ponytail: clean, structured component with direct modal triggers.
 */
export function AgentSidebar({
  agent,
  onRequestAppraisal,
  onEnquiry,
  onCallAgency,
}: AgentSidebarProps) {
  const rating = agent.rating || 4.9;
  const reviewsCount = agent.reviewsCount || 64;
  const badges = agent.badges || ["2025 Top Agent", "14 years experience"];

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: agent.name,
          url: window.location.href,
        });
      } catch {
        // user cancelled share
      }
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <aside className="w-full flex flex-col gap-4">
      {/* Verified badge */}
      <div
        className="w-full bg-white rounded-xl py-3 px-6 flex justify-center items-center gap-2.5 shadow-[0px_0px_13px_0px_rgba(0,0,0,0.12)]"
      >
        <img src={Verify} alt="Verified by Briksy" className="h-5 w-auto" />
        <span className="font-medium text-[0.875rem] text-[#342511]">Verified by Briksy</span>
      </div>

      {/* Profile Card — Banner + Overlapping Avatar */}
      <div className="bg-white rounded-2xl border border-[#EDE8E4] overflow-visible pb-6 shadow-sm">
        <div className="relative w-full h-[180px] rounded-t-2xl overflow-hidden bg-[#E2CBB3]">
          <SafeImage
            src={agent.bannerImage || defaultBanner}
            alt="Agent Banner"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Circular Avatar overlapping */}
        <div className="relative flex justify-center -mt-16">
          <div
            className="w-[124px] h-[124px] rounded-full overflow-hidden border-[4.8px] border-white bg-white shadow-[0px_13px_39px_0px_rgba(0,0,0,0.10),0px_0px_0px_1.6px_rgba(0,0,0,0.02)]"
          >
            <SafeImage
              src={agent.avatar || defaultAvatar}
              alt={agent.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Info Content */}
        <div className="flex flex-col items-center gap-3 text-center px-6 pt-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-[1.375rem] font-medium text-[#342511] leading-tight">
              {agent.name}
            </h1>
            <p className="text-[0.875rem] text-[#7C5F42]">
              {agent.role || "Selling Principal"} at{" "}
              {agent.agencyUrl ? (
                <a
                  href={agent.agencyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#342511] transition-colors"
                >
                  {agent.agencyName || "Ray White - Hervey Bay"}
                </a>
              ) : (
                <span className="underline">{agent.agencyName || "Ray White - Hervey Bay"}</span>
              )}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1.5 text-[0.875rem] text-[#342511]">
            <Star size={18} className="fill-[#F5551A] text-[#F5551A]" />
            <span className="font-medium">{rating}</span>
            <span className="text-[#8B6F54]">({reviewsCount} reviews)</span>
          </div>

          {/* Badges / Experience */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-1">
            {badges.map((badge, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F8F4EE] text-[#8B6F54] text-[0.75rem] font-medium border border-[#EDE8E4]"
              >
                {idx === 0 && <Award size={14} className="text-[#8B6F54]" />}
                {badge}
              </span>
            ))}
          </div>

          {/* Share & Favorite buttons */}
          <div className="flex items-center gap-3 mt-3">
            <button
              onClick={handleShare}
              className="w-9 h-9 rounded-full bg-[#F8F4EE] border border-[#EDE8E4] flex items-center justify-center text-[#7C5F42] hover:text-[#342511] hover:bg-white transition-colors"
              title="Share profile"
            >
              <Share size={15} />
            </button>
            <FavoriteButton
              variant="icon-only"
              showText={false}
              iconSize={15}
              targetId={agent.id}
              targetType="organization"
              initialIsFavourite={agent.is_favourite}
              className="w-9 h-9 rounded-full bg-[#F8F4EE] border border-[#EDE8E4] flex items-center justify-center text-[#7C5F42] hover:text-[#342511] hover:bg-white transition-colors"
            />
          </div>
        </div>
      </div>

      {/* Enquiry Card */}
      <div className="w-full bg-white rounded-2xl border border-[#EDE8E4] flex flex-col gap-3.5 p-6 shadow-sm">
        <button
          onClick={onRequestAppraisal}
          className="w-full h-10 rounded-full bg-[#342511] text-[#F8F4EE] font-medium text-[0.875rem] hover:opacity-90 transition-opacity flex items-center justify-center"
        >
          Request a free appraisal
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={onEnquiry}
            className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-[#342511] font-medium text-[0.875rem] hover:bg-gray-50 transition-colors flex items-center justify-center"
          >
            Enquiry
          </button>
          <button
            onClick={onCallAgency}
            className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-[#342511] font-medium text-[0.875rem] hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
          >
            <Phone size={14} />
            Call Agency
          </button>
        </div>
      </div>
    </aside>
  );
}

export default AgentSidebar;
