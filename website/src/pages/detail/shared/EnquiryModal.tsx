import { useState, type FormEvent } from "react";
import { X } from "lucide-react";

type EnquiryValues = {
  seeker_name: string;
  seeker_email: string;
  seeker_phone: string;
  subject: string;
  message: string;
};

type Props = {
  open: boolean;
  title?: string;
  companyName?: string;
  initialSubject?: string;
  submitting?: boolean;
  error?: string | null;
  success?: string | null;
  onClose: () => void;
  onSubmit: (values: EnquiryValues) => Promise<void> | void;
};

export function EnquiryModal({
  open,
  title = "Send an Enquiry",
  companyName,
  initialSubject = "Property enquiry",
  submitting = false,
  error,
  success,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<EnquiryValues>({
    seeker_name: "",
    seeker_email: "",
    seeker_phone: "",
    subject: initialSubject,
    message: "",
  });

  if (!open) return null;

  const update = (key: keyof EnquiryValues, value: string) => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit(values);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-[520px] rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-[1.5rem] font-medium text-primary-brown">{title}</h2>
            {companyName && (
              <p className="mt-1 text-sm text-primary-light-brown">
                Your enquiry will go directly to {companyName}.
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-primary-brown hover:bg-[#F8F4EE]"
            aria-label="Close enquiry form"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm text-primary-brown">Name</label>
            <input
              required
              value={values.seeker_name}
              onChange={(event) => update("seeker_name", event.target.value)}
              className="w-full rounded-xl border border-[#E7E7E4] bg-[#F8F4EE] px-4 py-3 text-primary-brown outline-none focus:border-primary-brown"
              placeholder="Your name"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm text-primary-brown">Email</label>
              <input
                required
                type="email"
                value={values.seeker_email}
                onChange={(event) => update("seeker_email", event.target.value)}
                className="w-full rounded-xl border border-[#E7E7E4] bg-[#F8F4EE] px-4 py-3 text-primary-brown outline-none focus:border-primary-brown"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm text-primary-brown">Phone <span aria-hidden="true">*</span></label>
              <input
                required
                type="tel"
                value={values.seeker_phone}
                onChange={(event) => update("seeker_phone", event.target.value)}
                className="w-full rounded-xl border border-[#E7E7E4] bg-[#F8F4EE] px-4 py-3 text-primary-brown outline-none focus:border-primary-brown"
                placeholder="Your phone number"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm text-primary-brown">Subject</label>
            <input
              required
              value={values.subject}
              onChange={(event) => update("subject", event.target.value)}
              className="w-full rounded-xl border border-[#E7E7E4] bg-[#F8F4EE] px-4 py-3 text-primary-brown outline-none focus:border-primary-brown"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-primary-brown">Message</label>
            <textarea
              required
              rows={5}
              value={values.message}
              onChange={(event) => update("message", event.target.value)}
              className="w-full resize-none rounded-xl border border-[#E7E7E4] bg-[#F8F4EE] px-4 py-3 text-primary-brown outline-none focus:border-primary-brown"
              placeholder="Tell the company what you’d like to know..."
            />
          </div>

          {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
          {success && <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">{success}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="h-12 w-full rounded-full bg-primary-brown text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Sending..." : "Send an Enquiry"}
          </button>
        </form>
      </div>
    </div>
  );
}
