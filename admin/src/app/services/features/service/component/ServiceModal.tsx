import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";

import type { ServiceList, ServiceFormValues, ServiceCategory } from "../service_list.types";
import { deleteServiceMediaApi } from "../service_list.api";
import { ServiceAreaGeometryEditor } from "./ServiceAreaGeometryEditor";
import type { ServiceAreaGeometry } from "../serviceAreaGeometry";

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
    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState(initialValues?.images ?? []);
    const [existingVideos, setExistingVideos] = useState(initialValues?.videos ?? []);
    const [form, setForm] = useState<ServiceFormValues>({
        name: initialValues?.name ?? "",
        slug: initialValues?.slug ?? initialValues?.category ?? "",
        description: initialValues?.description ?? "",
        category: initialValues?.category ?? (initialValues?.slug as ServiceCategory) ?? "electrical",
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
            category: initialValues?.category ?? (initialValues?.slug as ServiceCategory) ?? "electrical",
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

    return (
        <ModalShell
            title={initialValues ? "Edit Service" : "Add Service"}
            onClose={onClose}
            onSubmit={() =>
                onSubmit({
                    ...form,
                    images,
                    videos,
                    slug: form.slug?.trim() || form.category,
                })
            }
            isSubmitting={isSubmitting}
            submitLabel={initialValues ? "Update Service" : "Create Service"}
            isValid={!!form.name}
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
                <label className="form-label">Slug</label>

                <input
                    className="form-control form-control-solid"
                    value={form.slug}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            slug: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mb-7">
                <label className="form-label">Category</label>

                <select
                    className="form-select form-select-solid"
                    value={form.category}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            category: e.target.value as ServiceCategory,
                        }))
                    }
                >
                    <option value="electrical">Electrical</option>

                    <option value="plumbing">Plumbing</option>

                    <option value="fencing">Fencing</option>

                    <option value="landscapers">Landscapers</option>

                    <option value="conveyancers">Conveyancers</option>

                    <option value="brokers">Brokers</option>
                </select>
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
                    className="form-control form-control-solid"
                    value={form.service_area ?? ""}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            service_area: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Images</label>
                {existingImages.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                        {existingImages.map((media) => (
                            <div className="border rounded p-2" key={media.id ?? media.url}>
                                <img src={media.url} alt="Service" style={{ width: 96, height: 72, objectFit: "cover" }} />
                                {media.id && <button type="button" className="btn btn-sm btn-link text-danger d-block" onClick={() => deleteServiceMediaApi(media.id!).then(() => setExistingImages((items) => items.filter((item) => item.id !== media.id)))}>Remove</button>}
                            </div>
                        ))}
                    </div>
                )}
                <input type="file" className="form-control" accept="image/*" multiple onChange={(event) => setImages(Array.from(event.target.files ?? []))} />
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Videos</label>
                {existingVideos.length > 0 && (
                    <div className="d-flex flex-column gap-1 mb-3">
                        {existingVideos.map((media) => (
                            <div key={media.id ?? media.url} className="d-flex align-items-center gap-2">
                                <a href={media.url} target="_blank" rel="noreferrer">Existing video</a>
                                {media.id && <button type="button" className="btn btn-sm btn-link text-danger" onClick={() => deleteServiceMediaApi(media.id!).then(() => setExistingVideos((items) => items.filter((item) => item.id !== media.id)))}>Remove</button>}
                            </div>
                        ))}
                    </div>
                )}
                <input type="file" className="form-control" accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska" multiple onChange={(event) => setVideos(Array.from(event.target.files ?? []))} />
            </div>

            <div className="fv-row mt-6">
                <label className="form-label">Service Area Coverage</label>
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
