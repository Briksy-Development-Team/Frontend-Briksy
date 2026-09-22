import { useCallback, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import axiosInstance from "../../services/api/axiosInstance";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import PropertyModal from "../../services/features/properties/component/PropertyModal";
import { createPropertyApi } from "../../services/features/properties/property.api";
import type { PropertyFormValues } from "../../services/features/properties/property.types";
import { builderProjectConfig } from "../../services/features/builder_projects/builder_project.config";
import type { BuilderProject } from "../../services/features/builder_projects/builder_project.types";
import {
  BuilderProjectModal,
  type ProjectFormValues,
} from "../../services/features/builder_projects/component/BuilderProjectModal";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";

const BuilderProjectList = () => {
  const [data, setData] = useState<BuilderProject[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const [savingProject, setSavingProject] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const fetchProjects = useCallback(async (params?: any) => {
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: { data: BuilderProject[]; total?: number } }>(
        "/admin/builder-projects",
        { params }
      );
      const items = response.data.data.data ?? [];
      setData(items);
      setTotal(response.data.data.total ?? items.length);
    } catch {
      setError("Builder projects could not be loaded.");
    }
  }, []);

  const { params, handleParamsChange } = useEntityTable(fetchProjects);

  useEffect(() => {
    void fetchProjects(params);
  }, [fetchProjects, params]);

  const saveProject = async (values: ProjectFormValues) => {
    setSavingProject(true);
    setError(null);
    setNotice(null);
    try {
      await axiosInstance.post("/admin/builder-projects", values);
      setShowProjectModal(false);
      setNotice("Project added successfully.");
      await fetchProjects(params);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this project.");
    } finally {
      setSavingProject(false);
    }
  };

  const saveProperty = async (values: PropertyFormValues) => {
    setSavingProperty(true);
    setError(null);
    setNotice(null);
    try {
      await createPropertyApi(values);
      setShowPropertyModal(false);
      setNotice("Property added successfully. It will appear in your property listings after review.");
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this property.");
    } finally {
      setSavingProperty(false);
    }
  };

  return (
    <Content>
      <PageHeader
        title="Builder Projects"
        subtitle="Manage and view residential and commercial developments"
      />

      {error && <div className="alert alert-danger mb-5">{error}</div>}
      {notice && <div className="alert alert-success mb-5">{notice}</div>}

      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={builderProjectConfig.columns}
        filtersConfig={builderProjectConfig.filters}
        enableRowClick
        getRowLink={(row) => `/admin/builder-projects/${row.id}`}
        storageKey="builderProjectsColumns"
        headerActions={[
          {
            label: "Add Property",
            onClick: () => {
              setNotice(null);
              setShowPropertyModal(true);
            },
          },
          {
            label: "Add Project",
            onClick: () => {
              setNotice(null);
              setShowProjectModal(true);
            },
          },
        ]}
      />

      {showProjectModal && (
        <BuilderProjectModal
          isSubmitting={savingProject}
          onClose={() => setShowProjectModal(false)}
          onSubmit={saveProject}
        />
      )}

      {showPropertyModal && (
        <PropertyModal
          isSubmitting={savingProperty}
          onClose={() => setShowPropertyModal(false)}
          onSubmit={saveProperty}
        />
      )}
    </Content>
  );
};

export default function BuilderProjectPage() {
  return (
    <Routes>
      <Route index element={<BuilderProjectList />} />
      <Route path=":id" element={<GenericDetailPage />} />
    </Routes>
  );
}
