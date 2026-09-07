import { ServiceSidebar } from "./components/ServiceSidebar";
import {
  ServiceList,
  ServiceRecentWork,
  ServiceLocation,
  ServiceQualifications,
} from "./components/ServiceDetails";
import Reviews from "../../../components/reviews/Reviews";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import Protect from "../../../assets/icons/protect.svg"

export const serviceData = {
  id: 1,
  name: "Rajesh Kumar",
  registration: "Licensed Electrician & Home Wiring Specialist",
  address: "Shop 1/33 Village Circuit, Gregory Hills NSW 2557",
  category: "Electricians",
  rating: 4.9,
  reviewsCount: 64,
  avatar: "https://i.pravatar.cc/150?img=11",
  bannerImage:
    "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=2000&auto=format&fit=crop",
  companyName: "Doyle Electrical",
  companyLogo: "https://i.pravatar.cc/150?img=11",

  servicesData: {
    list: [
      {
        id: 1,
        title: "Wiring Installation & Repair",
        description:
          "Safe mounting, bracket and supply installation for screens & displays.",
        price: "$120",
        duration: "Approx. 1 hr",
        image:
          "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: 2,
        title: "Plumbing Fixtures",
        description:
          "Expert leak detection, pipe installation, and bathroom remodels for...",
        price: "$80",
        duration: "Approx. 45 min",
        image:
          "https://images.unsplash.com/photo-1585641753457-41eb3e8529e7?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: 3,
        title: "Wiring Installation & Repair",
        description:
          "Safe mounting, conduit and outlet installation for screens & displays.",
        price: "$120",
        duration: "Approx. 1 hr",
        image:
          "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=200",
      },
      {
        id: 4,
        title: "HVAC Maintenance",
        description:
          "Comprehensive testing and cooling system checks to ensure...",
        price: "$150",
        duration: "Approx. 1.5 hrs",
        image:
          "https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&q=80&w=200",
      },
    ],
  },

  qualifications: [
    {
      title: "10 years of experience",
      description:
        "Deep domain knowledge, reliable consulting & flawless timelines.",
    },
    {
      title: "Police highlight",
      description:
        "Passed by state-certified verified checks which is standard for...",
    },
    {
      title: "Insurance and training",
      description: "$5m certified Public Liability Cover",
    },
  ],

  recentWork: {
    totalPhotos: 20,
    totalVideos: 5,
    items: [
      {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800",
      },
      {
        id: 2,
        type: "image",
        src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=600",
      },
      {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1542013936693-884638332954?auto=format&fit=crop&q=80&w=600",
      },
    ],
  },

  location: {
    description:
      "I travel to you anywhere in the area outlined on the map. To book in a different location, you can message me.",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50554.60553700944!2d144.8674488!3d-37.8001059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4f9b0f6e63%3A0x502cb20e4bfa6350!2sFootscray%20VIC%203011!5e0!3m2!1sen!2sau!4v1000000000000",
    suburbs: ["Footscray", "Yarraville", "Seddon", "Kingsville"],
    moreCount: 12,
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
        text: "Quoted $480 fixed and that's exactly what we paid. Found an unsafe join in the roof from a previous owner's work and showed me photos before touching it.",
      },
      {
        id: 2,
        author: "Priya S.",
        context: "Full rewire, Seddon · April 2026",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=47",
        text: "Five days in a 1920s weatherboard, which is never simple. He talked me out of two power points I didn't need — that told me a lot. Left the place tidy every evening.",
      },
    ],
  },

  contact: {
    price: 50, // $0.5 / hour wait, $50? the design says $0.5 / hour
    rateType: "Flat rate service",
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
    <div className="min-h-screen mt-20 font-helvetica flex flex-col  ">
      <main className="flex-1 w-full px-[5%] py-6  mx-auto">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <Breadcrumb items={breadcrumbs} />
        </div>

        <div className="flex flex-col lg:flex-row  gap-16 items-start relative">
          <aside className="w-full lg:w-[30%] shrink-0 lg:sticky lg:top-32 flex flex-col gap-6">
            <ServiceSidebar
              contact={serviceData.contact}
              service={serviceData}
            />
          </aside>

          <div className="w-full lg:w-[65%] flex flex-col gap-16 pb-8">
            <div id="services">
              <ServiceList servicesData={serviceData.servicesData} />
            </div>

            <div id="qualifications">
              <ServiceQualifications
                companyName={serviceData.companyName}
                companyLogo={serviceData.companyLogo}
                qualifications={serviceData.qualifications}
              />
            </div>

            <div id="gallery" className="w-[80%]">
              <ServiceRecentWork recentWork={serviceData.recentWork} />
            </div>

            <div id="location" className="w-[80%]">
              <ServiceLocation location={serviceData.location} />
            </div>

            <div id="reviews">

              <Reviews data={serviceData.reviews} name={serviceData.companyName} />
            </div>

            <div className="bg-white  rounded-xl p-4 w-[80%] flex items-center gap-4 shadow-sm">
              <div className="w-14 h-14 bg-[#FAF8F5] rounded-full flex items-center justify-center shrink-0">
                <img src={Protect} alt="" className="w-full h-full" />
              </div>
              <p className="text-[1rem] text-black">
                To protect yourself from fraud, only use the contact details
                provided and verified by BRIKSY.
              </p>
            </div>

            <div className="flex justify-center items-center gap-4 pb-16 text-[0.875rem] text-primary-light-brown">
              <button className="hover:underline">See an issue? </button>
              <span>·</span>
              <button className="hover:underline">
                Report this listing
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ServiceDetail;
