import { KTIcon } from "../../../../../_metronic/helpers";
import { formatDateTime } from "../../../utils/dateFormat";
import type { ActivityLog } from "../activity-log.types";

type Props = {
  log: ActivityLog;
  onClose: () => void;
};

const formatValue = (value: unknown) => {
  if (value === null || value === undefined || value === "") {
    return "—";
  }

  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  return JSON.stringify(value, null, 2);
};

const renderJsonBlock = (value: Record<string, unknown> | null) => {
  if (!value || Object.keys(value).length === 0) {
    return <span className="text-muted">—</span>;
  }

  return (
    <pre className="bg-light rounded p-4 mb-0 text-dark" style={{ whiteSpace: "pre-wrap" }}>
      {JSON.stringify(value, null, 2)}
    </pre>
  );
};

const ActivityLogDetailModal = ({ log, onClose }: Props) => {
  const keys = Array.from(
    new Set([
      ...Object.keys(log.old_values ?? {}),
      ...Object.keys(log.new_values ?? {}),
    ]),
  );

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.65)", zIndex: 1080 }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <div>
              <h2 className="fw-bolder mb-1">Activity Log Details</h2>
              <div className="text-muted fs-6">{formatDateTime(log.created_at, { withRelative: false })}</div>
            </div>
            <button type="button" className="btn btn-icon btn-sm btn-active-icon-primary" onClick={onClose}>
              <KTIcon iconName="cross" className="fs-1" />
            </button>
          </div>

          <div className="modal-body">
            <div className="row g-5">
              <div className="col-lg-6">
                <div className="card card-flush h-100">
                  <div className="card-header">
                    <h3 className="card-title">Overview</h3>
                  </div>
                  <div className="card-body">
                    <div className="mb-4">
                      <div className="text-muted fs-7">User</div>
                      <div className="fw-semibold">{log.user_name ?? "—"}</div>
                      <div className="text-muted fs-7">{log.user_email ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">Role</div>
                      <div className="fw-semibold">{log.user_role ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">Organisation/Company</div>
                      <div className="fw-semibold">{log.organization?.name ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">Action</div>
                      <div className="fw-semibold">{log.action}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">Module</div>
                      <div className="fw-semibold">{log.module ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">Description</div>
                      <div className="fw-semibold">{log.description ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">HTTP Method</div>
                      <div className="fw-semibold">{log.method ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">Route</div>
                      <div className="fw-semibold">{log.route ?? "—"}</div>
                    </div>
                    <div className="mb-4">
                      <div className="text-muted fs-7">IP Address</div>
                      <div className="fw-semibold">{log.ip_address ?? "—"}</div>
                    </div>
                    <div>
                      <div className="text-muted fs-7">User Agent</div>
                      <div className="fw-semibold text-break">{log.user_agent ?? "—"}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-lg-6">
                <div className="card card-flush mb-5">
                  <div className="card-header">
                    <h3 className="card-title">Metadata</h3>
                  </div>
                  <div className="card-body">{renderJsonBlock(log.metadata)}</div>
                </div>

                <div className="card card-flush">
                  <div className="card-header">
                    <h3 className="card-title">Value Changes</h3>
                  </div>
                  <div className="card-body">
                    {keys.length === 0 ? (
                      <div className="text-muted">No field changes were captured.</div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-row-dashed align-middle gs-0 gy-3">
                          <thead>
                            <tr className="text-start text-muted fw-bold fs-7 text-uppercase">
                              <th>Field</th>
                              <th>Old Value</th>
                              <th>New Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {keys.map((key) => (
                              <tr key={key}>
                                <td className="fw-semibold">{key}</td>
                                <td className="text-break">
                                  {formatValue(log.old_values?.[key])}
                                </td>
                                <td className="text-break">
                                  {formatValue(log.new_values?.[key])}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export { ActivityLogDetailModal };
