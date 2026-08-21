import { useState, useEffect } from "react"
import clsx from "clsx"
import { ModalShell } from "../../../../modules/apps/component/ModalShell"
import { useModuleAccess, useRoleAccess } from "../../../../modules/auth"
import {
  ADMIN_PERMISSIONS,
  SUPER_ADMIN_PERMISSIONS,
  PERMISSION_LABELS,
  type StaffMember,
  type StaffFormValues,
  type PlatformPermission,
} from "../staff.types"

type Props = {
  initialValues?: StaffMember | null
  onClose: () => void
  onSubmit: (values: StaffFormValues) => void
  isSubmitting?: boolean
}

const StaffModal = ({ initialValues, onClose, onSubmit, isSubmitting }: Props) => {
  const isEdit = !!initialValues
  const { isSuperAdmin } = useRoleAccess()
  const { hasModule } = useModuleAccess()
  const availablePermissions = isSuperAdmin
    ? SUPER_ADMIN_PERMISSIONS
    : [
        "dashboard.view",
        ...(hasModule("property_management")
          ? ADMIN_PERMISSIONS.filter((perm) => perm.startsWith("property."))
          : []),
        ...(hasModule("service_management")
          ? ADMIN_PERMISSIONS.filter((perm) => perm.startsWith("service."))
          : []),
        ...ADMIN_PERMISSIONS.filter(
          (perm) => perm.startsWith("user.") || perm.startsWith("settings."),
        ),
      ].filter((perm, index, array) => array.indexOf(perm) === index) as typeof ADMIN_PERMISSIONS[number][]

  const [form, setForm] = useState<StaffFormValues>({
    name: "",
    email: "",
    password: "",
    permissions: [],
  })

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
  })

  useEffect(() => {
    if (initialValues) {
      setForm({
        name: initialValues.name,
        email: initialValues.email,
        password: "",
        permissions: initialValues.permissions,
      })
    }
  }, [initialValues])

  const nameError = touched.name && !form.name ? "Name is required" : ""
  const emailError = touched.email && !form.email ? "Email is required" : ""
  const passwordError =
    !isEdit && touched.password && !form.password ? "Password is required" : ""

  const isValid = !!form.name && !!form.email && (isEdit || !!form.password)

  const togglePermission = (perm: PlatformPermission) => {
    setForm((prev) => ({
      ...prev,
      permissions: prev.permissions.includes(perm)
        ? prev.permissions.filter((p) => p !== perm)
        : [...prev.permissions, perm],
    }))
  }

  const handleSubmit = () => {
    setTouched({ name: true, email: true, password: true })
    if (!isValid) return
    onSubmit(form)
  }

  return (
    <ModalShell
      title={isEdit ? "Edit Staff Member" : "Add Staff Member"}
      onClose={onClose}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      submitLabel={isEdit ? "Update" : "Add Staff"}
      isValid={isValid}
    >
      {/* Name */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Full Name</label>
        <input
          type="text"
          placeholder="Full name"
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
          onBlur={() => setTouched((p) => ({ ...p, name: true }))}
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!nameError,
            "is-valid": touched.name && !nameError,
          })}
          autoComplete="off"
        />
        {nameError && (
          <div className="fv-plugins-message-container">
            <span className="fv-help-block">{nameError}</span>
          </div>
        )}
      </div>

      {/* Email */}
      <div className="fv-row mb-7">
        <label className="required fw-bold fs-6 mb-2">Email</label>
        <input
          type="email"
          placeholder="Email address"
          value={form.email}
          onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          onBlur={() => setTouched((p) => ({ ...p, email: true }))}
          className={clsx("form-control form-control-solid", {
            "is-invalid": !!emailError,
            "is-valid": touched.email && !emailError,
          })}
          autoComplete="off"
        />
        {emailError && (
          <div className="fv-plugins-message-container">
            <span className="fv-help-block">{emailError}</span>
          </div>
        )}
      </div>

      {/* Password — only on create */}
      {!isEdit && (
        <div className="fv-row mb-7">
          <label className="required fw-bold fs-6 mb-2">Password</label>
          <input
            type="password"
            placeholder="Temporary password"
            value={form.password ?? ""}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            onBlur={() => setTouched((p) => ({ ...p, password: true }))}
            className={clsx("form-control form-control-solid", {
              "is-invalid": !!passwordError,
              "is-valid": touched.password && !passwordError,
            })}
            autoComplete="off"
          />
          {passwordError && (
            <div className="fv-plugins-message-container">
              <span className="fv-help-block">{passwordError}</span>
            </div>
          )}
        </div>
      )}

      {/* Permissions */}
      <div className="fv-row mb-7">
        <label className="fw-bold fs-6 mb-4 d-block">Permissions</label>
        <div className="d-flex flex-column gap-4">
          {availablePermissions.map((perm, i) => (
            <div key={perm}>
              <label className="form-check form-check-custom form-check-solid d-flex align-items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  className="form-check-input"
                  checked={form.permissions.includes(perm)}
                  onChange={() => togglePermission(perm)}
                />
                <span className="form-check-label fw-semibold text-gray-800">
                  {PERMISSION_LABELS[perm]}
                </span>
              </label>
              {i < availablePermissions.length - 1 && (
                <div className="separator separator-dashed mt-4" />
              )}
            </div>
          ))}
        </div>
      </div>
    </ModalShell>
  )
}

export { StaffModal }
