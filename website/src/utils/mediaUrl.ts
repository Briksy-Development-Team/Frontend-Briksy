const LOOPBACK_HOST_PATTERN = /^(localhost|127\.0\.0\.1|0\.0\.0\.0)$/i;

/** Resolve API/storage media without allowing a local development host to leak into production. */
export function resolveMediaUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  if (value.startsWith("data:") || value.startsWith("blob:")) return value;

  const configuredApi = import.meta.env.VITE_APP_API_URL?.trim().replace(/\/$/, "");
  const apiOrigin = configuredApi && /^https?:\/\//i.test(configuredApi)
    ? configuredApi.replace(/\/api\/?$/, "")
    : typeof window !== "undefined" ? window.location.origin : "";

  try {
    const parsed = new URL(value, typeof window !== "undefined" ? window.location.origin : "http://localhost");
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      if (LOOPBACK_HOST_PATTERN.test(parsed.hostname) && apiOrigin) {
        return `${apiOrigin}${parsed.pathname}${parsed.search}`;
      }
      return parsed.href;
    }
  } catch {
    // Fall through to the relative-path handling below.
  }

  if (!apiOrigin) return value;
  return `${apiOrigin}/${value.replace(/^\/+/, "")}`;
}
