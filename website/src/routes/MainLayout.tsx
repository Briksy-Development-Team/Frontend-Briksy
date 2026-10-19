import { useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Footer from '../components/footer/Footer';
import Navbar from '../components/nav/Navbar';
import BottomNav from '../mobile_app/navigation/BottomNav';
import LocationPermissionPrompt from '../components/location/LocationPermissionPrompt';
import { useIsMobileApp } from '../utils/platform';
import { useMobileWelcome } from '../utils/welcome';
import AppWelcome from '../mobile_app/pages/welcome/AppWelcome';

const HIDE_NAV_MOBILE = ['/property/', '/builder/', '/notification', '/help-support', '/company-details', '/terms', '/service', '/privacy-policy', '/enquiries', '/saved'];
const HIDE_BOTTOM_NAV_ROUTES = ['/checkout'];

const MainLayout = () => {
    const [mode, setMode] = useState<"collapsed" | "search" | "ai">("collapsed");
    const location = useLocation();
    const navigate = useNavigate();
    const isApp = useIsMobileApp();
    const { showWelcome, completeWelcome } = useMobileWelcome(isApp);

    const hasHero = location.pathname === '/' || location.pathname === '/home';
    const hideOnMobile = HIDE_NAV_MOBILE.some(r => location.pathname.startsWith(r));
    const hideBottomNav = HIDE_BOTTOM_NAV_ROUTES.some(r => location.pathname.startsWith(r));

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
        <div className="min-h-screen bg-[#F8F4EE] flex flex-col">
            <Navbar mode={mode} setMode={setMode} hasHero={hasHero} hideOnMobile={hideOnMobile} />
            <div className="flex-1">
                <Outlet context={{ mode, setMode, isApp }} />
            </div>
            <Footer />
            <LocationPermissionPrompt />
        </div>
    )
}

export default MainLayout
