import { ShieldCheck } from 'lucide-react';

export function ServiceSidebar({ contact, name }: { contact: any; name: string }) {
  const formatPrice = (val: number) => `$${(val / 1000).toFixed(0)}k`;

  return (
    <div className="flex flex-col gap-4 w-full">
      
      <div className="w-full bg-white rounded-[1.25rem] py-4 px-6 shadow-sm border border-gray-50 flex justify-center items-center gap-2.5">
        <ShieldCheck className="text-primary-brown" size={22} />
        <span className="font-semibold text-primary-brown text-[0.9375rem]">Verified by Briksy</span>
      </div>

      
      <div className="w-full bg-white rounded-[1.25rem] p-6 lg:p-7 shadow-sm border border-gray-50 flex flex-col gap-5">
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-[1.75rem] font-bold text-primary-brown">
              From {formatPrice(contact.price)}
            </span>
            <span className="text-[0.8125rem] font-medium text-primary-light-brown">fixed price</span>
          </div>
          <p className="text-[0.8125rem] text-primary-light-brown mt-2 leading-snug">
            Free consultation and site assessment · Typically replies within one business day
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full bg-primary-brown text-white py-3.5 rounded-xl font-semibold text-[0.9375rem] hover:bg-[#4a361a] transition-colors">
            Request a free consultation
          </button>
          <button className="w-full bg-white border border-primary-light-brown/50 text-primary-brown py-3.5 rounded-xl font-semibold text-[0.9375rem] hover:bg-white-50 transition-colors">
            Send an enquiry
          </button>
        </div>

        <p className="text-[0.75rem] text-primary-light-brown leading-snug">
          Enquiries go directly to {name}. BRIKSY never charges buyers.
        </p>
      </div>
    </div>
  );
}
