const DEFAULT_MAP_QUERY = "Australia";

export const buildGoogleMapsEmbedUrl = ({
  lat,
  lng,
  address,
}: {
  lat?: number | null;
  lng?: number | null;
  address?: string | null;
}) => {
  const hasCoordinates =
    typeof lat === "number" &&
    Number.isFinite(lat) &&
    typeof lng === "number" &&
    Number.isFinite(lng) &&
    !(lat === 0 && lng === 0);

  const query = hasCoordinates ? `${lat},${lng}` : (address?.trim() || DEFAULT_MAP_QUERY);

  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`;
};
