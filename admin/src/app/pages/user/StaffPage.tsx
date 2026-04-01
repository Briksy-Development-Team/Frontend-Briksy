import { Route, Routes, Outlet, Navigate } from "react-router-dom";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

import { useEffect } from "react";
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
    dispatch(fetchStaff(query));
  }, [dispatch, query]);

  const handleSearch = (search: string) => {
    dispatch(setStaffQuery({ search, page: 1 }));
  };

  const handleFiltersChange = (filters: Record<string, FilterValue>) => {
    dispatch(setStaffQuery({ filter: filters, page: 1 }));
  };

  const handleSortChange = ({ key, direction }: { key: string; direction: "asc" | "desc" }) => {
    dispatch(setStaffQuery({ sort: key, direction, page: 1 }));
  };

  const handlePaginationChange = (page: number, per_page: number) => {
    dispatch(setStaffQuery({ page, per_page }));
  };

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
