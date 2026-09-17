import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Mail, MapPin, Phone, ShieldCheck, Star } from "lucide-react";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import { getOrganization, type PublicOrganization } from "../../../api/seeker/organization.api";
import { getService, type PublicService } from "../../../api/service/service.api";
import ServicePlaceholder from "../../../assets/place holder/serviceholder.svg";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import { EnquiryModal } from "../shared/EnquiryModal";

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
    return <div className="min-h-screen bg-[#F8F4EE] pb-16 pt-24 font-helvetica"><main className="mx-auto w-full px-[5%] py-6"><Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Services", isBack: true }, { label: service.name }]} /><div className="mt-8 grid gap-12 lg:grid-cols-[30%_1fr]"><aside className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-28"><img src={service.images[0]?.url || ServicePlaceholder} alt="" className="h-28 w-28 rounded-2xl object-cover" /><h1 className="mt-5 text-3xl font-medium text-primary-brown">{service.name}</h1><p className="mt-2 text-primary-light-brown">{service.category || "Professional service"}</p><div className="mt-6 space-y-3 text-sm text-primary-light-brown">{location && <p className="flex gap-2"><MapPin size={17} />{location}</p>}{provider?.contact_phone && <a className="flex gap-2" href={`tel:${provider.contact_phone}`}><Phone size={17} />{provider.contact_phone}</a>}{provider?.contact_email && <a className="flex gap-2" href={`mailto:${provider.contact_email}`}><Mail size={17} />{provider.contact_email}</a>}</div><button type="button" onClick={() => setIsEnquiryOpen(true)} className="mt-6 h-11 w-full rounded-full bg-primary-brown text-white">Send an Enquiry</button></aside><section className="space-y-8"><div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">{service.title || service.name}</h2><p className="mt-4 text-primary-light-brown">{service.description || "No description provided for this service."}</p>{(service.rate_from != null || service.rate_to != null) && <p className="mt-4 text-primary-brown">{service.rate_from != null && `From $${service.rate_from}`}{service.rate_to != null && ` to $${service.rate_to}`}</p>}</div>{media.length > 0 && <div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">Service gallery</h2><div className="mt-5 grid gap-4 sm:grid-cols-2">{media.map((item) => item.type === "video" ? <video key={item.id} src={item.url} controls playsInline className="w-full rounded-2xl bg-black" /> : <img key={item.id} src={item.url} alt={service.name} className="aspect-video w-full rounded-2xl object-cover" />)}</div></div>}</section></div></main><EnquiryModal open={isEnquiryOpen} companyName={provider?.name} initialSubject={`${service.name} enquiry`} submitting={enquirySubmitting} error={enquiryError} success={enquirySuccess} onClose={() => setIsEnquiryOpen(false)} onSubmit={async (values) => { if (!provider?.id) { setEnquiryError("This service has no organisation attached yet."); return; } setEnquirySubmitting(true); setEnquiryError(null); try { await createInquiry({ organization_id: provider.id, lead_source: "service_profile", subject: values.subject, message: values.message, seeker_name: values.seeker_name, seeker_email: values.seeker_email, seeker_phone: values.seeker_phone || null }); setEnquirySuccess("Your enquiry has been sent successfully."); } catch (reason: any) { setEnquiryError(reason?.response?.data?.message || "Unable to send enquiry. Please try again."); } finally { setEnquirySubmitting(false); } }} /></div>;
  }

  if (!organization) return null;

  const location = [organization.address, organization.state, organization.postcode].filter(Boolean).join(", ");
  const services = organization.services ?? [];

  return <div className="min-h-screen bg-[#F8F4EE] pb-16 pt-24 font-helvetica"><main className="mx-auto w-full px-[5%] py-6">
    <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Find a professional", isBack: true }, { label: organization.name }]} />
    <div className="mt-8 grid gap-12 lg:grid-cols-[30%_1fr]">
      <aside className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-28">
        {organization.banner_url && <img src={organization.banner_url} alt="" className="mb-5 h-28 w-full rounded-2xl object-cover" />}
        <img src={organization.logo_url || ServicePlaceholder} alt={organization.name} className="h-28 w-28 rounded-2xl object-cover" />
        <h1 className="mt-5 text-3xl font-medium text-primary-brown">{organization.name}</h1>
        <p className="mt-2 text-primary-light-brown">{organization.type?.name || "Property professional"}</p>
        <div className="mt-5 flex items-center gap-2 text-primary-brown"><Star size={17} className="fill-orange-500 text-orange-500" /> {organization.rating || 0}</div>
        {organization.is_verified && <p className="mt-4 flex items-center gap-2 text-sm text-primary-brown"><ShieldCheck size={17} /> Verified business</p>}
        <div className="mt-6 space-y-3 text-sm text-primary-light-brown">
          {location && <p className="flex gap-2"><MapPin size={17} />{location}</p>}
          {organization.contact?.phone && <a className="flex gap-2" href={`tel:${organization.contact.phone}`}><Phone size={17} />{organization.contact.phone}</a>}
          {organization.contact?.email && <a className="flex gap-2" href={`mailto:${organization.contact.email}`}><Mail size={17} />{organization.contact.email}</a>}
        </div>
      </aside>
      <section className="space-y-8">
        <div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">About {organization.name}</h2><p className="mt-4 text-primary-light-brown">{organization.type?.name || "Verified property professional"} serving {location || "the local area"}.</p></div>
        <div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">Services offered</h2>{services.length ? <div className="mt-5 grid gap-3 sm:grid-cols-2">{services.map((service) => <div key={service.id} className="rounded-2xl border border-[#E7E7E4] p-4"><p className="font-medium text-primary-brown">{service.name}</p>{service.description && <p className="mt-2 text-sm text-primary-light-brown">{service.description}</p>}{service.starting_price != null && <p className="mt-2 text-sm text-primary-light-brown">From ${service.starting_price}</p>}</div>)}</div> : <p className="mt-4 text-primary-light-brown">No services have been listed.</p>}</div>
        <div className="rounded-3xl bg-white p-7"><h2 className="text-xl font-medium text-primary-brown">Business details</h2><dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2"><div><dt className="text-primary-light-brown">ABN</dt><dd className="text-primary-brown">{organization.abn || "Not provided"}</dd></div><div><dt className="text-primary-light-brown">Address</dt><dd className="text-primary-brown">{location || "Not provided"}</dd></div></dl></div>
      </section>
    </div>
  </main></div>;
};

export default ServiceDetail;
