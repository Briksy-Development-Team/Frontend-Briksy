// shared/components/modal/ModalShell.tsx

import { KTIcon } from '../../../../_metronic/helpers'

type Props = {
  title: string
  onClose: () => void
  onSubmit: () => void | Promise<unknown>
  isSubmitting?: boolean
  submitLabel?: string
  isValid?: boolean
  dialogClassName?: string
  children: React.ReactNode
}

const ModalShell = ({
  title,
  onClose,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Save',
  isValid = true,
  dialogClassName = "mw-650px",
  children,
}: Props) => {
  const handleSubmit = async () => {
    const result = onSubmit()

    if (result && typeof (result as Promise<unknown>).then === "function") {
      await result
    }

    onClose()
  }

  return (
    <div
      className="modal fade show d-block"
      style={{ background: "rgba(0,0,0,0.6)" }}
      onClick={onClose}
    >
      <div
        className={`modal-dialog modal-dialog-centered ${dialogClassName}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">

          {/* Header — always the same */}
          <div className="modal-header">
            <h2 className="fw-bolder">{title}</h2>
            <button
              className="btn btn-icon btn-sm btn-active-icon-primary"
              onClick={onClose}
            >
              <KTIcon iconName="cross" className="fs-1" />
            </button>
          </div>

          {/* Body — feature-specific content goes here */}
          <div className="modal-body scroll-y mx-5 mx-xl-15 my-7">
            <div
              className="d-flex flex-column scroll-y me-n7 pe-7"
              style={{ maxHeight: "60vh", overflowY: "auto" }}
            >
              {children}
            </div>
          </div>

          {/* Footer — always the same */}
          <div className="modal-footer">
            <div className="text-center w-100">
              <button
                type="button"
                className="btn btn-light me-3"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => void handleSubmit()}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? 'Saving...' : submitLabel}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export { ModalShell }
