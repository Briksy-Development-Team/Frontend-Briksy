import { Menu, HelpCircle, LogOut, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Place from "../../assets/place holder/place.svg";

const ProfileDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user, logout } = useAuth()

    // ponytail: mock auth state | upgrade: connect to auth store
    const isLoggedIn = false; 

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (document.body.style.position === "fixed") return;
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const closeAndNav = (path: string) => {
        setDropdownOpen(false);
        navigate(path);
    };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen((value) => !value)}
        className="flex items-center justify-center gap-2 rounded-3xl border border-white/20 bg-white px-3 py-2 text-gray-800 transition-colors"
        aria-label="Open account menu"
      >
        <Menu size={20} />
        <span className="hidden text-sm font-medium lg:inline">{user?.name?.split(' ')[0] ?? 'Account'}</span>
        <img loading="lazy" src={Place} alt="profile" className="h-6 w-6" />
      </button>

      {dropdownOpen ? (
        <div className="absolute right-0 z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-[#e7e1d8] bg-white shadow-xl">
          <div className="border-b border-[#f0ebe5] px-5 py-4">
            <p className="text-xs uppercase tracking-[0.22em] text-[#8b6f54]">Signed in as</p>
            <p className="mt-1 text-sm font-medium text-[#342511]">{user?.name ?? 'Seeker'}</p>
            <p className="text-sm text-[#7c5f42]">{user?.email}</p>
          </div>

          <div className="py-2">
            <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="p-2 rounded-3xl space-x-2 border bg-white flex items-center justify-center transition-colors border-gray-300 text-gray-800"
            >
              <UserRound size={18} className="text-[#8b6f54]" />
              My Account
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/account/liked-properties')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <Heart size={18} className="text-[#8b6f54]" />
              My Liked Properties
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/account/inquiries')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <img src={Notification} alt="" className="h-[18px] w-[18px]" />
              My Inquiries
            </button>
            <button
              onClick={() => {
                setDropdownOpen(false)
                navigate('/help-support')
              }}
              className="flex w-full items-center gap-3 px-5 py-3 text-left text-sm font-medium text-[#342511] hover:bg-[#fbfaf3]"
            >
              <HelpCircle size={18} className="text-[#8b6f54]" />
              Help & Contact
            </button>
          </div>

            {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-72 bg-white rounded-3xl shadow-xl border border-gray-200 py-3 z-50">
                    <button
                        onClick={() => closeAndNav('/help-support')}
                        className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                    >
                        <HelpCircle size={20} className="text-gray-800" strokeWidth={1.5} />
                        <span className="font-semibold text-gray-900 text-sm">
                            Help Or Contact Us
                        </span>
                    </button>
                    
                    <div className="border-t border-gray-200 mx-6 my-2" />

                    {!isLoggedIn ? (
                        <div className="px-6 py-2 flex flex-col gap-3">
                            <button
                                onClick={() => closeAndNav('/login')}
                                className="w-full bg-[#2B2B2B] hover:bg-black text-white rounded-2xl py-3 font-medium transition-colors"
                            >
                                Login
                            </button>
                            <button
                                onClick={() => closeAndNav('/register')}
                                className="w-full bg-white border border-gray-300 hover:border-gray-400 text-gray-900 rounded-2xl py-3 font-medium transition-colors"
                            >
                                Register
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => closeAndNav('/notification')}
                                className="w-full flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
                            >
                                <MessageSquare size={20} className="text-gray-800" strokeWidth={1.5} />
                                <span className="font-semibold text-gray-900 text-sm">
                                    Notifications
                                </span>
                            </button>
                            
                            <div className="border-t border-gray-200 mx-6 my-2" />
                            
                            <button
                                onClick={() => closeAndNav('/profile')}
                                className="w-full text-left px-6 py-3 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition-colors"
                            >
                                View Profile
                            </button>
                            
                            <div className="border-t border-gray-200 mx-6 my-2" />
                            
                            <div className="px-6 py-3 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => closeAndNav('/coming-soon')}>
                                <div className="text-sm font-semibold text-gray-900">
                                    Become a Agent/Agency
                                </div>
                                <div className="text-sm text-gray-400 mt-1">
                                    Open Agent/ Agency Panel
                                </div>
                            </div>
                            
                            <div className="border-t border-gray-200 mx-6 my-2" />
                            
                            <button
                                onClick={() => {
                                    // handle logout logic here
                                    closeAndNav('/login');
                                }}
                                className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 transition-colors"
                            >
                                <LogOut size={18} />
                                <span className="font-semibold text-sm">Logout</span>
                            </button>
                        </>
                    )}
                </div>
            )}
        </div>
      ) : null}
    </div>
  )
}

export default ProfileDropdown
