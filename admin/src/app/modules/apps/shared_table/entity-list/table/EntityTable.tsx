import { useState, useMemo, useEffect, Fragment } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { useTable, type HeaderGroup, type Row, type Cell, type Column as ReactTableColumn } from "react-table";
import type { Column as CustomColumn } from "../types";
import { usePermissionAccess } from "../../../../auth";

export type RowAction<T> = {
  label: string;
  className?: string;
  permission?: string;
  icon?: string;
  badge?: string | number;
  dividerBefore?: boolean;
  showIf?: (row: T) => boolean;
  onClick: (row: T) => void;
};

export type ProfileMediaKind = "duo" | "avatar" | "none";
export type ProfileTypeSetting = ProfileMediaKind | "auto";

interface ProfileInfo {
  kind: ProfileMediaKind;
  main?: string;
  logo?: string;
  avatar?: string;
  initials: string;
  logoInitials?: string;
  isTrader?: boolean;
  isVerified?: boolean;
}

type Props<T extends { id: string | number }> = {
  data: T[];
  columns: CustomColumn<T>[];
  enableRowClick?: boolean;
  getRowLink?: (row: T) => string;
  selectedRows?: Set<T["id"]>;
  onRowSelect?: (id: T["id"]) => void;
  onSelectAll?: (checked: boolean) => void;
  rowActions?: RowAction<T>[];
  profileType?: ProfileTypeSetting;
  entityName?: string;
};

const getImg = (val: unknown): string | undefined => {
  if (typeof val === "string" && val.trim()) return val;
  if (val && typeof val === "object" && "url" in val) return (val as { url?: string }).url;
  return undefined;
};

const getInitials = (s?: unknown, fb = "BK"): string =>
  typeof s === "string" && s.trim()
    ? s.trim().split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase()
    : fb;

const getProfile = (
  item: unknown,
  forcedKind: ProfileTypeSetting = "auto",
  entityName?: string
): ProfileInfo => {
  if (!item || typeof item !== "object") return { kind: "none", initials: "" };
  if (forcedKind === "none") return { kind: "none", initials: "" };
  const r = item as Record<string, unknown>;

  const isExplicitTrader =
    entityName === "traders" ||
    entityName === "professionals" ||
    entityName === "services" ||
    r.business_type === "solo_trader" ||
    (r.type as { slug?: string })?.slug === "trades-professionals" ||
    r.plan_family === "trades_professional" ||
    "service_area" in r ||
    "service_group_count" in r ||
    "avg_org_rating" in r ||
    (typeof r.category === "string" &&
      ["landscapers", "concreter", "fencing", "mortgage-brokers", "conveyancers", "building-and-pest"].includes(r.category));

  const isExplicitSeeker =
    entityName === "users" ||
    entityName === "seekers" ||
    "display_name" in r ||
    (Array.isArray(r.roles) && r.roles.includes("seeker")) ||
    ("email_verified_at" in r && "mobile_number" in r && !isExplicitTrader);

  if (forcedKind === "avatar" || (forcedKind === "auto" && (isExplicitTrader || isExplicitSeeker))) {
    const imgs = Array.isArray(r.images) ? r.images : [];
    const avatar =
      getImg(r.logo_url) ||
      getImg(r.avatar_url) ||
      getImg(r.profile_image_url) ||
      getImg(r.image) ||
      getImg(imgs[0]);
    const s = String(r.business_verification_status ?? r.status ?? "").toLowerCase();
    // Tick is ONLY on traders and professionals when verified/approved. Never on seekers, and never if rejected/unapproved.
    const isTrader = isExplicitTrader;
    const isVerified = isTrader && (r.is_verified === true || s === "verified" || s === "approved");

    return {
      kind: "avatar",
      avatar,
      initials: getInitials(r.display_name ?? r.name ?? r.title, "ST"),
      isTrader,
      isVerified,
    };
  }

  // Duo Media: Property, Builder, Real Estate Agency
  const isProperty = "listing_purpose" in r || "is_auction" in r || "property_category" in r || "bedroom_option" in r || "property_type" in r;
  const isBuilder = "project_type" in r || "builder_project_count" in r || "pending_builder_projects_count" in r || r.business_type === "builder";
  const isOrg = "pending_properties_count" in r || r.business_type === "real_estate_agency" || (r.banner_url && r.logo_url) || typeof r.business_type === "string";

  if (forcedKind === "duo" || (forcedKind === "auto" && (isProperty || isBuilder || isOrg))) {
    const imgs = Array.isArray(r.images) ? r.images : [];
    const main = getImg(imgs[0]) || getImg(r.banner_url) || getImg(r.image);
    const org = r.organization as { name?: string; logo_url?: string } | undefined;
    const logo = getImg(org?.logo_url) || getImg(r.logo_url) || getImg(r.builder_logo);
    return {
      kind: "duo",
      main,
      logo,
      initials: getInitials(r.title ?? r.name, "PR"),
      logoInitials: getInitials(org?.name ?? r.name, "BK"),
    };
  }

  return { kind: "none", initials: "" };
};

const DuoMedia = ({ p }: { p: ProfileInfo }) => {
  const [e1, setE1] = useState(false);
  const [e2, setE2] = useState(false);
  return (
    <div className="briksy-duo-container">
      <div className="briksy-duo-main">
        {p.main && !e1 ? (
          <img src={p.main} alt={p.initials} onError={() => setE1(true)} loading="lazy" />
        ) : (
          <div className="briksy-duo-placeholder">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
        )}
      </div>
      <div className="briksy-duo-logo">
        {p.logo && !e2 ? (
          <img src={p.logo} alt={p.logoInitials} onError={() => setE2(true)} loading="lazy" />
        ) : (
          <span>{p.logoInitials || p.initials}</span>
        )}
      </div>
    </div>
  );
};

const AvatarMedia = ({ p }: { p: ProfileInfo }) => {
  const [e, setE] = useState(false);
  return (
    <div className="briksy-avatar-container">
      <div className="briksy-avatar-main">
        {p.avatar && !e ? (
          <img src={p.avatar} alt={p.initials} onError={() => setE(true)} loading="lazy" />
        ) : (
          <span>{p.initials}</span>
        )}
      </div>
      {/* Tick ONLY on traders and professionals when verified/approved. If rejected or not approved, NO tick. Seekers NEVER have tick. */}
      {p.isTrader && p.isVerified && (
        <div className="briksy-avatar-badge briksy-avatar-badge--verified">
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none">
            <path d="M2.5 6.5L4.5 8.5L9.5 3.5" stroke="#FFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      )}
    </div>
  );
};

const renderStatusPill = (val: string) => {
  const s = val.trim().toLowerCase();
  const variant = ["verified", "approved", "published", "active"].includes(s)
    ? "verified"
    : ["pending", "pending review", "draft", "in review"].includes(s)
    ? "pending"
    : ["rejected", "archived", "inactive", "suspended"].includes(s)
    ? "rejected"
    : null;

  if (!variant) return val;
  return (
    <span className={`briksy-status-pill briksy-status-pill--${variant}`}>
      <span className="briksy-status-dot" />
      <span>{val}</span>
    </span>
  );
};

const renderActionIcon = (label: string, className?: string) => {
  const isDanger = className?.includes("text-danger") || /delete|remove|reject/i.test(label);
  const color = isDanger ? "#B42318" : "#342511";
  const l = label.toLowerCase();

  if (/view|detail|show/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    );
  }
  if (/edit|update|rename/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    );
  }
  if (/delete|remove|trash/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        <line x1="10" y1="11" x2="10" y2="17" />
        <line x1="14" y1="11" x2="14" y2="17" />
      </svg>
    );
  }
  if (/approve|verify|accept/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
    );
  }
  if (/reject|cancel/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18" />
        <line x1="6" y1="6" x2="18" y2="18" />
      </svg>
    );
  }
  if (/reinstate|restore|undo/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 7v6h6" />
        <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13" />
      </svg>
    );
  }
  if (/reason|info/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="16" x2="12" y2="12" />
        <circle cx="12" cy="8" r="1" fill={color} stroke="none" />
      </svg>
    );
  }
  if (/suspend|pause/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="10" y1="15" x2="10" y2="9" />
        <line x1="14" y1="15" x2="14" y2="9" />
      </svg>
    );
  }
  if (/review|listing|submission|document/i.test(l)) {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="4" fill={color} />
    </svg>
  );
};

export const EntityTable = <T extends { id: string | number }>({
  data,
  columns,
  enableRowClick = false,
  getRowLink,
  selectedRows = new Set(),
  onRowSelect,
  onSelectAll,
  rowActions,
  profileType = "auto",
  entityName,
}: Props<T>) => {
  const navigate = useNavigate();
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable<T>({ columns: columns as unknown as ReactTableColumn<T>[], data });
  const { hasPermission } = usePermissionAccess();

  const allSelected = data.length > 0 && selectedRows.size === data.length;
  const someSelected = selectedRows.size > 0 && selectedRows.size < data.length;
  const visibleActions = rowActions?.filter((a) => !a.permission || hasPermission(a.permission)) ?? [];

  const resolvedKind = useMemo<ProfileMediaKind>(() => {
    if (profileType !== "auto") return profileType;
    for (const item of data) {
      const k = getProfile(item, "auto", entityName).kind;
      if (k !== "none") return k;
    }
    return "none";
  }, [data, profileType, entityName]);

  const hasProfileCol = resolvedKind !== "none";

  const [activeMenu, setActiveMenu] = useState<{
    row: T;
    actions: RowAction<T>[];
    top: number;
    left: number;
  } | null>(null);

  useEffect(() => {
    if (!activeMenu) return;
    const close = () => setActiveMenu(null);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [activeMenu]);

  const handleDotsClick = (e: React.MouseEvent<HTMLButtonElement>, row: T, rowActionsList: RowAction<T>[]) => {
    e.stopPropagation();
    if (activeMenu?.row.id === row.id) {
      setActiveMenu(null);
      return;
    }
    const rect = e.currentTarget.getBoundingClientRect();
    const menuWidth = 232;
    let left = rect.right - menuWidth;
    if (left < 10) left = 10;
    if (left + menuWidth > window.innerWidth - 10) {
      left = window.innerWidth - menuWidth - 10;
    }

    const estHeight = rowActionsList.length * 40 + 20;
    const spaceBelow = window.innerHeight - rect.bottom;
    const flipUp = spaceBelow < estHeight && rect.top > estHeight;
    const top = flipUp ? Math.max(8, rect.top - estHeight - 4) : rect.bottom + 4;

    setActiveMenu({
      row,
      actions: rowActionsList,
      top,
      left,
    });
  };

  const handleRowClick = (row: T) => {
    if (!enableRowClick || !getRowLink) return;
    navigate(getRowLink(row), {
      state: { data: row, columns: columns.map((c) => ({ key: c.accessor, label: c.Header })) },
    });
  };

  const thBase: React.CSSProperties = {
    padding: "12px 20px",
    fontSize: "12px",
    fontWeight: 500,
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#7C5F42",
    background: "#F8F4EE",
    borderBottom: "1px solid #E7E7E4",
    whiteSpace: "nowrap",
    position: "sticky",
    top: 0,
    zIndex: 2,
  };

  const tdBase = (isClickable: boolean): React.CSSProperties => ({
    padding: "14px 20px",
    fontSize: "13.5px",
    color: "#342511",
    borderBottom: "1px solid #E7E7E4",
    whiteSpace: "nowrap",
    cursor: isClickable ? "pointer" : "default",
  });

  return (
    <div className="briksy-table-container">
      <table {...getTableProps()} className="briksy-table">
        <thead>
          {headerGroups.map((hg: HeaderGroup<T>) => {
            const { key, ...rest } = hg.getHeaderGroupProps();
            return (
              <tr key={key} {...rest}>
                {onRowSelect && (
                  <th style={{ ...thBase, width: 50, textAlign: "center", position: "sticky", left: 0, zIndex: 3, borderRight: "1.5px solid #E7E7E4" }}>
                    <div className="d-flex justify-content-center align-items-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        checked={allSelected}
                        ref={(el) => { if (el) el.indeterminate = someSelected; }}
                        onChange={(e) => onSelectAll?.(e.target.checked)}
                        style={{ borderRadius: 6, borderColor: "#E7E7E4" }}
                      />
                    </div>
                  </th>
                )}

                {hasProfileCol && (
                  <th style={{ ...thBase, width: resolvedKind === "duo" ? 96 : 68, textAlign: "center", padding: "12px 14px" }} className="briksy-th" />
                )}

                {hg.headers.map((col: HeaderGroup<T>) => {
                  const { key: colKey, ...restCol } = col.getHeaderProps();
                  return (
                    <th key={colKey} {...restCol} style={thBase} className="briksy-th">
                      {col.render("Header")}
                    </th>
                  );
                })}

                {visibleActions.length > 0 && (
                  <th style={{ ...thBase, width: 80, textAlign: "center" }} className="briksy-th">
                    Actions
                  </th>
                )}
              </tr>
            );
          })}
        </thead>

        <tbody {...getTableBodyProps()}>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (onRowSelect ? 1 : 0) + (hasProfileCol ? 1 : 0) + (visibleActions.length ? 1 : 0)}
                style={{ textAlign: "center", padding: "64px 20px", color: "#7C5F42", fontSize: 14 }}
              >
                No data found
              </td>
            </tr>
          ) : (
            rows.map((row: Row<T>) => {
              prepareRow(row);
              const { key: rowKey, ...restRow } = row.getRowProps();
              const isSelected = selectedRows.has(row.original.id);
              const isClickable = !!(enableRowClick && getRowLink);
              const actions = visibleActions.filter((a) => !a.showIf || a.showIf(row.original));
              const p = hasProfileCol ? getProfile(row.original, resolvedKind, entityName) : null;

              return (
                <tr
                  key={rowKey}
                  {...restRow}
                  onClick={() => handleRowClick(row.original)}
                  className={`briksy-tr ${isSelected ? "briksy-tr--selected" : ""} ${activeMenu?.row.id === row.original.id ? "briksy-tr--menu-open" : ""}`}
                >
                  {onRowSelect && (
                    <td
                      onClick={(e) => e.stopPropagation()}
                      className="briksy-td briksy-td-checkbox"
                      style={{ ...tdBase(false), position: "sticky", left: 0, zIndex: 1, textAlign: "center", borderRight: "1.5px solid #E7E7E4" }}
                    >
                      <div className="d-flex justify-content-center align-items-center">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onRowSelect(row.original.id)}
                          style={{ borderRadius: 6, borderColor: "#E7E7E4" }}
                        />
                      </div>
                    </td>
                  )}

                  {hasProfileCol && p && (
                    <td style={{ ...tdBase(isClickable), width: resolvedKind === "duo" ? 96 : 68, padding: "10px 14px", verticalAlign: "middle", textAlign: "center" }} className="briksy-td">
                      {p.kind === "duo" ? <DuoMedia p={p} /> : p.kind === "avatar" ? <AvatarMedia p={p} /> : null}
                    </td>
                  )}

                  {row.cells.map((cell: Cell<T>) => {
                    const { key: cellKey, ...restCell } = cell.getCellProps();
                    const isStatus = /status|verification/i.test(String(cell.column.id ?? cell.column.Header ?? ""));
                    return (
                      <td key={cellKey} {...restCell} style={tdBase(isClickable)} className="briksy-td">
                        {isStatus && typeof cell.value === "string" && cell.value.trim()
                          ? renderStatusPill(cell.value)
                          : cell.render("Cell")}
                      </td>
                    );
                  })}

                  {visibleActions.length > 0 && (
                    <td onClick={(e) => e.stopPropagation()} style={{ ...tdBase(false), textAlign: "center" }} className="briksy-td">
                      {actions.length > 0 ? (
                        <button
                          type="button"
                          className={`briksy-dots-btn ${activeMenu?.row.id === row.original.id ? "briksy-dots-btn--active" : ""}`}
                          aria-label="Row actions"
                          onClick={(e) => handleDotsClick(e, row.original, actions)}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <circle cx="5" cy="12" r="2" />
                            <circle cx="12" cy="12" r="2" />
                            <circle cx="19" cy="12" r="2" />
                          </svg>
                        </button>
                      ) : (
                        <span style={{ color: "#d2ccc4" }}>—</span>
                      )}
                    </td>
                  )}
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {activeMenu &&
        createPortal(
          <>
            <div
              className="briksy-menu-backdrop"
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(null);
              }}
            />
            <div
              className="briksy-action-menu"
              style={{
                top: activeMenu.top,
                left: activeMenu.left,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {activeMenu.actions.map((a, idx) => {
                const isDanger = a.className?.includes("text-danger") || /delete|remove/i.test(a.label);
                const prev = activeMenu.actions[idx - 1];
                const prevIsDanger = prev?.className?.includes("text-danger") || /delete|remove/i.test(prev?.label ?? "");
                const showDivider = (idx > 0 && isDanger && !prevIsDanger) || a.dividerBefore;

                return (
                  <Fragment key={a.label}>
                    {showDivider && <div className="briksy-action-divider" />}
                    <button
                      type="button"
                      className={`briksy-action-item ${isDanger ? "briksy-action-item--danger" : ""}`}
                      onClick={() => {
                        setActiveMenu(null);
                        a.onClick(activeMenu.row);
                      }}
                    >
                      <span className="briksy-action-icon">{renderActionIcon(a.label, a.className)}</span>
                      <span className="briksy-action-label">{a.label}</span>
                      {a.badge !== undefined && <span className="briksy-action-badge">{a.badge}</span>}
                    </button>
                  </Fragment>
                );
              })}
            </div>
          </>,
          document.body
        )}
    </div>
  );
};
