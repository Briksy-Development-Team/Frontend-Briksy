import { KTCard, KTIcon } from '../../../../../_metronic/helpers'
import type { EmailTemplate } from '../email-template.types'

type Props = {
    templates: EmailTemplate[]
    onAdd: () => void
    onEdit: (template: EmailTemplate) => void
    onDelete: (template: EmailTemplate) => void
}

const EmailTemplateList = ({ templates, onAdd, onEdit, onDelete }: Props) => {
    return (
        <KTCard>
            <div className="container-fluid py-6">

                {/* Header */}
                <div className="d-flex justify-content-between align-items-center mb-8">
                    <div>
                        <h3 className="fw-bold mb-1">Email Templates</h3>
                        <span className="text-muted">{templates.length} templates configured</span>
                    </div>
                    <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onAdd}>
                        <KTIcon iconName="plus" className="fs-2" />
                        Add Template
                    </button>
                </div>

                {/* Empty state */}
                {templates.length === 0 && (
                    <div className="text-center py-10 text-muted">
                        No email templates yet. Click "Add Template" to create one.
                    </div>
                )}

                {/* Cards */}
                <div className="row g-5 g-xl-8">
                    {templates.map((template) => (
                        <div className="col-xl-4 col-md-6 col-sm-12" key={template.id}>
                            <div className="card h-100 shadow-sm border-0 position-relative">

                                {/* Action buttons */}
                                <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 3 }}>
                                    <button
                                        className="btn btn-icon btn-sm btn-light-primary"
                                        onClick={() => onEdit(template)}
                                        title="Edit template"
                                    >
                                        <KTIcon iconName="pencil" className="fs-4" />
                                    </button>
                                    <button
                                        className="btn btn-icon btn-sm btn-light-danger"
                                        onClick={() => onDelete(template)}
                                        title="Delete template"
                                    >
                                        <KTIcon iconName="trash" className="fs-4" />
                                    </button>
                                </div>

                                <div className="card-body d-flex flex-column pt-10">

                                    {/* Status badge */}
                                    <div className="mb-3">
                                        <span className={`badge badge-light-${template.status === 'active' ? 'success' : 'danger'}`}>
                                            {template.status}
                                        </span>
                                    </div>

                                    {/* Name */}
                                    <h4 className="fw-bold mb-2">{template.name}</h4>

                                    {/* Trigger */}
                                    <div className="mb-4">
                                        <span className="badge badge-light-primary">
                                            {template.key}
                                        </span>
                                    </div>

                                    {/* Subject */}
                                    <div className="mb-3">
                                        <div className="text-muted fs-7 mb-1">Subject</div>
                                        <div className="fw-semibold text-gray-800">{template.subject}</div>
                                    </div>

                                    {/* Body preview */}
                                    <div className="mb-0">
                                        <div className="text-muted fs-7 mb-1">Body Preview</div>
                                        <div
                                            className="text-gray-700 fs-7"
                                            style={{
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical',
                                                overflow: 'hidden',
                                            }}
                                        >
                                            {template.body}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </KTCard>
    )
}

export default EmailTemplateList
