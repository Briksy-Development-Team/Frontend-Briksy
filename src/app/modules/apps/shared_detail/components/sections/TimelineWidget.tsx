import React from "react";
import type { TimelineSectionConfig } from "../../core/DetailTypes";

type Props = {
  config: TimelineSectionConfig;
};

// MOCK DATA for now until API is ready
const mockTimelineEvents = [
  { id: 1, title: "Account Created", description: "User registered via portal.", date: "2023-10-12 14:30", color: "success", icon: "check" },
  { id: 2, title: "Logged In", description: "IP: 192.168.1.1", date: "2023-10-13 09:00", color: "primary", icon: "user" },
  { id: 3, title: "Saved Property", description: "Property ID #4029 saved.", date: "2023-10-15 11:20", color: "warning", icon: "star" },
  { id: 4, title: "Inquiry Sent", description: "Requested viewing for Property #4029.", date: "2023-10-16 16:45", color: "info", icon: "message-text-2" },
];

export default function TimelineWidget({ config }: Props) {
  return (
    <div className="card shadow-sm h-100">
      <div className="card-header align-items-center border-0 mt-4">
        <h3 className="card-title align-items-start flex-column">
          <span className="fw-bolder mb-2 text-dark">{config.title}</span>
          <span className="text-muted fw-bold fs-7">Recent Activity Feed</span>
        </h3>
      </div>
      <div className="card-body pt-5">
        <div className="timeline-label">
          {mockTimelineEvents.map((event) => (
            <div key={event.id} className="timeline-item">
              <div className="timeline-label fw-bolder text-gray-800 fs-6">
                {event.date.split(" ")[1]} {/* Time */}
              </div>
              <div className="timeline-badge">
                <i className={`fa fa-genderless text-${event.color} fs-1`}></i>
              </div>
              <div className="timeline-content d-flex">
                <span className="fw-bolder text-gray-800 ps-3">{event.title}</span>
                <span className="text-muted ms-2">— {event.description}</span>
                <span className="text-muted ms-auto fs-7">{event.date.split(" ")[0]}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6 mt-8">
          <div className="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
            <div className="mb-3 mb-md-0 fw-semibold">
              <h4 className="text-gray-900 fw-bold">Mock Data Notice</h4>
              <div className="fs-6 text-gray-700 pe-7">
                This timeline is currently using mock data. It will be wired to the real activity log API in a future update.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}