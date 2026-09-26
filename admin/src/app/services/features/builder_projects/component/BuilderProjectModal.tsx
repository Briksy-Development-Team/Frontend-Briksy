import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import { LocationAutocomplete, type LocationSelection } from "../../maps/LocationAutocomplete";
import { LocationMapPreview } from "../../maps/LocationMapPreview";
import { useAuth } from "../../../../modules/auth";
import { mediaAllowance } from "../../../../modules/subscription/mediaEntitlements";
import type { BuilderProject, BuilderProjectMedia } from "../builder_project.types";

export type ProjectFormValues = {
  name: string;
  project_type: string;
  status: string;
  location: string;
  state: string;
  postcode: string;
  description: string;
  latitude: string | number;
  longitude: string | number;
  images: File[];
  videos: File[];
};

type Props = {
  initialValues?: BuilderProject | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void | Promise<unknown>;
  onDeleteMedia?: (mediaId: string) => void | Promise<unknown>;
};

export const BuilderProjectModal = ({
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
  onDeleteMedia,
}: Props) => {
  const [images, setImages] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [mediaError, setMediaError] = useState<string | null>(null);
  const { entitlements } = useAuth();
  const allowance = mediaAllowance(entitlements);
  const [form, setForm] = useState<ProjectFormValues>({
    name: initialValues?.name ?? "",
    project_type: initialValues?.project_type ?? "",
    status: initialValues?.status ?? "planning",
    location: initialValues?.location ?? "",
    state: initialValues?.state ?? "",
    postcode: initialValues?.postcode ?? "",
    description: initialValues?.description ?? "",
    latitude: initialValues?.latitude ?? "",
    longitude: initialValues?.longitude ?? "",
    images: [],
    videos: [],
  });

  useEffect(() => {
    setForm({
      name: initialValues?.name ?? "",
      project_type: initialValues?.project_type ?? "",
      status: initialValues?.status ?? "planning",
      location: initialValues?.location ?? "",
      state: initialValues?.state ?? "",
      postcode: initialValues?.postcode ?? "",
      description: initialValues?.description ?? "",
      latitude: initialValues?.latitude ?? "",
      longitude: initialValues?.longitude ?? "",
      images: [],
      videos: [],
    });
    setImages([]);
    setVideos([]);
    setMediaError(null);
  }, [initialValues]);

  const updateForm = (key: keyof ProjectFormValues, value: string) =>
    setForm((current) => ({ ...current, [key]: value }));

  const handleLocationSelect = (selection: LocationSelection) => {
    setForm((current) => ({
      ...current,
      location: selection.address ?? selection.full_address ?? current.location,
      state: selection.state ?? current.state,
      postcode: selection.postcode ?? current.postcode,
      latitude: selection.latitude ?? current.latitude,
      longitude: selection.longitude ?? current.longitude,
    }));
  };

  const handleImageChange = (files: File[]) => {
    const nextImages = files.filter((file) => file.type.startsWith("image/"));
    if (allowance.imagesConfigured && allowance.images !== null && (initialValues?.images?.length ?? 0) + nextImages.length > allowance.images) {
      setMediaError(`Your ${allowance.planName} plan allows a maximum of ${allowance.images} images for this project.`);
      return;
    }
    setMediaError(null);
    setImages(nextImages);
    setForm((current) => ({ ...current, images: nextImages }));
  };

  const handleVideoChange = (files: File[]) => {
    const nextVideos = files.filter((file) => file.type.startsWith("video/"));
    const maxVideoSize = 1024 * 1024 * 1024;
    const invalidVideo = nextVideos.find((file) => file.size > maxVideoSize);
    if (invalidVideo) {
      setMediaError(`${invalidVideo.name} must be smaller than 1 GB.`);
      return;
    }
    if (!allowance.videoIncluded) {
      setMediaError("Video uploads are not included in your current plan.");
      return;
    }
    if (allowance.videosConfigured && allowance.videos !== null && (initialValues?.videos?.length ?? 0) + nextVideos.length > allowance.videos) {
      setMediaError(`Your ${allowance.planName} plan allows a maximum of ${allowance.videos} videos for this project.`);
      return;
    }
    setMediaError(null);
    setVideos(nextVideos);
    setForm((current) => ({ ...current, videos: nextVideos }));
  };

  const handleSubmit = async () => {
    if (!form.name.trim()) return;
    await onSubmit(form);
  };

  const validLatitude = form.latitude === "" || (Number(form.latitude) >= -90 && Number(form.latitude) <= 90);
  const validLongitude = form.longitude === "" || (Number(form.longitude) >= -180 && Number(form.longitude) <= 180);

  return (
    <ModalShell
      title={initialValues ? "Edit Project" : "Add Builder Project"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={initialValues ? "Update Project" : "Save Project"}
      isValid={Boolean(form.name.trim()) && validLatitude && validLongitude}
      dialogClassName="mw-650px"
    >
      <div className="row g-4">
        <div className="col-md-6">
          <label className="form-label required">Project Name</label>
          <input
            className="form-control form-control-solid"
            required
            maxLength={150}
            placeholder="e.g. Metro Homes Development"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Project Type</label>
          <input
            className="form-control form-control-solid"
            maxLength={80}
            placeholder="e.g. Townhouse Development"
            value={form.project_type}
            onChange={(e) => updateForm("project_type", e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <label className="form-label">Status</label>
          <select
            className="form-select form-select-solid"
            value={form.status}
            onChange={(e) => updateForm("status", e.target.value)}
          >
            <option value="planning">Planning</option>
            <option value="in_delivery">In Delivery</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="col-12">
          <LocationAutocomplete
            value={form.location}
            label="Project Location"
            placeholder="Search for the project address"
            onChange={(value) => updateForm("location", value)}
            onSelect={handleLocationSelect}
          />
          <div className="row g-4 mt-1">
            <div className="col-md-6">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                className={`form-control form-control-solid ${!validLatitude ? "is-invalid" : ""}`}
                min="-90"
                max="90"
                step="any"
                placeholder="e.g. -32.9283"
                value={form.latitude}
                onChange={(e) => updateForm("latitude", e.target.value)}
              />
              {!validLatitude && <div className="invalid-feedback">Latitude must be between -90 and 90.</div>}
            </div>
            <div className="col-md-6">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                className={`form-control form-control-solid ${!validLongitude ? "is-invalid" : ""}`}
                min="-180"
                max="180"
                step="any"
                placeholder="e.g. 151.7817"
                value={form.longitude}
                onChange={(e) => updateForm("longitude", e.target.value)}
              />
              {!validLongitude && <div className="invalid-feedback">Longitude must be between -180 and 180.</div>}
            </div>
          </div>
          <div className="text-muted fs-7 mt-2">Enter the exact coordinates. The map below is a preview only.</div>
          <LocationMapPreview
            latitude={form.latitude}
            longitude={form.longitude}
            address={form.location}
            onChange={() => {}}
            height={240}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">State</label>
          <input
            className="form-control form-control-solid"
            maxLength={10}
            placeholder="NSW"
            value={form.state}
            onChange={(e) => updateForm("state", e.target.value)}
          />
        </div>

        <div className="col-md-6">
          <label className="form-label">Postcode</label>
          <input
            className="form-control form-control-solid"
            maxLength={10}
            placeholder="2300"
            value={form.postcode}
            onChange={(e) => updateForm("postcode", e.target.value)}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Description</label>
          <textarea
            className="form-control form-control-solid"
            rows={3}
            placeholder="Provide brief details about this development project..."
            value={form.description}
            onChange={(e) => updateForm("description", e.target.value)}
          />
        </div>

        <div className="col-12">
          <label className="form-label">Project Images</label>
          <input
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp"
            className="form-control form-control-solid"
            onChange={(event) => handleImageChange(Array.from(event.target.files ?? []))}
          />
          <div className="text-muted fs-7 mt-2">
            {allowance.imagesConfigured ? `Up to ${allowance.images ?? 0} images per project.` : "Image limit is not configured."} {images.length} selected.
          </div>
        </div>

        <div className="col-12">
          <label className="form-label">Project Videos</label>
          <input
            type="file"
            multiple
            accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
            className="form-control form-control-solid"
            onChange={(event) => handleVideoChange(Array.from(event.target.files ?? []))}
          />
          <div className="text-muted fs-7 mt-2">
            {allowance.videosConfigured ? `Up to ${allowance.videos ?? 0} videos per project.` : "Video limit is not configured."} {videos.length} selected.
          </div>
          {mediaError ? <div className="text-danger fs-7 mt-2">{mediaError}</div> : null}

          {initialValues?.images?.length ? (
            <MediaPreviewList
              label="Existing Images"
              media={initialValues.images}
              type="image"
              onDeleteMedia={onDeleteMedia}
            />
          ) : null}
          {initialValues?.videos?.length ? (
            <MediaPreviewList
              label="Existing Videos"
              media={initialValues.videos}
              type="video"
              onDeleteMedia={onDeleteMedia}
            />
          ) : null}
        </div>
      </div>
    </ModalShell>
  );
};

const MediaPreviewList = ({
  label,
  media,
  type,
  onDeleteMedia,
}: {
  label: string;
  media: BuilderProjectMedia[];
  type: "image" | "video";
  onDeleteMedia?: (mediaId: string) => void | Promise<unknown>;
}) => (
  <div className="mt-5">
    <label className="form-label">{label}</label>
    <div className="row g-3">
      {media.map((item) => (
        <div className="col-md-4 position-relative" key={item.id ?? item.url}>
          {type === "image" ? (
            <img src={item.url} alt="Project" className="w-100 rounded border" style={{ height: 130, objectFit: "cover" }} />
          ) : (
            <video src={item.url} controls className="w-100 rounded border" style={{ height: 130 }} />
          )}
          {item.id && onDeleteMedia ? (
            <button
              type="button"
              className="btn btn-sm btn-light-danger btn-icon position-absolute top-0 end-0 m-2"
              onClick={() => void onDeleteMedia(item.id as string)}
              aria-label={`Delete ${type}`}
            >
              ×
            </button>
          ) : null}
        </div>
      ))}
    </div>
  </div>
);
