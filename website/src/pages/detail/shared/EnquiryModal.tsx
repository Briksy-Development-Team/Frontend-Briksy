import { useState, type FormEvent, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import ModalWrapper from "../../../components/wrapper/ModalWrapper";

const INTERESTS = [
  "Booking an inspection",
  "Property information",
  "Price / sale information",
  "Contract / Section 32",
  "Making an offer",
  "Other",
];

const inputClass =
  "w-full rounded-xl border border-[#E7E7E4] bg-white px-4 py-3 text-sm text-primary-brown outline-none placeholder:text-primary-light-brown focus:border-primary-brown";

export type EnquiryValues = {
  interests: string[];
  other_interest: string;
  seeker_name: string;
  seeker_email: string;
  seeker_phone: string;
  subject: string;
  message: string;
  screenshot: File | null;
  send_copy: boolean;
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-primary-brown">{label}</span>
      {children}
    </label>
  );
}

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
    interests: [],
    other_interest: "",
    seeker_name: "",
    seeker_email: "",
    seeker_phone: "",
    subject: initialSubject,
    message: "",
    screenshot: null,
    send_copy: false,
  });
  const [formError, setFormError] = useState<string | null>(null);

  const update = <K extends keyof EnquiryValues>(
    key: K,
    value: EnquiryValues[K],
  ) => setValues((current) => ({ ...current, [key]: value }));

  const toggleInterest = (item: string) =>
    update(
      "interests",
      values.interests.includes(item)
        ? values.interests.filter((i) => i !== item)
        : [...values.interests, item],
    );

  const pickScreenshot = (file?: File) => {
    if (file && file.size > 10 * 1024 * 1024)
      return setFormError("Screenshot must be under 10MB.");
    setFormError(null);
    update("screenshot", file ?? null);
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!values.interests.length)
      return setFormError("Please select at least one option.");
    setFormError(null);
    await onSubmit(values);
  };

  const shownError = formError || error;

  return (
    <ModalWrapper isOpen={open}>
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4">
        <div
          className="max-h-[95vh] w-full max-w-[55rem] flex flex-col rounded-3xl bg-white p-4 shadow-2xl"
          data-lenis-prevent
        >
          <button
            type="button"
            onClick={onClose}
            className="mb-6 rounded-full p-1 text-primary-brown w-3"
            aria-label="Close enquiry form"
          >
            <X size={22} />
          </button>
          <div
            className="overflow-y-auto flex-1 min-h-0 custom-scrollbar px-2"
            data-lenis-prevent
          >
            <h2 className="text-[1.75rem] font-medium text-primary-brown">
              {title}
            </h2>
            {companyName && (
              <p className="mt-1 text-sm text-primary-light-brown">
                Your enquiry will go directly to {companyName}.
              </p>
            )}

            <form onSubmit={submit} className="mt-4  space-y-4">
              <fieldset>
                <legend className="mb-2 text-sm text-primary-brown">
                  I am interested in: *
                </legend>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 sm:grid-cols-3">
                  {INTERESTS.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-2 text-sm text-primary-brown"
                    >
                      <input
                        type="checkbox"
                        checked={values.interests.includes(item)}
                        onChange={() => toggleInterest(item)}
                        className="h-4 w-4 rounded accent-primary-brown"
                      />
                      {item}
                    </label>
                  ))}
                </div>
                <input
                  required={values.interests.includes("Other")}
                  value={values.other_interest}
                  onChange={(e) => update("other_interest", e.target.value)}
                  className={`${inputClass} mt-3`}
                  placeholder="Other..."
                />
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full name">
                  <input
                    required
                    value={values.seeker_name}
                    onChange={(e) => update("seeker_name", e.target.value)}
                    className={inputClass}
                    placeholder="Your name"
                  />
                </Field>
                <Field label="Email address">
                  <input
                    required
                    type="email"
                    value={values.seeker_email}
                    onChange={(e) => update("seeker_email", e.target.value)}
                    className={inputClass}
                    placeholder="you@example.com"
                  />
                </Field>
              </div>

              <Field label="Phone *">
                <input
                  required
                  type="tel"
                  value={values.seeker_phone}
                  onChange={(e) => update("seeker_phone", e.target.value)}
                  className={inputClass}
                  placeholder="Your phone number"
                />
              </Field>

              <Field label="Subject">
                <input
                  required
                  value={values.subject}
                  onChange={(e) => update("subject", e.target.value)}
                  className={inputClass}
                />
              </Field>

              <Field label="Message">
                <textarea
                  required
                  rows={5}
                  value={values.message}
                  onChange={(e) => update("message", e.target.value)}
                  className={`${inputClass} resize-none`}
                  placeholder="Tell the company what you’d like to know..."
                />
              </Field>

              <label className="flex cursor-pointer items-center justify-between rounded-xl border border-dashed border-[#D9D5CC] px-4 py-3 text-sm text-primary-brown">
                <span className="flex items-center gap-2">
                  <Plus size={16} />
                  {values.screenshot
                    ? values.screenshot.name
                    : "Attach a screenshot"}
                </span>
                <span className="text-xs text-primary-light-brown">
                  PNG or JPG, up to 10MB
                </span>
                <input
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={(e) => pickScreenshot(e.target.files?.[0])}
                />
              </label>

              <label className="flex items-center gap-2 text-sm text-primary-brown">
                <input
                  type="checkbox"
                  checked={values.send_copy}
                  onChange={(e) => update("send_copy", e.target.checked)}
                  className="h-4 w-4 rounded accent-primary-brown"
                />
                Email me a copy of this message
              </label>

              {shownError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                  {shownError}
                </p>
              )}
              {success && (
                <p className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-700">
                  {success}
                </p>
              )}

              <div className="flex items-center gap-3  ">
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-12 rounded-full bg-primary-brown px-6 text-sm font-medium text-white transition-opacity
                 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send message"}
                </button>
                <span className="text-xs text-primary-light-brown">
                  We never share your details with providers.
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
