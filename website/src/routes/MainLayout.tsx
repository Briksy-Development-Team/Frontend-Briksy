import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/footer/Footer';
import Navbar from '../components/nav/Navbar';
import BottomNav from '../mobile_app/navigation/BottomNav';
import LocationPermissionPrompt from '../components/location/LocationPermissionPrompt';
import { useIsMobileApp } from '../utils/platform';

const HIDE_NAV_MOBILE = ['/property/', '/builder/', '/profile/', '/notification', '/help-support', '/company-details','/terms', '/service', '/privacy-policy'];
const HIDE_BOTTOM_NAV_ROUTES = ['/checkout'];

const MainLayout = () => {
    const [mode, setMode] = useState<"collapsed" | "search" | "ai">("collapsed");
    const location = useLocation();
    const isApp = useIsMobileApp();

    const hasHero = location.pathname === '/' || location.pathname === '/home';
    const hideOnMobile = HIDE_NAV_MOBILE.some(r => location.pathname.startsWith(r));
    const hideBottomNav = HIDE_BOTTOM_NAV_ROUTES.some(r => location.pathname.startsWith(r));

    if (isApp) {
        return (
            <div className="min-h-[100dvh] flex flex-col bg-[#F8F4EE]">
                <div className={`flex-1 min-h-[100dvh] ${hideBottomNav ? "" : "pb-16"}`}>
                    <Outlet context={{ mode, setMode, isApp }} />
                </div>
                {!hideBottomNav && <BottomNav />}
                <LocationPermissionPrompt />
            </div>
        );
    }

    return (
        <div>
            <Navbar mode={mode} setMode={setMode} hasHero={hasHero} hideOnMobile={hideOnMobile} />
            <Outlet context={{ mode, setMode, isApp }} />
            <Footer />
            <LocationPermissionPrompt />
        </div>
    )
}

export default MainLayout
