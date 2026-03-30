import { Outlet } from 'react-router-dom'
import Navbar from '../navbar/Navbar'
import { profileData } from '../data/profileDummydata'

const MainLayout = ({ dark, setDark }: any) => {
    return (
        <div className={`min-h-screen ${dark ? "bg-black text-white" : "bg-zinc-50 text-black"}`}>

            <Navbar
                dark={dark}
                setDark={setDark}
                avatar={profileData.seeker.avatar}
                name={profileData.seeker.name}
            />

            <Outlet />
        </div>
    )
}

export default MainLayout