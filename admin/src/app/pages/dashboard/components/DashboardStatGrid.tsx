import React, { FC } from "react";
import { KTIcon } from "../../../../_metronic/helpers";
import type {
  StatCardProps,
  StatCardTrend,
  DashboardStatGridProps,
} from "./statUtils";
import "./DashboardStatGrid.css";

const renderIcon = (icon: React.ReactNode | string | undefined, label: string) => {
  if (React.isValidElement(icon)) {
    return icon;
  }
  if (typeof icon === "string") {
    return <KTIcon iconName={icon} className="fs-2 text-primary" />;
  }

  const l = (label || "").toLowerCase();
  if (
    l.includes("builder") ||
    l.includes("team") ||
    l.includes("member") ||
    l.includes("user") ||
    l.includes("agent") ||
    l.includes("seeker") ||
    l.includes("people")
  ) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (l.includes("verif") || l.includes("approv") || l.includes("secur")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <polyline points="9 12 11 14 15 10" />
      </svg>
    );
  }
  if (l.includes("pend") || l.includes("review") || l.includes("wait") || l.includes("time") || l.includes("clock")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
    );
  }
  if (l.includes("project") || l.includes("service") || l.includes("region") || l.includes("layer")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 2 7 12 12 22 7 12 2" />
        <polyline points="2 17 12 22 22 17" />
        <polyline points="2 12 12 17 22 12" />
      </svg>
    );
  }
  if (l.includes("subscription") || l.includes("data") || l.includes("plan")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <ellipse cx="12" cy="5" rx="9" ry="3" />
        <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
        <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
      </svg>
    );
  }
  if (l.includes("enquir") || l.includes("inquir") || l.includes("mail") || l.includes("message") || l.includes("sms")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  if (l.includes("compan") || l.includes("business") || l.includes("briefcase")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
      </svg>
    );
  }
  if (l.includes("order") || l.includes("cart") || l.includes("basket")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    );
  }
  if (l.includes("propert") || l.includes("listing") || l.includes("home")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    );
  }
  if (l.includes("revenue") || l.includes("money") || l.includes("dollar") || l.includes("aud") || l.includes("price")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    );
  }
  if (l.includes("referral") || l.includes("share")) {
    return (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    );
  }

  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  );
};

const resolveTrend = (
  trend?: StatCardTrend | null,
  changePercent?: number | string | null,
  changePeriod = "vs. last 30 days",
  isPositive?: boolean,
  isNeutral?: boolean
) => {
  if (trend === null || changePercent === null) {
    return null;
  }

  const rawVal = trend?.value ?? (changePercent !== undefined ? changePercent : "+8%");
  const period = trend?.period ?? changePeriod;

  if (rawVal === undefined || rawVal === "") {
    return null;
  }

  const str = String(rawVal).trim();
  const num = typeof rawVal === "number" ? rawVal : parseFloat(str.replace(/[^0-9.-]/g, ""));
  const validNum = !isNaN(num) ? num : 0;

  const neutral =
    trend?.isNeutral ??
    isNeutral ??
    (validNum === 0 && (str === "0%" || str === "0" || str.startsWith("—")));

  const positive =
    trend?.isPositive ??
    isPositive ??
    (validNum > 0 || str.startsWith("+"));

  let display: string;
  if (neutral) {
    display = "0%";
  } else if (str.endsWith("%")) {
    display = str.startsWith("+") || str.startsWith("-") ? str : `${positive ? "+" : "-"}${str}`;
  } else {
    display = `${positive ? "+" : "-"}${Math.abs(validNum)}%`;
  }

  return {
    isPositive: positive && !neutral,
    isNeutral: neutral,
    text: display,
    period,
  };
};

export const DashboardStatCard: FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend,
  changePercent,
  changePeriod = "vs. last 30 days",
  isPositive,
  isNeutral,
  className = "",
  style,
}) => {
  const resolvedTrend = resolveTrend(trend, changePercent, changePeriod, isPositive, isNeutral);
  const renderedIcon = renderIcon(icon, label);

  return (
    <div className={`briksy-stat-card ${className}`} style={style}>
      <div className="d-flex align-items-start gap-3">
        <div className="briksy-stat-icon-wrapper flex-shrink-0">
          {renderedIcon}
        </div>
        <div className="d-flex flex-column min-w-0 flex-grow-1">
          <div className="briksy-stat-value">
            {value}
          </div>
          <div className="briksy-stat-label" title={label}>
            {label}
          </div>
        </div>
      </div>

      {resolvedTrend && (
        <div className="briksy-stat-trend">
          <span
            className={
              resolvedTrend.isNeutral
                ? "briksy-stat-trend--neutral"
                : resolvedTrend.isPositive
                ? "briksy-stat-trend--positive"
                : "briksy-stat-trend--negative"
            }
          >
            {resolvedTrend.isNeutral ? (
              "—"
            ) : resolvedTrend.isPositive ? (
              "↑"
            ) : (
              "↓"
            )}{" "}
            {resolvedTrend.text}
          </span>
          <span className="briksy-stat-period">{resolvedTrend.period}</span>
        </div>
      )}
    </div>
  );
};

export const DashboardStatGrid: FC<DashboardStatGridProps> = ({
  items,
  columns,
  className = "",
  style,
}) => {
  const count = items.length;
  if (count === 0) return null;

  const cols = columns ?? (count <= 4 ? count : Math.min(count, 6));

  const normalizedItems: StatCardProps[] = items.map((item) => {
    if (Array.isArray(item)) {
      const [label, value, changePercent, changePeriod] = item;
      return {
        label,
        value,
        changePercent,
        changePeriod: changePeriod ?? "vs. last 30 days",
      };
    }
    return item;
  });

  const gridStyle: React.CSSProperties = {
    ...style,
    ...({ "--stat-grid-cols": cols } as React.CSSProperties),
  };

  return (
    <div className={`briksy-stat-grid ${className}`} style={gridStyle}>
      {normalizedItems.map((item, idx) => (
        <DashboardStatCard key={item.label || idx} {...item} />
      ))}
    </div>
  );
};

export default DashboardStatGrid;
