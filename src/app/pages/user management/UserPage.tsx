import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import SoloPage from "./user/SoloPage"
import OrganizationPage from "./user/OrganizationPage"
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage"

const UserPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route path="organization" element={<OrganizationPage />} />
        <Route path="organization/:id" element={<GenericDetailPage />} />

        <Route path="solo" element={<SoloPage />} />
        <Route path="solo/:id" element={<GenericDetailPage />} />

        <Route index element={<Navigate to="dashboard" />} />
      </Route>
    </Routes>
  )
}

export default UserPage