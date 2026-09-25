import { useState } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import Breadcrumb from "../../../../components/nav/Breadcrumb";
import ServicePlaceholder from "../../../../assets/place holder/serviceholder.svg";
import type { PublicService } from "../../../../api/service/service.api";
import { ServiceEnquiry } from "./ServiceEnquiry";
import { ServiceRecentWork } from "./ServiceDetails";
import MobileStickyAction from "../../../../components/custom/MobileStickyAction";
import FraudBanner from "../../../../components/custom/FraudBanner";

export const joinAddress = (
  o?: {
    address?: string | null;
    state?: string | null;
    postcode?: string | null;
  } | null,
) => [o?.address, o?.state, o?.postcode].filter(Boolean).join(", ");

export const toMedia = (
  images: { url: string }[] = [],
  videos: { url: string }[] = [],
) => [
    ...images.map(({ url }) => ({ src: url, type: "image" as const })),
    ...videos.map(({ url }) => ({
      src: url,
      type: "video" as const,
      videoUrl: url,
    })),
  ];

export function ServiceOnlyView({ service }: { service: PublicService }) {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);

  const provider = service.organization;
  const location = joinAddress(provider);
  const media = toMedia(service.images, service.videos);

  return (
    <div className="min-h-screen bg-[#F8F4EE] pb-16 pt-24 font-helvetica">
      <div className="mx-auto w-full px-[5%] py-6">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Services", isBack: true },
            { label: service.name },
          ]}
        />

        <div className="mt-8 grid gap-12 lg:grid-cols-[30%_1fr]">
          <div className="h-fit rounded-3xl bg-white p-6 lg:sticky lg:top-28">
            <img
              src={service.images[0]?.url || ServicePlaceholder}
              alt=""
              className="h-28 w-28 rounded-2xl object-cover"
            />
            <h1 className="mt-5 text-3xl font-medium text-primary-brown">
              {service.name}
            </h1>
            <p className="mt-2 text-primary-light-brown">
              {service.category || "Professional service"}
            </p>

            <div className="mt-6 space-y-3 text-sm text-primary-light-brown">
              {location && (
                <p className="flex gap-2">
                  <MapPin size={17} />
                  {location}
                </p>
              )}
              {provider?.contact_phone && (
                <a
                  className="flex gap-2"
                  href={`tel:${provider.contact_phone}`}
                >
                  <Phone size={17} />
                  {provider.contact_phone}
                </a>
              )}
              {provider?.contact_email && (
                <a
                  className="flex gap-2"
                  href={`mailto:${provider.contact_email}`}
                >
                  <Mail size={17} />
                  {provider.contact_email}
                </a>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsEnquiryOpen(true)}
              className="mt-6 h-11 w-full rounded-full bg-primary-brown text-white"
            >
              Send an Enquiry
            </button>
          </div>

          <div className="space-y-8">
            <div className="rounded-3xl bg-white p-7">
              <h2 className="text-xl font-medium text-primary-brown">
                {service.title || service.name}
              </h2>
              <p className="mt-4 text-primary-light-brown">
                {service.description ||
                  "No description provided for this service."}
              </p>
            </div>

            {media.length > 0 && (
              <div className="rounded-3xl bg-white p-7">
                <ServiceRecentWork
                  title="Service gallery"
                  recentWork={{
                    totalPhotos: media.filter((m) => m.type === "image").length,
                    totalVideos: media.filter((m) => m.type === "video").length,
                    items: media
                      .slice(0, 3)
                      .concat([
                        { src: ServicePlaceholder, type: "image" },
                        { src: ServicePlaceholder, type: "image" },
                        { src: ServicePlaceholder, type: "image" },
                      ])
                      .slice(0, 3), // Ensure it has at least 3 items to render the collage gracefully
                    allItems: media,
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="mt-10  w-full flex items-center justify-center ">
        <FraudBanner />
      </div>

      <MobileStickyAction
        onEnquiry={() => setIsEnquiryOpen(true)}
      />

      <ServiceEnquiry
        open={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        organizationId={provider?.id}
        companyName={provider?.name}
        subject={`${service.name} enquiry`}
      />
    </div>
  );
}
