import { Route, Routes } from 'react-router-dom'
import Profile from '../profile/Profile'
import Home from '../home/Home'
import Login from '../login-signup/login/Login'
import MainLayout from './MainLayout'
import SignUp from '../login-signup/signup/SignUp'
import Forgot from '../login-signup/forgot/Forgot'
import ProtectedRoute from './ProtectedRoute'

const AppRouter = ({ dark, setDark }: AppRouterProps) => {
    return (
        <Routes>
            <Route element={<MainLayout dark={dark} setDark={setDark} />}>
                <Route path='/' element={<Home dark={dark} />} />
                <Route element={<ProtectedRoute />}>
                    <Route path='/profile' element={<Profile dark={dark} />} />
                </Route>
            </Route>

            {/* Routes WITHOUT Navbar */}
            <Route path='/login' element={<Login dark={dark} />} />
            <Route path='/register' element={<SignUp dark={dark} />} />
            <Route path='/forgot' element={<Forgot dark={dark} />} />


        </Routes>
    )
}

export default AppRouter
