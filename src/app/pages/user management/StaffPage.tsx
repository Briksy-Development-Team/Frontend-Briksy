import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import { useDebounce } from "use-debounce";

import { useDispatch, useSelector } from "react-redux";
import { fetchStaff } from "../../services/features/staff/staffSlice";
import { RootState, AppDispatch } from "../../services/store";

import {
  EntityList, QueryParams,
} from "../../modules/apps/shared_table/entity-list/EntityList";
import { StaffColumns } from "../../services/features/staff/staffColumns";
import { StaffFilters } from "../../services/features/staff/staffFilter";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";

const StaffList = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, total, error } = useSelector(
    (state: RootState) => state.staff
  );

  const [search, setSearch] = useState("");

  const [debouncedSearch] = useDebounce(search, 400);

  const [params, setParams] = useState<QueryParams>({
    page: 1,
    per_page: 10,
    search: "",
    filters: {},
    sort: "",
    direction: "asc",
  });

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: debouncedSearch,
      page: 1,
    }));
  }, [debouncedSearch]);

  useEffect(() => {
    dispatch(fetchStaff(params));
  }, [params]);

  const handleParamsChange = (next: QueryParams) => {
    if (next.search !== params.search) {
      setSearch(next.search);
      return;
    }

    setParams(next);
  };

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

      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={StaffColumns}
        filtersConfig={StaffFilters}
        enableRowClick
        getRowLink={(row: any) => `/apps/staff-management/staff/${row.id}`}
      />

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