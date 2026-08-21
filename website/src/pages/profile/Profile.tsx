import { useState, useEffect } from "react";

import Notification from "../../assets/icons/profile/notification.svg?react";
import Placeholder from "../../assets/icons/profile/placeholder.svg?react";
import Save from "../../assets/icons/profile/save.svg?react";
import Privacy from "../../assets/icons/profile/privacy.svg?react";
import Account from "../../assets/icons/profile/account.svg?react";

import Myprofile from "../../components/profile-options/myprofile/Myprofile";
import Mysavedata from "../../components/profile-options/mysavedata/Mysavedata";
import Mynotification from "../../components/profile-options/mynotification/Mynotification";
import Myprivacy from "../../components/profile-options/myprivacy/Myprivacy";
import Myaccounts from "../../components/profile-options/myaccounts/Myaccounts";

const Profile = () => {
    const [selectedProfile, setSelectedProfile] = useState("profile");

    
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [selectedProfile]);

    const profileData = [
        {
            id: "profile",
            label: "My profile",
            icon: Placeholder,
            show: Myprofile,
        },
        {
            id: "saved-searches",
            label: "Saved searches",
            icon: Save,
            show: Mysavedata,
        },
        {
            id: "notifications",
            label: "Notifications",
            icon: Notification,
            show: Mynotification,
        },
        {
            id: "privacy",
            label: "Privacy",
            icon: Privacy,
            show: Myprivacy,
        },
        {
            id: "accounts",
            label: "Accounts",
            icon: Account,
            show: Myaccounts,
        },
    ];

    const selectedItem = profileData.find(
        (item) => item.id === selectedProfile
    );

    const SelectedComponent = selectedItem?.show;

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
                            const isActive = selectedProfile === item.id;

                            return (
                                <button
                                    key={item.id}
                                    onClick={() => setSelectedProfile(item.id)}
                                    className={`flex w-full gap-4 rounded-xl border border-[#EDE8E4] px-4 py-5 transition-colors ${isActive
                                        ? "bg-primary-brown text-white"
                                        : "text-primary-brown hover:bg-[#EDE8E4]/50"
                                        }`}
                                >
                                    <Icon />
                                    <p>{item.label}</p>
                                </button>
                            );
                        })}
                    </div>
                </div>

                <main className="w-[70%] pb-10">
                    {SelectedComponent && <SelectedComponent />}
                </main>

            </div>
        </div>
    );
};

export default Profile;