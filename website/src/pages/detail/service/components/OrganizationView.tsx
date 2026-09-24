import { useState } from "react";
import Breadcrumb from "../../../../components/nav/Breadcrumb";
import ServicePlaceholder from "../../../../assets/place holder/serviceholder.svg";
import type { PublicService } from "../../../../api/service/service.api";
import type { PublicOrganization } from "../../../../api/seeker/organization.api";
import { ServiceSidebar } from "./ServiceSidebar";
import { ServiceList, ServiceQualifications, ServiceRecentWork, ServiceLocation } from "./ServiceDetails";
import { ServiceMobileHeader } from "./ServiceMobileHeader";
import Reviews from "../../../../components/reviews/Reviews";
import { ServiceEnquiry } from "./ServiceEnquiry";
import { joinAddress, toMedia } from "./ServiceOnlyView";
import MobileStickyAction from "../../../../components/custom/MobileStickyAction";
import FraudBanner from "../../../../components/custom/FraudBanner";

export function OrganizationView({ organization, service }: { organization: PublicOrganization, service: PublicService | null }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const selected = service && { ...service, starting_price: service.rate_from };
  const allServices = [
    ...(selected ? [selected] : []),
    ...(organization.services ?? []).filter((s) => s.id !== selected?.id),
  ];
  const focus = allServices[0]; // drives favourite target, price and service area

  const mappedServices = allServices.map((s) => {
    const from = s.starting_price ?? s.rate_from;
    return {
      id: s.id,
      image: s.images?.[0]?.url || ServicePlaceholder,
      title: s.name,
      description: s.description || "No description provided for this service.",
      price: from != null ? `From $${from}` : "Custom quote",
      duration: s.service_area || "Contact for estimate",
    };
  });

  const serviceMedia = allServices.flatMap((s) => toMedia(s.images, s.videos));
  const galleryItems = [0, 1, 2].map((i) => serviceMedia[i] || { src: ServicePlaceholder, type: "image" as const });

  const address = joinAddress(organization);
  const serviceArea = focus?.service_area;
  const locationText = serviceArea || address;
  const mapSrc = locationText ? `https://www.google.com/maps?q=${encodeURIComponent(locationText)}&output=embed` : "";
  const rating = Number(organization.rating || 0);
  const price = focus?.starting_price ?? focus?.rate_from ?? 0;

  return (
    <div className="min-h-screen bg-[#F8F4EE] pb-16 font-helvetica md:pt-20">
      <div className="w-full px-[3%] md:py-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Find a professional", isBack: true },
            { label: organization.type?.name || "Trades and repairs" },
            { label: organization.name },
          ]}
        />

        <ServiceMobileHeader organization={organization} />

        <div className="mt-4 flex flex-col items-start gap-12 md:mt-8 lg:flex-row">
          <div className="hidden w-full md:block lg:sticky lg:top-28 lg:w-[30%]">
            <ServiceSidebar
              contact={{ price, rateType: "/hour" }}
              service={{
                id: focus?.id || organization.id,
                favoriteType: focus ? "service" : "organization",
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

          <div className="flex w-full flex-col gap-12 pt-0 md:pt-6 lg:w-[70%]">
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
                  { title: "Service area", description: serviceArea || address || "Contact this business for service locations" },
                ]}
              />

              <div className="md:w-[70%]">
                <ServiceRecentWork
                  recentWork={{
                    totalPhotos: serviceMedia.filter((m) => m.type === "image").length,
                    totalVideos: serviceMedia.filter((m) => m.type === "video").length,
                    items: galleryItems,
                    allItems: serviceMedia,
                  }}
                />
              </div>

              <ServiceLocation
                location={{
                  description: serviceArea
                    ? `This business provides services in ${serviceArea}. Contact them to confirm availability for your location.`
                    : address
                      ? `This business is based in ${address}. Contact them to confirm service availability.`
                      : "Contact this business to confirm its service area.",
                  mapSrc,
                  address: locationText,
                  serviceArea,
                  geometry: focus?.service_area_geometry,
                }}
              />
            </div>

            <div id="reviews">
              <Reviews
                name={organization.name}
                data={{ overall: rating, count: 0, distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }, list: [] }}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="mt-10  w-full flex items-center justify-center ">
        <FraudBanner />
      </div>

      <MobileStickyAction
        price={
          focus?.starting_price != null
            ? `$${focus.starting_price}`
            : focus?.rate_from != null
              ? `$${focus.rate_from}`
              : "Contact"
        }
        onEnquiry={() => setIsEnquiryOpen(true)}
      />

      <ServiceEnquiry
        open={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        organizationId={organization.id}
        companyName={organization.name}
        subject={`${organization.name} enquiry`}
      />
    </div>
  );
}
