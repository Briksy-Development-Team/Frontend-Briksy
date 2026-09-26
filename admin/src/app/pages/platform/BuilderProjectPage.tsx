import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axiosInstance from "../../services/api/axiosInstance";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { builderProjectConfig } from "../../services/features/builder_projects/builder_project.config";
import type { BuilderProject } from "../../services/features/builder_projects/builder_project.types";
import {
  BuilderProjectModal,
  type ProjectFormValues,
} from "../../services/features/builder_projects/component/BuilderProjectModal";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";

export default function BuilderProjectPage() {
  const location = useLocation();
  const isDetailPage = location.pathname.split("/").filter(Boolean).length > 2;
  const reviewMode = location.pathname.startsWith("/super-admin/");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [savingProject, setSavingProject] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<BuilderProject | null>(null);
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

  if (isDetailPage) {
    return <GenericDetailPage />;
  }

  const saveProject = async (values: ProjectFormValues) => {
    setSavingProject(true);
    setError(null);
    setNotice(null);
    try {
      if (editingProject) {
        await axiosInstance.post(`/admin/builder-projects/${editingProject.id}`, toProjectFormData(values, true));
      } else {
        await axiosInstance.post("/admin/builder-projects", toProjectFormData(values));
      }
      setShowProjectModal(false);
      setEditingProject(null);
      setNotice(editingProject
        ? "Project updated successfully. It will be reviewed again before publication."
        : "Project submitted successfully. It will be published after Super Admin review.");
      await fetchProjects(params);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? (editingProject ? "Unable to update this project." : "Unable to add this project."));
    } finally {
      setSavingProject(false);
    }
  };

  const deleteProject = async (id: string) => {
    if (!window.confirm("Delete this builder project?")) return;

    setError(null);
    setNotice(null);
    try {
      await axiosInstance.delete(`/admin/builder-projects/${id}`);
      setNotice("Project deleted successfully.");
      await fetchProjects(params);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Unable to delete this project.");
    }
  };

  const deleteProjectMedia = async (mediaId: string) => {
    if (!window.confirm("Delete this project media?")) return;
    await axiosInstance.delete(`/media/${mediaId}`);
    setEditingProject((current) => current ? {
      ...current,
      images: current.images?.filter((media) => media.id !== mediaId),
      videos: current.videos?.filter((media) => media.id !== mediaId),
    } : current);
  };

  const isPendingReview = (row: BuilderProject) =>
    String(row.status ?? "").trim().toLowerCase().replace(/_/g, " ") === "pending review";

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
        getRowLink={(row) => `${reviewMode ? "/super-admin" : "/admin"}/builder-projects/${row.id}`}
        storageKey="builderProjectsColumns"
        headerActions={reviewMode ? [] : [
          {
            label: "Add Project",
            permission: "project.create",
            onClick: () => {
              setNotice(null);
              setEditingProject(null);
              setShowProjectModal(true);
            },
          },
        ]}
        rowActions={reviewMode ? [
          {
            label: "Approve & Publish",
            className: "text-success",
            showIf: isPendingReview,
            onClick: (row: BuilderProject) => void reviewProject(row.id, "approve"),
          },
          {
            label: "Reject",
            className: "text-danger",
            showIf: isPendingReview,
            onClick: (row: BuilderProject) => void reviewProject(row.id, "reject"),
          },
        ] : [
          {
            label: "Edit",
            permission: "project.update",
            onClick: (row: BuilderProject) => {
              setNotice(null);
              setEditingProject(row);
              setShowProjectModal(true);
            },
          },
          {
            label: "Delete",
            className: "text-danger",
            permission: "project.delete",
            onClick: (row: BuilderProject) => void deleteProject(row.id),
          },
        ]}
      />

      {showProjectModal && (
        <BuilderProjectModal
          initialValues={editingProject}
          isSubmitting={savingProject}
          onClose={() => {
            setShowProjectModal(false);
            setEditingProject(null);
          }}
          onSubmit={saveProject}
          onDeleteMedia={deleteProjectMedia}
        />
      )}
    </Content>
  );
}

const toProjectFormData = (payload: ProjectFormValues, methodOverride = false) => {
  const formData = new FormData();
  formData.append("name", payload.name);
  formData.append("project_type", payload.project_type);
  formData.append("status", payload.status);
  formData.append("location", payload.location);
  formData.append("state", payload.state);
  formData.append("postcode", payload.postcode);
  formData.append("description", payload.description);
  if (payload.latitude !== "" && payload.latitude !== null && payload.latitude !== undefined) formData.append("latitude", String(payload.latitude));
  if (payload.longitude !== "" && payload.longitude !== null && payload.longitude !== undefined) formData.append("longitude", String(payload.longitude));
  payload.images.forEach((file) => formData.append("images[]", file));
  payload.videos.forEach((file) => formData.append("videos[]", file));
  if (methodOverride) formData.append("_method", "PUT");
  return formData;
};
