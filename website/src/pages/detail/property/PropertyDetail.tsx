import Breadcrumb from "../../../components/nav/Breadcrumb";
import Reviews from "../../../components/reviews/Reviews";
import { PropertyGallery } from "./components/PropertyGallery";
import { PropertyTitle, PropertyAgentCard, PropertyAbout, PropertyAmenities, PropertyMap } from "./components/PropertyInfo";
import { PropertyCompanyDetails } from "./components/PropertyHost";
import { PropertySidebar } from "./components/PropertySidebar";
import StaffGrid from "../../../components/grids/StaffGrid";
import { ShieldCheck, Share } from "lucide-react";
import FavoriteButton from "../../../components/custom/FavoriteButton";

const property = {
  title: 'Modern Townhouse Near Transport - 2',
  subtitle: '5 guests • 2 bedrooms • 3 beds • 2 bathrooms',
  address: '12 Maple Street, Toorak VIC 3142',
  images: [
    'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80',
    'https://images.unsplash.com/photo-1600607687931-cebf0046cbb4?w=600&q=80',
    'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=600&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=600&q=80',
  ],
  agent: {
    name: 'Sunrise Property Group',
    role: 'Property Management • Since 2016',
    verified: 'Verified [ Builder / Org. ]',
    avatar: 'https://i.pravatar.cc/150?img=11',
  },
  about: 'Low-maintenance living with open-plan design and secure parking. This modern townhouse offers the perfect blend of style and convenience, located just minutes from Richmond Station and the vibrant Church Street precinct. Enjoy easy access to Melbourne CBD, local cafes, boutiques, and parks — all within walking distance.',
  amenities: [
    { name: 'name 1' }, { name: 'name 1' }, { name: 'name 1' },
    { name: 'name 2' }, { name: 'name 2' }, { name: 'name 2' },
    { name: 'name 3' }, { name: 'name 3' }, { name: 'name 3' },
    { name: 'name 4' }, { name: 'name 4' }, { name: 'name 4' },
  ],
  mapSrc: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d50554.60553700944!2d144.8674488!3d-37.8001059!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad65d4f9b0f6e63%3A0x502cb20e4bfa6350!2sFootscray%20VIC%203011!5e0!3m2!1sen!2sau!4v1000000000000',
  company: {
    name: 'Sunrise Property Group',
    location: 'Richmond, VIC 3121',
    tags: ['Tag Line 2', 'Tag Line 2', 'Tag Line 2'],
    rating: 4.5,
    reviews: 123,
    since: 2016,
    logo: 'https://ui-avatars.com/api/?name=troi&background=0D47A1&color=fff'
  },
  hosts: [
    {
      id: 1,
      name: 'Sunrise Property Group',
      role: 'Licensed Mortgage Broker',
      location: 'Richmond, VIC 3121',
      tags: ['Mortgage Broker', '12 Year Experience', 'Tag Line 2'],
      rating: 4.5,
      reviews: 123,
      avatar: 'https://i.pravatar.cc/150?img=11',
      cover: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80',
    },
    {
      id: 2,
      name: 'Sunrise Property Group',
      role: 'Licensed Mortgage Broker',
      location: 'Richmond, VIC 3121',
      tags: ['Mortgage Broker', '12 Year Experience', 'Tag Line 2'],
      rating: 4.5,
      reviews: 123,
      avatar: 'https://i.pravatar.cc/150?img=12',
      cover: 'https://images.unsplash.com/photo-1600607687931-cebf0046cbb4?w=400&q=80',
    }
  ],
  reviews: {
    overall: 4.8,
    count: 123,
    distribution: { 5: 86, 4: 11, 3: 2, 2: 1, 1: 0 },
    list: [
      {
        id: 1,
        author: "Priya & Marcus",
        context: "Sold in Cremorne - May 2026",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=11",
        text: "He told us to hold off six weeks and repaint rather than list immediately. Cost us $4k and added a lot more than that at auction. The advice was against his own short-term interest and that told us everything.",
      },
    ],
  },
  sidebar: {
    builder: 'Sunrise Property Group',
    availability: 'Mon - Sat · 9 AM - 6 PM',
    location: 'Richmond, VIC 3121',
  }
};

const PropertyDetail = () => {
  const addressParts = property.address.split(', ');
  const suburbStateZip = addressParts[addressParts.length - 1].split(' ');
  const state = suburbStateZip[suburbStateZip.length - 2] || "Victoria";
  const suburb = suburbStateZip.slice(0, -2).join(' ') || "Toorak";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Buy", isBack: true },
    { label: "New property" },
    { label: state },
    { label: suburb },
    { label: property.title }
  ];

  return (
    <div className="min-h-screen mt-20 font-helvetica flex flex-col ">
      <main className="flex-1 w-full  px-[5%]  py-6">

        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <Breadcrumb items={breadcrumbs} />

          <div className="flex items-center gap-4 text-primary-brown text-[0.875rem] font-medium self-end sm:self-auto mb-6 sm:mb-0">
            <button className="flex items-center gap-2 hover:opacity-70 transition">
              <Share size={18} /> Share
            </button>
            <FavoriteButton
              variant="inline"
              showText={true}
              iconSize={18}
              className="hover:opacity-70 transition text-primary-brown"
            />
          </div>
        </div>


        <div className="mb-10 w-full">
          <PropertyGallery images={property.images} />
        </div>


        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          <div className="flex-1 min-w-0 flex flex-col gap-10 w-full">

            <PropertyTitle title={property.title} subtitle={property.subtitle} />
            <PropertyAgentCard agent={property.agent} />

            <div className="flex flex-col gap-12 pb-8">
              <div id="about">
                <PropertyAbout about={property.about} />
              </div>

              <div className="w-full h-[1px] bg-[#EBE5D9]" />

              <div id="amenities">
                <PropertyAmenities amenities={property.amenities} />
              </div>

              <div className="w-full h-[1px] bg-[#EBE5D9]" />

              <div id="map">
                <PropertyMap mapSrc={property.mapSrc} />
              </div>

              <div className="w-full h-[1px] bg-[#EBE5D9]" />

              <div id="company">
                <PropertyCompanyDetails company={property.company} />
              </div>

              <div id="host">
                <div className="mb-4">
                  <h2 className="text-[1.25rem] font-bold text-primary-brown">Meet The Host</h2>
                </div>
                <StaffGrid staff={property.hosts} />
              </div>

              <div className="w-full flex justify-center py-4">
                <div className="bg-white border border-[#EBE5D9] rounded-xl py-4 px-6 flex items-center gap-3 w-full max-w-[800px] shadow-sm">
                  <ShieldCheck className="text-[#B98A44]" size={24} />
                  <span className="text-[0.875rem] text-primary-brown">To protect yourself from fraud, only use the contact details provided and verified by BRIKSY.</span>
                </div>
              </div>

              <div id="reviews">
                <Reviews data={property.reviews} name={property.agent.name} />
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-[30%] shrink-0 lg:sticky lg:top-32">
            <PropertySidebar sidebar={property.sidebar} />
          </aside>
        </div>
      </main>
    </div>
  );
};

export default PropertyDetail;
