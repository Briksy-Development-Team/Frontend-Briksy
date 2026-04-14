import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useDebounce } from "use-debounce";

import { fetchSeekers } from "../../services/features/seeker/seekerSlice";
import type { RootState, AppDispatch } from "../../services/store";
import type { Seeker } from "../../services/features/seeker/seeker.types";

import {
  EntityList,
  QueryParams,
} from "../../modules/apps/shared_table/entity-list/EntityList";

import { seekerColumns } from "../../services/features/seeker/seekerColumns";
import { seekerFilters } from "../../services/features/seeker/SeekerFilter";

import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";

const SeekerPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { data, total, error } = useSelector(
    (state: RootState) => state.seeker
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
    dispatch(fetchSeekers(params));
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
        <PageHeader title="Seeker" subtitle="Manage all seekers" />
        <div className="text-danger">{error}</div>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Seeker" subtitle="Manage all seekers" />

      <EntityList<Seeker>
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={seekerColumns}
        filtersConfig={seekerFilters}
        enableRowClick
        getRowLink={(row: Seeker) =>
          `/apps/seeker-management/seeker/${row.id}`
        }
      />
    </Content>
  );
};

export default SeekerPage;