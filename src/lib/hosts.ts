export function getNormalizedHost(rawHost?: string | null) {
  return rawHost?.split(":")[0].trim().toLowerCase() ?? "";
}

export function isAdminHost(host?: string | null) {
  const normalizedHost = getNormalizedHost(host);
  return (
    normalizedHost === "admin.iownchatgpt.com" ||
    normalizedHost === "admin.localhost" ||
    normalizedHost === "admin.127.0.0.1"
  );
}

export function getPublicSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "https://iownchatgpt.com";
}
