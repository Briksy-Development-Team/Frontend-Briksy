interface MobileStickyActionProps {
  price: string;
  priceLabel?: string;
  onEnquiry: () => void;
}

export default function MobileStickyAction({
  price,
  priceLabel,
  onEnquiry,
}: MobileStickyActionProps) {
  return (
    <div className="md:hidden w-full bg-white border-t border-[#EBE5D9] px-[5%] py-4 flex items-center justify-between">
      <div className="flex flex-col">
        <span className="text-[1.25rem] font-medium text-primary-brown leading-tight">
          {price === 'Contact' ? price : `From ${price}`}
        </span>
        {priceLabel && (
          <span className="text-[0.8125rem] text-primary-light-brown">
            {priceLabel}
          </span>
        )}
      </div>
      <button
        type="button"
        onClick={onEnquiry}
        className="bg-primary-brown text-white px-6 py-2.5 rounded-full text-[0.9375rem] font-medium hover:opacity-90 transition-opacity whitespace-nowrap"
      >
        Send an enquiry
      </button>
    </div>
  );
}
