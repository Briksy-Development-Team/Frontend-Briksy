import { BuilderHeader, BuilderAbout } from "./components/BuilderMain";
import { BuilderHomes } from "./components/BuilderPortfolio";
import { BuilderSidebar } from "./components/BuilderSidebar";
import { Share } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import FavoriteButton from "../../../components/custom/FavoriteButton";
import {
  getOrganization,
  type PublicOrganization,
} from "../../../api/seeker/organization.api";
import { getProperties } from "../../../api/property/property.api";
import { propertyToCard } from "../../../api/public.mappers";
import BuilderBackground from "../../../assets/place holder/builderbg.svg";
import BusinessPlaceholder from "../../../assets/place holder/bussinessholder.svg";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import { EnquiryModal } from "../shared/EnquiryModal";

type HttpLikeError = Error & { response?: { status?: number } };

const BuilderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [builder, setBuilder] = useState<PublicOrganization | null>(null);
  const [homes, setHomes] = useState<any[]>([]);
  const [propertyCount, setPropertyCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    const loadBuilder = getOrganization(id);

    loadBuilder
      .then((organizationResponse) =>
        getProperties({
          organization_slug: organizationResponse.data.slug || undefined,
          per_page: 12,
        }).then((propertyResponse) => ({
          organizationResponse,
          propertyResponse,
        })),
      )
      .then(({ organizationResponse, propertyResponse }) => {
        if (!active) return;
        setBuilder(organizationResponse.data);
        setHomes(propertyResponse.data.map(propertyToCard));
        setPropertyCount(
          propertyResponse.meta?.pagination?.total ??
            propertyResponse.data.length,
        );
      })
      .catch((reason: HttpLikeError) => {
        if (active)
          setError(
            reason?.response?.status === 404
              ? "This organisation was not found."
              : "Unable to load this organisation.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen px-[5%] pt-32 text-primary-brown">
        Loading organisation...
      </div>
    );
  if (error || !builder)
    return (
      <div className="min-h-screen px-[5%] pt-32 text-primary-brown">
        {error || "Organisation not found."}
      </div>
    );

  const address = [builder.address, builder.state, builder.postcode]
    .filter(Boolean)
    .join(", ");
  const tags = (builder.services ?? [])
    .slice(0, 5)
    .map((service) => service.name);
  const viewModel = {
    name: builder.name,
    type: builder.type?.name,
    registration: builder.is_verified
      ? "Verified organisation"
      : "Organisation",
    address,
    rating: builder.rating || 0,
    reviewsCount: 0,
    teamSize: "Verified business",
    bannerImage: builder.banner_url || BuilderBackground,
    logo: builder.logo_url || BusinessPlaceholder,
    snapshot: {},
    about: {
      name: builder.name,
      description: tags.length
        ? `Services offered: ${tags.join(", ")}.`
        : "No description has been provided.",
    },
  };

  return (
    <div className="min-h-screen md:mt-20 mt-0 font-helvetica flex flex-col">
      <main className="flex-1 w-full md:px-[3%] md:py-6">
        <div className="  hidden sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "Find a builder", isBack: true },
              { label: builder.name },
            ]}
          />
          <div className=" hidden md:flex items-center  gap-4 text-primary-brown text-[0.875rem] font-medium self-end sm:self-auto mb-6 sm:mb-0">
            <button className="flex items-center gap-2 hover:opacity-70 transition">
              <Share size={18} /> Share
            </button>
            <FavoriteButton
              variant="inline"
              showText
              iconSize={18}
              targetId={builder.id}
              targetType="organization"
              className="hover:opacity-70 transition text-primary-brown"
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          <div className="flex-1 min-w-0 flex flex-col  gap-10 w-full">
            <BuilderHeader builder={viewModel} />
            <div className="flex flex-col px-[3%] md:px-0  gap-16">
              <div id="homes">
                <BuilderHomes
                  homes={homes}
                  propertiesHref={`/result?type=property&organization_slug=${encodeURIComponent(builder.slug || "")}`}
                  description={`${propertyCount} published propert${propertyCount === 1 ? "y" : "ies"} for ${builder.name}.`}
                />
              </div>
              <div id="about">
                <BuilderAbout about={viewModel.about} />
              </div>
            </div>
          </div>
          <div className="w-full hidden md:flex lg:w-[25%] shrink-0 lg:sticky lg:top-32">
            <BuilderSidebar
              name={builder.name}
              onEnquiry={() => {
                setEnquiryError(null);
                setEnquirySuccess(null);
                setIsEnquiryOpen(true);
              }}
            />
          </div>
        </div>
      </main>
      <EnquiryModal
        open={isEnquiryOpen}
        companyName={builder.name}
        initialSubject={`${builder.name} enquiry`}
        submitting={enquirySubmitting}
        error={enquiryError}
        success={enquirySuccess}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmit={async (values) => {
          setEnquirySubmitting(true);
          setEnquiryError(null);
          try {
            await createInquiry({
              organization_id: builder.id,
              lead_source: "builder_profile",
              subject: values.subject,
              message: values.message,
              seeker_name: values.seeker_name,
              seeker_email: values.seeker_email,
              seeker_phone: values.seeker_phone || null,
            });
            setEnquirySuccess("Your enquiry has been sent successfully.");
          } catch (reason: any) {
            setEnquiryError(
              reason?.response?.data?.message ||
                "Unable to send enquiry. Please try again.",
            );
          } finally {
            setEnquirySubmitting(false);
          }
        }}
      />
    </div>
  );
};

export default BuilderDetail;
