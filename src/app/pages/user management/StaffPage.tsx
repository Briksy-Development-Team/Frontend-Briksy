import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../../services/features/staff/staffSlice";
import { RootState, AppDispatch } from "../../services/store";

import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { StaffColumns } from "../../services/features/staff/staffColumns";
import { StaffFilters } from "../../services/features/staff/staffFilter";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";

const StaffList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, total, loading, error } = useSelector(
    (state: RootState) => state.staff
  );

  const [params, setParams] = useState({
    page: 1,
    pageSize: 10,
    search: "",
    filters: {},
    sortBy: "",
    sortOrder: "asc" as "asc" | "desc",
  });

  useEffect(() => {
    dispatch(fetchStaff(params));
  }, [params, dispatch]);

  if (error) {
    return (
      <Content>
        <PageHeader title="Staff" subtitle="Manage all Staff" />
        <div>{error}</div>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Staff" subtitle="Manage all Staff" />
      {loading ? (
        <div>Loading...</div>
      ) : (
        <EntityList
          data={data}
          total={total}
          params={params}
          onParamsChange={setParams}
          columns={StaffColumns}
          filtersConfig={StaffFilters}
          searchableKeys={["name", "email"]}
          enableRowClick
          getRowLink={(row: any) => `/apps/staff-management/staff/${row.id}`}
        />
      )}
    </Content>
  );
};

const StaffPage = () => {
  return (
    <Routes>
      <Route index element={<StaffList />} />
      <Route path=":id" element={<GenericDetailPage />} />
    </Routes>
  );
};

export default StaffPage;