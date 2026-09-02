import Verify from "../../../../assets/icons/verify.svg"

export function BuilderSidebar({ price }: { price: number }) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full bg-white rounded-[1.25rem] py-4 px-6 shadow-sm border border-gray-50 flex justify-center items-center gap-2">
        <img src={Verify} alt="" />
        <span className="font-semibold text-primary-brown">Verified by Briksy</span>
      </div>

      <div className="w-full bg-white rounded-[1.25rem] p-6 lg:p-8 shadow-sm border border-gray-50 flex flex-col gap-6">
        <div>
          <h2 className="text-[1.5rem] font-bold text-primary-brown">
            From ${price / 1000}k <span className="text-[0.875rem] font-medium text-gray-100">fixed price</span>
          </h2>
          <p className="text-[0.75rem] text-primary-light-brown mt-2 leading-snug">
            Free consultation and site assessment. Typically replies within one business day.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <button className="w-full bg-primary-brown text-white py-3.5 rounded-xl font-medium text-[0.875rem] hover:bg-[#4a361a] transition-colors">
            Request a free consultation
          </button>
          <button className="w-full bg-white border border-white-100 text-primary-brown py-3.5 rounded-xl font-medium text-[0.875rem] hover:bg-white-50 transition-colors">
            Send an enquiry
          </button>
        </div>

        <p className="text-[0.75rem] text-primary-light-brown leading-snug">
          Enquiries go directly to Harkaway Homes. BRIKSY never charges buyers.
        </p>
      </div>
    </div>
  );
}
