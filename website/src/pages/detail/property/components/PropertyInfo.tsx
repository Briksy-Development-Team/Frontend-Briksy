import { ShieldCheck, List } from 'lucide-react';

export const PropertyTitle = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div>
    <h1 className="mt-2 text-[1.75rem] md:text-[1.875rem] font-bold text-primary-brown">{title}</h1>
    <div className="text-[1rem] text-primary-brown mt-1">
      {subtitle}
    </div>
  </div>
);

export const PropertyAgentCard = ({ agent }: { agent: any }) => (
  <div className="flex flex-col sm:flex-row sm:items-center justify-between  bg-white px-6 rounded-[0.75rem] py-6">
    <div className="flex items-center gap-4">
      <div className="relative">
        <img src={agent.avatar} className="w-14 h-14 rounded-full object-cover" alt="" />
        <div className="absolute bottom-0 right-0 bg-white rounded-full p-[2px]">
          <ShieldCheck size={16} className="text-primary-brown fill-white" />
        </div>
      </div>
      <div>
        <p className="font-bold text-[1rem] text-primary-brown">{agent.name}</p>
        <p className="text-[0.875rem] text-primary-light-brown mt-0.5">{agent.role}</p>
      </div>
    </div>
    <div className="flex items-center gap-2 mt-4 sm:mt-0 text-primary-brown text-[1rem] font-medium">
      <ShieldCheck size={20} />
      {agent.verified}
    </div>
  </div>
);

export const PropertyAbout = ({ about }: { about: string }) => (
  <div className="flex flex-col border-y border-[#E2CBB3] py-10 gap-6">
    <h2 className="text-[1.25rem] font-medium text-primary-brown">About this property</h2>
    <p className="text-[1rem] text-primary-brown leading-relaxed tracking-wider whitespace-pre-line">{about}</p>
  
  </div>
);

export const PropertyAmenities = ({ amenities }: { amenities: any[] }) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-[1.25rem] font-medium text-primary-brown">What this place offers</h2>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 gap-x-8">
      {amenities.map((item, idx) => (
        <div key={idx} className="flex items-center gap-3 text-primary-brown text-[1rem]">
          <List size={20} className="text-primary-light-brown" />
          <span>{item.name}</span>
        </div>
      ))}
    </div>
    <div>
      <button className="mt-4 px-4 py-3 rounded-[0.5rem] text-[0.875rem] font-medium text-primary-brown bg-white transition-colors">
        Show All 
      </button>
    </div>
  </div>
);

export const PropertyMap = ({ mapSrc }: { mapSrc: string }) => (
  <div className="flex flex-col gap-6">
    <h2 className="text-[1.25rem] font-bold text-primary-brown">Where you'll be</h2>
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-[#EBE5D9]">
      <iframe
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
