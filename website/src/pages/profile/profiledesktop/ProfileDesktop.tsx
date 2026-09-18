import { useEffect } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

import Notification from "../../../assets/icons/profile/notification.svg?react";
import Placeholder from "../../../assets/icons/profile/placeholder.svg?react";
import Save from "../../../assets/icons/profile/save.svg?react";
import Privacy from "../../../assets/icons/profile/privacy.svg?react";

const ProfileDesktop = () => {
    const location = useLocation();
    
    const currentSection = location.pathname.replace('/profile', '').replace('/', '') || 'personal-info';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentSection]);

    const profileData = [
        { id: "personal-info", label: "My profile", icon: Placeholder },
        { id: "saved-search", label: "Saved searches", icon: Save },
        { id: "notifications", label: "Notifications", icon: Notification },
        { id: "privacy", label: "Privacy", icon: Privacy },
    ];

    return (
        <div className="mt-28 w-full font-helvetica px-8 pb-16">
            <div className="flex w-full justify-around items-start">
                <div className="sticky top-32 w-[20%] pb-8">
                    <h1 className="pb-5 text-[1.875rem] font-medium text-primary-brown">
                        Profile
                    </h1>
                    <div className="space-y-3">
                        {profileData.map((item) => {
                            const Icon = item.icon;
                            const isActive = currentSection === item.id;
                            return (
                                <Link
                                    key={item.id}
                                    to={`/profile/${item.id}`}
                                    className={`flex w-full gap-4 rounded-xl border border-[#EDE8E4] px-4 py-5 transition-colors ${
                                        isActive ? "bg-primary-brown text-white" : "text-primary-brown hover:bg-[#EDE8E4]/50"
                                    }`}
                                >
                                    <Icon />
                                    <p>{item.label}</p>
                                </Link>
                            );
                        })}
                    </div>
                </div>
                <main className="w-[70%] pb-10">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default ProfileDesktop;
