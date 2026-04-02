import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import { profileData } from '../data/profileDummydata'
import { useAuth } from '../auth/AuthContext'

interface MainLayoutProps {
    dark: boolean
    setDark: (value: boolean) => void
}

const MainLayout = ({ dark, setDark }: MainLayoutProps) => {
    const { user, isAuthenticated } = useAuth()

    return (
        <div className={`min-h-screen ${dark ? "bg-black text-white" : "bg-zinc-50 text-black"}`}>

            <Navbar
                dark={dark}
                setDark={setDark}
                avatar={isAuthenticated ? profileData.seeker.avatar : undefined}
                name={user?.name ?? profileData.seeker.name}
            />

            <Outlet />
        </div>
    )
}

export default MainLayout
