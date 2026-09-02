import { Star, Share } from "lucide-react";
import FavoriteButton from "../../../../components/custom/FavoriteButton";

export function ServiceSidebar({
  contact,
  service,
}: {
  contact: any;
  service: any;
}) {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="w-full  rounded-xl overflow-hidden flex flex-col items-center">
        <div className="w-full h-48  overflow-hidden">
          {service.bannerImage ? (
           
              <img
                src={service.bannerImage}
                alt="Banner"
                className="w-full h-full object-cover rounded-xl"
              />
          
          ) : null}
        </div>

        <div className="relative -mt-10 mb-10">
          <div className="w-20 h-20 rounded-full border-4 border-[#FAF8F5] overflow-hidden bg-white">
            <img
              src={service.avatar}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        <div className="flex flex-col items-center px-6 pb-6 text-center">
          <div className="flex flex-col gap-[0.8125rem]">
            {" "}
            <h1 className="text-[1.875rem] font-medium text-primary-brown leading-tight">
              {service.name}
            </h1>
            <p className="text-[1rem] text-primary-brown ">
              {service.registration}
            </p>
          </div>

          <div className="flex items-center gap-1 mt-4 text-[0.875rem] text-primary-brown">
            <Star size={16} className="fill-[#F05537] text-[#F05537]" />
            <span className="font-medium text-primary-brown">
              {service.rating}
            </span>
            <span className="font-medium text-primary-brown">
              ({service.reviewsCount} reviews)
            </span>
          </div>
          <p className="text-[0.75rem] mt-1">
            Has a ZIP image by VIP category is optional here
          </p>

          <div className="flex items-center gap-4 mt-6 text-primary-light-brown">
            <button className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors ">
              <Share size={18} />
            </button>
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center hover:bg-gray-50 transition-colors ">
              <FavoriteButton
                variant="inline"
                showText={false}
                iconSize={18}
                className="text-primary-light-brown hover:text-primary-brown transition-colors"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Pricing / Contact Card */}
      <div className="w-full bg-white rounded-3xl p-[1.25rem]  border border-gray-50 flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-baseline gap-1">
            <span className="text-[1.25rem] font-medium text-primary-brown">
              From ${contact.price}
            </span>
            <span className="text-[0.75rem] text-primary-light-brown">
              /hour
            </span>
          </div>
          <span className="text-[0.75rem] font-medium text-[#F05537] mt-0.5">
            {contact.rateType}
          </span>
        </div>
        <button className="bg-primary-brown text-white px-[1.625rem] py-[0.875rem] rounded-full font-semibold text-[0.875rem] hover:bg-[#4a361a] transition-colors">
          Contact {service.name.split(" ")[0]}
        </button>
      </div>
    </div>
  );
}
