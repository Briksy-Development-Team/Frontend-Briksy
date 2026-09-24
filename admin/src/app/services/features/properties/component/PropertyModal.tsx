import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Property, PropertyFormValues, PropertyImage, PropertyVideo } from "../property.types";
import { LocationAutocomplete, type LocationSelection } from "../../maps/LocationAutocomplete";
import { LocationMapPreview } from "../../maps/LocationMapPreview";
import { useAuth, useRoleAccess } from "../../../../modules/auth";
import { mediaAllowance } from "../../../../modules/subscription/mediaEntitlements";
import { deletePropertyMediaApi, fetchPropertyFeaturesApi } from "../property.api";
import { fetchOrganizationApi, fetchOrganizationByIdApi } from "../../organization/organization.api";
import { mapOrganization } from "../../organization/organization.mapper";
import type { Organization } from "../../organization/organization.types";
import type { PropertyFeatureGroup } from "../property.types";

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
    const MAX_VIDEO_SIZE = 1024 * 1024 * 1024;
    const ALLOWED_VIDEO_TYPES = new Set(["video/mp4", "video/quicktime", "video/x-msvideo", "video/x-matroska", "video/webm"]);
    const { isSuperAdmin } = useRoleAccess();
    const { entitlements } = useAuth();
    const allowance = mediaAllowance(entitlements);
    const [organizations, setOrganizations] = useState<Organization[]>([]);
    const [organizationSearch, setOrganizationSearch] = useState("");
    const [organizationsLoading, setOrganizationsLoading] = useState(false);
    const [organizationsError, setOrganizationsError] = useState<string | null>(null);
    const [featureGroups, setFeatureGroups] = useState<PropertyFeatureGroup[]>([]);
    const [featuresLoading, setFeaturesLoading] = useState(true);
    const [form, setForm] = useState<PropertyFormValues>({
        title: initialValues?.title ?? "",
        organization_id: initialValues?.organization?.id ?? "",
        description: initialValues?.description ?? "",
        status: initialValues?.status ?? "Draft",
        listing_purpose: initialValues?.listing_purpose ?? "SELL",
        price: initialValues?.price ?? "",
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
        features: initialValues?.features?.map((feature) => feature.id) ?? [],
        images: [],
        videos: [],
    });

    const [images, setImages] = useState<File[]>([]);
    const [videos, setVideos] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<PropertyImage[]>(initialValues?.images ?? []);
    const [existingVideos, setExistingVideos] = useState<PropertyVideo[]>(initialValues?.videos ?? []);
    const [deletingImageIds, setDeletingImageIds] = useState<string[]>([]);

    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoPreviews, setVideoPreviews] = useState<string[]>([]);
    const [mediaError, setMediaError] = useState<string | null>(null);

    const handleMediaChange = (files: File[]) => {
        const invalidVideo = files.find((file) => file.type.startsWith("video/") && (!ALLOWED_VIDEO_TYPES.has(file.type) || file.size > MAX_VIDEO_SIZE));
        if (invalidVideo) {
            setMediaError(`${invalidVideo.name} must be an MP4, MOV, AVI, MKV, or WebM video smaller than 1 GB.`);
            setImages([]);
            setVideos([]);
            return;
        }
        const nextImages = files.filter((file) => file.type.startsWith("image/"));
        const nextVideos = files.filter((file) => file.type.startsWith("video/"));
        if (allowance.imagesConfigured && allowance.images !== null && existingImages.length + nextImages.length > allowance.images) {
            setMediaError(`Your ${allowance.planName} plan allows a maximum of ${allowance.images} images. Remove an image or upgrade your plan.`);
            return;
        }
        if (nextVideos.length > 0 && !allowance.videoIncluded) {
            setMediaError("Video uploads are not included in your current plan.");
            return;
        }
        if (allowance.videosConfigured && allowance.videos !== null && existingVideos.length + nextVideos.length > allowance.videos) {
            setMediaError(`Your ${allowance.planName} plan allows a maximum of ${allowance.videos} videos. Remove a video or upgrade your plan.`);
            return;
        }
        setMediaError(null);
        setImages(nextImages);
        setVideos(nextVideos);
    };

    useEffect(() => {
        let active = true;
        setFeaturesLoading(true);
        void fetchPropertyFeaturesApi()
            .then((groups) => { if (active) setFeatureGroups(groups); })
            .catch(() => { if (active) setFeatureGroups([]); })
            .finally(() => { if (active) setFeaturesLoading(false); });
        return () => { active = false; };
    }, []);

    useEffect(() => {
        if (!initialValues) {
            setForm({
                title: "",
                organization_id: "",
                description: "",
                status: "Draft",
                listing_purpose: "SELL",
                price: "",
                address: "",
                address_line_1: "",
                address_line_2: "",
                full_address: "",
                formatted_address: "",
                place_id: "",
                latitude: "",
                longitude: "",
                suburb: "",
                state: "",
                postcode: "",
                country: "Australia",
                property_type_id: "",
                location_verified: false,
                features: [],
                images: [],
                videos: [],
            });
            setImages([]);
            setVideos([]);
            setExistingImages([]);
            setExistingVideos([]);
            return;
        }

        setForm({
            title: initialValues.title ?? "",
            organization_id: initialValues.organization?.id ?? "",
            description: initialValues.description ?? "",
            status: initialValues.status ?? "Draft",
            listing_purpose: initialValues.listing_purpose ?? "SELL",
            price: initialValues.price ?? "",
            address: initialValues.address ?? "",
            address_line_1: initialValues.address_line_1 ?? initialValues.address ?? "",
            address_line_2: initialValues.address_line_2 ?? "",
            full_address: initialValues.full_address ?? initialValues.address ?? "",
            formatted_address: initialValues.formatted_address ?? initialValues.full_address ?? "",
            place_id: initialValues.place_id ?? "",
            latitude: initialValues.latitude ?? "",
            longitude: initialValues.longitude ?? "",
            suburb: initialValues.suburb ?? "",
            state: initialValues.state ?? "",
            postcode: initialValues.postcode ?? "",
            country: initialValues.country ?? "Australia",
            property_type_id: initialValues.property_type_id ?? "",
            location_verified: initialValues.location_verified ?? false,
            features: initialValues.features?.map((feature) => feature.id) ?? [],
            images: [],
            videos: [],
        });
        setImages([]);
        setVideos([]);
        setExistingImages(initialValues.images ?? []);
        setExistingVideos(initialValues.videos ?? []);
    }, [initialValues]);

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

    useEffect(() => {
        if (!isSuperAdmin) return;

        let active = true;
        setOrganizationsLoading(true);
        setOrganizationsError(null);
        const timer = window.setTimeout(() => {
            void fetchOrganizationApi({ page: 1, per_page: 25, search: organizationSearch || undefined })
                .then((result) => {
                    if (!active) return;
                    const next: Organization[] = result.data.map(mapOrganization);
                    setOrganizations((current) => {
                        const selected = current.find((item) => item.id === form.organization_id);
                        return selected && !next.some((item) => item.id === selected.id) ? [selected, ...next] : next;
                    });
                })
                .catch(() => { if (active) setOrganizationsError("Unable to load organizations."); })
                .finally(() => { if (active) setOrganizationsLoading(false); });
        }, 250);

        return () => {
            active = false;
            window.clearTimeout(timer);
        };
    }, [isSuperAdmin, organizationSearch, form.organization_id]);

    useEffect(() => {
        if (!isSuperAdmin || !form.organization_id || organizations.some((item) => item.id === form.organization_id)) return;

        let active = true;
        void fetchOrganizationByIdApi(form.organization_id)
            .then((item) => {
                if (active && item) setOrganizations((current) => [mapOrganization(item), ...current]);
            })
            .catch(() => undefined);

        return () => { active = false; };
    }, [isSuperAdmin, form.organization_id, organizations]);

    const handleSubmit = () => {
        onSubmit({
            ...form,
            country: form.country || "Australia",
            status: isSuperAdmin ? form.status : "Pending Review",
            // Location verification is controlled by the dedicated review
            // endpoint and is intentionally not part of CRUD payloads.
            location_verified: undefined,
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

    const handleDeleteExistingImage = async (image: PropertyImage) => {
        if (!image.id) {
            return;
        }

        const confirmed = window.confirm("Delete this image?");
        if (!confirmed) {
            return;
        }

        setDeletingImageIds((prev) => [...prev, image.id as string]);

        try {
            await deletePropertyMediaApi(image.id);
            setExistingImages((prev) => prev.filter((item) => item.id !== image.id));
        } catch (error) {
            console.error("Failed to delete property image.", error);
            window.alert("Failed to delete the image. Please try again.");
        } finally {
            setDeletingImageIds((prev) => prev.filter((id) => id !== image.id));
        }
    };

    const handleDeleteExistingVideo = async (video: PropertyVideo) => {
        if (!video.id || !window.confirm("Delete this video?")) return;
        setDeletingImageIds((prev) => [...prev, video.id as string]);
        try {
            await deletePropertyMediaApi(video.id);
            setExistingVideos((prev) => prev.filter((item) => item.id !== video.id));
        } catch {
            window.alert("Failed to delete the video. Please try again.");
        } finally {
            setDeletingImageIds((prev) => prev.filter((id) => id !== video.id));
        }
    };

    const toggleFeature = (featureId: string) => {
        setForm((prev) => ({
            ...prev,
            features: prev.features?.includes(featureId)
                ? prev.features.filter((id) => id !== featureId)
                : [...(prev.features ?? []), featureId],
        }));
    };

    return (
        <ModalShell
            title={initialValues ? "Edit Property" : "Add Property"}
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={initialValues ? "Update Property" : "Create Property"}
            isValid={!!form.title && (!isSuperAdmin || !!form.organization_id)}
        >
            <div className="fv-row mb-7">
                {isSuperAdmin ? (
                    <>
                        <label className="required form-label">Organization</label>
                        <input
                            className="form-control form-control-solid"
                            value={organizationSearch}
                            onChange={(e) => setOrganizationSearch(e.target.value)}
                            placeholder="Search organizations by name or code"
                        />
                        <select
                            className="form-select form-select-solid mt-2"
                            value={form.organization_id ?? ""}
                            onChange={(e) => setForm((prev) => ({ ...prev, organization_id: e.target.value }))}
                            disabled={organizationsLoading}
                            required
                        >
                            <option value="">{organizationsLoading ? "Loading organizations..." : "Select organization"}</option>
                            {organizations.map((organization) => (
                                <option value={organization.id} key={organization.id}>
                                    {organization.name}{organization.display_id ? ` — ${organization.display_id}` : ""}
                                </option>
                            ))}
                        </select>
                        {organizationsError ? <div className="text-danger mt-2">{organizationsError}</div> : null}
                        {!organizationsLoading && !organizationsError && organizations.length === 0 ? <div className="text-muted mt-2">No organizations found.</div> : null}
                    </>
                ) : null}
            </div>
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

            <div className="row">
                <div className="col-md-6 fv-row mb-7">
                    <label className="form-label">Listing Purpose</label>
                    <select className="form-select form-select-solid" value={form.listing_purpose ?? "SELL"}
                        onChange={(e) => setForm((prev) => ({ ...prev, listing_purpose: e.target.value as PropertyFormValues["listing_purpose"] }))}>
                        <option value="SELL">Sell</option>
                        <option value="RENT">Rent</option>
                        <option value="BOTH">Both</option>
                    </select>
                </div>
                <div className="col-md-6 fv-row mb-7">
                    <label className="form-label">Price</label>
                    <input type="number" min="0" step="0.01" className="form-control form-control-solid" value={form.price ?? ""}
                        onChange={(e) => setForm((prev) => ({ ...prev, price: e.target.value }))} />
                </div>
            </div>

            <div className="fv-row mb-7">
                <label className="form-label">Property Features</label>
                {featuresLoading ? <div className="text-muted fs-7">Loading property features...</div> : null}
                {!featuresLoading && featureGroups.length === 0 ? <div className="text-muted fs-7">No property features are configured.</div> : null}
                <div className="d-flex flex-column gap-4">
                    {featureGroups.map((group) => (
                        <div key={group.id}>
                            <div className="fw-semibold mb-2">{group.name}</div>
                            <div className="row g-2">
                                {group.features.map((feature) => (
                                    <div className="col-md-6" key={feature.id}>
                                        <label className="form-check form-check-custom form-check-solid">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                checked={form.features?.includes(feature.id) ?? false}
                                                onChange={() => toggleFeature(feature.id)}
                                            />
                                            <span className="form-check-label">{feature.name}</span>
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {isSuperAdmin ? (
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
                        <option value="Pending Review">Pending Review</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Published">Published</option>
                        <option value="Archived">Archived</option>
                    </select>
                </div>
            ) : null}

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

                <div className="col-md-6">
                    <div className="fv-row mb-7">
                        <label className="form-label">Property Rating</label>
                        <input className="form-control form-control-solid" value={initialValues?.rating ?? 0} readOnly disabled />
                        <div className="form-text">Calculated from property reviews.</div>
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

            <div className="fv-row mb-7">
                <label className="form-label">Map Preview</label>
                <LocationMapPreview
                    latitude={form.latitude ?? null}
                    longitude={form.longitude ?? null}
                    address={form.formatted_address ?? form.full_address ?? form.address}
                    onChange={handleLocationSelect}
                    height={260}
                />
                <div className="text-muted fs-7 mt-2">
                    Drag the marker or click on the map to reverse geocode the address.
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

                        {isSuperAdmin ? (
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
                        ) : (
                            <div className="form-control form-control-solid bg-light">
                                {form.location_verified ? "Verified" : "Pending super-admin review"}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Existing Images */}
            {existingImages.length ? (
                <>
                    <label className="form-label">Existing Photos</label>

                    <div className="row g-3 mb-7">
                        {existingImages.map((img) => (
                            <div key={img.id ?? img.url} className="col-md-3">
                                <div className="position-relative">
                                    <img
                                        src={img.url}
                                        className="w-100 rounded border"
                                        style={{
                                            height: 150,
                                            objectFit: "cover",
                                        }}
                                    />

                                    {img.id ? (
                                        <button
                                            type="button"
                                            className="btn btn-sm btn-light-danger btn-icon position-absolute top-0 end-0 m-2 shadow-sm"
                                            onClick={() => handleDeleteExistingImage(img)}
                                            disabled={deletingImageIds.includes(img.id)}
                                            aria-label="Delete image"
                                        >
                                            {deletingImageIds.includes(img.id) ? (
                                                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true" />
                                            ) : (
                                                <span className="fw-bold fs-3" aria-hidden="true">×</span>
                                            )}
                                        </button>
                                    ) : null}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

            {/* Upload Images */}
            <div className="fv-row mb-7">
                <label className="form-label">Property Media</label>

                <div className="alert alert-light-info py-2 fs-7">Plan media allowance<br />• {allowance.imagesConfigured ? `Up to ${allowance.images ?? 0} images` : "Image limit is not configured"}<br />• {allowance.videosConfigured ? `Up to ${allowance.videos ?? 0} videos` : "Video limit is not configured"}<br />• Only media within your current plan allowance will be displayed publicly.</div>

                <div className="border border-dashed border-gray-300 rounded p-5">
                    <input
                        type="file"
                        multiple
                        accept="image/jpeg,image/png,image/webp,video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm"
                        className="form-control"
                        onChange={(e) => handleMediaChange(Array.from(e.target.files ?? []))}
                    />

                    <div className="text-muted fs-7 mt-2">Upload images and videos together</div>
                    {mediaError && <div className="text-danger fs-7 mt-2">{mediaError}</div>}
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
            {existingVideos.length ? (
                <>
                    <label className="form-label">Existing Videos</label>

                    <div className="row g-3 mb-7">
                        {existingVideos.map((video) => (
                            <div key={video.id ?? video.url} className="col-md-6 position-relative">
                                <video
                                    src={video.url}
                                    controls
                                    className="w-100 rounded border"
                                />
                                {video.id ? <button type="button" className="btn btn-sm btn-light-danger btn-icon position-absolute top-0 end-0 m-2 shadow-sm" onClick={() => void handleDeleteExistingVideo(video)} disabled={deletingImageIds.includes(video.id)} aria-label="Delete video"><span className="fw-bold fs-3" aria-hidden="true">×</span></button> : null}
                            </div>
                        ))}
                    </div>
                </>
            ) : null}

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
