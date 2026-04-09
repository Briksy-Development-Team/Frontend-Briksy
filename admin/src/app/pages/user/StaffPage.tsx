import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff, setStaffQuery } from "../../services/features/staff/staffSlice";
import { RootState, AppDispatch } from "../../services/store";
import { FilterValue } from "../../modules/apps/shared_table/entity-list/EntityList";

import { staffColumns } from "../../services/features/staff/staffColumns";
import { staffFilters } from "../../services/features/staff/staffFilters";

const StaffPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, query, pagination } = useSelector(
    (state: RootState) => state.staff
  );

  useEffect(() => {
    // Avoid repeated fetch loops caused by object identity changes in query.
    dispatch(
      fetchStaff({
        page: query.page ?? 1,
        per_page: query.per_page ?? 10,
        search: query.search,
        sort: query.sort,
        direction: query.direction,
        filter: query.filter,
      })
    );
  }, [dispatch, query.page, query.per_page, query.search, query.sort, query.direction, JSON.stringify(query.filter)]);

  const handleSearch = useCallback((search: string) => {
    dispatch(setStaffQuery({ search, page: 1 }));
  }, [dispatch]);

  const handleFiltersChange = useCallback((filters: Record<string, FilterValue>) => {
    dispatch(setStaffQuery({ filter: filters, page: 1 }));
  }, [dispatch]);

  const handleSortChange = useCallback(({ key, direction }: { key: string; direction: "asc" | "desc" }) => {
    dispatch(setStaffQuery({ sort: key, direction, page: 1 }));
  }, [dispatch]);

  const handlePaginationChange = useCallback((page: number, per_page: number) => {
    dispatch(setStaffQuery({ page, per_page }));
  }, [dispatch]);

  return (
    <Routes>
      <Route element={<Outlet />}>
        <Route
          path="staff"
          element={
            <Content>
              <PageHeader title="Staff" subtitle="Manage all staff" />
              {loading ? (
                <div>Loading...</div>
              ) : (
                <EntityList
                  data={data}
                  columns={staffColumns}
                  filtersConfig={staffFilters}
                  searchableKeys={["name", "email"]}
                  pagination={
                    pagination
                      ? {
                          page: pagination.current_page,
                          pageSize: pagination.per_page,
                          total: pagination.total,
                        }
                      : undefined
                  }
                  enableRowClick
                  getRowLink={(row: { id: number }) => `/apps/staff-management/staff/${row.id}`}
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
      <Route index element={<Navigate to="/apps/staff-management/staff" />} />
    </Routes>
  );
};

export default StaffPage;
