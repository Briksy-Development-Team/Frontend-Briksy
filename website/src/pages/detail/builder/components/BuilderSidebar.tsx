import Verify from "../../../../assets/icons/verify.svg";

type Props = {
  name?: string;
  address?: string | null;
  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;
  operatingHours?: string | null;
  isAgent?: boolean;
  isBuyerAgent?: boolean;
  onEnquiry?: () => void;
  onCall?: () => void;
};

export function BuilderSidebar({
  name,
  address,
  contactPhone,
  contactEmail,
  website,
  operatingHours,
  isAgent,
  isBuyerAgent,
  onEnquiry,
  onCall,
}: Props) {
  const primaryButtonText = isBuyerAgent
    ? "Request a free consultation"
    : isAgent
    ? "Request a free consultation"
    : "Request a free consultation";

  const footerText = name
    ? `Enquiries go directly to ${name}. BRIKSY never charges buyers.`
    : "BRIKSY never charges buyers.";

  const hasContactDetails = address || contactPhone || contactEmail || operatingHours || website;

  return (
    <div className="flex flex-col gap-4 lg:w-full md:w-[80%] mx-auto">
      {/* Verified badge */}
      <div
        className="w-full bg-white rounded-xl py-3 px-9 flex justify-center items-center gap-2.5"
        style={{ boxShadow: "0px 0px 13px 0px rgba(0, 0, 0, 0.12)" }}
      >
        <img src={Verify} alt="" />
        <span className="font-medium text-[0.875rem] text-primary-brown">Verified by Briksy</span>
      </div>

      {/* Enquiry card */}
      <div className="w-full bg-white rounded-2xl border border-[#EDE8E4] flex flex-col gap-3.5 p-[26px]">
        {/* Header */}
        <h2 className="text-[1.5rem] font-medium leading-8 tracking-[-0.006em] text-primary-brown">
          Contact Details
        </h2>

        {/* Contact info card */}
        {hasContactDetails && (
          <div className="border border-[#E7E7E4] rounded-[10px] p-3 flex flex-col gap-1.5">
            {address && (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] text-[#8B6F54]">Address</span>
                  <span className="text-[0.875rem] font-medium text-black leading-snug">{address}</span>
                </div>
                <div className="w-full h-px bg-[#E7E7E4]" />
              </>
            )}
            {operatingHours && (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] text-[#8B6F54]">Hours</span>
                  <span className="text-[0.875rem] font-medium text-black">{operatingHours}</span>
                </div>
                <div className="w-full h-px bg-[#E7E7E4]" />
              </>
            )}
            {(contactPhone || contactEmail) && (
              <>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[0.75rem] text-[#8B6F54]">Contact Details</span>
                  {contactPhone && (
                    <a
                      href={`tel:${contactPhone}`}
                      className="text-[0.875rem] font-medium text-black hover:underline"
                    >
                      {contactPhone}
                    </a>
                  )}
                  {contactEmail && (
                    <a
                      href={`mailto:${contactEmail}`}
                      className="text-[0.875rem] font-medium text-black hover:underline truncate"
                    >
                      {contactEmail}
                    </a>
                  )}
                </div>
                {website && <div className="w-full h-px bg-[#E7E7E4]" />}
              </>
            )}
            {website && (
              <div className="flex flex-col gap-1.5">
                <span className="text-[0.75rem] text-[#8B6F54]">Website</span>
                <a
                  href={website.startsWith("http") ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.875rem] font-medium text-black hover:underline truncate"
                >
                  {website}
                </a>
              </div>
            )}
          </div>
        )}

        {/* Primary CTA */}
        <button
          onClick={onEnquiry}
          className="w-full h-10 rounded-full bg-primary-brown text-white py-[0.5rem] px-[1.5rem] font-medium text-[0.875rem] hover:opacity-90 transition-opacity"
        >
          {primaryButtonText}
        </button>

        {/* Secondary action row */}
        <div className="flex gap-3.5">
          <button
            onClick={onEnquiry}
            className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-primary-brown font-medium text-[0.875rem] hover:bg-gray-50 transition-colors"
          >
            Enquiry
          </button>
          {contactPhone && (
            <a
              href={`tel:${contactPhone}`}
              onClick={onCall}
              className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-primary-brown font-medium text-[0.875rem] flex items-center justify-center hover:bg-gray-50 transition-colors"
            >
              Call Agency
            </a>
          )}
          {!contactPhone && (
            <button
              onClick={onEnquiry}
              className="flex-1 h-10 rounded-full border border-[#EDE8E4] bg-white text-primary-brown font-medium text-[0.875rem] hover:bg-gray-50 transition-colors"
            >
              Call Agency
            </button>
          )}
        </div>

        {/* Footer */}
        <p className="text-[0.75rem] text-black leading-snug">{footerText}</p>
      </div>
    </div>
  );
}
