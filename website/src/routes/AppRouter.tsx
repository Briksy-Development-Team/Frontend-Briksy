import { Navigate, Route, Routes } from "react-router-dom";
import Profile from "../pages/profile/Profile";
import Home from "../pages/home/Home";
import MainLayout from "./MainLayout";
import Register from "../pages/auth/register/Register";

import Terms from "../pages/home/terms/Terms";
import Pricing from "../pages/home/subscription/Pricing";
import SearchPage from "../pages/search/SearchPage";
import Error from "../components/error/Error";
import Coming from "../components/coming/Coming";
import Notification from "../components/notification/Notification.tsx";
import Help from "../components/help/Help.tsx";
import PropertyDetail from "../pages/detail/property/PropertyDetail";
import BuilderDetail from "../pages/detail/builder/BuilderDetail";
import ServiceDetail from "../pages/detail/service/ServiceDetail";

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/terms" element={<Terms />} />
        <Route path="/subs" element={<Pricing />} />

        
        <Route path="/profile" element={<Profile />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/help-support" element={<Help />} />

        <Route path="/" element={<Home />} />

        <Route path="/result" element={<SearchPage />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/builder/:id" element={<BuilderDetail />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
      </Route>
      <Route path="/error" element={<Error />} />
      <Route path="/coming-soon" element={<Coming />} />
      <Route path="/login" element={<Navigate to="/admin/login" replace />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AppRouter;
