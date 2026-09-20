import Breadcrumb from "../../../components/nav/Breadcrumb";
import Reviews from "../../../components/reviews/Reviews";
import { PropertyGallery } from "./components/PropertyGallery";
import { PropertyTitle, PropertyAgentCard, PropertyAbout, PropertyAmenities, PropertyMap } from "./components/PropertyInfo";
import { PropertyCompanyDetails } from "./components/PropertyHost";
import { PropertySidebar } from "./components/PropertySidebar";
// import StaffGrid from "../../../components/grids/StaffGrid";
import { ShieldCheck, Share } from "lucide-react";
import FavoriteButton from "../../../components/custom/FavoriteButton";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProperty, type PublicProperty } from "../../../api/property/property.api";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import { buildGoogleMapsEmbedUrl } from "../../../utils/googleMaps";
import { EnquiryModal } from "../shared/EnquiryModal";
import TraderGridCard from '../../../components/cards/trader/TraderGridCard';
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Mousewheel } from "swiper/modules"

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [propertyData, setPropertyData] = useState<PublicProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    getProperty(id)
      .then(({ data }) => { if (active) setPropertyData(data); })
      .catch((reason: any) => { if (active) setError(reason?.response?.status === 404 ? "This property was not found." : "Unable to load this property."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <p className="py-20 text-center">Loading property...</p>;
  if (error) return <p className="py-20 text-center text-red-700">{error}</p>;
  if (!propertyData) return <p className="py-20 text-center">This property is unavailable.</p>;

  const property = {
    ...propertyData,
    address: propertyData.full_address || propertyData.address || "",
    subtitle: [propertyData.bedroom_option, propertyData.bathroom_option, propertyData.car_space_option].filter(Boolean).join(" • "),
    images: (() => {
      const media = (propertyData.media?.length ? propertyData.media : [
        ...(propertyData.images || []).map((item, index) => ({ ...item, id: `image-${index}`, type: 'image' as const })),
        ...(propertyData.videos || []).map((item, index) => ({ ...item, id: `video-${index}`, type: 'video' as const })),
      ]);
      return media
        .filter((item, index, all) => item.url && all.findIndex((candidate) => candidate.id ? candidate.id === item.id : candidate.url === item.url) === index)
        .map((item) => ({ id: item.id, src: item.url ?? undefined, type: item.type, videoSrc: item.type === 'video' ? item.url ?? undefined : undefined }));
    })(),
    agent: { name: propertyData.organization?.name || "Property agent", role: "Verified property organisation", verified: propertyData.organization?.is_verified ? "Verified" : "", avatar: propertyData.organization?.logo_url || "" },
    about: propertyData.description || "No description provided.",
    amenities: (propertyData.features || []).map((feature) => ({ name: feature.name })),
    mapSrc: buildGoogleMapsEmbedUrl({
      lat: propertyData.location?.latitude,
      lng: propertyData.location?.longitude,
      address: propertyData.full_address || propertyData.address,
    }),
    company: {
      id: propertyData.organization?.slug || propertyData.organization?.id || "",
      name: propertyData.organization?.name || "Property organisation",
      location: propertyData.address || "",
      tags: [],
      rating: propertyData.rating || 0,
      reviews: 0,
      since: undefined,
      logo: propertyData.organization?.logo_url || "",
    },
    hosts: [] as any[],
    reviews: { overall: propertyData.rating || 0, count: 0, distribution: {}, list: [] },
    sidebar: { builder: propertyData.organization?.name || "", builderName: propertyData.organization?.name || "", availability: "", location: propertyData.address || "", price: propertyData.price || 0 },
  };

  const submitEnquiry = async (values: {
    seeker_name: string;
    seeker_email: string;
    seeker_phone: string;
    subject: string;
    message: string;
  }) => {
    if (!propertyData.organization?.id) {
      setEnquiryError("This property does not have a company attached yet.");
      return;
    }

    setEnquirySubmitting(true);
    setEnquiryError(null);
    setEnquirySuccess(null);

    try {
      await createInquiry({
        organization_id: propertyData.organization.id,
        property_listing_id: propertyData.id,
        lead_source: "property_listing",
        subject: values.subject,
        message: values.message,
        seeker_name: values.seeker_name,
        seeker_email: values.seeker_email,
        seeker_phone: values.seeker_phone || null,
      });
      setEnquirySuccess("Your enquiry has been sent successfully.");
    } catch (reason: any) {
      setEnquiryError(reason?.response?.data?.message || "Unable to send enquiry. Please try again.");
    } finally {
      setEnquirySubmitting(false);
    }
  };
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
              targetId={property.id}
              targetType="property"
              initialIsFavourite={Boolean(propertyData.is_favourite)}
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
                  <h2 className="text-[1.25rem] font-medium text-primary-brown">Meet The Host</h2>
                </div>
                <Swiper
                  modules={[Mousewheel]}
                  spaceBetween={14}
                  slidesPerView="auto"
                  watchOverflow={false}
                  grabCursor
                  mousewheel={{
                    forceToAxis: true,
                    sensitivity: 1,
                    releaseOnEdges: true,
                  }}
                  slidesOffsetBefore={0}
                  slidesOffsetAfter={0}
                  className="!ml-0  [overscroll-behavior-x:contain] touch-pan-y"
                >
                  {property.hosts.slice(0, 3).map((item) => (
                    <SwiperSlide
                      key={item.id}
                      className=" !w-[19.4375rem]"
                    >
                      <TraderGridCard item={item} />
                    </SwiperSlide>
                  ))}
                </Swiper>
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

          <aside className="w-full lg:w-[30%] hidden md:flex shrink-0 lg:sticky lg:top-32">
            <PropertySidebar sidebar={property.sidebar} onEnquiry={() => setIsEnquiryOpen(true)} />
          </aside>
        </div>
      </main>
      <EnquiryModal
        open={isEnquiryOpen}
        companyName={propertyData.organization?.name || undefined}
        initialSubject={`Enquiry about ${propertyData.title}`}
        submitting={enquirySubmitting}
        error={enquiryError}
        success={enquirySuccess}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmit={submitEnquiry}
      />
    </div>
  );
};

export default PropertyDetail;
