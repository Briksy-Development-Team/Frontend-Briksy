import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import MainLayout from './MainLayout'
import Login from '../pages/auth/login/Login'
import Register from '../pages/auth/register/Register'
import AccountLayout from '../pages/account/AccountLayout'
import AccountProfile from '../pages/account/Profile'
import LikedProperties from '../pages/account/LikedProperties'
import Inquiries from '../pages/account/Inquiries'

import Terms from '../pages/home/terms/Terms'
import Pricing from '../pages/home/subscription/Pricing'
import SearchPage from '../pages/search/SearchPage'
import Error from '../components/error/Error'
import Coming from '../components/coming/Coming'
import HomeB from '../pages/home/Home.tsx'
import Notification from '../components/notification/Notification.tsx'
import Help from '../components/help/Help.tsx'
import PropertyDetail from '../pages/detail/PropertyDetail'
import BuilderDetail from '../pages/detail/builder/BuilderDetail'
import ServiceDetail from '../pages/detail/service/ServiceDetail'
import ProtectedRoute from './ProtectedRoute'

const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<Navigate to="/login" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/terms" element={<Terms />} />
        <Route path="/subs" element={<Pricing />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<Navigate to="/account/profile" replace />} />
            <Route path="profile" element={<AccountProfile />} />
            <Route path="liked-properties" element={<LikedProperties />} />
            <Route path="inquiries" element={<Inquiries />} />
          </Route>
        </Route>

        <Route path="/profile" element={<Navigate to="/account/profile" replace />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/help-support" element={<Help />} />

        <Route path="/" element={<Home />} />
        <Route path="/v2" element={<HomeB />} />

        <Route path="/result" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/builder/:id" element={<BuilderDetail />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
      </Route>
      <Route path="/error" element={<Error />} />
      <Route path="/coming-soon" element={<Coming />} />
    </Routes>
  )
}

export default AppRouter
