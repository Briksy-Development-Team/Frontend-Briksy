import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import { getOrganization, type PublicOrganization } from "../../../api/seeker/organization.api";
import { getProperties } from "../../../api/property/property.api";
import { propertyToCard } from "../../../api/public.mappers";
import type { Property } from "../../../types/property";
import { AgentSidebar } from "./components/AgentSidebar";
import { AgentProperties } from "./components/AgentProperties";
import { AgentAbout } from "./components/AgentAbout";
import { AgentMobileHeader } from "./components/AgentMobileHeader";
import FraudBanner from "../../../components/custom/FraudBanner";
import MobileStickyAction from "../../../components/custom/MobileStickyAction";
import { EnquiryModal } from "../shared/EnquiryModal";
import { SimilarSection } from "../shared";
import DetailSkeleton from "../../../components/skeletons/DetailSkeleton";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import defaultBanner from "../../../assets/agent/agent_banner.png";
import defaultAvatar from "../../../assets/agent/agent_avatar.png";

type HttpLikeError = Error & { response?: { status?: number } };

/**
 * Dedicated Agent Details Page matching Figma node 4359-2061.
 * Left side: AgentSidebar (same architecture as traders).
 * Right side: Performance snapshot, Agent properties with SwiperScroll, About, Ratings and reviews using shared Reviews component.
 */
export const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<PublicOrganization | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertyCount, setPropertyCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Enquiry modal state
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubject, setEnquirySubject] = useState("");
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    setLoading(true);
    setError(null);

    getOrganization(id)
      .then((orgRes) => {
        if (!active) return;
        setOrganization(orgRes.data);

        // Fetch properties related to this agent / organization
        return getProperties({
          organization_slug: orgRes.data.slug || undefined,
          organization_id: orgRes.data.id,
          per_page: 12,
        }).then((propRes) => {
          if (!active) return;
          const mapped = propRes.data.map(propertyToCard);
          setProperties(mapped);
          setPropertyCount(propRes.meta?.pagination?.total ?? mapped.length);
        });
      })
      .catch((reason: HttpLikeError) => {
        if (active) {
          setError(
            reason?.response?.status === 404
              ? "This agent was not found."
              : "Unable to load agent details. Please try again later.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const handleEnquirySubmit = async (values: {
    seeker_name: string;
    seeker_email: string;
    seeker_phone?: string;
    subject: string;
    message: string;
    interested_in?: string[];
  }) => {
    if (!organization) return;
    setEnquirySubmitting(true);
    setEnquiryError(null);
    try {
      const result = await createInquiry({
        organization_id: organization.id,
        lead_source: "agent_profile",
        subject: values.subject,
        interested_in: ["property_information"],
        message: values.message,
        seeker_name: values.seeker_name,
        seeker_email: values.seeker_email,
        seeker_phone: values.seeker_phone || null,
      });
      setEnquirySuccess(
        result.data?.email_delivery?.status !== "sent"
          ? `${result.message} Our team can still view it.`
          : "Your enquiry has been sent successfully.",
      );
    } catch (reason: any) {
      setEnquiryError(
        reason?.response?.data?.message || "Unable to send enquiry. Please try again.",
      );
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const openAppraisalModal = () => {
    setEnquirySubject(`Request a free appraisal from ${organization?.name || "Agent"}`);
    setEnquiryError(null);
    setEnquirySuccess(null);
    setIsEnquiryOpen(true);
  };

  const openGeneralEnquiryModal = () => {
    setEnquirySubject(`General Enquiry for ${organization?.name || "Agent"}`);
    setEnquiryError(null);
    setEnquirySuccess(null);
    setIsEnquiryOpen(true);
  };

  const handleCallAgency = () => {
    const phone = organization?.contact?.phone;
    if (phone) {
      window.location.href = `tel:${phone}`;
    } else {
      openGeneralEnquiryModal();
    }
  };

  if (loading) {
    return <DetailSkeleton gallery={false} />;
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen  px-[3%] pt-32 text-primary-brown">
        {error || "Agent not found."}
      </div>
    );
  }

  const agentName = organization.name;
  const propertiesList = properties;
  const aboutDescription = organization.description?.trim();

  const agentModel = {
    id: organization.id,
    name: agentName,
    role: organization.type?.name,
    agencyName: organization.type?.label,
    agencyUrl: organization.website || undefined,
    bannerImage: organization.banner_url || defaultBanner,
    avatar: organization.logo_url || defaultAvatar,
    rating: organization.rating,
    reviewsCount: organization.reviews_count,
    phone: organization.contact?.phone,
    email: organization.contact?.email,
    is_favourite: organization.is_favourite,
    is_verified: organization.is_verified,
  };

  return (
    <div className="min-h-screen  font-helvetica md:pt-20">
      <main className="flex-1 w-full max-w-[1530px] mx-auto sm:px-8 lg:px-20 pb-12 md:py-6">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Find an agent", href: "/agents", isBack: true },
            { label: agentName },
          ]}
        />

        {/* Mobile Header */}
        <AgentMobileHeader agent={agentModel} />

        {/* 2-Column Layout matching PropertyDetail gap-12 */}
        <div className="mt-4 flex flex-col items-start px-4 gap-12 md:mt-8 lg:flex-row">
          {/* Left Column (Sticky Sidebar on Desktop matching 360px) */}
          <aside className="hidden w-full md:flex flex-col lg:sticky lg:top-28 lg:w-[360px] shrink-0">
            <AgentSidebar
              agent={agentModel}
              onRequestAppraisal={openAppraisalModal}
              onEnquiry={openGeneralEnquiryModal}
              onCallAgency={handleCallAgency}
            />
          </aside>

          {/* Right Column (Content matching gap-8) */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 w-full pt-0 md:pt-2">
            {/* Organization-linked properties from the backend */}
            <AgentProperties
              agentName={agentName}
              homes={propertiesList}
              totalCount={propertyCount}
              slug={organization.slug}
            />

            {aboutDescription && (
              <AgentAbout agentName={agentName} description={aboutDescription} />
            )}

          </div>
        </div>

        {/* Similar Agents Section */}
        <SimilarSection type="agent" currentId={id} className="px-4 sm:px-0" />

      </main>
      <div className="my-10 px-[3%]  w-full flex items-center justify-center ">
        <FraudBanner />
      </div>
      <div className="sticky bottom-0 z-20">

        <MobileStickyAction
          price="Appraisal"
          onEnquiry={openAppraisalModal}
        />
      </div>

      {/* Enquiry / Appraisal Modal */}
      <EnquiryModal
        open={isEnquiryOpen}
        companyName={agentName}
        initialSubject={enquirySubject || `${agentName} enquiry`}
        submitting={enquirySubmitting}
        error={enquiryError}
        success={enquirySuccess}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmit={handleEnquirySubmit}
      />
    </div>
  );
};

export default AgentDetail;
