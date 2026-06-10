import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import { fetchSeekers } from "../../services/features/seeker/seekerSlice";
import { seekerConfig } from "../../services/features/seeker/seeker.config";
import type { RootState, AppDispatch } from "../../services/store";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";

const SeekerList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, total, error } = useSelector((s: RootState) => s.seeker);

  const { params, handleParamsChange } = useEntityTable(
    (p) => dispatch(fetchSeekers(p))
  );

  if (error) return (
    <Content>
      <PageHeader title="Seekers" subtitle="All registered seekers" />
      <div className="text-danger">{error}</div>
    </Content>
  );

  return (
    <Content>
      <PageHeader title="Seekers" subtitle="All registered seekers" />
      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={seekerConfig.columns}
        filtersConfig={seekerConfig.filters}
        enableRowClick
        getRowLink={(row) => `/seekers/${row.id}`}
      />
    </Content>
  );
};

const SeekerPage = () => (
  <Routes>
    <Route index element={<SeekerList />} />
    <Route path=":id" element={<GenericDetailPage />} />
  </Routes>
);

export default SeekerPage;