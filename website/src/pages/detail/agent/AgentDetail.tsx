import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import { getOrganization, type PublicOrganization } from "../../../api/seeker/organization.api";
import { getProperties } from "../../../api/property/property.api";
import { propertyToCard } from "../../../api/public.mappers";
import type { Property } from "../../../types/property";
import { AgentSidebar } from "./components/AgentSidebar";
import { AgentPerformance } from "./components/AgentPerformance";
import { AgentProperties } from "./components/AgentProperties";
import { AgentAbout } from "./components/AgentAbout";
import { AgentMobileHeader } from "./components/AgentMobileHeader";
import Reviews from "../../../components/reviews/Reviews";
import FraudBanner from "../../../components/custom/FraudBanner";
import MobileStickyAction from "../../../components/custom/MobileStickyAction";
import { EnquiryModal } from "../shared/EnquiryModal";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import defaultBanner from "../../../assets/agent/agent_banner.png";
import defaultAvatar from "../../../assets/agent/agent_avatar.png";
import defaultReviewer from "../../../assets/agent/reviewer_avatar.png";

type HttpLikeError = Error & { response?: { status?: number } };

// Fallback data centralized in the main detail page as requested
const DEFAULT_PERFORMANCE = {
  medianSoldPrice: "$809k",
  medianDaysAdvertised: 42,
  propertiesSoldLead: 126,
  propertiesSoldSecondary: 44,
};

const DEFAULT_BADGES = ["2025 Top Agent", "14 years experience"];

const getDefaultProperties = (agentName: string): Property[] => [
  {
    id: "agent-prop-1",
    title: "Home in Bondi Beach",
    address: "1702/433 Kent Street, Sydney NSW",
    location: "Bondi Beach, Sydney",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80",
    price: 10000,
    beds: 3,
    baths: 2,
    sqm: 135,
    posterName: agentName,
    posterAvatar: defaultAvatar,
    badge: "Trending",
    lat: -33.8915,
    lng: 151.2767,
    isFavourite: false,
  },
  {
    id: "agent-prop-2",
    title: "Luxury Beachfront Apartment",
    address: "88 Campbell Parade, Bondi NSW",
    location: "Bondi Beach, Sydney",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&auto=format&fit=crop&q=80",
    price: 18500,
    beds: 3,
    baths: 2,
    sqm: 140,
    posterName: agentName,
    posterAvatar: defaultAvatar,
    badge: "Trending",
    lat: -33.892,
    lng: 151.275,
    isFavourite: false,
  },
  {
    id: "agent-prop-3",
    title: "Contemporary Villa with Pool",
    address: "12 Ramsgate Avenue, North Bondi NSW",
    location: "North Bondi, Sydney",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&auto=format&fit=crop&q=80",
    price: 24000,
    beds: 4,
    baths: 3,
    sqm: 210,
    posterName: agentName,
    posterAvatar: defaultAvatar,
    badge: "Trending",
    lat: -33.89,
    lng: 151.279,
    isFavourite: false,
  },
];

const getDefaultAbout = (agentName: string) =>
  `Low-maintenance living with open-plan design and secure parking. Dedicated and experienced, ${agentName} offers unparalleled service across residential property sales, project marketing, and expert negotiations. With deep local market insight and a commitment to transparent communication, clients receive tailored advice that delivers exceptional outcomes at every stage of the property journey.`;

const getDefaultReviews = (agentName: string) => ({
  overall: 4.8,
  count: 123,
  distribution: { 5: 86, 4: 11, 3: 2, 2: 1, 1: 0 },
  list: [
    {
      id: "rev-1",
      author: "Priya & Marcus",
      avatar: defaultReviewer,
      date: "May 2026",
      rating: 5,
      review:
        "“He told us to hold off six weeks and repaint rather than list immediately. Cost us $4k and added a lot more than that at auction. The advice was against his own short-term interest and that told us everything.”",
    },
    {
      id: "rev-2",
      author: "Daniel & Sarah Jenkins",
      avatar: defaultReviewer,
      date: "April 2026",
      rating: 5,
      review:
        `“Exceptional market knowledge and honest guidance from ${agentName}. Guided our auction campaign smoothly, keeping us informed daily. Achieved $120k above our reserve price.”`,
    },
    {
      id: "rev-3",
      author: "Catherine O'Connor",
      avatar: defaultReviewer,
      date: "March 2026",
      rating: 5,
      review:
        "“Transparent, professional, and went the extra mile to coordinate pre-settlement inspections. Would recommend without hesitation.”",
    },
  ],
});

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
    return (
      <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 text-[#342511]">
        Loading agent profile...
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 text-[#342511]">
        {error || "Agent not found."}
      </div>
    );
  }

  // Fallback data passed from main controller
  const agentName = organization.name;
  const propertiesList = properties.length > 0 ? properties : getDefaultProperties(agentName);
  const totalPropertiesCount = propertyCount || propertiesList.length || 169;
  const aboutDescription = organization.description?.trim() || getDefaultAbout(agentName);
  const reviewsData = getDefaultReviews(agentName);

  const agentModel = {
    id: organization.id,
    name: agentName,
    role: organization.type?.name || "Selling Principal",
    agencyName: organization.type?.label || "Ray White - Hervey Bay",
    agencyUrl: organization.website || undefined,
    bannerImage: organization.banner_url || defaultBanner,
    avatar: organization.logo_url || defaultAvatar,
    rating: organization.rating || 4.9,
    reviewsCount: organization.reviews_count || 64,
    badges: DEFAULT_BADGES,
    phone: organization.contact?.phone,
    email: organization.contact?.email,
    is_favourite: organization.is_favourite,
    is_verified: organization.is_verified,
  };

  return (
    <div className="min-h-screen bg-[#F8F4EE] pb-16 font-helvetica md:pt-20">
      <div className="w-full px-[3%] md:py-6">
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

        {/* 2-Column Layout */}
        <div className="mt-4 flex flex-col items-start gap-12 md:mt-8 lg:flex-row">
          {/* Left Column (Sticky Sidebar on Desktop) */}
          <div className="hidden w-full md:block lg:sticky lg:top-28 lg:w-[32%] xl:w-[30%] shrink-0">
            <AgentSidebar
              agent={agentModel}
              onRequestAppraisal={openAppraisalModal}
              onEnquiry={openGeneralEnquiryModal}
              onCallAgency={handleCallAgency}
            />
          </div>

          {/* Right Column (Content) */}
          <div className="flex w-full flex-col gap-14 pt-0 md:pt-2 lg:w-[68%] xl:w-[70%]">
            {/* 1. Performance Snapshot */}
            <AgentPerformance
              agentName={agentName}
              snapshot={DEFAULT_PERFORMANCE}
            />

            {/* 2. Properties with Map visual & SwiperScroll */}
            <AgentProperties
              agentName={agentName}
              homes={propertiesList}
              totalCount={totalPropertiesCount}
              slug={organization.slug}
            />

            {/* 3. About Section */}
            <AgentAbout
              agentName={agentName}
              description={aboutDescription}
            />

            {/* 4. Shared Reviews Component */}
            <Reviews
              name={agentName}
              data={reviewsData}
            />
          </div>
        </div>
      </div>

      {/* Fraud notice & reporting */}
      <div className="mt-12 w-full flex flex-col items-center justify-center gap-4 px-[3%]">
        <FraudBanner className="w-full md:w-[60%] lg:w-[50%]" />
        <div className="text-[0.875rem] text-[#342511] flex items-center gap-1.5 mt-2">
          <span>See an issue?</span>
          <button
            onClick={openGeneralEnquiryModal}
            className="underline font-medium hover:text-black transition-colors cursor-pointer"
          >
            Report this listing
          </button>
        </div>
      </div>

      {/* Mobile Sticky Action */}
      <MobileStickyAction
        price="Appraisal"
        onEnquiry={openAppraisalModal}
      />

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
