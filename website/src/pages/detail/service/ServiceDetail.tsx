import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, MapPin, Phone } from "lucide-react";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import { getOrganization, type PublicOrganization } from "../../../api/seeker/organization.api";
import { getService, type PublicService } from "../../../api/service/service.api";
import ServicePlaceholder from "../../../assets/place holder/serviceholder.svg";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import { EnquiryModal } from "../shared/EnquiryModal";

// New UI Components
import { ServiceSidebar } from "./components/ServiceSidebar";
import {
  ServiceList,
  ServiceQualifications,
  ServiceRecentWork,
  ServiceLocation,
} from "./components/ServiceDetails";
import Reviews from "../../../components/reviews/Reviews";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<PublicOrganization | null>(null);
  const [service, setService] = useState<PublicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const load = async () => {
      const loadOrganization = async (organizationId: string) => {
        return (await getOrganization(organizationId)).data;
      };

      try {
        // Trader cards use an organization slug/id in this route. Resolve that first
        // to avoid unnecessary 404s against the service endpoint.
        const organizationData = await loadOrganization(id);
        if (active) setOrganization(organizationData);
      } catch (organizationReason: any) {
        if (organizationReason?.response?.status !== 404) throw organizationReason;

        const serviceResponse = await getService(id);
        if (!active) return;
        setService(serviceResponse.data);
        if (serviceResponse.data.organization?.id) {
          const organizationData = await loadOrganization(serviceResponse.data.organization.id);
          if (active) setOrganization(organizationData);
        }
      }
    };

    load().catch((reason: any) => {
      if (active) setError(reason?.response?.status === 404 ? "This professional or service was not found." : "Unable to load this professional or service.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32">Loading professional...</div>;
  if (error || (!organization && !service)) return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 text-primary-brown">{error || "Professional or service not found."}</div>;

  if (service && !organization) {
    const provider = service.organization;
    const location = [provider?.address, provider?.state, provider?.postcode].filter(Boolean).join(", ");
    const media = [...service.images.map((item) => ({ ...item, type: "image" as const })), ...service.videos.map((item) => ({ ...item, type: "video" as const }))];
    return <div className="min-h-screen bg-[#F8F4EE] pb-16 pt-24 font-helvetica"><div className="mx-auto w-full px-[5%] py-6"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services", isBack: true }, { label: service.name }]} /><div className="mt-8 grid gap-12 lg:grid-cols-[30%_1fr]"><div className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-28"><img src={service.images[0]?.url || ServicePlaceholder} alt="" className="h-28 w-28 rounded-2xl object-cover" /><h1 className="mt-5 text-3xl font-medium text-primary-brown">{service.name}</h1><p className="mt-2 text-primary-light-brown">{service.category || "Professional service"}</p><div className="mt-6 space-y-3 text-sm text-primary-light-brown">{location && <p className="flex gap-2"><MapPin size={17} />{location}</p>}{provider?.contact_phone && <a className="flex gap-2" href={`tel:${provider.contact_phone}`}><Phone size={17} />{provider.contact_phone}</a>}{provider?.contact_email && <a className="flex gap-2" href={`mailto:${provider.contact_email}`}><Mail size={17} />{provider.contact_email}</a>}</div><button type="button" onClick={() => setIsEnquiryOpen(true)} className="mt-6 h-11 w-full rounded-full bg-primary-brown text-white">Send an Enquiry</button></div><div className="space-y-8"><div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">{service.title || service.name}</h2><p className="mt-4 text-primary-light-brown">{service.description || "No description provided for this service."}</p>{(service.rate_from != null || service.rate_to != null) && <p className="mt-4 text-primary-brown">{service.rate_from != null && `From $${service.rate_from}`}{service.rate_to != null && ` to $${service.rate_to}`}</p>}</div>{media.length > 0 && <div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">Service gallery</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{media.map((item) => item.type === "video" ? <video key={item.id} src={item.url} controls playsInline className="w-full rounded-2xl bg-black" /> : <img key={item.id} src={item.url} alt={service.name} className="aspect-video w-full rounded-2xl object-cover" />)}</div></div>}</div></div></div><EnquiryModal open={isEnquiryOpen} companyName={provider?.name} initialSubject={`${service.name} enquiry`} submitting={enquirySubmitting} error={enquiryError} success={enquirySuccess} onClose={() => setIsEnquiryOpen(false)} onSubmit={async (values) => { if (!provider?.id) { setEnquiryError("This service has no organisation attached yet."); return; } setEnquirySubmitting(true); setEnquiryError(null); try { await createInquiry({ organization_id: provider.id, lead_source: "service_profile", subject: values.subject, message: values.message, seeker_name: values.seeker_name, seeker_email: values.seeker_email, seeker_phone: values.seeker_phone || null }); setEnquirySuccess("Your enquiry has been sent successfully."); } catch (reason: any) { setEnquiryError(reason?.response?.data?.message || "Unable to send enquiry. Please try again."); } finally { setEnquirySubmitting(false); } }} /></div>;
  }

  if (!organization) return null;

  const services = organization.services ?? [];
  const selectedService = service ? {
    id: service.id,
    name: service.name,
    slug: service.slug || service.name.toLowerCase().replace(/\s+/g, "-"),
    description: service.description,
    starting_price: service.rate_from,
    rate_from: service.rate_from,
    rate_to: service.rate_to,
    service_area: service.service_area,
    service_area_geometry: service.service_area_geometry,
    images: service.images,
    videos: service.videos,
  } : null;
  const allServices = selectedService && !services.some((item) => item.id === selectedService.id)
    ? [selectedService, ...services]
    : services.map((item) => item.id === selectedService?.id ? { ...item, ...selectedService } : item);

  const mappedServices = allServices.map(s => ({
    id: s.id,
    image: s.images?.[0]?.url || ServicePlaceholder,
    title: s.name,
    description: s.description || "No description provided for this service.",
    price: (s.starting_price ?? s.rate_from) != null ? `From $${s.starting_price ?? s.rate_from}` : "Custom quote",
    duration: s.service_area || "Contact for estimate",
  }));
  const firstService = allServices[0];
  const serviceMedia = allServices.flatMap((item) => (item.images || []).map((image) => ({ src: image.url })));
  const galleryItems = [0, 1, 2].map((index) => serviceMedia[index] || { src: ServicePlaceholder });
  const address = [organization.address, organization.state, organization.postcode].filter(Boolean).join(", ");
  const serviceArea = selectedService?.service_area || firstService?.service_area;
  const serviceAreaGeometry = selectedService?.service_area_geometry || firstService?.service_area_geometry;
  const locationText = serviceArea || address;
  const mapSrc = locationText ? `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&output=embed` : "";
  const rating = Number(organization.rating || 0);
  const price = selectedService?.rate_from ?? selectedService?.starting_price ?? firstService?.starting_price ?? firstService?.rate_from ?? 0;

  return (
    <div className="min-h-screen bg-[#F8F4EE] pb-16 pt-20 font-helvetica">
      <div className=" w-full px-[3%] py-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Find a professional", isBack: true },
            { label: organization.type?.name || "Trades and repairs" },
            { label: organization.name }
          ]}
        />

        <div className="mt-8  gap-12  flex items-start">

          <div className="lg:sticky w-[30%] lg:top-28 ">
            <ServiceSidebar
              contact={{ price, rateType: "/hour" }}
              service={{
                bannerImage: organization.banner_url || "",
                avatar: organization.logo_url || ServicePlaceholder,
                name: organization.name,
                registration: organization.type?.name || "Trades & Professional Services",
                rating,
                reviewsCount: 0,
                address,
              }}
              onEnquiry={() => setIsEnquiryOpen(true)}
            />
          </div>

          <div className="flex flex-col w-[70%] gap-12 pt-6">
            <div id="services">
              <ServiceList servicesData={{ list: mappedServices }} />
            </div>

            <div id="overview" className="flex flex-col gap-12">
              <ServiceQualifications
                companyName={organization.name}
                companyLogo={organization.logo_url || ServicePlaceholder}
                qualifications={[
                  { title: "Business type", description: organization.type?.name || "Trades & Professional Services" },
                  { title: "Briksy verification", description: organization.is_verified ? "Verified business on Briksy" : "Verification pending" },
                  { title: "Service area", description: serviceArea || address || "Contact this business for service locations" }
                ]}
              />
              <div className="w-[70%]">
                <ServiceRecentWork
                  recentWork={{
                    totalPhotos: serviceMedia.length,
                    items: galleryItems,
                  }}
                /></div>

              <ServiceLocation
                location={{
                  description: serviceArea ? `This business provides services in ${serviceArea}. Contact them to confirm availability for your location.` : address ? `This business is based in ${address}. Contact them to confirm service availability.` : "Contact this business to confirm its service area.",
                  mapSrc,
                  address: locationText,
                  serviceArea,
                  geometry: serviceAreaGeometry,
                }}
              />
            </div>

            <div id="reviews">
              <Reviews
                name={organization.name}
                data={{
                  overall: rating,
                  count: 0,
                  distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
                  list: [],
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <EnquiryModal
        open={isEnquiryOpen}
        companyName={organization.name}
        initialSubject={`${organization.name} enquiry`}
        submitting={enquirySubmitting}
        error={enquiryError}
        success={enquirySuccess}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmit={async (values) => {
          if (!organization?.id) {
            setEnquiryError("This professional has no organisation ID attached yet.");
            return;
          }
          setEnquirySubmitting(true);
          setEnquiryError(null);
          try {
            await createInquiry({
              organization_id: organization.id,
              lead_source: "service_profile",
              subject: values.subject,
              message: values.message,
              seeker_name: values.seeker_name,
              seeker_email: values.seeker_email,
              seeker_phone: values.seeker_phone || null
            });
            setEnquirySuccess("Your enquiry has been sent successfully.");
          } catch (reason: any) {
            setEnquiryError(reason?.response?.data?.message || "Unable to send enquiry. Please try again.");
          } finally {
            setEnquirySubmitting(false);
          }
        }}
      />
    </div>
  );
};

export default ServiceDetail;
