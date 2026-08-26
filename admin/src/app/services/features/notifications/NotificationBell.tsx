import { KTIcon } from "../../../../_metronic/helpers";
import { useRoleAccess } from "../../../modules/auth";
import { getRolePortalBaseRoute } from "../../../modules/auth/core/roleRoutes";
import { useNotifications } from "./useNotifications";
import { NotificationDropdown } from "./NotificationDropdown";

const NotificationBell = () => {
  const { isSuperAdmin } = useRoleAccess();
  const portalBase = getRolePortalBaseRoute(isSuperAdmin ? ["super_admin"] : ["admin"]);
  const { items, unreadCount, markRead, markAllRead } = useNotifications();
  const unreadItems = items.filter((item) => !item.read_at).slice(0, 5);

  return (
    <div className="app-navbar-item ms-1 ms-md-4">
      <div
        data-kt-menu-trigger="{default: 'click'}"
        data-kt-menu-attach="parent"
        data-kt-menu-placement="bottom-end"
        className="btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px position-relative"
      >
        <KTIcon iconName="notification-bing" className="fs-2" />
        {unreadCount > 0 ? (
          <span className="position-absolute top-0 start-100 translate-middle badge badge-circle badge-danger">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        ) : null}
      </div>
      <NotificationDropdown
        items={unreadItems}
        portalBase={portalBase}
        onMarkRead={markRead}
        onMarkAllRead={markAllRead}
      />
    </div>
  );
};

export { NotificationBell };
