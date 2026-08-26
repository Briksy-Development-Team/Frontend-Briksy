import React from "react";
import type { EmailsSectionConfig } from "../../core/DetailTypes";

type Props = {
  config: EmailsSectionConfig;
};

// MOCK DATA
const mockEmails = [
  { id: 1, subject: "Welcome to Briksy!", sender: "support@briksy.com", receiver: "user@example.com", date: "2 days ago", body: "Thank you for registering...", direction: "outbound", status: "delivered" },
  { id: 2, subject: "Question regarding Property #4029", sender: "user@example.com", receiver: "sales@briksy.com", date: "1 day ago", body: "Hello, I am interested in viewing this property.", direction: "inbound", status: "read" },
];

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
        <div className="d-flex flex-column gap-5">
          {mockEmails.map((email) => (
            <div key={email.id} className="d-flex align-items-center bg-light p-4 rounded border border-dashed border-gray-300">
              <div className="symbol symbol-45px me-4">
                <span className={`symbol-label bg-light-${email.direction === "inbound" ? "success" : "primary"}`}>
                  <i className={`fa fa-arrow-${email.direction === "inbound" ? "down text-success" : "up text-primary"} fs-2`}></i>
                </span>
              </div>
              <div className="d-flex flex-column flex-grow-1">
                <a href="#" className="text-gray-900 text-hover-primary fs-5 fw-bolder mb-1">{email.subject}</a>
                <span className="text-muted fw-bold fs-7">
                  {email.direction === "inbound" ? `From: ${email.sender}` : `To: ${email.receiver}`}
                </span>
              </div>
              <div className="d-flex flex-column align-items-end">
                <span className="text-muted fw-bold fs-7 mb-1">{email.date}</span>
                <span className={`badge badge-light-${email.status === "delivered" ? "primary" : "success"} fs-8`}>{email.status}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="notice d-flex bg-light-primary rounded border-primary border border-dashed p-6 mt-8">
          <div className="d-flex flex-stack flex-grow-1 flex-wrap flex-md-nowrap">
            <div className="mb-3 mb-md-0 fw-semibold">
              <h4 className="text-gray-900 fw-bold">Mock Data Notice</h4>
              <div className="fs-6 text-gray-700 pe-7">
                This widget is currently using mock data. Full email thread viewing will be enabled once the backend API is ready.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
