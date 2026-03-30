import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeekers } from "../../services/features/seeker/seekerSlice";
import { RootState } from "../../services/store";

import { seekerColumns } from "../../services/features/seeker/seekerColumns";
import { seekerFilters } from "../../services/features/seeker/SeekerFilter";

const SeekerPage = () => {
    const dispatch = useDispatch();
    const { data, loading } = useSelector(
        (state: RootState) => state.seeker
    );

    useEffect(() => {
        dispatch(fetchSeekers());
    }, [dispatch]);

    return (
        <Routes>
            <Route element={<Outlet />}>

                <Route
                    path="seeker"
                    element={
                        <Content>
                            <PageHeader
                                title="Seeker"
                                subtitle="Manage all seekers"
                            />

                            {loading ? (
                                <div>Loading...</div>
                            ) : (
                                <EntityList
                                    data={data}
                                    columns={seekerColumns}
                                    filtersConfig={seekerFilters}
                                    searchableKeys={["name", "email"]}
                                    enableRowClick
                                    getRowLink={(row: any) =>
                                        `/apps/seeker-management/seeker/${row.id}`
                                    }
                                />
                            )}
                        </Content>
                    }
                />

            </Route>

            <Route
                index
                element={<Navigate to="/apps/seeker-management/seeker" />}
            />
        </Routes>
    );
};

export default SeekerPage;