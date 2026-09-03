import Verify from "../../../assets/icons/verify.svg";

type Props = {
  price: string;
  priceLabel?: string;
  description?: string;
  buttonText?: string;
  footerText?: string;
  onEnquiry?: () => void;
};

export function DetailSidebar({
  price,
  priceLabel,
  description,
  buttonText = "Send a enquiry",
  footerText,
  onEnquiry,
}: Props) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div
        className="w-full bg-white rounded-xl py-3 px-9 flex justify-center items-center gap-2.5"
        style={{ boxShadow: "0px 0px 13px 0px rgba(0, 0, 0, 0.12)" }}
      >
        <img src={Verify} alt="" />
        <span className="font-medium text-[0.875rem] text-primary-brown">Verified by Briksy</span>
      </div>

      <div className="w-full bg-white rounded-2xl border border-[#EDE8E4] flex flex-col gap-3.5 p-[26px]">
        <div className="flex items-baseline gap-1.5">
          <span className="text-[1.5rem] font-medium leading-8 tracking-[-0.006em] text-primary-brown">
            From {price}
          </span>
          {priceLabel && (
            <span className="text-[0.75rem] font-normal text-black">{priceLabel}</span>
          )}
        </div>

        {description && (
          <p className="text-[0.75rem] text-black leading-snug">{description}</p>
        )}

        <button
          onClick={onEnquiry}
          className="w-full h-10 rounded-full bg-primary-brown text-white font-medium text-[0.875rem] hover:opacity-90 transition-opacity"
        >
          {buttonText}
        </button>

        {footerText && (
          <p className="text-[0.75rem] text-black leading-snug">{footerText}</p>
        )}
      </div>
    </div>
  );
}
