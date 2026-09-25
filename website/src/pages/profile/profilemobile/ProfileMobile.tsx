import { ChevronRight ,ArrowLeft } from "lucide-react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { SafeImage } from "../../../components/custom/SafeImage";

function getInitials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
}

function formatJoined(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-AU", { month: "long", year: "numeric" });
}

export default function ProfileMobile() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isHub = location.pathname.replace(/\/$/, '') === '/profile';

  if (!isHub) {
    const section = location.pathname.split('/').pop() || '';
    let label = 'Back';
    if (section === 'personal-info') label = 'Personal info';
    else if (section === 'saved-search') label = 'Save Search';
    else if (section === 'notifications') label = 'Notification';
    else if (section === 'privacy') label = 'Privacy';

    return (
      <div className="min-h-screen  font-helvetica">
        <div className="flex bg-white items-center mb-4 gap-3 px-5 py-5 ">
          <button
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2  text-[#342511] text-[15px] font-medium"
          >
            <ArrowLeft className=" w-5 h-5" />
            {label}
          </button>
        </div>
        <div className="px-5 pb-8">
          <Outlet />
        </div>
      </div>
    );
  }

  const initials = user?.name ? getInitials(user.name) : "?";

  const menuRows1 = [
    { label: "Personal info", view: "personal-info" },
    { label: "Save Search", view: "saved-search" },
    { label: "Notification", view: "notifications" },
    { label: "Privacy", view: "privacy" },
  ];

  return (
    <div className="min-h-screen bg-[#F8F4EE] font-helvetica pb-8">
      {/* Top bar */}
      {/* <div className="flex items-center justify-between px-5 py-[18px]">
        <h1 className="text-[1.875rem] font-medium text-[#342511]">Profile</h1>
        <div className="flex gap-1">
          {["S", "A"].map((letter, i) => (
            <div
              key={i}
              className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-[13px] font-semibold"
            >
              {letter}
            </div>
          ))}
        </div>
      </div> */}

      <div className="flex flex-col gap-5 px-5 mt-28">
       <div className="bg-white rounded-3xl shadow-[0px_8px_24px_rgba(0,0,0,0.1)] px-6 py-8 flex flex-col items-center gap-2">
          {user?.avatar_url ? (
            <SafeImage
              src={user.avatar_url}
              alt={user.name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-[#342511] flex items-center justify-center text-white text-3xl font-semibold">
              {initials}
            </div>
          )}
          <p className="text-[1.125rem] font-medium text-[#342511] mt-2">{user?.name}</p>
          <p className="text-[0.75rem] text-[#8B6F54]">
            Seeker account · joined {formatJoined(user?.created_at)}
          </p>
        </div>

        {/* Verify banner */}
        <div className="bg-[#E2CBB3] rounded-xl px-4 py-3 flex items-start gap-2">
          <span className="text-[#342511] text-xl font-medium leading-none mt-0.5">ⓘ</span>
          <p className="text-[0.75rem] text-[#342511]">
            Please verify your mobile number to access all features.
          </p>
        </div>

        {/* Menu card 1 */}
        <div className="bg-white rounded-2xl border border-[#EDE8E4] overflow-hidden">
          {menuRows1.map((row, i) => (
            <div key={row.view}>
              <Link
                to={`/profile/${row.view}`}
                className="w-full flex items-center justify-between px-4 py-4"
              >
                <span className="text-[14px] font-medium text-[#342511]">{row.label}</span>
                <ChevronRight className="w-4 h-4 text-[#8B6F54]" />
              </Link>
              {i < menuRows1.length - 1 && <div className="h-px bg-[#EDE8E4] mx-0" />}
            </div>
          ))}
        </div>

        {/* Menu card 2 - Security */}
        <div className="bg-white rounded-2xl border border-[#EDE8E4] overflow-hidden">
          <button className="w-full flex items-center justify-between px-4 py-4">
            <span className="text-[14px] font-medium text-[#342511]">Security</span>
            <ChevronRight className="w-4 h-4 text-[#8B6F54]" />
          </button>
        </div>

        {/* Log Out */}
        <button
          onClick={() => logout()}
          className="w-full h-[50px] bg-white border border-[#E2E8F0] rounded-full text-[14px] font-medium text-[#342511]"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
