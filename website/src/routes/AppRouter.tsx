import { Route, Routes } from 'react-router-dom'
import Profile from '../profile/Profile'
import Home from '../home/Home'
import Navbar from '../navbar/Navbar'
import { profileData } from '../data/profileDummydata'

interface AppRouterProps {
    dark: boolean
    setDark: (value: boolean) => void
}

const AppRouter = ({ dark, setDark }: AppRouterProps) => {
    return (
        <div className={`min-h-screen transition-colors duration-300 ${dark ? "bg-black text-white" : "bg-zinc-50 text-black"}`}>

            <Navbar
                dark={dark}
                setDark={setDark}
                avatar={profileData.seeker.avatar}
                name={profileData.seeker.name}
            />

            <Routes>
                <Route path='/' element={<Home dark={dark} />} />
                <Route path='/profile' element={<Profile dark={dark} />} />
            </Routes>

        </div>
    )
}

export default AppRouter