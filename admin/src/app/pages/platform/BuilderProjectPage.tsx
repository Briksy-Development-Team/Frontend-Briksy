import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
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

export default function BuilderProjectPage() {
  const location = useLocation();
  const reviewMode = location.pathname.startsWith("/super-admin/");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  const [savingProperty, setSavingProperty] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [data, setData] = useState<BuilderProject[]>([]);
  const [total, setTotal] = useState(0);

  const fetchProjects = useCallback(async (params?: any) => {
    setError(null);
    try {
      const response = await axiosInstance.get<{ data: { data: BuilderProject[]; total?: number } }>(
        reviewMode ? "/super-admin/builder-projects" : "/admin/builder-projects",
        { params }
      );
      const items = response.data.data.data ?? [];
      setData(items);
      setTotal(response.data.data.total ?? items.length);
    } catch {
      setError("Builder projects could not be loaded.");
    }
  }, [reviewMode]);

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
      setNotice("Project submitted successfully. It will be published after Super Admin review.");
      await fetchProjects(params);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this project.");
    } finally {
      setSavingProject(false);
    }
  };

  const reviewProject = async (id: string, action: "approve" | "reject") => {
    const rejection_reason = action === "reject"
      ? window.prompt("Reason for rejecting this project:") ?? ""
      : undefined;
    if (action === "reject" && !rejection_reason?.trim()) return;

    setError(null);
    try {
      await axiosInstance.patch("/super-admin/builder-projects/" + id + "/" + action, rejection_reason
        ? { rejection_reason }
        : undefined);
      setNotice(action === "approve" ? "Project approved and published." : "Project rejected.");
      await fetchProjects(params);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to update this project.");
    }
  };

  const saveProperty = async (values: PropertyFormValues) => {
    setSavingProperty(true);
    setError(null);
    setNotice(null);
    try {
      await createPropertyApi(values);
      setShowPropertyModal(false);
      setNotice("Property submitted successfully. It will be published after Super Admin review.");
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to add this property.");
    } finally {
      setSavingProperty(false);
    }
  };

  return (
    <Content>
      <PageHeader
        title={reviewMode ? "Builder Project Reviews" : "Builder Projects"}
        subtitle={reviewMode ? "Review projects submitted by builders" : "Manage and view residential and commercial developments"}
      />

      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={builderProjectConfig.columns}
        filtersConfig={builderProjectConfig.filters}
        enableRowClick={!reviewMode}
        getRowLink={(row) => `/admin/builder-projects/${row.id}`}
        storageKey="builderProjectsColumns"
        headerActions={reviewMode ? [] : [
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
        rowActions={reviewMode ? [
          {
            label: "Approve & Publish",
            className: "text-success",
            showIf: (row: BuilderProject) => row.status === "Pending Review",
            onClick: (row: BuilderProject) => void reviewProject(row.id, "approve"),
          },
          {
            label: "Reject",
            className: "text-danger",
            showIf: (row: BuilderProject) => row.status === "Pending Review",
            onClick: (row: BuilderProject) => void reviewProject(row.id, "reject"),
          },
        ] : undefined}
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
}
