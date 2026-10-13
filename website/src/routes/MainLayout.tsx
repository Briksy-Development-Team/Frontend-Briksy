import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Footer from '../components/footer/Footer';
import Navbar from '../components/nav/Navbar';
import LocationPermissionPrompt from '../components/location/LocationPermissionPrompt';

const HIDE_NAV_MOBILE = ['/property/', '/builder/', '/profile/', '/notification', '/help-support', '/company-details','/terms', '/service', '/privacy-policy'];
const MainLayout = () => {
    const [mode, setMode] = useState<"collapsed" | "search" | "ai">("collapsed");
    const location = useLocation();
    const hasHero = location.pathname === '/' || location.pathname === '/home';
    const hideOnMobile = HIDE_NAV_MOBILE.some(r => location.pathname.startsWith(r));

    return (
        <div>
            <Navbar mode={mode} setMode={setMode} hasHero={hasHero} hideOnMobile={hideOnMobile} />
            <Outlet context={{ mode, setMode }} />
            <Footer />
            <LocationPermissionPrompt />

        </div>
    )
}

export default MainLayout
