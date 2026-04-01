import { Route, Routes, Outlet, Navigate, useParams } from "react-router-dom";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import EntityDetail from "../../modules/apps/shared_table/entity-list/components/EntityDetail";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrganizations, setOrganizationQuery } from "../../services/features/organization/organizationSlice";
import { RootState, AppDispatch } from "../../services/store";
import { FilterValue } from "../../modules/apps/shared_table/entity-list/EntityList";
import { organizationColumns } from "../../services/features/organization/organizationColumns";
import { organizationFilters } from "../../services/features/organization/organizationFilters";

const ServicePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, query, pagination } = useSelector(
    (state: RootState) => state.organization
  );

  useEffect(() => {
    dispatch(fetchOrganizations(query));
  }, [dispatch, query]);

  const handleSearch = (search: string) => {
    dispatch(setOrganizationQuery({ search, page: 1 }));
  };

  const handleFiltersChange = (filters: Record<string, FilterValue>) => {
    dispatch(setOrganizationQuery({ filter: filters, page: 1 }));
  };

  const handleSortChange = ({ key, direction }: { key: string; direction: "asc" | "desc" }) => {
    dispatch(setOrganizationQuery({ sort: key, direction, page: 1 }));
  };

  const handlePaginationChange = (page: number, per_page: number) => {
    dispatch(setOrganizationQuery({ page, per_page }));
  };

  return (
    <Routes>
      <Route element={<Outlet />}>

        <Route
          path="agencies"
          element={
            <Content>
              <PageHeader title="Agencies" subtitle="Manage all agencies on the platform" />
              {loading ? (
                <div>Loading...</div>
              ) : (
                <EntityList
                  data={data}
                  columns={organizationColumns}
                  filtersConfig={organizationFilters}
                  searchableKeys={["name", "email"]}
                  enableRowClick
                  getRowLink={(row: { id: number }) => `/apps/business-management/agencies/${row.id}`}
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

        <Route path="agencies/:id" element={<AgencyDetail />} />

      </Route>

      <Route index element={<Navigate to="/apps/business-management/agencies" />} />
    </Routes>
  );
};

const AgencyDetail = () => {
  const { id } = useParams();
  const { data } = useSelector((state: RootState) => state.organization);
  const agency = data.find((item: any) => item.id === Number(id));

  const detailFields = [
    { key: "id", label: "ID" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "status", label: "Status" },
    { key: "organization_type.name", label: "Type" },
  ];

  return (
    <Content>
      <PageHeader title="Agency Details" />

      <EntityDetail title="Agency Details" data={agency || null} fields={detailFields} />
    </Content>
  );
};

export default ServicePage;
