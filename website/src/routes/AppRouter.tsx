import { Navigate, Route, Routes } from 'react-router-dom'
import Home from '../pages/home/Home'
import MainLayout from './MainLayout'
import Register from '../pages/auth/register/Register'


import Terms from "../pages/home/terms/Terms";
import Pricing from "../pages/home/subscription/Pricing";
import CheckoutInvitationPage from "../pages/checkout/CheckoutInvitationPage";
import SearchPage from "../pages/search/SearchPage";
import Error from "../components/error/Error";
import Coming from "../components/coming/Coming";
import Notification from "../components/notification/Notification.tsx";
import Help from "../components/help/Help.tsx";
import PropertyDetail from "../pages/detail/property/PropertyDetail";
import BuilderDetail from "../pages/detail/builder/BuilderDetail";
import BuilderProjectDetail from "../pages/detail/builder/BuilderProjectDetail";
import ServiceDetail from "../pages/detail/service/ServiceDetail";
import AgentDetail from "../pages/detail/agent/AgentDetail";
import Login from "../pages/auth/login/Login.tsx";
import ProtectedRoute from './ProtectedRoute.tsx'
import Profile from '../pages/profile/Profile.tsx'
import BlogsPage from "../pages/blogs/BlogsPage";
import BlogDetail from "../pages/blogs/BlogDetail";
import PublicInfoPage from "../pages/static/PublicInfoPage";
import Myprofile from "../components/profile-options/myprofile/Myprofile";
import Mysavedata from "../components/profile-options/mysavedata/Mysavedata";
import Mynotification from "../components/profile-options/mynotification/Mynotification";
import Myprivacy from "../components/profile-options/myprivacy/Myprivacy";
import CollectionsPage from "../components/profile-options/collections/CollectionsPage";
import CollectionDetailPage from "../components/profile-options/collections/CollectionDetailPage";
import MyCalendar from "../components/profile-options/calendar/MyCalendar";
import AppEnquiries from "../mobile_app/pages/enquiries/AppEnquiries";
const AppRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<Navigate to="/login" replace />} />

      <Route element={<MainLayout />}>
        <Route path="/terms" element={<Terms />} />
        <Route path="/subs" element={<Pricing />} />
        <Route path="/checkout/invite/:token" element={<CheckoutInvitationPage />} />
        <Route path="/checkout" element={<CheckoutInvitationPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="profile" element={<Profile />}>
            <Route index element={<Myprofile />} />
            <Route path="personal-info" element={<Myprofile />} />
            <Route path="saved-search" element={<Mysavedata />} />
            <Route path="collections" element={<CollectionsPage showBack={false} />} />
            <Route path="collections/:id" element={<CollectionDetailPage showBack={false} />} />
            <Route path="notifications" element={<Mynotification />} />
            <Route path="calendar" element={<MyCalendar />} />
            <Route path="privacy" element={<Myprivacy />} />
          </Route>
          <Route path="/saved" element={<CollectionsPage showBack={false} />} />
          <Route path="enquiries" element={<AppEnquiries />} />
          <Route path="profile/enquiries" element={<Navigate to="/enquiries" replace />} />
        </Route>
        <Route path="/calendar" element={<Navigate to="/profile/calendar" replace />} />
        <Route path="/collections" element={<Navigate to="/profile/collections" replace />} />

        <Route path="/privacy-policy" element={<Myprivacy />} />

        <Route path="/notification" element={<Notification />} />
        <Route path="/help-support" element={<Help />} />
        <Route path="/help" element={<Help />} />
        <Route path="/company-details" element={<PublicInfoPage kind="about" />} />
        <Route path="/how-we-verify" element={<PublicInfoPage kind="verification" />} />
        <Route path="/privacy-policy" element={<PublicInfoPage kind="privacy" />} />
        <Route path="/cookie-policy" element={<PublicInfoPage kind="cookies" />} />
        <Route path="/list-your-business" element={<Navigate to="/register" replace />} />

        <Route path="/" element={<Home />} />

        <Route path="/result" element={<SearchPage />} />
        <Route path="/buy" element={<SearchPage />} />
        <Route path="/sold" element={<SearchPage />} />
        <Route path="/rent" element={<SearchPage />} />
        <Route path="/builders" element={<SearchPage />} />
        <Route path="/agents" element={<SearchPage />} />
        <Route path="/professionals" element={<SearchPage />} />
        <Route path="/commercials" element={<SearchPage />} />
        <Route path="/auction" element={<SearchPage />} />
        <Route path="/auctions" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/auction/:id" element={<PropertyDetail />} />
        <Route path="/builder/:id" element={<BuilderDetail />} />
        <Route path="/agent/:id" element={<AgentDetail />} />
        <Route path="/builder-project/:id" element={<BuilderProjectDetail />} />
        <Route path="/service/:id" element={<ServiceDetail />} />

        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/:id" element={<BlogDetail />} />
      </Route>
      <Route path="/error" element={<Error />} />
      <Route path="/coming-soon" element={<Coming />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default AppRouter
