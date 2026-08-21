import { ServiceHeader, ServiceTabs } from "./components/ServiceMain";
import { ServiceAbout, ServiceList, ServiceRecentWork, ServiceLocation } from "./components/ServiceDetails";
import { ServiceSidebar } from "./components/ServiceSidebar";
import Reviews from "../../../components/reviews/Reviews";
import Breadcrumb from "../../../components/nav/Breadcrumb";

export const serviceData = {
  id: 1,
  name: "Doyle Electrical",
  registration: "Registered building practitioner · CDB-U 51204 NSW",
  address: "Shop 1/33 Village Circuit, Gregory Hills NSW 2557",
  category: "Electricians",
  rating: 4.9,
  reviewsCount: 64,
  teamSize: 6,
  teamAvatars: [
    "https://i.pravatar.cc/40?img=11",
    "https://i.pravatar.cc/40?img=12",
    "https://i.pravatar.cc/40?img=13",
  ],
  bannerImage:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
  logo: "https://ui-avatars.com/api/?name=DE&background=1a4db5&color=fff&size=150&font-size=0.33",

  about: {
    description:
      "Family-run electrical business operating across Melbourne's inner west since 2013. We handle everything from switchboard upgrades and full rewires through to solar and battery installs. Three licensed electricians on the team, fully insured, and known for turning up when we say we will. Free quotes on every job, and we'll always tell you if something doesn't need doing.",
  },

  recentWork: {
    totalPhotos: 20,
    totalVideos: 5,
    items: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
        title: "Switchboard upgrade",
        subtitle: "Yarraville - March 2026",
      },
      {
        id: 2,
        type: "video",
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
        duration: "0:22",
        title: "Switchboard walkthrough",
        subtitle: "Video · 22 sec",
      },
      {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600",
      },
    ],
  },

  servicesData: {
    tags: ["Electricians", "Solar installers", "EV chargers", "Data & cabling", "Security & alarms"],
    offer: {
      title: "$50 off your first job",
      subtitle:
        "New customers, minimum spend $300. Mention it when you enquire. Ends 30 September 2026.",
    },
    list: [
      {
        id: 1,
        title: "Switchboard upgrade",
        description: "Includes safety switch, compliant to AS/NZS 3000",
        price: "From $480",
      },
      {
        id: 2,
        title: "Full rewire, 3-bedroom",
        description: "Typically 3–5 days on site",
        price: "From $6,200",
      },
      {
        id: 3,
        title: "Solar and battery install",
        description: "CEC accredited, includes grid application",
        price: "Quoted per job",
      },
      {
        id: 4,
        title: "Power point or light install",
        description: "Minimum call-out applies",
        price: "From $120",
      },
      {
        id: 5,
        title: "Emergency call-out",
        description: "Available 7am–9pm, seven days",
        price: "$180 call-out",
      },
    ],
  },

  reviews: {
    overall: 4.9,
    count: 87,
    distribution: { 5: 80, 4: 12, 3: 5, 2: 2, 1: 1 },
    list: [
      {
        id: 1,
        author: "Marcus T.",
        context: "Switchboard upgrade, Yarraville · June 2026",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=52",
        text: "Quoted $480 fixed and that's exactly what we paid. Found an unsafe join in the roof from a previous owner's work and showed me photos before touching it. Turned up when he said he would, both visits.",
      },
      {
        id: 2,
        author: "Priya S.",
        context: "Full rewire, Seddon · April 2026",
        rating: 4,
        avatar: "https://i.pravatar.cc/150?img=47",
        text: "Five days in a 1920s weatherboard, which is never simple. He talked me out of two power points I didn't need — that told me a lot. Left the place tidy every evening.",
      },
    ],
  },

  location: {
    description: "Based in Footscray VIC 3011. Serving 20 suburbs — results are ordered by distance from the office.",
    mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50554.60553700944!2d144.8674488!3d-37.8001059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4f9b0f6e63%3A0x502cb20e4bfa6350!2sFootscray%20VIC%203011!5e0!3m2!1sen!2sau!4v1000000000000",
    suburbs: ["Footscray", "Yarraville", "Seddon", "Kingsville", "West Footscray", "Maidstone", "Braybrook", "Newport"],
    moreCount: 12,
  },

  contact: {
    price: 850000,
    phone: "+61 412 555 789",
    email: "hello@doyleelectrical.com.au",
  },
};

const ServiceDetail = () => {
  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Find a professional", isBack: true },
    { label: "Trades and repairs" },
    { label: serviceData.category },
  ];

  return (
    <div className="min-h-screen bg-white-50 font-helvetica flex flex-col">
      <main className="flex-1 w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6">
        <Breadcrumb items={breadcrumbs} />

        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          <div className="flex-1 min-w-0 flex flex-col gap-10 w-full">
            <ServiceHeader service={serviceData} />
            <ServiceTabs />

            <div className="flex flex-col gap-16 pb-8">
              
              <div id="overview">
                <ServiceAbout about={serviceData.about} showTitle={false} />
              </div>

              <div id="recent">
                <ServiceRecentWork recentWork={serviceData.recentWork} />
              </div>

              <div id="services">
                <ServiceList servicesData={serviceData.servicesData} name={serviceData.name} />
              </div>

              <div id="reviews">
                <Reviews data={serviceData.reviews} name={serviceData.name} />
              </div>

              <div id="location">
                <ServiceLocation location={serviceData.location} name={serviceData.name} />
              </div>
            </div>

            
            <div className="text-center py-4 border-t border-gray-50">
              <p className="text-[0.75rem] text-primary-light-brown">
                Only use contact details shown on Briksy. We never ask you to pay a deposit outside the platform.
              </p>
            </div>

            
            <div className="flex items-center gap-2 pb-16">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 2v12M3 2h8l-2 3.5L11 9H3" stroke="#8B6F54" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <button className="text-[0.875rem] text-primary-light-brown hover:text-primary-brown transition-colors">
                Report {serviceData.name}
              </button>
            </div>
          </div>

          <aside className="w-full lg:w-[360px] shrink-0 lg:sticky lg:top-32">
            <ServiceSidebar contact={serviceData.contact} name={serviceData.name} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;
