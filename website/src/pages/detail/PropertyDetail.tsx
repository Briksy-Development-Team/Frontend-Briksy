
import { Heart, MapPin, Bed, Bath, Square,  Phone, Mail } from 'lucide-react';

const property = {
  title: '4 Bedroom Family Home with Pool',
  address: '12 Maple Street, Toorak VIC 3142',
  price: 1_850_000,
  beds: 4, baths: 3, sqm: 420,
  badge: 'For Sale',
  description: 'A stunning family home nestled in one of Melbourne\'s most prestigious streets. Featuring light-filled open-plan living, a gourmet kitchen with stone benchtops, and a resort-style pool perfect for entertaining. Close to elite schools, boutique shopping, and public transport.',
  images: [
    'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=900&q=80',
    'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?w=900&q=80',
  ],
  agent: { name: 'Sarah Mitchell', avatar: 'https://i.pravatar.cc/80?img=47', agency: 'Ray White Toorak', phone: '+61 412 000 111', email: 'sarah@raywhite.com.au' },
  features: ['Pool', 'Double Garage', 'Ducted Heating', 'Alfresco Dining', 'Study', 'Powder Room'],
};

import Breadcrumb from "../../components/nav/Breadcrumb";

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
    <div className="min-h-screen bg-white-50 font-helvetica pb-16">
      <div className="max-w-5xl mx-auto px-4 pt-8">
        <Breadcrumb items={breadcrumbs} />

        
        <div className="grid grid-cols-3 gap-2 rounded-2xl overflow-hidden h-[420px]">
          <img src={property.images[0]} className="col-span-2 w-full h-full object-cover" alt="" />
          <div className="flex flex-col gap-2">
            <img src={property.images[1]} className="flex-1 w-full object-cover" alt="" />
            <img src={property.images[2]} className="flex-1 w-full object-cover" alt="" />
          </div>
        </div>

        <div className="mt-8 grid grid-cols-3 gap-8">
          
          <div className="col-span-2 space-y-6">
            <div>
              <span className="text-xs font-medium bg-primary-brown text-white px-3 py-1 rounded-full">{property.badge}</span>
              <h1 className="mt-3 text-2xl font-bold text-primary-brown">{property.title}</h1>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-primary-light-brown">
                <MapPin size={14} />{property.address}
              </div>
            </div>

            <div className="flex gap-6 text-primary-brown">
              <div className="flex items-center gap-2"><Bed size={18} /><span className="font-semibold">{property.beds}</span><span className="text-sm text-primary-light-brown">Beds</span></div>
              <div className="flex items-center gap-2"><Bath size={18} /><span className="font-semibold">{property.baths}</span><span className="text-sm text-primary-light-brown">Baths</span></div>
              <div className="flex items-center gap-2"><Square size={18} /><span className="font-semibold">{property.sqm}</span><span className="text-sm text-primary-light-brown">sqm</span></div>
            </div>

            <div>
              <h2 className="font-semibold text-primary-brown mb-2">About this property</h2>
              <p className="text-sm text-primary-light-brown leading-relaxed">{property.description}</p>
            </div>

            <div>
              <h2 className="font-semibold text-primary-brown mb-3">Features</h2>
              <div className="flex flex-wrap gap-2">
                {property.features.map(f => (
                  <span key={f} className="text-xs px-3 py-1.5 border border-white-100 rounded-full text-primary-brown">{f}</span>
                ))}
              </div>
            </div>
          </div>

          
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-white-100 space-y-4">
              <p className="text-2xl font-bold text-primary-brown">${property.price.toLocaleString()}</p>
              <div className="border-t border-white-100" />
              <div className="flex items-center gap-3">
                <img src={property.agent.avatar} className="w-12 h-12 rounded-full object-cover" alt="" />
                <div>
                  <p className="font-semibold text-sm text-primary-brown">{property.agent.name}</p>
                  <p className="text-xs text-primary-light-brown">{property.agent.agency}</p>
                </div>
              </div>
              <a href={`tel:${property.agent.phone}`} className="flex items-center gap-2 w-full bg-primary-brown text-white rounded-xl py-2.5 px-4 text-sm justify-center hover:opacity-90 transition-opacity">
                <Phone size={15} /> Call agent
              </a>
              <a href={`mailto:${property.agent.email}`} className="flex items-center gap-2 w-full border border-white-100 text-primary-brown rounded-xl py-2.5 px-4 text-sm justify-center hover:bg-white-50 transition-colors">
                <Mail size={15} /> Email agent
              </a>
            </div>

            <button className="flex items-center justify-center gap-2 w-full border border-white-100 bg-white text-primary-brown rounded-xl py-2.5 px-4 text-sm hover:bg-white-50 transition-colors">
              <Heart size={15} /> Save property
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
