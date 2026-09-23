import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";

import type { ServiceList, ServiceFormValues } from "../service_list.types";
import { deleteServiceMediaApi } from "../service_list.api";
import { ServiceAreaGeometryEditor } from "./ServiceAreaGeometryEditor";
import type { ServiceAreaGeometry } from "../serviceAreaGeometry";
import { fetchAdminDashboardSummary } from "../../dashboard/dashboard.api";
import { useAuth, useRoleAccess } from "../../../../modules/auth";
import { mediaAllowance } from "../../../../modules/subscription/mediaEntitlements";

const SERVICE_AREA_OPTIONS = [
    "Australia-wide",
    "Australian Capital Territory",
    "New South Wales",
    "Northern Territory",
    "Queensland",
    "South Australia",
    "Tasmania",
    "Victoria",
    "Western Australia",
];

const SERVICE_CATEGORY_OPTIONS = [
    { value: "Landscapers", label: "Landscapers" },
    { value: "Concreter", label: "Concreter" },
    { value: "Fencing", label: "Fencing" },
    { value: "Mortgage Brokers", label: "Mortgage Brokers" },
    { value: "Conveyancers", label: "Conveyancers" },
    { value: "Building and Pest", label: "Building and Pest" },
];

const normaliseCategory = (value?: string | null) => {
    if (!value) return "";
    if (["landscappers", "landscaping"].includes(value.toLowerCase())) return "Landscapers";
    const match = SERVICE_CATEGORY_OPTIONS.find((category) =>
        category.value.toLowerCase() === value.toLowerCase() ||
        category.value.toLowerCase().replace(/\s+/g, "-") === value.toLowerCase()
    );
    return match?.value ?? value;
};

type Props = {
    initialValues?: ServiceList | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: ServiceFormValues) => void;
};

const ServiceModal = ({
    initialValues,
    isSubmitting,
    onClose,
    onSubmit,
}: Props) => {
    const { isSuperAdmin } = useRoleAccess();
    const { entitlements } = useAuth();
    const allowance = mediaAllowance(entitlements);
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState(initialValues?.images ?? []);
    const [existingVideos, setExistingVideos] = useState(initialValues?.videos ?? []);
    const [serviceAreaEnabled, setServiceAreaEnabled] = useState(isSuperAdmin);
    const [serviceAreaLimit, setServiceAreaLimit] = useState<number | null>(null);
    const [serviceAreasUsed, setServiceAreasUsed] = useState<number | null>(null);
    const [form, setForm] = useState<ServiceFormValues>({
        name: initialValues?.name ?? "",
        slug: initialValues?.slug ?? initialValues?.category ?? "",
        description: initialValues?.description ?? "",
        category: normaliseCategory(initialValues?.category),
        service_area: initialValues?.service_area ?? "",
        service_area_geometry: initialValues?.service_area_geometry ?? null,
        rate_from: initialValues?.rate_from ?? "",
        rate_to: initialValues?.rate_to ?? "",
        is_active: initialValues?.is_active ?? true,
    });

    useEffect(() => {
        setForm({
            name: initialValues?.name ?? "",
            slug: initialValues?.slug ?? initialValues?.category ?? "",
            description: initialValues?.description ?? "",
            category: normaliseCategory(initialValues?.category),
            service_area: initialValues?.service_area ?? "",
            service_area_geometry: initialValues?.service_area_geometry ?? null,
            rate_from: initialValues?.rate_from ?? "",
            rate_to: initialValues?.rate_to ?? "",
            is_active: initialValues?.is_active ?? true,
        });
        setImages([]);
        setVideos([]);
        setExistingImages(initialValues?.images ?? []);
        setExistingVideos(initialValues?.videos ?? []);
    }, [initialValues]);

    useEffect(() => {
        if (isSuperAdmin) {
            setServiceAreaEnabled(true);
            return;
        }

        let active = true;
        void fetchAdminDashboardSummary()
            .then((summary) => {
                if (!active) return;
                setServiceAreaEnabled(Boolean(summary.capabilities?.service_areas));
                setServiceAreaLimit(summary.service_area_limit ?? null);
                setServiceAreasUsed(summary.metrics.service_regions ?? 0);
            })
            .catch(() => {
                if (active) setServiceAreaEnabled(false);
            });

        return () => {
            active = false;
        };
    }, [isSuperAdmin]);

    const handleImagesChange = (files: File[]) => {
        if (allowance.imagesConfigured && allowance.images !== null && existingImages.length + files.length > allowance.images) {
            setImages([]);
            window.alert(`Your ${allowance.planName} plan allows a maximum of ${allowance.images} images. Remove an image or upgrade your plan.`);
            return;
        }
        setImages(files);
    };

    const handleVideosChange = (files: File[]) => {
        if (files.length > 0 && !allowance.videoIncluded) {
            setVideos([]);
            window.alert("Video uploads are not included in your current plan.");
            return;
        }
        if (allowance.videosConfigured && allowance.videos !== null && existingVideos.length + files.length > allowance.videos) {
            setVideos([]);
            window.alert(`Your ${allowance.planName} plan allows a maximum of ${allowance.videos} videos. Remove a video or upgrade your plan.`);
            return;
        }
        setVideos(files);
    };

    return (
        <ModalShell
            title={initialValues ? "Edit Service" : "Add Service"}
            onClose={onClose}
            onSubmit={() =>
                onSubmit({
                    ...form,
                    images,
                    videos,
                    category: form.category?.trim() || form.name.trim(),
                })
            }
            isSubmitting={isSubmitting}
            submitLabel={initialValues ? "Update Service" : "Create Service"}
            isValid={!!form.name.trim() && !!form.category}
        >
            <div className="fv-row mb-7">
                <label className="required form-label">Service Name</label>

                <input
                    className="form-control form-control-solid"
                    value={form.name}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mb-7">
                <label className="required form-label">Category</label>
                <select
                    className="form-control form-control-solid"
                    value={form.category ?? ""}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            category: e.target.value,
                        }))
                    }
                >
                    <option value="">Select a category</option>
                    {SERVICE_CATEGORY_OPTIONS.map((category) => (
                        <option value={category.value} key={category.value}>{category.label}</option>
                    ))}
                </select>
                <div className="form-text">Select the category that best describes this service.</div>
            </div>

            <div className="fv-row">
                <label className="form-label">Description</label>

                <textarea
                    rows={4}
                    className="form-control form-control-solid"
                    value={form.description}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Service Area</label>

                <input
                    list="briksy-service-area-options"
                    className="form-control form-control-solid"
                    value={form.service_area ?? ""}
                    disabled={!serviceAreaEnabled}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            service_area: e.target.value,
                        }))
                    }
                />
                <datalist id="briksy-service-area-options">
                    {SERVICE_AREA_OPTIONS.map((option) => <option value={option} key={option} />)}
                </datalist>
                {!serviceAreaEnabled ? (
                    <div className="form-text text-warning">Service area coverage is not included in your current plan.</div>
                ) : (
                    <div className="form-text">
                        Choose a suggested region or enter a custom area.
                        {serviceAreaLimit !== null ? ` ${serviceAreasUsed ?? 0} of ${serviceAreaLimit} areas used.` : ""}
                    </div>
                )}
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Images</label>
                <div className="alert alert-light-info py-2 fs-7">Plan media allowance<br />• {allowance.imagesConfigured ? `Up to ${allowance.images ?? 0} images` : "Image limit is not configured"}<br />• {allowance.videosConfigured ? `Up to ${allowance.videos ?? 0} videos` : "Video limit is not configured"}<br />• Only media within your current plan allowance will be displayed publicly.</div>
                {existingImages.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {existingImages.map((media) => (
                            <div className="border rounded p-2 position-relative" key={media.id ?? media.url}>
                                <img src={media.url} alt="Service" style={{ width: 96, height: 72, objectFit: "cover" }} />
                                {media.id && <button type="button" className="btn btn-sm btn-light-danger btn-icon position-absolute top-0 end-0 m-2" aria-label="Remove image" onClick={() => deleteServiceMediaApi(media.id!).then(() => setExistingImages((items) => items.filter((item) => item.id !== media.id)))}><span className="fw-bold fs-3" aria-hidden="true">×</span></button>}
                            </div>
                        ))}
                    </div>
                )}
                <input type="file" className="form-control" accept="image/*" multiple onChange={(event) => handleImagesChange(Array.from(event.target.files ?? []))} />
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Videos</label>
                {existingVideos.length > 0 && (
                    <div className="d-flex flex-column gap-1 mb-3">
                        {existingVideos.map((media) => (
                            <div key={media.id ?? media.url} className="d-flex align-items-center gap-2">
                                <a href={media.url} target="_blank" rel="noreferrer">Existing video</a>
                                {media.id && <button type="button" className="btn btn-sm btn-light-danger btn-icon" aria-label="Remove video" onClick={() => deleteServiceMediaApi(media.id!).then(() => setExistingVideos((items) => items.filter((item) => item.id !== media.id)))}><span className="fw-bold fs-3" aria-hidden="true">×</span></button>}
                            </div>
                        ))}
                    </div>
                )}
                <input type="file" className="form-control" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska" multiple onChange={(event) => handleVideosChange(Array.from(event.target.files ?? []))} />
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Service Area Coverage</label>
                {serviceAreaEnabled ? (
                    <ServiceAreaGeometryEditor
                        value={form.service_area_geometry ?? null}
                        addressHint={form.service_area ?? null}
                        onChange={(geometry: ServiceAreaGeometry | null) =>
                            setForm((prev) => ({
                                ...prev,
                                service_area_geometry: geometry,
                            }))
                        }
                    />
                ) : (
                    <div className="alert alert-light-warning mb-0">Upgrade your plan to add or change service coverage.</div>
                )}
            </div>

            <div className="row mt-6">
                <div className="col-md-6 fv-row">
                    <label className="form-label">Price From</label>
                    <input
                        type="number"
                        className="form-control form-control-solid"
                        value={form.rate_from ?? ""}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                rate_from: e.target.value,
                            }))
                        }
                    />
                </div>
                <div className="col-md-6 fv-row">
                    <label className="form-label">Price To</label>
                    <input
                        type="number"
                        className="form-control form-control-solid"
                        value={form.rate_to ?? ""}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                rate_to: e.target.value,
                            }))
                        }
                    />
                </div>
            </div>

            <div className="fv-row mt-6">
                <label className="form-check form-switch form-check-custom form-check-solid">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={Boolean(form.is_active)}
                        onChange={(e) =>
                            setForm((prev) => ({
                                ...prev,
                                is_active: e.target.checked,
                            }))
                        }
                    />
                    <span className="form-check-label ms-3">Active</span>
                </label>
            </div>
        </ModalShell>
    );
};

export default ServiceModal;
