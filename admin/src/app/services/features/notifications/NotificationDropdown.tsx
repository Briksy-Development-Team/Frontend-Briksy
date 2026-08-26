import { Link } from "react-router-dom";
import type { PlatformNotification } from "./notifications.types";

type Props = {
  items: PlatformNotification[];
  portalBase: string;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
};

const NotificationDropdown = ({ items, portalBase, onMarkRead, onMarkAllRead }: Props) => {
  return (
    <div className="menu menu-sub menu-sub-dropdown menu-column w-375px w-lg-425px" data-kt-menu="true">
      <div className="p-5 border-bottom bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <div className="fw-bold fs-5">Notifications</div>
            <div className="text-muted fs-7">Latest unread activity</div>
          </div>
          <button type="button" className="btn btn-sm btn-light" onClick={onMarkAllRead}>
            Mark all read
          </button>
        </div>
      </div>
      <div className="max-h-350px overflow-auto">
        {items.length === 0 ? (
          <div className="p-5 text-center text-muted">No unread notifications.</div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="d-flex flex-stack px-5 py-4 border-bottom">
              <div className="me-3">
                <div className="fw-semibold text-gray-800">{item.title}</div>
                <div className="text-muted fs-7 text-truncate" style={{ maxWidth: 240 }}>
                  {item.message}
                </div>
              </div>
              <div className="d-flex flex-column align-items-end gap-2">
                <span className={`badge badge-light-${item.priority === "high" ? "danger" : item.priority === "low" ? "secondary" : "primary"}`}>
                  {item.priority}
                </span>
                <button type="button" className="btn btn-sm btn-light" onClick={() => onMarkRead(item.id)}>
                  Read
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="p-4 border-top d-flex justify-content-between align-items-center">
        <Link to={`${portalBase}/notifications`} className="btn btn-sm btn-primary">
          View all
        </Link>
        <span className="text-muted fs-8">{items.length} unread</span>
      </div>
    </div>
  );
};

export { NotificationDropdown };
