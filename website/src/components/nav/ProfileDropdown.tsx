import { Menu, HelpCircle, LogOut } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Place from "../../assets/place holder/place.svg";
import Notification from "../../assets/icons/profile/notification.svg"

const ProfileDropdown = () => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const close = (e: MouseEvent) => {
            if (document.body.style.position === "fixed") return;

            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const handleLoginNav = () => {
        setDropdownOpen(false);
        navigate("/admin/login");
    };

    const handleComingSoonNav = () => {
        setDropdownOpen(false);
        navigate("/coming-soon");
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="p-2 rounded-3xl space-x-2 border bg-white flex items-center justify-center transition-colors 
                   
                    border-gray-300 text-gray-800"
            >
                <Menu size={20} />
                <img loading="lazy" src={Place} alt="profile" />
            </button>

            {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-[#88867A] py-2 z-50">
                    <button
                        onClick={() => { navigate('/help-support') }}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                        <HelpCircle size={20} className="text-gray-800" strokeWidth={1.5} />
                        <span className="font-semibold text-gray-900 text-sm">
                            Help Or Contact Us
                        </span>
                    </button>
                    <div className="border-t border-gray-100 mx-5" />
                    <button
                        onClick={() => { navigate('/notification') }}
                        className="w-full flex items-center gap-3 px-5 py-4 hover:bg-gray-50 transition-colors"
                    >
                        <img src={Notification} alt="" />
                        <span className="font-semibold text-gray-900 text-sm">
                            Notifications
                        </span>
                    </button>
                    <div className="border-t border-gray-100 mx-5" />
                    <button
                        onClick={() => { navigate('/profile') }}
                        className="w-full text-left px-5 py-4 text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                    >
                        View Profile
                    </button>
                    <div className="border-t border-gray-100 mx-5" />
                    <div className="px-5 py-4">
                        <button
                            onClick={handleComingSoonNav}
                            className="w-full text-left text-sm font-medium text-gray-900 hover:underline"
                        >
                            Become a Agent/Agency
                        </button>
                        <button
                            onClick={handleComingSoonNav}
                            className="w-full text-left text-sm text-gray-400 mt-1 hover:underline"
                        >
                            Open Agent/ Agency Panel
                        </button>
                    </div>
                    <div className="border-t border-gray-100 mx-5" />
                    <button
                        onClick={handleLoginNav}
                        className="w-full text-left px-5 py-3 text-sm text-gray-400 hover:bg-gray-50 transition-colors"
                    >
                        Login/SignUp
                    </button>
                    <button
                        onClick={handleLoginNav}
                        className="w-full flex items-center gap-3 px-5 py-3 text-red-500 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={18} />
                        <span className="font-semibold text-sm">Logout</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProfileDropdown;
