import { useState, useEffect } from "react";
import clsx from "clsx";
import { ModalShell } from "../apps/component/ModalShell";
import {
  DEFAULT_FEATURES,
  type Plan,
  type PlanFormValues,
  type PlanFeature,
} from "../../services/features/subscriptions/plan.types";
import { KTIcon } from "../../../_metronic/helpers";

type Props = {
  initialValues?: Plan | null;
  onClose: () => void;
  onSubmit: (values: PlanFormValues) => void;
  isSubmitting?: boolean;
};

const defaultFeatureList = (): PlanFeature[] =>
  DEFAULT_FEATURES.map((f) => ({
    name: f.name,
    enabled: false,
    value: f.numeric ? 0 : undefined,
  }));

const PlanModal = ({
  initialValues,
  onClose,
  onSubmit,
  isSubmitting,
}: Props) => {
  const isEdit = !!initialValues;

  const [form, setForm] = useState<PlanFormValues>({
    name: "",
    price: 0,
    popular: false,
    features: defaultFeatureList(),
  });

  const [newFeatureName, setNewFeatureName] = useState("");
  const [newFeatureNumeric, setNewFeatureNumeric] = useState(false);

  // which row index is currently being edited inline
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [editNumeric, setEditNumeric] = useState(false);

  const [touched, setTouched] = useState({ name: false, price: false });

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        price: initialValues.price,
        popular: initialValues.popular,
        features: initialValues.features,
      });
    }
  }, [initialValues]);

  const nameError = touched.name && !form.name ? "Name is required" : "";
  const priceError =
    touched.price && form.price <= 0 ? "Price must be greater than 0" : "";
  const isValid = !!form.name && form.price > 0;

  const handleSubmit = () => {
    setTouched({ name: true, price: true });
    if (!isValid) return;
    onSubmit(form);
  };

  const isNumeric = (f: PlanFeature) => f.value !== undefined;

  const toggleFeature = (index: number) =>
    setForm((p) => ({
      ...p,
      features: p.features.map((f, i) =>
        i === index ? { ...f, enabled: !f.enabled } : f,
      ),
    }));

  const updateFeatureValue = (index: number, val: string) =>
    setForm((p) => ({
      ...p,
      features: p.features.map((f, i) =>
        i === index ? { ...f, value: val === "" ? 0 : Number(val) } : f,
      ),
    }));

  const removeFeature = (index: number) =>
    setForm((p) => ({
      ...p,
      features: p.features.filter((_, i) => i !== index),
    }));

  const addFeature = () => {
    const name = newFeatureName.trim();
    if (!name) return;
    if (
      form.features.some((f) => f.name.toLowerCase() === name.toLowerCase())
    ) {
      setNewFeatureName("");
      setNewFeatureNumeric(false);
      return;
    }
    setForm((p) => ({
      ...p,
      features: [
        ...p.features,
        { name, enabled: true, value: newFeatureNumeric ? 0 : undefined },
      ],
    }));
    setNewFeatureName("");
    setNewFeatureNumeric(false);
  };

  const handleNewFeatureKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addFeature();
    }
  };

  // ── Edit existing feature ──
  const startEdit = (index: number) => {
    const f = form.features[index];
    setEditingIndex(index);
    setEditName(f.name);
    setEditNumeric(isNumeric(f));
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditName("");
    setEditNumeric(false);
  };

  const saveEdit = () => {
    if (editingIndex === null) return;
    const trimmed = editName.trim();
    if (!trimmed) return;

    // prevent duplicate names against other rows
    const duplicate = form.features.some(
      (f, i) =>
        i !== editingIndex && f.name.toLowerCase() === trimmed.toLowerCase(),
    );
    if (duplicate) return;

    setForm((p) => ({
      ...p,
      features: p.features.map((f, i) => {
        if (i !== editingIndex) return f;
        return {
          ...f,
          name: trimmed,
          // switching numeric on → default value 0 if it wasn't numeric before
          // switching numeric off → drop value entirely
          value: editNumeric ? (f.value ?? 0) : undefined,
        };
      }),
    }));
    cancelEdit();
  };

  const handleEditKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      saveEdit();
    }
    if (e.key === "Escape") {
      cancelEdit();
    }
  };

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
            "is-valid": touched.name && !nameError,
          })}
          placeholder="e.g. Gold"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
        />
        {nameError && (
          <div className="fv-plugins-message-container">
            <span className="fv-help-block">{nameError}</span>
          </div>
        )}
      </div>

      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Price (₹)</label>
        <input
          type="number"
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!priceError,
            "is-valid": touched.price && !priceError,
          })}
          placeholder="e.g. 1999"
          value={form.price || ""}
          onChange={(e) =>
            setForm((p) => ({ ...p, price: Number(e.target.value) }))
          }
          onBlur={() => setTouched((p) => ({ ...p, price: true }))}
        />
        {priceError && (
          <div className="fv-plugins-message-container">
            <span className="fv-help-block">{priceError}</span>
          </div>
        )}
      </div>

      <div className="fv-row mb-7">
        <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            className="form-check-input"
            checked={form.popular}
            onChange={(e) =>
              setForm((p) => ({ ...p, popular: e.target.checked }))
            }
          />
          <span className="fw-bold fs-6">Mark as Most Popular</span>
        </label>
      </div>

      <div className="fv-row mb-7">
        <label className="fw-bold fs-6 mb-4 d-block">Features & Limits</label>

        <div className="d-flex flex-column gap-3 mb-4">
          {form.features.map((feature, i) => {
            const isRowEditing = editingIndex === i;

            if (isRowEditing) {
              return (
                <div
                  key={`edit-${i}`}
                  className="d-flex flex-column gap-2 p-3 rounded border border-primary"
                  style={{ background: "rgba(var(--bs-primary-rgb), 0.04)" }}
                >
                  <div className="d-flex gap-2 align-items-center">
                    <input
                      type="text"
                      className="form-control form-control-solid"
                      value={editName}
                      autoFocus
                      onChange={(e) => setEditName(e.target.value)}
                      onKeyDown={handleEditKeyDown}
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
                      onChange={(e) => setEditNumeric(e.target.checked)}
                    />
                    <span className="text-muted fs-7">
                      This is a numeric limit (e.g. a quantity)
                    </span>
                  </label>
                </div>
              );
            }

            // ── Normal display row ──
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
                    onChange={() => toggleFeature(i)}
                  />
                  <span className="fw-semibold text-gray-800">
                    {feature.name}
                  </span>
                </label>

                {isNumeric(feature) && (
                  <input
                    type="number"
                    className="form-control form-control-solid"
                    style={{ width: 100 }}
                    placeholder="0"
                    value={feature.value || ""}
                    onChange={(e) => updateFeatureValue(i, e.target.value)}
                    disabled={!feature.enabled}
                  />
                )}

                <button
                  type="button"
                  className="btn btn-icon btn-sm btn-light-primary"
                  onClick={() => startEdit(i)}
                  title="Edit"
                >
                  <KTIcon iconName="pencil" className="fs-5" />
                </button>

                <button
                  type="button"
                  className="btn btn-icon btn-sm btn-light-danger"
                  onClick={() => removeFeature(i)}
                  title="Remove"
                >
                  <KTIcon iconName="trash" className="fs-5" />
                </button>
              </div>
            );
          })}

          {form.features.length === 0 && (
            <div className="text-muted fs-7">No features added yet.</div>
          )}
        </div>

        <div className="d-flex flex-column gap-2">
          <div className="d-flex gap-2">
            <input
              type="text"
              className="form-control form-control-solid"
              placeholder="e.g. API Calls or White-label App"
              value={newFeatureName}
              onChange={(e) => setNewFeatureName(e.target.value)}
              onKeyDown={handleNewFeatureKeyDown}
            />
            <button
              type="button"
              className="btn btn-light-primary d-flex align-items-center gap-2"
              onClick={addFeature}
            >
              <KTIcon iconName="plus" className="fs-3" />
              Add
            </button>
          </div>

          <label className="form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="form-check-input"
              checked={newFeatureNumeric}
              onChange={(e) => setNewFeatureNumeric(e.target.checked)}
            />
            <span className="text-muted fs-7">
              This is a numeric limit (e.g. a quantity)
            </span>
          </label>
        </div>
      </div>
    </ModalShell>
  );
};

export { PlanModal };
