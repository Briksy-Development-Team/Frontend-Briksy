import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { EntityList, FilterValue } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeekers, setSeekerQuery } from "../../services/features/seeker/seekerSlice";
import { RootState, AppDispatch } from "../../services/store";

import { seekerColumns } from "../../services/features/seeker/seekerColumns";
import { seekerFilters } from "../../services/features/seeker/SeekerFilter";

const SeekerPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { data, loading, query, pagination } = useSelector(
        (state: RootState) => state.seeker
    );

    useEffect(() => {
        // Avoid repeated fetch loops caused by object identity changes in query.
        dispatch(
            fetchSeekers({
                page: query.page ?? 1,
                per_page: query.per_page ?? 10,
                search: query.search,
                sort: query.sort,
                direction: query.direction,
                filter: query.filter,
            })
        )
    }, [dispatch, query.page, query.per_page, query.search, query.sort, query.direction, JSON.stringify(query.filter)]);

    const handleSearch = useCallback((search: string) => {
        dispatch(setSeekerQuery({ search, page: 1 }));
    }, [dispatch]);

    const handleFiltersChange = useCallback((filters: Record<string, FilterValue>) => {
        dispatch(setSeekerQuery({ filter: filters, page: 1 }));
    }, [dispatch]);

    const handleSortChange = useCallback(({ key, direction }: { key: string; direction: "asc" | "desc" }) => {
        dispatch(setSeekerQuery({ sort: key, direction, page: 1 }));
    }, [dispatch]);

    const handlePaginationChange = useCallback((page: number, per_page: number) => {
        dispatch(setSeekerQuery({ page, per_page }));
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
                                    getRowLink={(row: { id: number }) =>
                                        `/apps/seeker-management/seeker/${row.id}`
                                    }
                                    onSearch={handleSearch}
                                    onFiltersChange={handleFiltersChange}
                                    onSortChange={handleSortChange}
                                    onPaginationChange={handlePaginationChange}
                                />
                            )}

                            {pagination && (
                                <div className="mt-3 text-end text-muted">
                                    Page {pagination.current_page} of {pagination.last_page} ({pagination.total} records)
                                </div>
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