import React from "react";
import type { InfoSectionConfig } from "../../core/DetailTypes";

type Props<T> = {
  config: InfoSectionConfig<T>;
  data: T;
};

export default function InfoCard<T>({ config, data }: Props<T>) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">{config.title}</span>
        </h3>
      </div>
      <div className="card-body pt-5">
        <div className="row g-5">
          {config.fields.map((field: any, idx: number) => {
            const value =
              typeof field.accessor === "function"
                ? field.accessor(data)
                : data[field.accessor as keyof T];

            return (
              <div
                key={idx}
                className={`col-12 col-md-${field.colSpan || 6}`}
              >
                <div className="d-flex flex-column text-muted fw-semibold fs-6">
                  <span>{field.label}</span>
                  <span className="text-gray-900 fw-bold fs-5 mt-1">
                    {value !== null && value !== undefined && value !== "" ? (
                      value as React.ReactNode
                    ) : (
                      <span className="text-gray-400 fst-italic">Not provided</span>
                    )}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}