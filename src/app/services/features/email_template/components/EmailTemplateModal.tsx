import { useState, useEffect } from "react"
import clsx from "clsx"
import { ModalShell } from "../../../../modules/apps/component/ModalShell"
import {
    TEMPLATE_VARIABLES,
    type EmailTemplate,
    type EmailTemplateFormValues,
} from "../email-template.types"

type Props = {
    initialValues?: EmailTemplate | null
    onClose: () => void
    onSubmit: (values: EmailTemplateFormValues) => void
    isSubmitting?: boolean
}

const EmailTemplateModal = ({ initialValues, onClose, onSubmit, isSubmitting }: Props) => {
    const isEdit = !!initialValues

    const [form, setForm] = useState<EmailTemplateFormValues>({
        key: "",
        name: "",
        subject: "",
        body: "",
        variables: [],
        status: "active",
    })

    const [touched, setTouched] = useState({ name: false, subject: false, body: false })

    useEffect(() => {
        if (initialValues) {
            setForm({
                key: initialValues.key,
                name: initialValues.name,
                subject: initialValues.subject,
                body: initialValues.body,
                variables: initialValues.variables ?? [],
                status: initialValues.status,
            })
        }
    }, [initialValues])

    const nameError = touched.name && !form.name ? "Name is required" : ""
    const subjectError = touched.subject && !form.subject ? "Subject is required" : ""
    const bodyError = touched.body && !form.body ? "Body is required" : ""

    const isValid = !!form.key && !!form.name && !!form.subject && !!form.body

    const handleSubmit = () => {
        setTouched({ name: true, subject: true, body: true })
        if (!isValid) return
        onSubmit(form)
    }

    return (
        <ModalShell
            title={isEdit ? "Edit Email Template" : "Add Email Template"}
            onClose={onClose}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            submitLabel={isEdit ? "Update Template" : "Create Template"}
            isValid={isValid}
        >
            <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">Template Key</label>
                    <input
                    type="text"
                    className={clsx("form-control form-control-solid", {
                        "is-invalid": !!nameError,
                        "is-valid": touched.name && !nameError,
                    })}
                    placeholder="e.g. welcome-email"
                    value={form.key}
                    onChange={(e) => setForm((p) => ({ ...p, key: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, name: true }))}
                />
                {nameError && <div className="fv-plugins-message-container"><span className="fv-help-block">{nameError}</span></div>}
            </div>

            <div className="fv-row mb-7">
                    <label className="required fw-bold fs-6 mb-2">Template Name</label>
                    <select
                        className="form-select form-select-solid"
                        value={form.name}
                        onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    >
                        {TEMPLATE_VARIABLES.map((variable) => (
                            <option key={variable} value={variable}>
                                {variable}
                            </option>
                        ))}
                    </select>
            </div>

            <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Email Subject</label>
                <input
                    type="text"
                    className={clsx("form-control form-control-solid", {
                        "is-invalid": !!subjectError,
                        "is-valid": touched.subject && !subjectError,
                    })}
                    placeholder="e.g. Welcome to Briksy!"
                    value={form.subject}
                    onChange={(e) => setForm((p) => ({ ...p, subject: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, subject: true }))}
                />
                {subjectError && <div className="fv-plugins-message-container"><span className="fv-help-block">{subjectError}</span></div>}
            </div>

            <div className="fv-row mb-7">
                <label className="required fw-bold fs-6 mb-2">Email Body</label>
                <textarea
                    className={clsx("form-control form-control-solid", {
                        "is-invalid": !!bodyError,
                        "is-valid": touched.body && !bodyError,
                    })}
                    rows={6}
                    placeholder="Hi {{name}}, ..."
                    value={form.body}
                    onChange={(e) => setForm((p) => ({ ...p, body: e.target.value }))}
                    onBlur={() => setTouched((p) => ({ ...p, body: true }))}
                />
                {bodyError && <div className="fv-plugins-message-container"><span className="fv-help-block">{bodyError}</span></div>}
                <div className="text-muted fs-7 mt-2">
                    Use placeholders like <code>{"{{name}}"}</code>, <code>{"{{order_number}}"}</code>, <code>{"{{total_amount}}"}</code>
                </div>
            </div>

            <div className="fv-row mb-7">
                <label className="form-check form-check-custom form-check-solid form-switch d-flex align-items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        className="form-check-input"
                        checked={form.status === "active"}
                        onChange={(e) => setForm((p) => ({ ...p, status: e.target.checked ? "active" : "inactive" }))}
                    />
                    <span className="fw-bold fs-6">Active</span>
                </label>
            </div>
        </ModalShell>
    )
}

export { EmailTemplateModal }
