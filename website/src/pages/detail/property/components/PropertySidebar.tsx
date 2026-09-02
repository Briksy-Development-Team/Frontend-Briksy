import { ArrowUpRight } from "lucide-react";
import Verify from "../../../../assets/icons/verify.svg"

export const PropertySidebar = ({ sidebar }: { sidebar: any }) => {
  return (
    <div className="space-y-4 ">
      <div className="bg-white h-12 w-full space-x-2 flex justify-center items-center rounded-xl text-[0.875rem] font-medium text-primary-brown  ">
        <img src={Verify} alt="" />

        <p className=" ">Verified by Briksy</p>
      </div>

      <div className="bg-white rounded-xl w-full p-4 border border-[#EBE5D9] shadow-sm flex flex-col gap-6">
        <h2 className="text-[1.5rem] font-medium text-primary-brown ">
          Speak directly with the builder
        </h2>

        <div className="border-[0.5px] border-black rounded-xl overflow-hidden text-[0.875rem]">
          <div className="grid grid-cols-2 border-b-[0.5px] border-black">
            <div className="p-3 ">
              <p className="text-[0.625rem]  text-[#98928E] uppercase tracking-wider mb-1">
                BUILDER
              </p>
              <p className="font-medium text-black truncate">
                {sidebar.builder}
              </p>
            </div>
            <div className="p-3">
              <p className="text-[0.625rem]  text-[#98928E] uppercase tracking-wider mb-1">
                AVAILABILITY
              </p>
              <p className="font-medium text-black truncate">
                {sidebar.availability}
              </p>
            </div>
          </div>
          <div className="p-3">
            <p className="text-[0.625rem]  text-[#98928E] uppercase tracking-wider mb-1">
              LOCATION
            </p>
            <p className="font-medium text-black truncate">
              {sidebar.location}
            </p>
          </div>
        </div>

        <div className="w-full bg-[#F2F2F2] text-primary-brown rounded-xl py-3 px-4 text-[1rem] font-medium text-center">
          Responds within 24 hours
        </div>

        <button className="flex items-center justify-center gap-2 w-full bg-[#4A3B2C] text-white rounded-xl py-3.5 px-4 text-[0.875rem] font-medium hover:opacity-90 transition-opacity">
          View Contact Details <ArrowUpRight size={18} />
        </button>

        <p className="text-center text-[1rem] font-medium text-primary-brown">
          Get phone and email instantly
        </p>
      </div>
    </div>
  );
};
