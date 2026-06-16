import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Property, PropertyFormValues } from "../property.types";

type Props = {
    initialValues?: Property | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: PropertyFormValues) => void;
};

const PropertyModal = ({
    initialValues,
    isSubmitting,
    onClose,
    onSubmit,
}: Props) => {
    const [form, setForm] = useState<PropertyFormValues>({
        title: initialValues?.title ?? "",
        description: initialValues?.description ?? "",
        status: initialValues?.status ?? "Draft",
        address: initialValues?.address ?? "",
        suburb: initialValues?.suburb ?? "",
        postcode: initialValues?.postcode ?? "",
        images: [],
        videos: [],
    });

    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);

    useEffect(() => {
        const urls = images.map((file) => URL.createObjectURL(file));

        setImagePreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [images]);

    useEffect(() => {
        const urls = videos.map((file) => URL.createObjectURL(file));

        setVideoPreviews(urls);

        return () => {
            urls.forEach((url) => URL.revokeObjectURL(url));
        };
    }, [videos]);

    const handleSubmit = () => {
        onSubmit({
            ...form,
            images,
            videos,
        });
    };

    return (
        <ModalShell
            title={initialValues ? "Edit Property" : "Add Property"}
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={initialValues ? "Update Property" : "Create Property"}
            isValid={!!form.title}
        >
            <div className="fv-row mb-7">
                <label className="required form-label">Property Name</label>

                <input
                    className="form-control form-control-solid"
                    value={form.title}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            title: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mb-7">
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

            <div className="fv-row mb-7">
                <label className="form-label">Status</label>

                <select
                    className="form-select form-select-solid"
                    value={form.status}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            status: e.target.value as PropertyFormValues["status"],
                        }))
                    }
                >
                    <option value="Draft">Draft</option>

                    <option value="Published">Published</option>

                    <option value="Archived">Archived</option>
                </select>
            </div>

            {/* Address */}
            <div className="fv-row mb-7">
                <label className="form-label">Address</label>

                <input
                    className="form-control form-control-solid"
                    value={form.address}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            address: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Suburb</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.suburb}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    suburb: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Postcode</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.postcode}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    postcode: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>

            {/* Existing Images */}
            {initialValues?.images?.length ? (
                <>
                    <label className="form-label">Existing Photos</label>

                    <div className="row g-3 mb-7">
                        {initialValues.images.map((img) => (
                            <div key={img.url} className="col-md-3">
                                <img
                                    src={img.url}
                                    className="w-100 rounded border"
                                    style={{
                                        height: 150,
                                        objectFit: "cover",
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Upload Images */}
            <div className="fv-row mb-7">
                <label className="form-label">Property Photos</label>

                <div className="border border-dashed border-gray-300 rounded p-5">
                    <input
                        type="file"
                        multiple
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setImages(Array.from(e.target.files ?? []))}
                    />

                    <div className="text-muted fs-7 mt-2">Upload one or more photos</div>
                </div>

                {images.length > 0 && (
                    <div className="text-muted fs-7 mt-2">
                        {images.length} image(s) selected
                    </div>
                )}
            </div>

            {imagePreviews.length > 0 && (
                <div className="row g-3 mb-7">
                    {imagePreviews.map((preview, index) => (
                        <div key={index} className="col-md-3">
                            <img
                                src={preview}
                                className="w-100 rounded border"
                                style={{
                                    height: 150,
                                    objectFit: "cover",
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Existing Videos */}
            {initialValues?.videos?.length ? (
                <>
                    <label className="form-label">Existing Videos</label>

                    <div className="row g-3 mb-7">
                        {initialValues.videos.map((video) => (
                            <div key={video.url} className="col-md-6">
                                <video
                                    src={video.url}
                                    controls
                                    className="w-100 rounded border"
                                />
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Upload Videos */}
            <div className="fv-row mb-7">
                <label className="form-label">Property Videos</label>

                <div className="border border-dashed border-gray-300 rounded p-5">
                    <input
                        type="file"
                        multiple
                        accept="video/*"
                        className="form-control"
                        onChange={(e) => setVideos(Array.from(e.target.files ?? []))}
                    />

                    <div className="text-muted fs-7 mt-2">Upload property videos</div>
                </div>

                {videos.length > 0 && (
                    <div className="text-muted fs-7 mt-2">
                        {videos.length} video(s) selected
                    </div>
                )}
            </div>

            {videoPreviews.length > 0 && (
                <div className="row g-3">
                    {videoPreviews.map((preview, index) => (
                        <div key={index} className="col-md-6">
                            <video src={preview} controls className="w-100 rounded border" />
                        </div>
                    ))}
                </div>
            )}
        </ModalShell>
    );
};

export default PropertyModal;
