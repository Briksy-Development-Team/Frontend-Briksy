import { ShieldCheck, Star } from 'lucide-react';
import Approves from '../../../../assets/logo/apprrove.svg';

export function BuilderHeader({ builder }: { builder: any }) {
  return (
    <div className="w-full flex flex-col gap-6">
      <div className="w-full h-32 md:h-48 rounded-[0.75rem] overflow-hidden">
        <img src={builder.bannerImage} alt="Banner" className="w-full h-full object-cover" />
      </div>

      <div className="flex flex-col  md:flex-row gap-6 items-start">
        <div className=" 0 h-36 shrink-0 rounded-2xl overflow-hidden shadow-sm bg-white">
          <img src={builder.logo} alt={builder.name} className="w-full h-full object-cover" />
        </div>

        <div className="flex  flex-col gap-2 pt-2">
          <h1 className="text-[1rem] md:text-[1.875rem] font-medium text-primary-brown leading-tight">
            {builder.name}
          </h1>
          <p className="text-[0.875rem] text-primary-light-brown">
            {builder.registration}
          </p>
          <p className="text-[1rem]  text-primary-brown">
            {builder.address}
          </p>
          
          <div className="flex flex-wrap items-center gap-3 mt-1 text-[0.875rem] text-primary-brown">
            <div className="flex items-center gap-1">
              <Star size={16} className="fill-primary-light-brown/50 text-primary-light-brown/50" />
              <span className="font-medium">{builder.rating}</span>
              <span className="text-gray-100">({builder.reviewsCount} reviews)</span>
            </div>
            <span className="text-gray-100">•</span>
            <div className="flex items-center gap-1">
              <img src={Approves} className="h-5 w-auto" alt="Verified" />
              <span>{builder.teamSize} people work here</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function BuilderTabs() {
  const tabs = ["Overview", "Homes", "Performance", "Team", "About", "Reviews"];
  
  const handleScroll = (tab: string) => {
    let targetId = tab.toLowerCase();
    if (targetId === "overview") targetId = "snapshot";

    const element = document.getElementById(targetId);
    if (element) {
      const offset = 120;
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };
  
  return (
    <div className="w-full border-b border-gray-50 overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-8 min-w-max">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleScroll(tab)}
            className={`py-4 text-[0.875rem] font-medium transition-colors ${
              i === 0 
                ? "text-primary-brown border-b-2 border-primary-brown" 
                : "text-primary-light-brown hover:text-primary-brown] border-b-2 border-transparent"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}

export function BuilderAbout({ about }: { about: any }) {
  return (
    <div className="flex flex-col gap-8">
      <h2 className="text-[1.5rem] font-medium text-primary-brown">About Harkaway Homes</h2>
      
      <div className="text-[1rem] text-primary-brown leading-loose whitespace-pre-wrap">
        {about.description}
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-4 border-t border-gray-50 pt-8">
        <div>
          <h4 className="text-[0.75rem] text-primary-light-brown mb-1">Trading since</h4>
          <p className="text-[0.875rem] font-medium text-primary-brown">{about.tradingSince}</p>
        </div>
        <div>
          <h4 className="text-[0.75rem] text-primary-light-brown mb-1">Build regions</h4>
          <p className="text-[0.875rem] font-medium text-primary-brown">{about.buildRegions}</p>
        </div>
        <div>
          <h4 className="text-[0.75rem] text-primary-light-brown mb-1">Contract type</h4>
          <p className="text-[0.875rem] font-medium text-primary-brown">{about.contractType}</p>
        </div>
        <div>
          <h4 className="text-[0.75rem] text-primary-light-brown mb-1">Team size</h4>
          <p className="text-[0.875rem] font-medium text-primary-brown">{about.teamSize}</p>
        </div>
        <div>
          <h4 className="text-[0.75rem] text-primary-light-brown mb-1">Build types</h4>
          <p className="text-[0.875rem] font-medium text-primary-brown">{about.buildTypes}</p>
        </div>
        <div>
          <h4 className="text-[0.75rem] text-primary-light-brown mb-1">Warranty</h4>
          <p className="text-[0.875rem] font-medium text-primary-brown">{about.warranty}</p>
        </div>
      </div>
    </div>
  );
}

export function BuilderContact() {
  const options = [
    { title: "Build a new home", desc: "On my own land or yours" },
    { title: "House and land package", desc: "Ready-to-go packages" },
    { title: "Knockdown rebuild", desc: "Existing home on site" },
    { title: "Visit a display home", desc: "Book an appointment" },
    { title: "An advertised home", desc: "Enquire about a listing" },
    { title: "General enquiry", desc: "Something else" }
  ];

  return (
    <div className="flex flex-col gap-8 w-full pb-16">
      <h2 className="text-[1.5rem] font-bold text-primary-brown">Contact Harkaway Homes</h2>
      
      <div className="bg-white p-6 md:p-8 rounded-[1.5rem] shadow-sm border border-gray-50 w-full flex flex-col gap-6">
        <h3 className="text-[0.875rem] font-semibold text-primary-brown">What's your enquiry about?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {options.map((opt) => (
            <button 
              key={opt.title}
              className="flex flex-col items-start p-4 bg-white-50 hover:bg-white-100 rounded-xl text-left transition-colors border border-transparent hover:border-primary-light-brown/60"
            >
              <div className="text-[0.875rem] font-medium text-primary-brown">{opt.title}</div>
              <div className="text-[0.75rem] text-primary-light-brown mt-1">{opt.desc}</div>
            </button>
          ))}
        </div>
        
        <div className="flex justify-end mt-2">
          <button className="bg-primary-brown text-white py-3 px-20 rounded-xl font-medium text-[0.875rem] hover:bg-[#4a361a] transition-colors">
            Next
          </button>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <div className="bg-white py-4 px-6 rounded-2xl border border-gray-50 shadow-sm flex items-center gap-4 max-w-lg">
          <ShieldCheck className="text-primary-light-brown/60 shrink-0" size={32} />
          <p className="text-[0.75rem] text-primary-brown leading-tight font-medium">
            To protect yourself from fraud, only use the contact details provided and verified by BRIKSY.
          </p>
        </div>
      </div>
    </div>
  );
}
