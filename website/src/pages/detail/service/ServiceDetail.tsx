import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import { getOrganization, type PublicOrganization } from "../../../api/seeker/organization.api";
import { getService, type PublicService } from "../../../api/service/service.api";
import ServicePlaceholder from "../../../assets/place holder/serviceholder.svg";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import { EnquiryModal } from "../shared/EnquiryModal";

// New UI Components
import { ServiceSidebar } from "./components/ServiceSidebar";
import { ServiceTabs } from "./components/ServiceMain";
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
    getOrganization(id).then((response) => { if (active) setOrganization(response.data); }).catch((organizationReason: any) => {
      if (organizationReason?.response?.status !== 404) throw organizationReason;
      return getService(id).then((response) => { if (active) setService(response.data); });
    }).catch((reason: any) => {
      if (active) setError(reason?.response?.status === 404 ? "This professional or service was not found." : "Unable to load this professional or service.");
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32">Loading professional...</div>;
  if (error || (!organization && !service)) return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 text-primary-brown">{error || "Professional or service not found."}</div>;

  if (service) {
    const provider = service.organization;
    const location = [provider?.address, provider?.state, provider?.postcode].filter(Boolean).join(", ");
    const media = [...service.images.map((item) => ({ ...item, type: "image" as const })), ...service.videos.map((item) => ({ ...item, type: "video" as const }))];
    return <div className="min-h-screen bg-[#F8F4EE] pb-16 pt-24 font-helvetica"><div className="mx-auto w-full px-[5%] py-6"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services", isBack: true }, { label: service.name }]} /><div className="mt-8 grid gap-12 lg:grid-cols-[30%_1fr]"><div className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-28"><img src={service.images[0]?.url || ServicePlaceholder} alt="" className="h-28 w-28 rounded-2xl object-cover" /><h1 className="mt-5 text-3xl font-medium text-primary-brown">{service.name}</h1><p className="mt-2 text-primary-light-brown">{service.category || "Professional service"}</p><div className="mt-6 space-y-3 text-sm text-primary-light-brown">{location && <p className="flex gap-2"><MapPin size={17} />{location}</p>}{provider?.contact_phone && <a className="flex gap-2" href={`tel:${provider.contact_phone}`}><Phone size={17} />{provider.contact_phone}</a>}{provider?.contact_email && <a className="flex gap-2" href={`mailto:${provider.contact_email}`}><Mail size={17} />{provider.contact_email}</a>}</div><button type="button" onClick={() => setIsEnquiryOpen(true)} className="mt-6 h-11 w-full rounded-full bg-primary-brown text-white">Send an Enquiry</button></div><div className="space-y-8"><div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">{service.title || service.name}</h2><p className="mt-4 text-primary-light-brown">{service.description || "No description provided for this service."}</p>{(service.rate_from != null || service.rate_to != null) && <p className="mt-4 text-primary-brown">{service.rate_from != null && `From $${service.rate_from}`}{service.rate_to != null && ` to $${service.rate_to}`}</p>}</div>{media.length > 0 && <div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">Service gallery</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{media.map((item) => item.type === "video" ? <video key={item.id} src={item.url} controls playsInline className="w-full rounded-2xl bg-black" /> : <img key={item.id} src={item.url} alt={service.name} className="aspect-video w-full rounded-2xl object-cover" />)}</div></div>}</div></div></div><EnquiryModal open={isEnquiryOpen} companyName={provider?.name} initialSubject={`${service.name} enquiry`} submitting={enquirySubmitting} error={enquiryError} success={enquirySuccess} onClose={() => setIsEnquiryOpen(false)} onSubmit={async (values) => { if (!provider?.id) { setEnquiryError("This service has no organisation attached yet."); return; } setEnquirySubmitting(true); setEnquiryError(null); try { await createInquiry({ organization_id: provider.id, lead_source: "service_profile", subject: values.subject, message: values.message, seeker_name: values.seeker_name, seeker_email: values.seeker_email, seeker_phone: values.seeker_phone || null }); setEnquirySuccess("Your enquiry has been sent successfully."); } catch (reason: any) { setEnquiryError(reason?.response?.data?.message || "Unable to send enquiry. Please try again."); } finally { setEnquirySubmitting(false); } }} /></div>;
  }

  if (!organization) return null;

  const services = organization.services ?? [];

  const mappedServices = services.length ? services.map(s => ({
    id: s.id,
    image: s.images?.[0]?.url || ServicePlaceholder,
    title: s.name,
    description: s.description || "Package tailored to client needs.",
    price: s.starting_price != null ? `From $${s.starting_price}` : "Custom quote",
    duration: "1 hr"
  })) : [
    { id: 1, image: ServicePlaceholder, title: "Wiring, Installation & Repair", description: "Safe wiring, socket and switch installation for homes & offices.", price: "$120", duration: "1 hr" },
    { id: 2, image: ServicePlaceholder, title: "Plumbing Services", description: "Expert leak detection, pipe installation, and bathroom renovations.", price: "$220", duration: "2 hrs" }
  ];

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
              contact={{ price: 120, rateType: "/hour" }}
              service={{
                bannerImage: organization.banner_url || "",
                avatar: organization.logo_url || ServicePlaceholder,
                name: organization.name,
                registration: organization.type?.name || "Licensed Professional in Home Wiring Specialist",
                rating: organization.rating || 4.9,
                reviewsCount: 164,
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
                  { title: "10 years of experience", description: "Body weight training, mobility coaching & survival Scrabble" },
                  { title: "Career highlight", description: "Choreographing a routine for a local fitness commercial" },
                  { title: "Education and training", description: "Apprenticeship, Cert IV in Fitness" }
                ]}
              />
              <div className="w-[70%]">
                <ServiceRecentWork
                  recentWork={{
                    totalPhotos: 12,
                    items: [
                      { src: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop" },
                      { src: "https://images.unsplash.com/photo-1581092921461-7031e4bfb83e?q=80&w=2070&auto=format&fit=crop" },
                      { src: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?q=80&w=2070&auto=format&fit=crop" }
                    ]
                  }}
                /></div>

              <ServiceLocation
                location={{
                  description: "I travel to you in the area outlined on the map. To book in a different location, you can message me.",
                  mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1565451.6961476686!2d143.20816812836224!3d-36.99451188339893!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sVictoria%2C%20Australia!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
                }}
              />
            </div>

            <div id="reviews">
              <Reviews
                name={organization.name}
                data={{
                  overall: organization.rating || 4.9,
                  count: 164,
                  distribution: { 5: 80, 4: 15, 3: 5, 2: 0, 1: 0 },
                  list: [
                    {
                      id: 1,
                      avatar: ServicePlaceholder,
                      author: "Priya & Marcus",
                      context: "Built in Cranbourne - May 2024",
                      rating: 5,
                      text: "He told us to hold off on weekly and recent rather than tell immediately. Built up SPA and added a bit more than that at auction. The advice was against his own short term interest and that told us everything."
                    },
                    {
                      id: 2,
                      avatar: ServicePlaceholder,
                      author: "Priya & Marcus",
                      context: "Built in Cranbourne - May 2024",
                      rating: 5,
                      text: "He told us to hold off on weekly and recent rather than tell immediately. Built up SPA and added a bit more than that at auction. The advice was against his own short term interest and that told us everything."
                    }
                  ]
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
