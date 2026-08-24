import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import Footer from '../components/footer/Footer';
import Navbar from '../components/nav/Navbar';

const MainLayout = () => {
    const [mode, setMode] = useState<"collapsed" | "search" | "ai">("collapsed");
    const location = useLocation();
    const hasHero = location.pathname === '/' || location.pathname === '/home';

    return (
        <div>
            <Navbar mode={mode} setMode={setMode} hasHero={hasHero} />
            <Outlet context={{ mode, setMode }} />
            <Footer />

        </div>
    )
}

export default MainLayout