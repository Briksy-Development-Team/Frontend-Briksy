export type WebhookEventGroup = {
  title: string;
  prefix: string;
  description: string;
};

export const WEBHOOK_EVENT_GROUPS: WebhookEventGroup[] = [
  {
    title: "Authentication",
    prefix: "auth.",
    description: "Login and logout lifecycle events.",
  },
  {
    title: "Users",
    prefix: "user.",
    description: "User profile and account lifecycle events.",
  },
  {
    title: "Organizations",
    prefix: "company.",
    description: "Organization lifecycle events.",
  },
  {
    title: "Compliance",
    prefix: "compliance.",
    description: "Compliance workflow events.",
  },
  {
    title: "Documents",
    prefix: "document.",
    description: "Document lifecycle events.",
  },
  {
    title: "Billing",
    prefix: "subscription.",
    description: "Subscription and billing events.",
  },
  {
    title: "Billing",
    prefix: "invoice.",
    description: "Invoice payment lifecycle events.",
  },
  {
    title: "Notifications",
    prefix: "notification.",
    description: "Notification delivery events.",
  },
];

export const WEBHOOK_DOCUMENTATION_SECTIONS = [
  {
    title: "Overview",
    body: "Webhooks let your systems receive near real-time notifications from Briksy when user, billing, compliance, document, and notification events occur.",
  },
  {
    title: "Authentication",
    body: "Each endpoint stores a shared secret. Briksy signs every payload using HMAC SHA-256 so the receiver can verify the message came from Briksy.",
  },
  {
    title: "Signature Verification",
    body: "Use the X-Brisky-Signature, X-Brisky-Timestamp, and raw JSON payload to validate delivery integrity before accepting the event.",
  },
  {
    title: "Retry Policy",
    body: "Failed deliveries are retried automatically with exponential backoff until the configured retry count is exhausted.",
  },
  {
    title: "Best Practices",
    body: "Use HTTPS endpoints only, respond quickly with a 2xx status, store processed event IDs for idempotency, and rotate secrets whenever integrations are updated.",
  },
] as const;

export const WEBHOOK_HTTP_HEADERS = [
  "Content-Type: application/json",
  "X-Brisky-Signature: <hmac sha256>",
  "X-Brisky-Event: <event name>",
  "X-Brisky-Timestamp: <ISO timestamp>",
];

export const WEBHOOK_RESPONSE_CODES = [
  { code: 200, meaning: "Success" },
  { code: 202, meaning: "Accepted" },
  { code: 400, meaning: "Invalid request or signature" },
  { code: 401, meaning: "Authentication failure" },
  { code: 403, meaning: "Forbidden" },
  { code: 404, meaning: "Endpoint not found" },
  { code: 429, meaning: "Rate limited" },
  { code: 500, meaning: "Server error" },
] as const;
