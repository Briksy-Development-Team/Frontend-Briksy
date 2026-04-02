import { Route, Routes } from 'react-router-dom'
import Profile from '../profile/Profile'
import Home from '../home/Home'
<<<<<<< Updated upstream
import Navbar from '../navbar/Navbar'
import { profileData } from '../data/profileDummydata'
=======
import Login from '../login-signup/login/Login'
import MainLayout from './MainLayout'
import SignUp from '../login-signup/signup/SignUp'
import Forgot from '../login-signup/forgot/Forgot'
import ProtectedRoute from './ProtectedRoute'
>>>>>>> Stashed changes

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
<<<<<<< Updated upstream
                <Route path='/profile' element={<Profile dark={dark} />} />
            </Routes>
=======
            </Route>

            <Route element={<ProtectedRoute />}>
                <Route element={<MainLayout dark={dark} setDark={setDark} />}>
                    <Route path='/profile' element={<Profile dark={dark} />} />
                </Route>
            </Route>
>>>>>>> Stashed changes

        </div>
    )
}

export default AppRouter
