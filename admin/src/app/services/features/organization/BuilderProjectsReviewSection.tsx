import { useCallback, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { buildApiParams } from "../../utils/buildApiParams";
import { EntityList } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { useEntityTable } from "../../../modules/apps/shared_table/hooks/useEntityTable";
import { builderProjectConfig } from "../builder_projects/builder_project.config";
import type { BuilderProject } from "../builder_projects/builder_project.types";

export default function BuilderProjectsReviewSection({ data }: { data: any }) {
  const [projects, setProjects] = useState<BuilderProject[]>([]);
  const [total, setTotal] = useState(0);
  const [message, setMessage] = useState<string | null>(null);

  const fetchProjects = useCallback(async (params: any) => {
    if (!data?.id) return;

    try {
      const response = await axiosInstance.get<any>("/super-admin/builder-projects", {
        params: buildApiParams({
          ...params,
          filters: { ...(params.filters ?? {}), organization_id: data.id },
        }),
      });
      const payload = response.data?.data;
      const items = Array.isArray(payload) ? payload : payload?.data ?? payload?.items ?? [];
      setProjects(items);
      setTotal(response.data?.meta?.pagination?.total ?? payload?.total ?? items.length);
      setMessage(null);
    } catch {
      setProjects([]);
      setTotal(0);
      setMessage("Builder projects could not be loaded.");
    }
  }, [data?.id]);

  const { params, handleParamsChange } = useEntityTable(fetchProjects);

  const review = async (project: BuilderProject, action: "approve" | "reject") => {
    const rejection_reason = action === "reject"
      ? window.prompt("Reason for rejecting this project:")?.trim()
      : undefined;
    if (action === "reject" && !rejection_reason) return;

    try {
      await axiosInstance.patch(
        `/super-admin/builder-projects/${project.id}/${action}`,
        rejection_reason ? { rejection_reason } : undefined,
      );
      await fetchProjects(params);
    } catch (reason: any) {
      setMessage(reason?.response?.data?.message ?? "Unable to update this project.");
    }
  };

  if (message && projects.length === 0) {
    return <div className="alert alert-warning mb-0">{message}</div>;
  }

  return (
    <>
      {message ? <div className="alert alert-warning">{message}</div> : null}
      <EntityList
        data={projects}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={builderProjectConfig.columns}
        filtersConfig={builderProjectConfig.filters}
        enableRowClick
        getRowLink={(row) => `/super-admin/builder-projects/${row.id}`}
        storageKey="organizationBuilderProjectsColumns"
        rowActions={[
          {
            label: "Approve & Publish",
            className: "text-success",
            onClick: (project) => void review(project, "approve"),
          },
          {
            label: "Reject",
            className: "text-danger",
            onClick: (project) => void review(project, "reject"),
          },
        ]}
      />
    </>
  );
}
