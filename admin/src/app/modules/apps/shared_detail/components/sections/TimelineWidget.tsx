import React from "react";
import type { TimelineSectionConfig } from "../../core/DetailTypes";

type Props = {
  config: TimelineSectionConfig;
  data: any;
};

const toTimelineEvents = (data: any) => {
  const events = Array.isArray(data?.timeline_events) ? data.timeline_events : [];

  if (events.length > 0) {
    return events.map((event: any, index: number) => ({
      id: event.id ?? `${index}`,
      title: event.title ?? event.action ?? "Update",
      description: event.description ?? event.comment ?? "No details provided.",
      date: event.created_at ?? "",
      color: event.action?.includes("reject")
        ? "danger"
        : event.action?.includes("approve") || event.action?.includes("publish") || event.action?.includes("verified")
          ? "success"
          : event.action?.includes("archive")
            ? "secondary"
            : "primary",
    }));
  }

  return [];
};

export default function TimelineWidget({ config, data }: Props) {
  const events = toTimelineEvents(data);

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header align-items-center border-0 mt-4">
        <h3 className="card-title align-items-start flex-column">
          <span className="fw-bolder mb-2 text-dark">{config.title}</span>
          <span className="text-muted fw-bold fs-7">Approval and activity history</span>
        </h3>
      </div>
      <div className="card-body pt-5">
        {events.length > 0 ? (
          <div className="timeline-label">
            {events.map((event: any) => (
              <div key={event.id} className="timeline-item">
                <div className="timeline-label fw-bolder text-gray-800 fs-6">
                  {event.date ? new Date(event.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "—"}
                </div>
                <div className="timeline-badge">
                  <i className={`fa fa-genderless text-${event.color} fs-1`}></i>
                </div>
                <div className="timeline-content d-flex flex-column">
                  <span className="fw-bolder text-gray-800 ps-3">{event.title}</span>
                  <span className="text-muted ms-2">— {event.description}</span>
                  <span className="text-muted ms-auto fs-7">{event.date ? new Date(event.date).toLocaleDateString() : ""}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="alert alert-light mb-0">No approval history has been recorded for this property yet.</div>
        )}
      </div>
    </div>
  );
}
