import { useRef, useMemo } from "react";
import type { QueryParams } from "../../EntityList";
import type { FilterConfig } from "./FilterDropdown";

export type SummaryCardItem = {
  id: string;
  label: string;
  count: number | string;
  subtitle?: string;
  dotColor?: string;
  active?: boolean;
  filterKey?: string;
  filterValue?: unknown;
  onClick?: () => void;
};

type Props<T> = {
  data: T[];
  total: number;
  params: QueryParams;
  onFilterChange: (filters: Record<string, unknown>) => void;
  filtersConfig?: FilterConfig[];
  customCards?: SummaryCardItem[];
  entityName?: string;
};

const isPos = (v: unknown) => /^(verified|approved|published|active|1|true)$/i.test(String(v));
const isPend = (v: unknown) => /^(pending|pending review|draft|in review|0|false)$/i.test(String(v));
const isNeg = (v: unknown) => /^(rejected|archived|inactive|suspended)$/i.test(String(v));

export const SummaryFilters = <T extends Record<string, unknown>>({
  data,
  total,
  params,
  onFilterChange,
  customCards,
  entityName = "agencies",
}: Props<T>) => {
  // Ponytail: Store collection totals from API. These values NEVER change on clicking a card.
  const prevEntityRef = useRef(entityName);
  const countsRef = useRef<{ all: number; pos: number; pend: number; neg: number } | null>(null);

  if (prevEntityRef.current !== entityName) {
    prevEntityRef.current = entityName;
    countsRef.current = null;
  }

  // Detect status field name
  const sample = data[0] ?? {};
  const statusKey = "business_verification_status" in sample
    ? "business_verification_status"
    : "is_active" in sample
    ? "is_active"
    : "status" in sample
    ? "status"
    : null;

  const activeVal = statusKey ? params.filters?.[statusKey] : undefined;
  const hasFilter = activeVal !== undefined && activeVal !== "" && activeVal !== "all";

  // Lock in base totals ONLY when on the unfiltered view AND total is not a lingering filtered total (prevents split-second flicker during fetch transitions)
  if (!hasFilter && statusKey && total > 0 && total >= (countsRef.current?.all ?? 0)) {
    const pos = data.filter((d) => isPos(d[statusKey])).length;
    const pend = data.filter((d) => isPend(d[statusKey])).length;
    const neg = data.filter((d) => isNeg(d[statusKey])).length;

    countsRef.current = {
      all: total,
      pos: Math.max(pos, countsRef.current?.pos ?? 0),
      pend: Math.max(pend, countsRef.current?.pend ?? 0),
      neg: Math.max(neg, countsRef.current?.neg ?? 0),
    };
  }

  const cards = useMemo<SummaryCardItem[]>(() => {
    if (customCards?.length) return customCards;

    const allCount = countsRef.current?.all ?? total ?? data.length;
    if (!statusKey) {
      return [{ id: "all", label: `All ${entityName}`, count: allCount, subtitle: "Showing all records", dotColor: "#342511", active: true }];
    }

    // Static counts: never change when clicking a card
    const posCount = countsRef.current?.pos ?? data.filter((d) => isPos(d[statusKey])).length;
    const pendCount = countsRef.current?.pend ?? data.filter((d) => isPend(d[statusKey])).length;
    const negCount = countsRef.current?.neg ?? data.filter((d) => isNeg(d[statusKey])).length;

    const posLabel = statusKey === "business_verification_status" ? "Verified" : statusKey === "is_active" ? "Active" : "Published";
    const pendLabel = statusKey === "business_verification_status" ? "Pending verification" : statusKey === "is_active" ? "Inactive" : "Pending";
    const negLabel = "Rejected";

    const pct = allCount > 0 ? Math.round((posCount / allCount) * 100) : 0;

    return [
      {
        id: "all",
        label: `All ${entityName}`,
        count: allCount,
        subtitle: "Showing all records",
        dotColor: "#342511",
        active: !hasFilter,
        filterKey: statusKey,
        filterValue: undefined,
      },
      {
        id: "pos",
        label: posLabel,
        count: posCount,
        subtitle: `${pct}% of ${entityName}`,
        dotColor: "#1F7A4D",
        active: Boolean(hasFilter && isPos(activeVal)),
        filterKey: statusKey,
        filterValue: statusKey === "is_active" ? "1" : posLabel === "Verified" ? "verified" : "Published",
      },
      {
        id: "pend",
        label: pendLabel,
        count: pendCount,
        subtitle: "Needs an admin decision",
        dotColor: "#8A5A00",
        active: Boolean(hasFilter && isPend(activeVal)),
        filterKey: statusKey,
        filterValue: statusKey === "is_active" ? "0" : pendLabel === "Pending verification" ? "pending" : "Pending Review",
      },
      {
        id: "neg",
        label: negLabel,
        count: negCount,
        subtitle: "Can re-apply after fixing",
        dotColor: "#B42318",
        active: Boolean(hasFilter && isNeg(activeVal)),
        filterKey: statusKey,
        filterValue: negLabel.toLowerCase(),
      },
    ];
  }, [customCards, data, total, entityName, hasFilter, activeVal, statusKey]);

  const handleClick = (card: SummaryCardItem) => {
    if (card.onClick) return card.onClick();
    if (!card.filterKey) return;
    const next = { ...(params.filters ?? {}) };
    if (card.filterValue === undefined) delete next[card.filterKey];
    else next[card.filterKey] = card.filterValue;
    onFilterChange(next);
  };

  return (
    <div className="briksy-summary-grid">
      {cards.map((c) => (
        <div
          key={c.id}
          className={`briksy-summary-card ${c.active ? "briksy-summary-card--active" : ""}`}
          onClick={() => handleClick(c)}
          role="button"
          tabIndex={0}
        >
          <div className="briksy-card-label-row">
            <span className="briksy-dot" style={{ backgroundColor: c.dotColor ?? "#342511" }} />
            <span className="briksy-card-label">{c.label}</span>
          </div>
          <div className="briksy-card-count">{c.count}</div>
          {c.subtitle && <div className="briksy-card-subtitle">{c.subtitle}</div>}
        </div>
      ))}
    </div>
  );
};
