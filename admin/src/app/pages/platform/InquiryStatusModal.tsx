import { useState } from "react";
import { ModalShell } from "../../modules/apps/component/ModalShell";
import { updateInquiryStatusApi } from "../../services/features/inquiries/inquiry.actions.api";

export const InquiryStatusModal = ({ inquiry, onClose }: { inquiry: any; onClose: () => void }) => {
  const [status, setStatus] = useState(inquiry.status ?? "new");
  const [saving, setSaving] = useState(false);
  const save = async () => { setSaving(true); try { await updateInquiryStatusApi(inquiry.id, status); onClose(); } finally { setSaving(false); } };
  return <ModalShell title="Update inquiry status" onClose={onClose} onSubmit={save} isSubmitting={saving}><label className="form-label">Status</label><select className="form-select" value={status} onChange={(event) => setStatus(event.target.value)}>{["new", "contacted", "in_discussion", "checkout_sent", "payment_pending", "paid", "closed", "expired"].map((value) => <option key={value} value={value}>{value.replace(/_/g, " ")}</option>)}</select></ModalShell>;
};
