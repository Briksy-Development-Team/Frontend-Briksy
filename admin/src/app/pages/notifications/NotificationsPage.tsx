import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { useNotifications } from "../../services/features/notifications/useNotifications";
import { useRoleAccess } from "../../modules/auth";

const timeAgo = (dateStr?: string | null) => {
  if (!dateStr) return "—";
  const mins = Math.floor((Date.now() - new Date(dateStr).getTime()) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.floor(mins / 60)}h ago`;
  return `${Math.floor(mins / 1440)}d ago`;
};

const priorityBadge: Record<string, string> = {
  high: "badge-light-danger",
  medium: "badge-light-primary",
  low: "badge-light-secondary",
};

const NotificationsPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const navigate = useNavigate();
  const { items, unreadCount, loading, error, filter, search, page, total,
    lastPage, setFilter, setSearch, setPage, markRead, markAllRead, remove } = useNotifications();

  const title = isSuperAdmin ? "Platform Notifications" : "Notifications";
  const portalBase = isSuperAdmin ? "/super-admin" : "/admin";
  const visibleItems = useMemo(() => items, [items]);

  const openNotification = async (id: string, actionUrl?: string | null) => {
    await markRead(id);
    if (!actionUrl) return;
    if (actionUrl.startsWith("http")) { window.location.assign(actionUrl); return; }
    navigate(actionUrl);
  };

  return (
    <Content>
      <PageHeader title={title} subtitle="Track platform activity and account updates." />

      {/* Toolbar — outside the card */}
      <div className="d-flex flex-wrap gap-3 align-items-center justify-content-between mb-5">
        <div className="d-flex gap-2">
          {(["all", "unread", "high"] as const).map((key) => (
            <button
              key={key}
              className={`btn btn-sm ${filter === key ? "btn-primary" : "btn-light"}`}
              onClick={() => setFilter(key)}
            >
              {key === "all" ? "All" : key === "unread" ? `Unread${unreadCount > 0 ? ` (${unreadCount})` : ""}` : "High Priority"}
            </button>
          ))}
        </div>
        <div className="d-flex gap-2">
          <input
            className="form-control form-control-solid form-control-sm"
            style={{ width: 240 }}
            placeholder="Search notifications..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="btn btn-sm btn-light" onClick={markAllRead} disabled={unreadCount === 0}>
            Mark all read
          </button>
        </div>
      </div>

      <KTCard>
        <div className="card-body py-6">

          {/* States */}
          {loading && <div className="text-muted text-center py-10">Loading...</div>}
          {error && <div className="alert alert-danger">{error}</div>}
          {!loading && !error && visibleItems.length === 0 && (
            <div className="text-center py-10">
              <div className="text-gray-700 fw-bold fs-5 mb-1">No notifications</div>
              <div className="text-muted fs-7">Nothing matches your current filter.</div>
            </div>
          )}

          {/* List */}
          <div className="d-flex flex-column gap-3">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className="d-flex align-items-start gap-4 p-4 rounded cursor-pointer"
                style={{
                  border: `1.5px solid ${!item.read_at ? "rgba(245,85,26,0.25)" : "var(--kt-border-color)"}`,
                  borderLeft: !item.read_at ? "3px solid #f5551a" : undefined,
                  background: !item.read_at ? "rgba(245,85,26,0.03)" : "var(--kt-card-bg)",
                  transition: "box-shadow 0.15s",
                }}
                role="button"
                tabIndex={0}
                onClick={() => void openNotification(item.id, item.action_url)}
                onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(52,37,17,0.08)")}
                onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
              >
                {/* Dot */}
                <div className="mt-1">
                  <span style={{
                    display: "block", width: 8, height: 8, borderRadius: "50%",
                    background: !item.read_at ? "#f5551a" : "transparent",
                    border: item.read_at ? "1.5px solid var(--kt-border-color)" : "none",
                    flexShrink: 0,
                  }} />
                </div>

                {/* Body */}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-1 flex-wrap">
                    <span className={`fw-${!item.read_at ? "bold" : "semibold"} text-gray-800 fs-6`}>
                      {item.title}
                    </span>
                    <span className={`badge ${priorityBadge[item.priority] ?? "badge-light-secondary"}`}>
                      {item.priority}
                    </span>
                    {!item.read_at && <span className="badge badge-light-warning">Unread</span>}
                  </div>
                  <div className="text-muted fs-7 mb-1">{item.message}</div>
                  <div className="text-muted fs-8">{timeAgo(item.created_at)}</div>
                </div>

                {/* Actions */}
                <div className="d-flex gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                  {item.action_url && (
                    <button className="btn btn-sm btn-light-primary" onClick={() => void openNotification(item.id, item.action_url)}>
                      Open
                    </button>
                  )}
                  {!item.read_at && (
                    <button className="btn btn-sm btn-light" onClick={() => void markRead(item.id)}>
                      Read
                    </button>
                  )}
                  <button className="btn btn-sm btn-light-danger" onClick={() => void remove(item.id)}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {!loading && total > 0 && (
            <div className="d-flex justify-content-between align-items-center mt-6 flex-wrap gap-3">
              <span className="text-muted fs-7">
                Page {page} of {lastPage} · {total} total
              </span>
              <div className="d-flex gap-2">
                <button className="btn btn-sm btn-light" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
                  Previous
                </button>
                <button className="btn btn-sm btn-light" onClick={() => setPage(Math.min(lastPage, page + 1))} disabled={page >= lastPage}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="mt-6 pt-5 border-top">
            <Link to={`${portalBase}/settings`} className="text-primary fw-semibold fs-7">
              Manage notification preferences
            </Link>
          </div>

        </div>
      </KTCard>
    </Content>
  );
};

export default NotificationsPage;
