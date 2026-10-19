import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/footer/Footer';
import Navbar from '../components/nav/Navbar';
import BottomNav from '../mobile_app/navigation/BottomNav';
import LocationPermissionPrompt from '../components/location/LocationPermissionPrompt';
import { useIsMobileApp } from '../utils/platform';
import { useMobileWelcome } from '../utils/welcome';
import AppWelcome from '../mobile_app/pages/welcome/AppWelcome';

import { getNavbarVisibilityClass, isNavbarHiddenBelowMd, isBottomNavHidden } from './navConfig';

const MainLayout = () => {
    const [mode, setMode] = useState<"collapsed" | "search" | "ai">("collapsed");
    const location = useLocation();
    const navigate = useNavigate();
    const isApp = useIsMobileApp();
    const { showWelcome, completeWelcome } = useMobileWelcome(isApp);

    const hasHero = location.pathname === '/' || location.pathname === '/home';
    const hideOnMobile = isNavbarHiddenBelowMd(location.pathname);
    const navVisibilityClass = getNavbarVisibilityClass(location.pathname);
    const hideBottomNav = isBottomNavHidden(location.pathname);

    if (isApp) {
        if (showWelcome && hasHero) {
            return (
                <AppWelcome
                    onGetStarted={() => {
                        completeWelcome();
                        navigate('/');
                    }}
                    onLogin={() => {
                        completeWelcome();
                        navigate('/login');
                    }}
                />
            );
        }

        return (
            <div className="min-h-[100dvh]  flex flex-col ">
                <div className={`flex-1 min-h-[100dvh] ${hideBottomNav ? "" : "pb-16"}`}>
                    <Outlet context={{ mode, setMode, isApp, hideBottomNav, hideOnMobile }} />
                </div>
                {!hideBottomNav && <BottomNav />}
                <LocationPermissionPrompt />
            </div>
        );
    }

    return (
        <div className="min-h-screen   max-w-[2000px] mx-auto flex flex-col">
            <Navbar mode={mode} setMode={setMode} hasHero={hasHero} hideOnMobile={hideOnMobile} visibilityClass={navVisibilityClass} />
            <div className="flex-1">
                <Outlet context={{ mode, setMode, isApp, hideBottomNav, hideOnMobile }} />
            </div>
            <Footer />
            <LocationPermissionPrompt />
        </div>
    )
}

export default MainLayout
