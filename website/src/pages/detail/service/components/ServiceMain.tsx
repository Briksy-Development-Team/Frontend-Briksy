import { Star } from 'lucide-react';

export function ServiceHeader({ service }: { service: any }) {
  return (
    <div className="w-full flex flex-col gap-6">

      <div className="w-full h-[200px] md:h-[260px] rounded-[1.5rem] overflow-hidden bg-white-100">
        <img src={service.bannerImage} alt="Banner" className="w-full h-full object-cover" />
      </div>


      <div className="flex flex-col md:flex-row gap-5 items-start">

        

        <div className="flex flex-col  md:flex-row gap-6 items-start">
          <div className=" 0 h-36 shrink-0 rounded-2xl overflow-hidden shadow-sm bg-white">
            <img src={service.logo} alt={service.name} className="w-full h-full object-cover" />
          </div>

          <div className="flex  flex-col gap-2 pt-2">
            <h1 className="text-[1rem] md:text-[1.875rem] font-medium text-primary-brown leading-tight">
              {service.name}
            </h1>
            <p className="text-[0.875rem] text-primary-light-brown">
              {service.registration}
            </p>
            <p className="text-[1rem]  text-primary-brown">
              {service.address}
            </p>

            <div className="flex flex-wrap items-center gap-3 mt-1 text-[0.875rem] text-primary-brown">
              <div className="flex items-center gap-1">
                <Star size={16} className="fill-orange-500 text-orange-500" />
                <span className="font-medium">{service.rating}</span>
                <span className="text-gray-100">({service.reviewsCount} reviews)</span>
              </div>
              <span className="text-gray-100">•</span>
              <div className="flex items-center gap-1">
                {/* <img src={Approves} className="h-5 w-auto" alt="Verified" /> */}
                <span>{service.teamSize} people work here</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ServiceTabs() {
  const tabs = ["Overview", "Services", "Reviews"];

  const handleScroll = (tab: string) => {
    const map: Record<string, string> = {
      overview: "overview",
      services: "services",
      reviews: "reviews",
    };
    const targetId = map[tab.toLowerCase()] ?? tab.toLowerCase();
    const element = document.getElementById(targetId);
    if (element) {
      const offset = 120;
      const y = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full border-b border-gray-50 overflow-x-auto hide-scrollbar">
      <div className="flex items-center gap-8 min-w-max">
        {tabs.map((tab, i) => (
          <button
            key={tab}
            onClick={() => handleScroll(tab)}
            className={`py-4 text-[0.875rem] font-medium transition-colors ${i === 0
                ? "text-primary-brown border-b-2 border-primary-brown"
                : "text-primary-light-brown hover:text-primary-brown border-b-2 border-transparent"
              }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
