import { ModalShell } from "../component/ModalShell"

type Props = {
    title: string
    message: string
    onClose: () => void
    onConfirm: () => void
    isSubmitting?: boolean
}

const DeleteConfirmModal = ({ title, message, onClose, onConfirm, isSubmitting }: Props) => (
    <ModalShell
        title={title}
        onClose={onClose}
        onSubmit={onConfirm}
        isSubmitting={isSubmitting}
        submitLabel="Delete"
        isValid={true}
    >
        <div className="text-center py-4">
            <div className="fs-1 mb-4">⚠️</div>
            <p className="text-gray-700 fs-5">{message}</p>
            <p className="text-muted fs-6">This action cannot be undone.</p>
        </div>
    </ModalShell>
)

export { DeleteConfirmModal }