import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { fetchWebhooksApi } from "../../services/features/webhooks/webhooks.api";
import type { WebhookEventRegistryItem } from "../../services/features/webhooks/webhooks.types";

const SAMPLE_PAYLOAD = `{
  "version": "1.0",
  "event": "user.created",
  "event_id": "f1b82f8c-0e11-4f1d-a8fe-8ad9f3a3d8a4",
  "delivery_id": "b95b2d96-8b65-4af5-a5d2-0a1d0f0a0cc1",
  "timestamp": "2026-07-08T10:15:00.000Z",
  "company_id": "company_123",
  "data": {
    "user_id": "user_456",
    "name": "Jane Doe",
    "email": "jane@example.com"
  }
}`;

export default function WebhooksDocumentationPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState<WebhookEventRegistryItem[]>([]);

  useEffect(() => {
    let active = true;
    void fetchWebhooksApi()
      .then((response) => {
        if (!active) return;
        setEvents(response.event_registry ?? []);
      })
      .catch(() => {
        if (!active) return;
        setEvents([]);
      });

    return () => {
      active = false;
    };
  }, []);

  const groupedEvents = useMemo(() => {
    return events.reduce<Record<string, WebhookEventRegistryItem[]>>((acc, event) => {
      acc[event.category] = [...(acc[event.category] ?? []), event];
      return acc;
    }, {});
  }, [events]);

  return (
    <Content>
      <PageHeader title="Webhook Documentation" subtitle="How to connect external systems to Briksy webhooks" />

      <div className="d-flex flex-wrap gap-3 mb-5">
        <button className="btn btn-primary" onClick={() => navigate("/admin/webhooks")}>
          Back to Webhooks
        </button>
      </div>

      <div className="card">
        <div className="card-body p-8">
          <div className="row g-5">
            <div className="col-xl-8">
              <div className="d-flex flex-column gap-4">
                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Overview</h3>
                  <p className="text-muted mb-0">
                    Webhooks let your systems receive near real-time notifications from Briksy when user, billing, compliance, document, and notification events occur.
                  </p>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Authentication</h3>
                  <p className="text-muted mb-0">
                    Each endpoint stores a shared secret. Briksy signs every payload using HMAC SHA-256 so the receiver can verify the message came from Briksy.
                  </p>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Signature Verification</h3>
                  <p className="text-muted mb-0">
                    Use the X-Brisky-Signature, X-Brisky-Timestamp, and raw JSON payload to validate delivery integrity before accepting the event.
                  </p>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Available Events</h3>
                  <p className="text-muted">Supported event keys come from the central webhook registry.</p>
                  <div className="accordion accordion-icon-toggle" id="webhook-doc-events">
                    {Object.entries(groupedEvents).map(([category, categoryEvents]) => (
                      <div className="accordion-item" key={category}>
                        <h2 className="accordion-header">
                          <button className="accordion-button" type="button">
                            {category}
                          </button>
                        </h2>
                        <div className="accordion-collapse collapse show">
                          <div className="accordion-body">
                            <div className="row g-3">
                              {categoryEvents.map((event) => (
                                <div className="col-md-6" key={event.key}>
                                  <div className="border rounded-4 p-3 h-100">
                                    <div className="fw-semibold">{event.display_name}</div>
                                    <div className="text-muted fs-8">{event.key}</div>
                                    <div className="text-muted fs-8 mt-1">{event.description}</div>
                                    {event.payload_schema ? <div className="text-muted fs-8 mt-2 font-monospace">{event.payload_schema}</div> : null}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Payload Example</h3>
                  <pre className="bg-light rounded-4 p-4 mb-0 overflow-auto">{SAMPLE_PAYLOAD}</pre>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Retry Policy</h3>
                  <p className="text-muted mb-0">
                    Failed deliveries are retried automatically with exponential backoff until the configured retry count is exhausted. After that the delivery is moved to the dead-letter equivalent failed state for manual requeue.
                  </p>
                </section>
              </div>
            </div>

            <div className="col-xl-4">
              <div className="d-flex flex-column gap-4">
                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">HTTP Headers</h3>
                  <ul className="list-unstyled mb-0">
                    <li className="mb-2 font-monospace small">Content-Type: application/json</li>
                    <li className="mb-2 font-monospace small">X-Brisky-Signature: &lt;hmac sha256&gt;</li>
                    <li className="mb-2 font-monospace small">X-Brisky-Event: &lt;event name&gt;</li>
                    <li className="mb-2 font-monospace small">X-Brisky-Timestamp: &lt;ISO timestamp&gt;</li>
                  </ul>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Response Expectations</h3>
                  <p className="text-muted mb-0">
                    Respond with any 2xx status code as soon as the event has been accepted. Store event IDs to make retries idempotent.
                  </p>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Status Codes</h3>
                  <ul className="list-unstyled mb-0">
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">200</span><span className="text-muted">Success</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">202</span><span className="text-muted">Accepted</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">400</span><span className="text-muted">Invalid request or signature</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">401</span><span className="text-muted">Authentication failure</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">403</span><span className="text-muted">Forbidden</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">404</span><span className="text-muted">Endpoint not found</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">429</span><span className="text-muted">Rate limited</span></li>
                    <li className="d-flex justify-content-between mb-2"><span className="fw-semibold">500</span><span className="text-muted">Server error</span></li>
                  </ul>
                </section>

                <section className="border rounded-4 p-4">
                  <h3 className="fw-bold mb-3">Best Practices</h3>
                  <ul className="text-muted mb-0 ps-3">
                    <li>Verify the HMAC signature before processing.</li>
                    <li>Return quickly and hand off longer work to a queue.</li>
                    <li>Reject non-HTTPS endpoints in production.</li>
                    <li>Store event IDs to avoid duplicate side effects.</li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Content>
  );
}
