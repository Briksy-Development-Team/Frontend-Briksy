import { ShieldCheck, List } from "lucide-react";
import Approves from "../../../../assets/logo/apprrove.svg";

export const PropertyTitle = ({
  title,
  beds,
  baths,
  sqm,
}: {
  title: string;
  beds?: string | number | null;
  baths?: string | number | null;
  sqm?: string | number | null;
}) => (
  <div>
    <h1 className="mt-2 text-[1.4rem] md:text-[1.875rem] font-medium text-primary-brown">
      {title}
    </h1>
    <div className="text-[1rem] text-primary-brown mt-1">
      {beds || "—"} Bed&nbsp;&nbsp;•&nbsp;&nbsp;{baths || "—"}{" "}
      Bath&nbsp;&nbsp;•&nbsp;&nbsp;{sqm || "—"} sqm
    </div>
  </div>
);

export const PropertyAgentCard = ({ agent }: { agent: any }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between  bg-white px-6 rounded-[0.75rem] py-6">
    <div className="flex items-center gap-4">
      <div className="relative">
        <img
          src={agent.avatar}
          className="w-14 h-14 rounded-full object-cover"
          alt=""
        />
        <div className="absolute -bottom-2  right-2 bg-white rounded-full p-[2px]">
          <img
            loading="lazy"
            src={Approves}
            alt="Verified"
            className="h-full w-full object-cover"
          />{" "}
        </div>
      </div>
      <div>
        <p className=" text-[0.875rem] md:text-[1rem] text-primary-brown">
          {agent.name}
        </p>
        <p className="text-[0.875rem] text-primary-light-brown mt-0.5">
          {agent.role}
        </p>
      </div>
    </div>
    <div className=" items-center hidden md:flex gap-2 mt-4 sm:mt-0 text-primary-brown text-[1rem] font-medium">
      <ShieldCheck size={20} />
      {agent.verified}
    </div>
  </div>
);

export const PropertyAbout = ({ about }: { about: string }) => (
  <div className="flex flex-col border-y border-[#E2CBB3] py-10 gap-6">
    <h2 className="text-[1.25rem] font-medium text-primary-brown">
      About this property
    </h2>
    <p className="text-[1rem] text-primary-brown leading-relaxed tracking-wider whitespace-pre-line">
      {about}
    </p>
  </div>
);

export const PropertyAmenities = ({ amenities }: { amenities: any[] }) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-[1.25rem] font-medium text-primary-brown">
      What this place offers
    </h2>
    {amenities.length > 0 ? (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4  md:gap-x-8">
        {amenities.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-3 text-primary-brown text-[1rem]"
          >
            <List size={16} className="text-primary-light-brown" />
            <span className="text-[0.750rem] ">{item.name}</span>
          </div>
        ))}
      </div>
    ) : (
      <p className="text-[0.875rem] text-primary-light-brown">
        No property features have been provided.
      </p>
    )}
  </div>
);

export const PropertyMap = ({ mapSrc }: { mapSrc: string }) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-[1.25rem] font-medium text-primary-brown">
      Where you'll be
    </h2>
    <div className="w-full h-[250px] md:h-[320px] rounded-2xl overflow-hidden border border-[#EBE5D9]">
      <iframe
        title="Property location map"
        src={mapSrc}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  </div>
);
