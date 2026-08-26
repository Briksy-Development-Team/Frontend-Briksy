import { type ReactNode, useEffect, useRef } from "react";
import ApexCharts, { ApexOptions } from "apexcharts";
import { getCSSVariableValue } from "../../../../_metronic/assets/ts/_utils";
import { useThemeMode } from "../../../../_metronic/partials/layout/theme-mode/ThemeModeProvider";

type ChartSeries = {
  name: string;
  data: number[];
  color?: string;
  type?: "area" | "bar" | "line";
};

type Props = {
  className?: string;
  title: string;
  subtitle?: string;
  categories: string[];
  series: ChartSeries[];
  chartType?: "area" | "bar" | "line" | "mixed";
  height?: number;
  showLegend?: boolean;
  horizontal?: boolean;
  stacked?: boolean;
  yaxis?: ApexOptions["yaxis"];
  actions?: ReactNode;
};

const DashboardChart = ({
  className = "",
  title,
  subtitle,
  categories,
  series,
  chartType = "area",
  height = 320,
  showLegend = true,
  horizontal = false,
  stacked = false,
  yaxis,
  actions,
}: Props) => {
  const chartRef = useRef<HTMLDivElement | null>(null);
  const { mode } = useThemeMode();

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    const chart = new ApexCharts(chartRef.current, buildOptions({
      categories,
      series,
      chartType,
      height,
      showLegend,
      horizontal,
      stacked,
      yaxis,
    }));

    chart.render();

    return () => {
      chart.destroy();
    };
  }, [categories, series, chartType, height, showLegend, horizontal, stacked, yaxis, mode]);

  return (
    <div className={`card ${className}`}>
      <div className="card-header border-0 pt-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-3 w-100">
          <h3 className="card-title align-items-start flex-column mb-0">
            <span className="card-label fw-bold fs-3 mb-1">{title}</span>
            {subtitle ? <span className="text-muted fw-semibold fs-7">{subtitle}</span> : null}
          </h3>
          {actions ? <div className="d-flex align-items-center gap-2 ms-md-auto">{actions}</div> : null}
        </div>
      </div>
      <div className="card-body pt-0">
        <div ref={chartRef} style={{ height: `${height}px` }} />
      </div>
    </div>
  );
};

export default DashboardChart;

function buildOptions({
  categories,
  series,
  chartType,
  height,
  showLegend,
  horizontal,
  stacked,
  yaxis,
}: {
  categories: string[];
  series: ChartSeries[];
  chartType: "area" | "bar" | "line" | "mixed";
  height: number;
  showLegend: boolean;
  horizontal: boolean;
  stacked: boolean;
  yaxis?: ApexOptions["yaxis"];
}): ApexOptions {
  const labelColor = getCSSVariableValue("--bs-gray-500");
  const borderColor = getCSSVariableValue("--bs-gray-200");
  const resolvedChartType = chartType === "mixed" ? "line" : chartType;
  const usesBar = chartType === "bar" || series.some((item) => item.type === "bar");
  const resolvedYaxis = Array.isArray(yaxis)
    ? yaxis.map((axis) => ({
        labels: {
          style: {
            colors: labelColor,
            fontSize: "12px",
          },
          ...(axis as any)?.labels,
        },
        ...axis,
      }))
    : yaxis
      ? {
          labels: {
            style: {
              colors: labelColor,
              fontSize: "12px",
            },
            ...(yaxis as any)?.labels,
          },
          ...yaxis,
        }
      : {
          labels: {
            style: {
              colors: labelColor,
              fontSize: "12px",
            },
          },
        };

  return {
    series: series.map(({ name, data, type }) => (type ? { name, data, type } : { name, data })),
    chart: {
      fontFamily: "inherit",
      type: resolvedChartType,
      height,
      toolbar: { show: false },
      animations: {
        enabled: true,
        speed: 500,
      },
      stacked,
    },
    legend: {
      show: showLegend,
      position: "top",
      horizontalAlign: "left",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: series.map((item) => (item.type === "bar" || (!item.type && chartType === "bar") ? 0 : 3)),
    },
    fill: {
      type: "solid",
      opacity: usesBar ? 1 : 0.35,
    },
    plotOptions: {
      bar: {
        borderRadius: 6,
        columnWidth: "42%",
        horizontal,
      },
    },
    xaxis: {
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: {
          colors: labelColor,
          fontSize: "12px",
        },
      },
    },
    yaxis: resolvedYaxis,
    grid: {
      borderColor,
      strokeDashArray: 4,
      yaxis: {
        lines: { show: true },
      },
    },
    colors: series.map((item, index) => item.color ?? defaultPalette[index % defaultPalette.length]),
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontSize: "12px",
      },
    },
  };
}

const defaultPalette = ["#bf9f7d", "#f5551a", "#342511", "#8b6f54"];
