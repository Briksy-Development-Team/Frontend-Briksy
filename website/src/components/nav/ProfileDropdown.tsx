import { Menu, HelpCircle, LogOut, MessageSquare } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Place from "../../assets/place holder/place.svg";

const ProfileDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

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
                onClick={() => setDropdownOpen((v) => !v)}
                className="p-2 rounded-3xl space-x-2 border bg-white flex items-center justify-center transition-colors border-gray-300 text-gray-800"
            >
                <Menu size={20} />
                <img loading="lazy" src={Place} alt="profile" />
            </button>

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
    );
};

export default ProfileDropdown;
