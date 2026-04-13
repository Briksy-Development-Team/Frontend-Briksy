import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSeekers } from "../../services/features/seeker/seekerSlice";
import { RootState, AppDispatch } from "../../services/store";

import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { seekerColumns } from "../../services/features/seeker/seekerColumns";
import { seekerFilters } from "../../services/features/seeker/SeekerFilter";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

const SeekerPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, total, loading, error } = useSelector(
    (state: RootState) => state.seeker
  );

  const [params, setParams] = useState({
    page: 1,
    per_page: 10,
    search: "",
    filters: {},
    sortBy: "",
    sortOrder: "asc" as "asc" | "desc",
  });

  useEffect(() => {
    dispatch(fetchSeekers(params));
  }, [params, dispatch]);

  if (error) {
    return (
      <Content>
        <PageHeader title="Seeker" subtitle="Manage all seekers" />
        <div>{error}</div>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Seeker" subtitle="Manage all seekers" />

      {loading ? (
        <div>Loading...</div>
      ) : (
        <EntityList
          data={data}
          total={total}
          params={params}
          onParamsChange={setParams}
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
  );
};

export default SeekerPage;