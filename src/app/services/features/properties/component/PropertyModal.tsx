import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Property, PropertyFormValues } from "../property.types";
import { LocationAutocomplete, type LocationSelection } from "../../maps/LocationAutocomplete";

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
        address_line_1: initialValues?.address_line_1 ?? initialValues?.address ?? "",
        address_line_2: initialValues?.address_line_2 ?? "",
        full_address: initialValues?.full_address ?? initialValues?.address ?? "",
        formatted_address: initialValues?.formatted_address ?? initialValues?.full_address ?? "",
        place_id: initialValues?.place_id ?? "",
        latitude: initialValues?.latitude ?? "",
        longitude: initialValues?.longitude ?? "",
        suburb: initialValues?.suburb ?? "",
        state: initialValues?.state ?? "",
        postcode: initialValues?.postcode ?? "",
        country: initialValues?.country ?? "Australia",
        property_type_id: initialValues?.property_type_id ?? "",
        location_verified: initialValues?.location_verified ?? false,
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
            country: form.country || "Australia",
            images,
            videos,
        });
    };

    const handleLocationSelect = (selection: LocationSelection) => {
        setForm((prev) => ({
            ...prev,
            address: selection.address ?? prev.address,
            address_line_1: selection.address_line_1 ?? selection.address ?? prev.address_line_1,
            address_line_2: selection.address_line_2 ?? prev.address_line_2,
            full_address: selection.full_address ?? selection.formatted_address ?? prev.full_address,
            formatted_address: selection.formatted_address ?? prev.formatted_address,
            place_id: selection.place_id ?? prev.place_id,
            latitude: selection.latitude ?? prev.latitude,
            longitude: selection.longitude ?? prev.longitude,
            suburb: selection.suburb ?? prev.suburb,
            state: selection.state ?? prev.state,
            postcode: selection.postcode ?? prev.postcode,
            country: selection.country ?? prev.country ?? "Australia",
            location_verified: selection.location_verified ?? prev.location_verified,
        }));
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
            <LocationAutocomplete
                value={form.full_address ?? form.address ?? ""}
                onChange={(value) =>
                    setForm((prev) => ({
                        ...prev,
                        full_address: value,
                        formatted_address: value,
                    }))
                }
                onSelect={handleLocationSelect}
                label="Address search"
                placeholder="Start typing an Australian address"
            />

            <div className="row">
                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Address Line 1</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.address_line_1}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    address_line_1: e.target.value,
                                    address: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Address Line 2</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.address_line_2}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    address_line_2: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="fv-row mb-7">
                <label className="form-label">Full Address</label>

                <textarea
                    rows={3}
                    className="form-control form-control-solid"
                    value={form.full_address ?? ""}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            full_address: e.target.value,
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
                        <label className="form-label">State</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.state}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    state: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="row">
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

                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Country</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.country}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    country: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Latitude</label>

                        <input
                            type="number"
                            step="any"
                            className="form-control form-control-solid"
                            value={form.latitude ?? ""}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    latitude: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Longitude</label>

                        <input
                            type="number"
                            step="any"
                            className="form-control form-control-solid"
                            value={form.longitude ?? ""}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    longitude: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Property Type ID</label>

                        <input
                            className="form-control form-control-solid"
                            value={form.property_type_id}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    property_type_id: e.target.value,
                                }))
                            }
                        />
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Location Verified</label>

                        <select
                            className="form-select form-select-solid"
                            value={String(form.location_verified)}
                            onChange={(e) =>
                                setForm((prev) => ({
                                    ...prev,
                                    location_verified: e.target.value === "true",
                                }))
                            }
                        >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                        </select>
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
