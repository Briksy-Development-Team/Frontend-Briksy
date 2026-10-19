import { useNavigate } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

const AVATARS = [
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/68.jpg",
];

export default function AppVerifiedPromo() {
  const navigate = useNavigate();

  return (
    <div className="rounded-[20px] bg-[#342511] text-white p-5 space-y-2.5">
      <div className="flex items-center gap-2">
        <ShieldCheck size={18} className="text-[#E2CBB3] shrink-0" />
        <h3 className="text-sm font-medium">Verified this week</h3>
      </div>

      <p className="text-xs text-[#E2CBB3] leading-relaxed">
        38 new builders and trades passed licence and insurance checks near you.
      </p>

      <div className="flex items-center justify-between pt-2">
        <button
          type="button"
          onClick={() => navigate("/result")}
          className="bg-[#E2CBB3] text-[#342511] px-4 py-1.5 rounded-full text-xs font-semibold active:scale-95 transition-all cursor-pointer"
        >
          Explore
        </button>

        <div className="flex items-center -space-x-2">
          {AVATARS.map((src) => (
            <img
              key={src}
              src={src}
              alt="Verified pro"
              className="w-7 h-7 rounded-full object-cover border-2 border-[#342511]"
            />
          ))}
          <div className="w-7 h-7 rounded-full bg-[#BF9F7D] text-[#342511] text-[10px] font-bold flex items-center justify-center border-2 border-[#342511]">
            +35
          </div>
        </div>
      </div>
    </div>
  );
}