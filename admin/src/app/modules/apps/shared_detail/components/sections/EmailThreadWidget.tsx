import React from "react";
import type { EmailsSectionConfig } from "../../core/DetailTypes";

type Props = {
  config: EmailsSectionConfig;
};

export default function EmailThreadWidget({ config }: Props) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header align-items-center border-0 mt-4">
        <h3 className="card-title align-items-start flex-column">
          <span className="fw-bolder mb-2 text-dark">{config.title}</span>
          <span className="text-muted fw-bold fs-7">Communication History</span>
        </h3>
        <div className="card-toolbar">
          <button className="btn btn-sm btn-primary">Compose Email</button>
        </div>
      </div>
      <div className="card-body pt-5">
        <div className="notice d-flex bg-light-secondary rounded border border-dashed p-6">
          <div className="fw-semibold text-muted">No communication history is available from the API.</div>
        </div>
      </div>
    </div>
  );
}
