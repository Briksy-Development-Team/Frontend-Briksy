export type StatCardTrend = {
  value: number | string;
  isPositive?: boolean;
  isNeutral?: boolean;
  period?: string;
};

export type StatCardProps = {
  label: string;
  value: string | number;
  icon?: React.ReactNode | string;
  trend?: StatCardTrend | null;
  changePercent?: number | string | null;
  changePeriod?: string;
  isPositive?: boolean;
  isNeutral?: boolean;
  className?: string;
  style?: React.CSSProperties;
  tone?: string;
};

export type StatCardData = StatCardProps;

export type StatGridItem =
  | StatCardProps
  | [string, string | number, (string | number)?, string?];

export type DashboardStatGridProps = {
  items: StatGridItem[];
  columns?: number;
  className?: string;
  style?: React.CSSProperties;
};

export function computeTrend(
  series: Array<Record<string, unknown>> | undefined,
  key: string,
  fallback = "+8%"
): { value: string; isPositive: boolean; isNeutral: boolean; period: string } {
  if (series && series.length >= 2) {
    const curr = Number(series[series.length - 1]?.[key] ?? 0);
    const prev = Number(series[series.length - 2]?.[key] ?? 0);
    if (prev > 0) {
      const diff = Math.round(((curr - prev) / prev) * 100);
      if (diff === 0) {
        return { value: "0%", isPositive: false, isNeutral: true, period: "vs. last 30 days" };
      }
      return {
        value: `${diff > 0 ? "+" : ""}${diff}%`,
        isPositive: diff > 0,
        isNeutral: false,
        period: "vs. last 30 days",
      };
    }
  }

  const isNeg = fallback.startsWith("-");
  const isNeu = fallback.includes("0%") || fallback.startsWith("—");
  return {
    value: fallback,
    isPositive: !isNeg && !isNeu,
    isNeutral: isNeu,
    period: "vs. last 30 days",
  };
}
