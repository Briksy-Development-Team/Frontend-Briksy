import { useState, useEffect } from "react"
import { KTIcon, toAbsoluteUrl } from "../../../../../../../_metronic/helpers"
import clsx from "clsx"

type User = {
  id?: number
  name: string
  email: string
  role: string
}

type Props = {
  user?: User | null
  onSave: (user: User) => void
  onClose: () => void
}

const ROLES = [
  { value: "Administrator", description: "Best for business owners and company administrators" },
  { value: "Developer", description: "Best for developers or people primarily using the API" },
  { value: "Analyst", description: "Best for people who need full access to analytics data, but don't need to update business settings" },
  { value: "Support", description: "Best for employees who regularly refund payments and respond to disputes" },
  { value: "Trial", description: "Best for people who need to preview content data, but don't need to make any updates" },
]

const UserEditModal = ({ user, onSave, onClose }: Props) => {
  const [form, setForm] = useState<User>({
    name: "",
    email: "",
    role: "Administrator",
  })

  const [touched, setTouched] = useState({ name: false, email: false })

  useEffect(() => {
    if (user) setForm(user)
  }, [user])

  const handleChange = (key: keyof User, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleBlur = (key: "name" | "email") => {
    setTouched((prev) => ({ ...prev, [key]: true }))
  }

  const nameError = touched.name && !form.name ? "Name is required" : ""
  const emailError = touched.email && !form.email ? "Email is required" : ""
  const isValid = !!form.name && !!form.email

  const handleSubmit = () => {
    setTouched({ name: true, email: true })
    if (!isValid) return
    onSave(form)
    onClose()
  }

  const blankImg = toAbsoluteUrl("media/svg/avatars/blank.svg")

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className="modal-dialog modal-dialog-centered mw-650px"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">

          {/* Header */}
          <div className="modal-header">
            <h2 className="fw-bolder">{user ? "Edit User" : "Add User"}</h2>
            <div
              className="btn btn-icon btn-sm btn-active-icon-primary"
              onClick={onClose}
              style={{ cursor: "pointer" }}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </div>
          </div>

          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div
              className="d-flex flex-column scroll-y me-n7 pe-7"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >

              <div className="fv-row mb-7">
                <label className="d-block fw-bold fs-6 mb-5">Avatar</label>
                <div
                  className="image-input image-input-outline"
                  data-kt-image-input="true"
                  style={{ backgroundImage: `url('${blankImg}')` }}
                >
                  <div
                    className="image-input-wrapper w-125px h-125px"
                    style={{ backgroundImage: `url('${blankImg}')` }}
                  />
                </div>
              </div>

              {/* Full Name */}
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Full Name</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  onBlur={() => handleBlur("name")}
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": !!nameError },
                    { "is-valid": touched.name && !nameError }
                  )}
                  autoComplete="off"
                />
                {nameError && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{nameError}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Email</label>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  onBlur={() => handleBlur("email")}
                  className={clsx(
                    "form-control form-control-solid mb-3 mb-lg-0",
                    { "is-invalid": !!emailError },
                    { "is-valid": touched.email && !emailError }
                  )}
                  autoComplete="off"
                />
                {emailError && (
                  <div className="fv-plugins-message-container">
                    <div className="fv-help-block">
                      <span role="alert">{emailError}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Role */}
              <div className="mb-7">
                <label className="required fw-bold fs-6 mb-5">Role</label>
                {ROLES.map((r, i) => (
                  <div key={r.value}>
                    <div className="d-flex fv-row">
                      <div className="form-check form-check-custom form-check-solid">
                        <input
                          className="form-check-input me-3"
                          type="radio"
                          name="role"
                          value={r.value}
                          id={`role_option_${i}`}
                          checked={form.role === r.value}
                          onChange={() => handleChange("role", r.value)}
                        />
                        <label className="form-check-label" htmlFor={`role_option_${i}`}>
                          <div className="fw-bolder text-gray-800">{r.value}</div>
                          <div className="text-gray-600">{r.description}</div>
                        </label>
                      </div>
                    </div>
                    {i < ROLES.length - 1 && (
                      <div className="separator separator-dashed my-5" />
                    )}
                  </div>
                ))}
              </div>

            </div>
          </div>

          {/* Footer / Actions */}
          <div className="modal-footer">
            <div className="text-center w-100 pt-5">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={onClose}
              >
                Discard
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Submit
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default UserEditModal