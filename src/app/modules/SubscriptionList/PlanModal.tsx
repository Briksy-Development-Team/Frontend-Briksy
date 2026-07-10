import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { ModalShell } from "../apps/component/ModalShell";
import { KTIcon } from "../../../_metronic/helpers";
import type { PermissionGroup } from "../../services/features/permissions/permission.types";
import type { Addon } from "../../services/features/billing/billing.types";
import {
  DEFAULT_FEATURES,
  type Plan,
  type PlanFeature,
  type PlanFormValues,
} from "../../services/features/subscriptions/plan.types";

type Props = {
  initialValues?: Plan | null;
  onClose: () => void;
  onSubmit: (values: PlanFormValues) => void;
  isSubmitting?: boolean;
  permissionGroups?: PermissionGroup[];
  availableAddons?: Addon[];
};

const defaultFeatureList = (): PlanFeature[] =>
  DEFAULT_FEATURES.map((feature) => ({
    name: feature.name,
    enabled: false,
    value: feature.numeric ? 0 : undefined,
  }));

const normalizeFeatureList = (features?: PlanFeature[]) => {
  if (!features?.length) {
    return defaultFeatureList();
  }

  return features.map((feature) => ({
    name: feature.name,
    enabled: feature.enabled,
    value: feature.value ?? undefined,
  }));
};

const PlanModal = ({
  initialValues,
  onClose,
  onSubmit,
  isSubmitting,
  permissionGroups = [],
  availableAddons = [],
}: Props) => {
  const isEdit = !!initialValues;

  const [form, setForm] = useState<PlanFormValues>({
    name: "",
    description: "",
    price: 0,
    monthly_price: null,
    yearly_price: null,
    currency: "AUD",
    billing_enabled: true,
    trial_days: null,
    propertyLimit: 0,
    popular: false,
    features: defaultFeatureList(),
    permissions: [],
    addon_ids: [],
  });

  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureNumeric, setNewFeatureNumeric] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editNumeric, setEditNumeric] = useState(false);
  const [touched, setTouched] = useState({ name: false, price: false, propertyLimit: false });
  const [permissionSearch, setPermissionSearch] = useState("");

  useEffect(() => {
    if (!initialValues) {
      setPermissionSearch("");
      return;
    }

    setForm({
      name: initialValues.name,
      description: initialValues.description ?? "",
      price: initialValues.price,
      monthly_price: initialValues.monthly_price ?? null,
      yearly_price: initialValues.yearly_price ?? null,
      currency: initialValues.currency ?? "AUD",
      billing_enabled: initialValues.billing_enabled ?? true,
      trial_days: initialValues.trial_days ?? null,
      propertyLimit: initialValues.propertyLimit ?? 0,
      popular: initialValues.popular,
      features: normalizeFeatureList(initialValues.features),
      permissions: initialValues.permissions ?? [],
      addon_ids: initialValues.addons?.map((addon) => addon.id) ?? [],
    });
    setPermissionSearch("");
  }, [initialValues]);

  const isValid = useMemo(
    () => form.name.trim().length > 0 && form.price >= 0 && form.propertyLimit >= 0,
    [form.name, form.price, form.propertyLimit],
  );

  const filteredPermissionGroups = useMemo(() => {
    const query = permissionSearch.trim().toLowerCase();

    if (!query) {
      return permissionGroups;
    }

    return permissionGroups
      .map((group) => ({
        ...group,
        permissions: group.permissions.filter((permission) => {
          const haystack = [
            group.module,
            permission.name,
            permission.display_name ?? "",
            permission.action,
          ]
            .join(" ")
            .toLowerCase();

          return haystack.includes(query);
        }),
      }))
      .filter((group) => group.permissions.length > 0);
  }, [permissionGroups, permissionSearch]);

  const selectedPermissionsCount = form.permissions.length;
  const totalPermissionsCount = permissionGroups.reduce(
    (count, group) => count + group.permissions.length,
    0,
  );

  const nameError = touched.name && !form.name ? "Name is required" : "";
  const priceError = touched.price && form.price < 0 ? "Price cannot be negative" : "";
  const propertyLimitError =
    touched.propertyLimit && form.propertyLimit < 0 ? "Property limit cannot be negative" : "";

  const handleSubmit = () => {
    setTouched({ name: true, price: true, propertyLimit: true });

    if (!isValid) {
      return;
    }

    onSubmit(form);
  };

  const isNumeric = (feature: PlanFeature) => feature.value !== undefined;

  const toggleFeature = (index: number) =>
    setForm((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index
          ? { ...feature, enabled: !feature.enabled }
          : feature,
      ),
    }));

  const updateFeatureValue = (index: number, value: string) =>
    setForm((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) =>
        featureIndex === index
          ? { ...feature, value: value === "" ? 0 : Number(value) }
          : feature,
      ),
    }));

  const removeFeature = (index: number) =>
    setForm((current) => ({
      ...current,
      features: current.features.filter((_, featureIndex) => featureIndex !== index),
    }));

  const addFeature = () => {
    const name = newFeatureName.trim();
    if (!name) {
      return;
    }

    if (form.features.some((feature) => feature.name.toLowerCase() === name.toLowerCase())) {
      setNewFeatureName("");
      setNewFeatureNumeric(false);
      return;
    }

    setForm((current) => ({
      ...current,
      features: [
        ...current.features,
        { name, enabled: true, value: newFeatureNumeric ? 0 : undefined },
      ],
    }));
    setNewFeatureName("");
    setNewFeatureNumeric(false);
  };

  const startEdit = (index: number) => {
    const feature = form.features[index];
    setEditingIndex(index);
    setEditName(feature.name);
    setEditNumeric(isNumeric(feature));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditNumeric(false);
  };

  const saveEdit = () => {
    if (editingIndex === null) {
      return;
    }

    const trimmed = editName.trim();
    if (!trimmed) {
      return;
    }

    const duplicate = form.features.some(
      (feature, featureIndex) =>
        featureIndex !== editingIndex &&
        feature.name.toLowerCase() === trimmed.toLowerCase(),
    );

    if (duplicate) {
      return;
    }

    setForm((current) => ({
      ...current,
      features: current.features.map((feature, featureIndex) => {
        if (featureIndex !== editingIndex) {
          return feature;
        }

        return {
          ...feature,
          name: trimmed,
          value: editNumeric ? (feature.value ?? 0) : undefined,
        };
      }),
    }));
    cancelEdit();
  };

  const togglePermission = (permissionName: string) =>
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permissionName)
        ? current.permissions.filter((value) => value !== permissionName)
        : [...current.permissions, permissionName],
    }));

  const setModulePermissions = (group: PermissionGroup, enabled: boolean) =>
    setForm((current) => {
      const modulePermissions = group.permissions.map((permission) => permission.name);
      const nextPermissions = enabled
        ? Array.from(new Set([...current.permissions, ...modulePermissions]))
        : current.permissions.filter((permission) => !modulePermissions.includes(permission));

      return {
        ...current,
        permissions: nextPermissions,
      };
    });

  const toggleAddon = (addonId: string) =>
    setForm((current) => ({
      ...current,
      addon_ids: current.addon_ids?.includes(addonId)
        ? current.addon_ids.filter((value) => value !== addonId)
        : [...(current.addon_ids ?? []), addonId],
    }));

  return (
    <ModalShell
      title={isEdit ? "Edit Plan" : "Add Plan"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEdit ? "Update Plan" : "Create Plan"}
      isValid={isValid}
    >
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Plan Name</label>
        <input
          type="text"
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!nameError,
          })}
          placeholder="e.g. Gold"
          value={form.name}
          onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
          onBlur={() => setTouched((current) => ({ ...current, name: true }))}
        />
        {nameError ? (
          <div className="fv-plugins-message-container">
            <span className="fv-help-block">{nameError}</span>
          </div>
        ) : null}
      </div>

      <div className="row g-5 mb-7">
        <div className="col-md-6">
          <label className="required fw-bold fs-6 mb-2">Legacy Price</label>
          <input
            type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
            className={clsx("form-control form-control-solid", {
              "is-invalid": !!priceError,
            })}
            placeholder="e.g. 1999"
            value={form.price || ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: Number(event.target.value) }))
            }
            onBlur={() => setTouched((current) => ({ ...current, price: true }))}
          />
          {priceError ? (
            <div className="fv-plugins-message-container">
              <span className="fv-help-block">{priceError}</span>
            </div>
          ) : null}
        </div>

        <div className="col-md-6">
          <label className="required fw-bold fs-6 mb-2">Property Limit</label>
          <input
            type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
            className={clsx("form-control form-control-solid", {
              "is-invalid": !!propertyLimitError,
            })}
            placeholder="e.g. 25"
            value={form.propertyLimit || ""}
            onChange={(event) =>
              setForm((current) => ({ ...current, propertyLimit: Number(event.target.value) }))
            }
            onBlur={() => setTouched((current) => ({ ...current, propertyLimit: true }))}
          />
          {propertyLimitError ? (
            <div className="fv-plugins-message-container">
              <span className="fv-help-block">{propertyLimitError}</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="row g-5 mb-7">
        <div className="col-md-6">
          <label className="fw-bold fs-6 mb-2">Description</label>
          <textarea
            className="form-control form-control-solid"
            rows={3}
            placeholder="Describe the plan"
            value={form.description ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
          />
        </div>
      </div>

      <div className="row g-5 mb-7">
        <div className="col-md-4">
          <label className="fw-bold fs-6 mb-2">Monthly Price</label>
          <input
            type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
            className="form-control form-control-solid"
            placeholder="e.g. 49"
            value={form.monthly_price ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                monthly_price: event.target.value === "" ? null : Number(event.target.value),
              }))
            }
          />
        </div>
        <div className="col-md-4">
          <label className="fw-bold fs-6 mb-2">Yearly Price</label>
          <input
            type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
            className="form-control form-control-solid"
            placeholder="e.g. 490"
            value={form.yearly_price ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                yearly_price: event.target.value === "" ? null : Number(event.target.value),
              }))
            }
          />
        </div>
        <div className="col-md-4">
          <label className="fw-bold fs-6 mb-2">Currency</label>
          <input
            type="text"
            className="form-control form-control-solid"
            placeholder="AUD"
            value={form.currency ?? "AUD"}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                currency: event.target.value.toUpperCase(),
              }))
            }
          />
        </div>
      </div>

      <div className="row g-5 mb-7">
        <div className="col-md-6">
          <label className="fw-bold fs-6 mb-2">Trial Days</label>
          <input
            type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
            className="form-control form-control-solid"
            placeholder="e.g. 14"
            value={form.trial_days ?? ""}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                trial_days: event.target.value === "" ? null : Number(event.target.value),
              }))
            }
          />
        </div>
        <div className="col-md-6 d-flex align-items-end">
          <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              className="form-check-input"
              checked={form.billing_enabled ?? true}
              onChange={(event) =>
                setForm((current) => ({ ...current, billing_enabled: event.target.checked }))
              }
            />
            <span className="fw-bold fs-6">Enable Billing Cycle Pricing</span>
          </label>
        </div>
      </div>

      <div className="fv-row mb-7">
        <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.popular}
            onChange={(event) =>
              setForm((current) => ({ ...current, popular: event.target.checked }))
            }
          />
          <span className="fw-bold fs-6">Mark as Most Popular</span>
        </label>
      </div>

      <div className="fv-row mb-7">
        <label className="fw-bold fs-6 mb-4 d-block">Features & Limits</label>

        <div className="d-flex flex-column gap-3 mb-4">
          {form.features.map((feature, index) => {
            const isEditing = editingIndex === index;

            if (isEditing) {
              return (
                <div
                  key={`edit-${index}`}
                  className="d-flex flex-column gap-2 p-3 rounded border border-primary"
                  style={{ background: "rgba(var(--bs-primary-rgb), 0.04)" }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      value={editName}
                      autoFocus
                      onChange={(event) => setEditName(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Enter") {
                          event.preventDefault();
                          saveEdit();
                        }
                        if (event.key === "Escape") {
                          cancelEdit();
                        }
                      }}
                    />
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-light-success"
                      onClick={saveEdit}
                      title="Save"
                    >
                      <KTIcon iconName="check" className="fs-5" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-icon btn-sm btn-light"
                      onClick={cancelEdit}
                      title="Cancel"
                    >
                      <KTIcon iconName="cross" className="fs-5" />
                    </button>
                  </div>

                  <label className="form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center gap-2 cursor-pointer m-0">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      checked={editNumeric}
                      onChange={(event) => setEditNumeric(event.target.checked)}
                    />
                    <span className="text-muted fs-7">
                      This is a numeric limit (e.g. a quantity)
                    </span>
                  </label>
                </div>
              );
            }

            return (
              <div
                key={feature.name}
                className="d-flex align-items-center justify-content-between gap-3"
              >
                <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer m-0 flex-grow-1">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={feature.enabled}
                    onChange={() => toggleFeature(index)}
                  />
                  <span className="fw-semibold text-gray-800">{feature.name}</span>
                </label>

                {isNumeric(feature) ? (
                  <input
                    type="number" min="0" onKeyDown={(e) => { if (e.key === "-" || e.key === "e") e.preventDefault(); }}
                    className="form-control form-control-solid w-100px"
                    value={feature.value ?? 0}
                    onChange={(event) => updateFeatureValue(index, event.target.value)}
                  />
                ) : null}

                <div className="d-flex gap-2">
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-light-primary"
                    onClick={() => startEdit(index)}
                    title="Edit feature"
                  >
                    <KTIcon iconName="pencil" className="fs-5" />
                  </button>
                  <button
                    type="button"
                    className="btn btn-icon btn-sm btn-light-danger"
                    onClick={() => removeFeature(index)}
                    title="Remove feature"
                  >
                    <KTIcon iconName="trash" className="fs-5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control form-control-solid"
            placeholder="e.g. API Calls or White-label App"
            value={newFeatureName}
            onChange={(event) => setNewFeatureName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                addFeature();
              }
            }}
          />
          <button type="button" className="btn btn-light-primary" onClick={addFeature}>
            <KTIcon iconName="plus" className="fs-2" />
            Add
          </button>
        </div>

        <label className="form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center gap-2 cursor-pointer mt-3">
          <input
            type="checkbox"
            className="form-check-input"
            checked={newFeatureNumeric}
            onChange={(event) => setNewFeatureNumeric(event.target.checked)}
          />
          <span className="text-muted fs-7">
            This is a numeric limit (e.g. a quantity)
          </span>
        </label>

        {availableAddons.length > 0 ? (
          <div className="mt-8">
            <label className="fw-bold fs-6 mb-4 d-block">Included Add-ons</label>
            <div className="row g-3">
              {availableAddons.map((addon) => {
                const checked = form.addon_ids?.includes(addon.id) ?? false;

                return (
                  <div className="col-md-6" key={addon.id}>
                    <label className={`form-check form-check-custom form-check-solid d-flex gap-3 m-0 p-3 rounded-3 border ${checked ? "border-primary bg-white" : "border-light"}`}>
                      <input
                        type="checkbox"
                        className="form-check-input mt-1"
                        checked={checked}
                        onChange={() => toggleAddon(addon.id)}
                      />
                      <span className="flex-grow-1">
                        <span className="fw-semibold d-block mb-1">{addon.name}</span>
                        <span className="text-muted fs-7">
                          {addon.feature_key} · {addon.pricing_type}
                        </span>
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {permissionGroups.length > 0 ? (
          <div className="mt-8">
            <div className="d-flex flex-wrap align-items-end justify-content-between gap-3 mb-4">
              <div>
                <label className="fw-bold fs-6 mb-1 d-block">Plan Permissions</label>
                <div className="text-muted fs-7">
                  Choose the access this plan should grant to admins.
                </div>
              </div>

              <div className="d-flex align-items-center gap-2">
                <span className="badge badge-light-primary">
                  {selectedPermissionsCount} selected
                </span>
                <span className="badge badge-light">
                  {totalPermissionsCount} available
                </span>
              </div>
            </div>

            <div className="mb-4">
              <input
                type="text"
                className="form-control form-control-solid"
                placeholder="Search permissions by module, action, or name"
                value={permissionSearch}
                onChange={(event) => setPermissionSearch(event.target.value)}
              />
            </div>

            <div className="row g-4">
              {filteredPermissionGroups.map((group) => {
                const selectedInModule = group.permissions.filter((permission) =>
                  form.permissions.includes(permission.name),
                ).length;
                const allInModuleSelected =
                  group.permissions.length > 0 &&
                  selectedInModule === group.permissions.length;
                const someInModuleSelected =
                  selectedInModule > 0 && selectedInModule < group.permissions.length;

                return (
                  <div className="col-12 col-xl-6" key={group.module}>
                    <div className="border rounded-3 p-4 h-100 bg-light">
                      <div className="d-flex align-items-start justify-content-between gap-3 mb-4">
                        <div>
                          <div className="fw-semibold text-uppercase text-muted fs-7 mb-1">
                            {group.module.replace(/_/g, " ")}
                          </div>
                          <div className="text-muted fs-7">
                            {selectedInModule} of {group.permissions.length} enabled
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2">
                          <button
                            type="button"
                            className={`btn btn-sm ${allInModuleSelected ? "btn-light-success" : "btn-light-primary"}`}
                            onClick={() => setModulePermissions(group, true)}
                          >
                            Select all
                          </button>
                          <button
                            type="button"
                            className={`btn btn-sm ${someInModuleSelected ? "btn-light-warning" : "btn-light"}`}
                            onClick={() => setModulePermissions(group, false)}
                          >
                            Clear
                          </button>
                        </div>
                      </div>

                      <div className="d-flex flex-column gap-3">
                        {group.permissions.map((permission) => {
                          const checked = form.permissions.includes(permission.name);

                          return (
                            <label
                              key={permission.id}
                              className={`form-check form-check-custom form-check-solid d-flex gap-3 m-0 p-3 rounded-3 border ${
                                checked ? "border-primary bg-white" : "border-light"
                              }`}
                            >
                              <input
                                type="checkbox"
                                className="form-check-input mt-1"
                                checked={checked}
                                onChange={() => togglePermission(permission.name)}
                              />
                              <span className="flex-grow-1">
                                <span className="fw-semibold d-block mb-1">
                                  {permission.display_name ?? permission.name}
                                </span>
                                <span className="d-flex flex-wrap align-items-center gap-2">
                                  <span className="badge badge-light">{permission.action}</span>
                                  <span className="text-muted fs-7">{permission.name}</span>
                                </span>
                              </span>
                            </label>
                          );
                        })}
                      </div>

                      {group.permissions.length === 0 ? (
                        <div className="text-muted fs-7">No permissions match the current search.</div>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>

            {filteredPermissionGroups.length === 0 ? (
              <div className="alert alert-light-info mt-4 mb-0">
                No permissions match your search.
              </div>
            ) : null}

            <div className="alert alert-light-primary mt-4 mb-0">
              This section controls role-like access for the plan. Permissions are matched by name, so keep them
              aligned with the backend permission catalog.
            </div>
          </div>
        ) : null}
      </div>
    </ModalShell>
  );
};

export { PlanModal };
