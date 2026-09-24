import Approve from "../../assets/icons/approve.svg"

interface FraudBannerProps {
  text?: string;
  className?: string;
}

export default function FraudBanner({
  text = 'To protect yourself from fraud, only use the contact details provided and verified by BRIKSY.',
  className = '',
}: FraudBannerProps) {
  return (
    <div
      className={`flex items-center gap-4 w-[50%] bg-white rounded-xl pr-6 py-1.5 shadow-[0_0_13px_rgba(0,0,0,0.12)] ${className}`}
    >
      <div className="w-[75px] h-[75px] flex items-center justify-center shrink-0">
        <img src={Approve} alt="" />
      </div>
      <p className="text-[0.875rem] text-black leading-relaxed max-w-[573px]">
        {text}
      </p>
    </div>
  );
}
