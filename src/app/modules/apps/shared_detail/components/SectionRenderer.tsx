import React from "react";
import type { SectionConfig } from "../core/DetailTypes";
import InfoCard from "./sections/InfoCard";
import RelatedTable from "./sections/RelatedTable";

type Props<T> = {
  config: SectionConfig<T>;
  data: T;
};

export default function SectionRenderer<T>({ config, data }: Props<T>) {
  switch (config.type) {
    case "info":
      return <InfoCard config={config} data={data} />;
    
    case "table":
      return <RelatedTable config={config} />;
    
    case "custom":
      const CustomComponent = config.component;
      return (
        <div className="card shadow-sm h-100">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold text-gray-900">{config.title}</span>
            </h3>
          </div>
          <div className="card-body pt-5">
            <CustomComponent data={data} />
          </div>
        </div>
      );

    case "timeline":
    case "emails":
    case "gallery":
    case "map":
    case "notes":
      // Placeholders for advanced widgets to be implemented in Phase 2
      return (
        <div className="card shadow-sm h-100 border-dashed border-primary">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold text-gray-900">{config.title}</span>
            </h3>
          </div>
          <div className="card-body pt-5 d-flex align-items-center justify-content-center">
            <div className="text-muted text-center">
              <div className="fs-6 fw-semibold">[{config.type.toUpperCase()} WIDGET PLACEHOLDER]</div>
              <div className="fs-7 mt-2">This widget will be fully implemented in Phase 2.</div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="alert alert-warning">
          Unknown section type
        </div>
      );
  }
}