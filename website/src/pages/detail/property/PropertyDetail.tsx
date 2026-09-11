import Breadcrumb from "../../../components/nav/Breadcrumb";
import Reviews from "../../../components/reviews/Reviews";
import { PropertyGallery } from "./components/PropertyGallery";
import { PropertyTitle, PropertyAgentCard, PropertyAbout, PropertyAmenities } from "./components/PropertyInfo";
import { PropertyCompanyDetails } from "./components/PropertyHost";
import { PropertySidebar } from "./components/PropertySidebar";
import StaffGrid from "../../../components/grids/StaffGrid";
import { ShieldCheck, Share } from "lucide-react";
import FavoriteButton from "../../../components/custom/FavoriteButton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProperty, type PublicProperty } from "../../../api/property/property.api";
import ServicePlaceholder from "../../../assets/place holder/serviceholder.svg";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<PublicProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    getProperty(id)
      .then(({ data }) => { if (active) setProperty(data); })
      .catch((reason: any) => { if (active) setError(reason?.response?.status === 404 ? "This property was not found." : "Unable to load this property."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="min-h-screen px-[5%] pt-32 text-primary-brown">Loading property...</div>;
  if (error || !property) return <div className="min-h-screen px-[5%] pt-32 text-primary-brown">{error || "Property not found."}</div>;

  const address = property.full_address || property.address || [property.location.suburb, property.location.state, property.location.postcode].filter(Boolean).join(", ");
  const organizationName = property.organization?.name || "Property owner";
  const gallery = (property.media ?? []).map((item) => ({ src: item.url ?? undefined, type: item.type, videoSrc: item.type === "video" ? item.url ?? undefined : undefined }));
  const amenities = (property.features ?? []).map((feature) => ({ name: feature.name }));
  const subtitle = [property.property_type?.name, property.bedroom_option && `${property.bedroom_option} bedrooms`, property.bathroom_option && `${property.bathroom_option} bathrooms`, property.floor_area_sqm && `${property.floor_area_sqm} sqm`].filter(Boolean).join(" • ");
  const company = { id: property.organization?.id, name: organizationName, logo: ServicePlaceholder, location: address, tags: property.property_type?.category ? [property.property_type.category] : [], rating: property.rating, reviews: 0, since: undefined };
  const agent = { name: organizationName, role: property.organization?.is_verified ? "Verified property organisation" : "Property organisation", verified: property.organization?.is_verified ? "Verified organisation" : "", avatar: ServicePlaceholder };

  return <div className="min-h-screen mt-20 font-helvetica flex flex-col"><main className="flex-1 w-full px-[5%] py-6">
    <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Properties", isBack: true }, { label: property.title }]} /><div className="flex items-center gap-4 text-primary-brown text-[0.875rem] font-medium self-end sm:self-auto mb-6 sm:mb-0"><button className="flex items-center gap-2 hover:opacity-70 transition"><Share size={18} /> Share</button><FavoriteButton variant="inline" showText iconSize={18} className="hover:opacity-70 transition text-primary-brown" /></div></div>
    <div className="mb-10 w-full"><PropertyGallery images={gallery} /></div>
    <div className="flex flex-col lg:flex-row gap-10 items-start relative"><div className="flex-1 min-w-0 flex flex-col gap-10 w-full"><PropertyTitle title={property.title} subtitle={subtitle || "Property details"} /><PropertyAgentCard agent={agent} /><div className="flex flex-col gap-12 pb-8"><PropertyAbout about={property.description || "No description provided for this property."} />{amenities.length > 0 && <><div className="w-full h-[1px] bg-[#EBE5D9]" /><PropertyAmenities amenities={amenities} /></>}<div className="w-full h-[1px] bg-[#EBE5D9]" /><PropertyCompanyDetails company={company} /><div id="host"><h2 className="mb-4 text-[1.25rem] font-medium text-primary-brown">Meet The Host</h2><StaffGrid staff={[]} /></div><div className="w-full flex justify-center py-4"><div className="bg-white border border-[#EBE5D9] rounded-xl py-4 px-6 flex items-center gap-3 w-full max-w-[800px] shadow-sm"><ShieldCheck className="text-[#B98A44]" size={24} /><span className="text-[0.875rem] text-primary-brown">To protect yourself from fraud, only use the contact details provided and verified by BRIKSY.</span></div></div><Reviews data={{ overall: property.rating, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, list: [] }} name={organizationName} /></div></div><aside className="w-full lg:w-[30%] shrink-0 lg:sticky lg:top-32"><PropertySidebar sidebar={{ price: property.price ?? undefined, builderName: organizationName }} /></aside></div>
  </main></div>;
};

export default PropertyDetail;
