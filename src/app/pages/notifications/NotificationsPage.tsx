import { useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { KTCard } from "../../../_metronic/helpers";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { useNotifications } from "../../services/features/notifications/useNotifications";
import { useRoleAccess } from "../../modules/auth";

const NotificationsPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const navigate = useNavigate();
  const {
    items,
    unreadCount,
    loading,
    error,
    filter,
    search,
    page,
    total,
    lastPage,
    setFilter,
    setSearch,
    setPage,
    markRead,
    markAllRead,
    remove,
  } = useNotifications();

  const title = isSuperAdmin ? "Platform Notifications" : "Notifications";
  const portalBase = isSuperAdmin ? "/super-admin" : "/admin";

  const visibleItems = useMemo(() => items, [items]);

  const openNotification = async (id: string, actionUrl?: string | null) => {
    await markRead(id);

    if (!actionUrl) {
      return;
    }

    if (actionUrl.startsWith("http://") || actionUrl.startsWith("https://")) {
      window.location.assign(actionUrl);
      return;
    }

    navigate(actionUrl);
  };

  return (
    <Content>
      <PageHeader title={title} subtitle="Track platform activity and account updates." />
      <KTCard>
        <div className="card-body">
          <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-5">
            <div className="btn-group">
              {(["all", "unread", "high"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  className={`btn btn-sm ${filter === item ? "btn-primary" : "btn-light"}`}
                  onClick={() => setFilter(item)}
                >
                  {item === "all" ? "All" : item === "unread" ? "Unread" : "High priority"}
                </button>
              ))}
            </div>

            <div className="d-flex gap-2">
              <input
                className="form-control form-control-solid"
                style={{ minWidth: 280 }}
                placeholder="Search title or message"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
              <button type="button" className="btn btn-light" onClick={markAllRead} disabled={unreadCount === 0}>
                Mark all read
              </button>
            </div>
          </div>

          {loading ? <div className="alert alert-light">Loading notifications...</div> : null}
          {error ? <div className="alert alert-danger">{error}</div> : null}

          {!loading && !error && visibleItems.length === 0 ? (
            <div className="alert alert-info mb-0">No notifications found.</div>
          ) : null}

          <div className="d-flex flex-column gap-3">
            {visibleItems.map((item) => (
              <div
                key={item.id}
                className={`card border ${item.read_at ? "" : "border-primary"} shadow-sm`}
                role="button"
                tabIndex={0}
                onClick={() => void openNotification(item.id, item.action_url)}
              >
                <div className="card-body d-flex justify-content-between gap-4">
                  <div>
                    <div className="d-flex flex-wrap gap-2 align-items-center mb-2">
                      <h4 className="mb-0 fs-6 fw-bold">{item.title}</h4>
                      <span className={`badge badge-light-${item.priority === "high" ? "danger" : item.priority === "low" ? "secondary" : "primary"}`}>
                        {item.priority}
                      </span>
                      {!item.read_at ? <span className="badge badge-light-warning">Unread</span> : null}
                    </div>
                    <div className="text-gray-700">{item.message}</div>
                    <div className="text-muted fs-8 mt-2">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : "Unknown time"}
                    </div>
                  </div>

                  <div className="d-flex flex-column gap-2 align-items-end">
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={(event) => {
                        event.stopPropagation();
                        void openNotification(item.id, item.action_url);
                      }}
                    >
                      Open
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light"
                      onClick={(event) => {
                        event.stopPropagation();
                        void markRead(item.id);
                      }}
                    >
                      Mark read
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-light text-danger"
                      onClick={(event) => {
                        event.stopPropagation();
                        void remove(item.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex flex-wrap justify-content-between align-items-center mt-5">
            <div className="text-muted fs-7">
              Showing page {page} of {lastPage}. Total notifications: {total}
            </div>
            <div className="btn-group">
              <button className="btn btn-light btn-sm" onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}>
                Previous
              </button>
              <button className="btn btn-light btn-sm" onClick={() => setPage(Math.min(lastPage, page + 1))} disabled={page >= lastPage}>
                Next
              </button>
            </div>
          </div>

          <div className="mt-5">
            <Link to={`${portalBase}/settings`} className="btn btn-sm btn-primary">
              Manage notification preferences
            </Link>
          </div>
        </div>
      </KTCard>
    </Content>
  );
};

export default NotificationsPage;
