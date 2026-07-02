import type { Column } from "../../../modules/apps/shared_table/entity-list/EntityList";
import { formatDateTime } from "../../utils/dateFormat";
import type { ActivityLog } from "./activity-log.types";

const formatCellValue = (value: unknown) => (value ? String(value) : "—");

export const getActivityLogColumns = (isSuperAdmin: boolean) => {
  const columns: Column<ActivityLog>[] = [
    {
      Header: "Date/Time",
      accessor: "created_at",
      sortable: true,
      Cell: ({ value }) =>
        formatDateTime(typeof value === "string" ? value : undefined, {
          withRelative: false,
        }),
    },
    {
      Header: "User",
      accessor: "user_name",
      sortable: true,
      Cell: ({ row }) => (
        <div className="d-flex flex-column">
          <span className="fw-semibold">{row.user_name ?? "—"}</span>
          <span className="text-muted fs-7">{row.user_email ?? "—"}</span>
        </div>
      ),
    },
    {
      Header: "Role",
      accessor: "user_role",
      sortable: true,
      Cell: ({ value }) => formatCellValue(value),
    },
  ];

    if (isSuperAdmin) {
    columns.push({
      Header: "Organisation/Company",
      accessor: "organization",
      Cell: ({ value }) => {
        const organization = value as ActivityLog["organization"];
        return organization?.name ?? "—";
      },
    });
  }

  columns.push(
    {
      Header: "Action",
      accessor: "action",
      sortable: true,
      Cell: ({ value }) => formatCellValue(value),
    },
    {
      Header: "Module",
      accessor: "module",
      sortable: true,
      Cell: ({ value }) => formatCellValue(value),
    },
    {
      Header: "Description",
      accessor: "description",
      Cell: ({ value }) => formatCellValue(value),
    },
    {
      Header: "IP Address",
      accessor: "ip_address",
      sortable: true,
      Cell: ({ value }) => formatCellValue(value),
    },
  );

  return columns;
};

export const activityLogActions = [
  "login",
  "logout",
  "failed_login",
  "created",
  "updated",
  "deleted",
];

export const activityLogModules = [
  "auth",
  "organizations",
  "properties",
  "services",
  "users",
  "plans",
  "plan_requests",
  "coupons",
  "referral_programs",
  "orders",
  "email_templates",
  "settings",
];

export const activityLogRoles = [
  "super_admin",
  "admin",
  "admin_staff",
  "seeker",
];
