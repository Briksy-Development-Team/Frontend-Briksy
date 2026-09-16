import React from "react";
import type { GallerySectionConfig } from "../../core/DetailTypes";

type Props<T> = {
  config: GallerySectionConfig<T>;
  data: T;
};

export default function GalleryWidget<T>({ config, data }: Props<T>) {
  const images: string[] = typeof config.imagesAccessor === "function"
    ? config.imagesAccessor(data)
    : data[config.imagesAccessor as keyof T] as unknown as string[];

  if (!images || images.length === 0) {
    return (
      <div className="card shadow-sm h-100">
        <div className="card-header border-0 pt-5">
          <h3 className="card-title align-items-start flex-column">
            <span className="card-label fw-bold text-gray-900">{config.title}</span>
          </h3>
        </div>
        <div className="card-body pt-5 text-center text-muted">
          No {config.mediaType === "video" ? "videos" : "images"} available.
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
        <div className="row g-5">
          {images.map((mediaUrl: string, idx: number) => (
            <div key={idx} className="col-4 col-md-3 col-xl-2">
              {config.mediaType === "video" ? (
                <video src={mediaUrl} controls preload="metadata" className="w-100 rounded border bg-dark" style={{ height: 110, objectFit: "cover" }} />
              ) : (
                <a className="d-block overlay" data-fslightbox="lightbox-basic" href={mediaUrl}>
                  <div className="overlay-wrapper bgi-no-repeat bgi-position-center bgi-size-cover card-rounded min-h-100px" style={{ backgroundImage: `url(${mediaUrl})` }} />
                  <div className="overlay-layer card-rounded bg-dark bg-opacity-25 shadow">
                    <i className="bi bi-eye-fill text-white fs-3x" />
                  </div>
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
