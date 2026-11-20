import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { usePermissionAccess } from "../../../../../auth";

export type BreadcrumbItem = {
  label: string;
  path?: string;
};

type Props = {
  title: string;
  subtitle?: string;
  breadcrumbs?: (string | BreadcrumbItem)[];
  onExport?: () => void;
  exportLabel?: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    permission?: string;
    icon?: ReactNode;
  }>;
  children?: ReactNode;
};

const PageHeader = ({
  title,
  subtitle,
  breadcrumbs,
  onExport,
  exportLabel = "Export",
  actions,
  children,
}: Props) => {
  const { hasPermission } = usePermissionAccess();

  const visibleActions =
    actions?.filter((a) => !a.permission || hasPermission(a.permission)) ?? [];

  return (
    <div className="briksy-page-header">
      <div className="briksy-header-titles">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="briksy-breadcrumbs" aria-label="Breadcrumb">
            {breadcrumbs.map((crumb, idx) => {
              const label = typeof crumb === "string" ? crumb : crumb.label;
              const path = typeof crumb === "string" ? undefined : crumb.path;
              const isLast = idx === breadcrumbs.length - 1;

              return (
                <span key={`${label}-${idx}`} className="d-inline-flex align-items-center gap-1">
                  {path && !isLast ? (
                    <Link to={path} className="briksy-breadcrumb-item">
                      {label}
                    </Link>
                  ) : (
                    <span className="briksy-breadcrumb-item">{label}</span>
                  )}
                  {!isLast && <span className="briksy-breadcrumb-separator">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        <h1 className="briksy-page-title">{title}</h1>

        {subtitle && <p className="briksy-page-subtitle">{subtitle}</p>}
      </div>

      <div className="briksy-header-actions">
        {onExport && (
          <button
            type="button"
            className="briksy-btn-secondary"
            onClick={onExport}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            <span>{exportLabel}</span>
          </button>
        )}

        {visibleActions.map((action) => (
          <button
            key={action.label}
            type="button"
            className="briksy-btn-primary"
            onClick={action.onClick}
          >
            {action.icon ?? (
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            )}
            <span>{action.label}</span>
          </button>
        ))}

        {children}
      </div>
    </div>
  );
};

export { PageHeader };
