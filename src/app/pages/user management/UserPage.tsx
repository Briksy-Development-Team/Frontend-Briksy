import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import SoloPage from "./user/SoloPage";
import OrganizationPage from "./user/OrganizationPage";

const UserPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>

                <Route path="organization/*" element={<OrganizationPage />} />

                <Route path="solo/*" element={<SoloPage />} />


                <Route index element={<Navigate to="dashboard" />} />

            </Route>
        </Routes>
    );
};

export default UserPage;