import React from "react";
import type { MapSectionConfig } from "../core/DetailTypes";

type Props<T> = {
  config: MapSectionConfig<T>;
  data: T;
};

export default function MapWidget<T>({ config, data }: Props<T>) {
  const lat = typeof config.latAccessor === "function" 
    ? config.latAccessor(data) 
    : data[config.latAccessor as keyof T] as unknown as number;

  const lng = typeof config.lngAccessor === "function" 
    ? config.lngAccessor(data) 
    : data[config.lngAccessor as keyof T] as unknown as number;

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">{config.title}</span>
        </h3>
      </div>
      <div className="card-body pt-5">
        <div className="w-100 h-300px rounded bg-light d-flex align-items-center justify-content-center">
           {/* In a real scenario, integrate Google Maps or Leaflet here */}
           <div className="text-center text-muted">
              <i className="bi bi-geo-alt-fill fs-2x mb-3"></i>
              <div className="fs-5 fw-bold">Map Placeholder</div>
              <div>Lat: {lat || "N/A"}, Lng: {lng || "N/A"}</div>
           </div>
        </div>
      </div>
    </div>
  );
}