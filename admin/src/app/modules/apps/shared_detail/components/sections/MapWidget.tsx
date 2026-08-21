import { useMemo } from "react";
import { LocationMapPreview } from "../../../../../services/features/maps/LocationMapPreview";
import type { MapSectionConfig } from "../../core/DetailTypes";

type Props<T> = {
  config: MapSectionConfig<T>;
  data: T;
};

const normalizeCoordinate = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
};

const MapWidget = <T,>({ config, data }: Props<T>) => {
  const coordinates = useMemo(() => {
    const latitude = normalizeCoordinate(
      typeof config.latAccessor === "function" ? config.latAccessor(data) : (data as Record<string, unknown>)?.[config.latAccessor],
    );
    const longitude = normalizeCoordinate(
      typeof config.lngAccessor === "function" ? config.lngAccessor(data) : (data as Record<string, unknown>)?.[config.lngAccessor],
    );

    return { latitude, longitude };
  }, [config, data]);

  if (coordinates.latitude === null || coordinates.longitude === null) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold text-gray-900">{config.title}</span>
          </h3>
        </div>
        <div className="card-body pt-5">
          <div className="alert alert-light mb-0">
            No map coordinates are available for this record yet.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-sm h-100">
      <div className="card-header border-0 pt-5">
        <h3 className="card-title align-items-start flex-column">
          <span className="card-label fw-bold text-gray-900">{config.title}</span>
        </h3>
      </div>
      <div className="card-body pt-5">
        <LocationMapPreview
          latitude={coordinates.latitude}
          longitude={coordinates.longitude}
          address={undefined}
          onChange={() => {}}
          height={360}
        />
      </div>
    </div>
  );
};

export default MapWidget;
