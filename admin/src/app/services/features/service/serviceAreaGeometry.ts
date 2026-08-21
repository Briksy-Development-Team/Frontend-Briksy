export type ServiceAreaGeometry = {
  type: "Polygon";
  coordinates: number[][][];
};

export type LatLngLiteral = {
  lat: number;
  lng: number;
};

export const isServiceAreaGeometry = (value: unknown): value is ServiceAreaGeometry => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const geometry = value as ServiceAreaGeometry;

  return (
    geometry.type === "Polygon" &&
    Array.isArray(geometry.coordinates) &&
    Array.isArray(geometry.coordinates[0]) &&
    Array.isArray(geometry.coordinates[0][0])
  );
};

export const geometryToPath = (geometry?: ServiceAreaGeometry | null): LatLngLiteral[] => {
  if (!geometry || !Array.isArray(geometry.coordinates?.[0])) {
    return [];
  }

  return geometry.coordinates[0]
    .map((point) => {
      const [lng, lat] = point;
      if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
        return null;
      }

      return { lat, lng } satisfies LatLngLiteral;
    })
    .filter((point): point is LatLngLiteral => point !== null);
};

export const pathToGeometry = (path: LatLngLiteral[]): ServiceAreaGeometry | null => {
  const cleanedPath = path.filter((point) => Number.isFinite(point.lat) && Number.isFinite(point.lng));

  if (cleanedPath.length < 3) {
    return null;
  }

  const ring: number[][] = cleanedPath.map((point) => [point.lng, point.lat]);
  const first = ring[0];
  const last = ring[ring.length - 1];

  if (!first || !last || first[0] !== last[0] || first[1] !== last[1]) {
    ring.push([...first]);
  }

  return {
    type: "Polygon",
    coordinates: [ring],
  };
};
