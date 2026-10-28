import Breadcrumb from "../../../components/nav/Breadcrumb";
import Reviews from "../../../components/reviews/Reviews";
import { PropertyGallery } from "./components/PropertyGallery";
import {
  PropertyTitle,
  PropertyAgentCard,
  PropertyAbout,
  PropertyAmenities,
  PropertyMap,
} from "./components/PropertyInfo";
import { PropertyCompanyDetails } from "./components/PropertyHost";
import { PropertySidebar } from "./components/PropertySidebar";
import AuctionSidebar from "./components/AuctionSidebar";
// import StaffGrid from "../../../components/grids/StaffGrid";
import { Share, ChevronLeft, FolderPlus } from "lucide-react";
import FavoriteButton from "../../../components/custom/FavoriteButton";
import DetailSkeleton from "../../../components/skeletons/DetailSkeleton";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getProperty,
  getProperties,
  type PublicProperty,
} from "../../../api/property/property.api";
import { createInquiry } from "../../../api/seeker/inquiry.api";
import { buildGoogleMapsEmbedUrl } from "../../../utils/googleMaps";
import { EnquiryModal } from "../shared/EnquiryModal";
import { DetailShorts, SimilarSection, marketingReelsToItems } from "../shared";
import { SwiperSection } from "../../../components/swiper";
import MobileStickyAction from "../../../components/custom/MobileStickyAction";
import FraudBanner from "../../../components/custom/FraudBanner";
import CollectionModal from "../../../components/collections/CollectionModal";
import { propertyStatusLabel } from "../../../utils/propertyStatus";
import TraderGridCard from "../../../components/cards/trader/TraderGridCard";
import {
  organizationToTrader,
  propertyToCard,
} from "../../../api/public.mappers";
import type { Trader } from "../../../types/trader";
import type { Property } from "../../../types/property";
import ServicePlaceholder from "../../../assets/place holder/serviceholder.svg";
import BuilderBackground from "../../../assets/place holder/builderbg.svg";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [propertyData, setPropertyData] = useState<PublicProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [initialInterestedIn, setInitialInterestedIn] = useState<string[]>([]);
  const [enquirySubmitting, setEnquirySubmitting] = useState(false);
  const [enquiryError, setEnquiryError] = useState<string | null>(null);
  const [enquirySuccess, setEnquirySuccess] = useState<string | null>(null);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);

  const openGeneralEnquiry = () => {
    setInitialInterestedIn([]);
    setIsEnquiryOpen(true);
  };

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    getProperty(id)
      .then(({ data }) => {
        if (active) setPropertyData(data);
      })
      .catch((reason: any) => {
        if (active)
          setError(
            reason?.response?.status === 404
              ? "This property was not found."
              : "Unable to load this property.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getProperties({ per_page: 8 })
      .then((res) => {
        if (!active) return;
        const filtered = (res.data || [])
          .filter((p) => String(p.id) !== String(id))
          .map(propertyToCard);
        setSimilarProperties(filtered);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) return <DetailSkeleton gallery={true} />;
  if (error) return <p className="py-20 text-center text-red-700">{error}</p>;
  if (!propertyData)
    return <p className="py-20 text-center">This property is unavailable.</p>;

  const property = {
    ...propertyData,
    address: propertyData.full_address || propertyData.address || "",
    subtitle: [
      propertyData.bedroom_option,
      propertyData.bathroom_option,
      propertyData.car_space_option,
    ]
      .filter(Boolean)
      .join(" • "),
    images: (() => {
      const media = propertyData.media?.length
        ? propertyData.media
        : [
            ...(propertyData.images || []).map((item, index) => ({
              ...item,
              id: `image-${index}`,
              type: "image" as const,
            })),
            ...(propertyData.videos || []).map((item, index) => ({
              ...item,
              id: `video-${index}`,
              type: "video" as const,
            })),
          ];
      let formattedMedia = media
        .filter(
          (item, index, all) =>
            item.url &&
            all.findIndex((candidate) =>
              candidate.id
                ? candidate.id === item.id
                : candidate.url === item.url,
            ) === index,
        )
        .map((item) => ({
          id: item.id,
          src: item.url ?? undefined,
          type: item.type,
          videoSrc: item.type === "video" ? (item.url ?? undefined) : undefined,
        }));

      return formattedMedia;
    })(),
    agent: propertyData.organization
      ? {
          name: propertyData.organization.name || "Property Management",
          role: "Property Management",
          verified: propertyData.organization.is_verified ? "Verified" : "",
          avatar: propertyData.organization.logo_url || "",
          since:
            (propertyData.organization as any).established_year || undefined,
        }
      : null,
    about: propertyData.description || "",
    amenities: (propertyData.features || []).map((feature) => ({
      name: feature.name,
    })),
    mapSrc:
      (propertyData.location?.latitude && propertyData.location?.longitude) ||
      propertyData.full_address ||
      propertyData.address
        ? buildGoogleMapsEmbedUrl({
            lat: propertyData.location?.latitude,
            lng: propertyData.location?.longitude,
            address: propertyData.full_address || propertyData.address,
          })
        : null,
    company: propertyData.organization
      ? {
          id:
            propertyData.organization.slug ||
            propertyData.organization.id ||
            "",
          name: propertyData.organization.name || "",
          location: propertyData.address || "",
          tags: [],
          rating: propertyData.rating || 0,
          reviews: 0,
          since:
            (propertyData.organization as any).established_year || undefined,
          logo: propertyData.organization.logo_url || "",
        }
      : null,
    reviews: {
      overall: propertyData.rating || 0,
      count: 0,
      distribution: {},
      list: [],
    },
    sidebar: {
      builder: propertyData.organization?.name || "",
      builderName: propertyData.organization?.name || "",
      availability: "",
      location: propertyData.address || "",
      price:
        propertyData.price ??
        propertyData.price_min ??
        propertyData.price_max ??
        undefined,
    },
  };

  const traderHost: Trader | null = propertyData.organization
    ? organizationToTrader({
        ...propertyData.organization,
        address: propertyData.full_address || propertyData.address,
      } as any)
    : propertyData.creator
      ? {
          id: propertyData.creator.id,
          name: propertyData.creator.name,
          tagLine: "Property Host",
          role: "Host",
          location:
            propertyData.full_address || propertyData.address || "Australia",
          avatar: ServicePlaceholder,
          bannerImage: BuilderBackground,
          rating: propertyData.rating || 0,
          reviews: 0,
          tags: [],
          isFavourite: false,
          favoriteId: propertyData.creator.id,
        }
      : null;

  const submitEnquiry = async (values: {
    seeker_name: string;
    seeker_email: string;
    seeker_phone: string;
    subject: string;
    message: string;
    interested_in: string[];
  }) => {
    if (!propertyData.organization?.id) {
      setEnquiryError("This property does not have a company attached yet.");
      return;
    }

    setEnquirySubmitting(true);
    setEnquiryError(null);
    setEnquirySuccess(null);

    try {
      const result = await createInquiry({
        organization_id: propertyData.organization.id,
        property_listing_id: propertyData.id,
        lead_source: "property_listing",
        subject: values.subject,
        interested_in: values.interested_in,
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
        reason?.response?.data?.message ||
          "Unable to send enquiry. Please try again.",
      );
    } finally {
      setEnquirySubmitting(false);
    }
  };

  const isAuction = Boolean(propertyData.is_auction);

  const addressParts = property.address.split(", ");
  const suburbStateZip = addressParts[addressParts.length - 1].split(" ");
  const state = suburbStateZip[suburbStateZip.length - 2] || "Victoria";
  const suburb = suburbStateZip.slice(0, -2).join(" ") || "Toorak";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: isAuction ? "Auctions" : "Buy", isBack: true },
    { label: isAuction ? "Auction property" : "New property" },
    { label: state },
    { label: suburb },
    { label: property.title },
  ];

  return (
    <div className="min-h-screen  md:mt-20 font-helvetica flex   md:pb-0 flex-col">
      <main className="flex-1 w-full max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-20 pb-12 md:py-6">
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col sm:flex-row justify-between sm:items-center  mb-6 gap-4">
          <Breadcrumb items={breadcrumbs} />

          <div className="flex items-center gap-4 text-primary-brown text-[0.875rem] font-medium self-end sm:self-auto mb-6 sm:mb-0">
            <button className="flex items-center gap-2 hover:opacity-70 transition cursor-pointer">
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
            <button
              type="button"
              onClick={() => setCollectionOpen(true)}
              className="flex items-center gap-2 hover:opacity-70 transition text-primary-brown cursor-pointer"
            >
              <FolderPlus size={18} /> Add to Collection
            </button>
          </div>
        </div>
        {collectionOpen && (
          <CollectionModal
            propertyId={property.id}
            onClose={() => setCollectionOpen(false)}
          />
        )}

        <div className="mb-10 w-full relative">
          {/* Mobile Overlay Header */}
          <div className="md:hidden absolute top-4 left-0 right-0 z-10 flex justify-between items-center pointer-events-none px-2">
            <button
              onClick={() => {
                if (window.history.length > 1) {
                  navigate(-1);
                } else {
                  navigate("/");
                }
              }}
              className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-brown pointer-events-auto hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex items-center gap-3 pointer-events-auto">
              <button className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-brown hover:bg-gray-50">
                <Share size={18} />
              </button>
              <FavoriteButton
                variant="icon-only"
                iconSize={18}
                className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-primary-brown hover:bg-gray-50"
                targetId={property.id}
                targetType="property"
                initialIsFavourite={Boolean(propertyData.is_favourite)}
              />
            </div>
          </div>

          <PropertyGallery
            images={property.images}
            floorplan={propertyData.floorplan?.url}
          />
        </div>

        {/* Main Body Grid matching Figma gap: 48px (gap-12) */}
        <div className="flex flex-col lg:flex-row gap-12 items-start relative">
          {/* Left Column matching Figma gap: 32px (gap-8) */}
          <div className="flex-1 min-w-0 flex flex-col gap-8 w-full">
            <PropertyTitle
              title={property.title}
              beds={propertyData.bedroom_option}
              baths={propertyData.bathroom_option}
              car={propertyData.car_space_option}
              sqm={propertyData.floor_area_sqm || propertyData.land_area_sqm}
              rating={property.company?.rating}
              ratingCount={property.reviews?.count || 0}
              reviewsCount={property.company?.reviews}
              organizationName={property.company?.name}
            />

            {propertyData.transaction_status ? (
              <span className="inline-flex w-fit rounded-full bg-primary-brown px-3 py-1 text-xs font-medium text-white">
                {propertyStatusLabel(
                  propertyData.listing_purpose,
                  propertyData.transaction_status,
                )}
              </span>
            ) : null}
            {isAuction ? (
              <span className="inline-flex w-fit rounded-full bg-[#8A5A2B] px-3 py-1 text-xs font-medium text-white">
                Auction
              </span>
            ) : null}

            {isAuction ? (
              <div className="md:hidden">
                <AuctionSidebar
                  sidebar={property.sidebar}
                  venueAddress={
                    propertyData.auction_details?.venue ||
                    propertyData.full_address ||
                    propertyData.address ||
                    undefined
                  }
                  auctionVenue={propertyData.auction_details?.venue}
                  auctionDate={propertyData.auction_details?.date}
                  auctionTime={propertyData.auction_details?.time}
                  auctioneer={propertyData.auction_details?.auctioneer}
                  auctionContact={propertyData.auction_details?.contact}
                  auctionDescription={propertyData.auction_details?.description}
                  propertyId={propertyData.id}
                  propertyTitle={propertyData.title}
                  organizationId={propertyData.organization?.id || undefined}
                  onEnquiry={openGeneralEnquiry}
                />
              </div>
            ) : null}

            {isAuction ? (
              <div className="md:hidden">
                <AuctionSidebar
                  sidebar={property.sidebar}
                  venueAddress={propertyData.auction_details?.venue || propertyData.full_address || propertyData.address || undefined}
                  auctionVenue={propertyData.auction_details?.venue}
                  auctionDate={propertyData.auction_details?.date}
                  auctionTime={propertyData.auction_details?.time}
                  auctioneer={propertyData.auction_details?.auctioneer}
                  auctionContact={propertyData.auction_details?.contact}
                  auctionDescription={propertyData.auction_details?.description}
                  propertyId={propertyData.id}
                  propertyTitle={propertyData.title}
                  organizationId={propertyData.organization?.id || undefined}
                  onEnquiry={openGeneralEnquiry}
                />
              </div>
            ) : null}

            {property.agent && <PropertyAgentCard agent={property.agent} />}

            {property.about && (
              <div id="about">
                <PropertyAbout about={property.about} />
              </div>
            )}
            {propertyData.transaction_status !== "SOLD" &&
              propertyData.transaction_status !== "LEASED" && (
                <button
                  type="button"
                  onClick={() => {
                    setInitialInterestedIn(["inspection"]);
                    setIsEnquiryOpen(true);
                  }}
                  className="w-full rounded-full bg-primary-brown px-6 py-4 text-center text-sm font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Request an Inspection
                </button>
              )}

            {property.amenities && property.amenities.length > 0 && (
              <div id="amenities">
                <PropertyAmenities amenities={property.amenities} />
              </div>
            )}

            {property.mapSrc && (
              <div id="map">
                <PropertyMap mapSrc={property.mapSrc} />
              </div>
            )}

            <div id="shorts">
              <DetailShorts reels={marketingReelsToItems(propertyData.shorts)} />
            </div>

            {property.company && (
              <div id="company">
                <PropertyCompanyDetails company={property.company} />
              </div>
            )}

            {traderHost && (
              <div id="host" className="w-full">
                <SwiperSection
                  title="Meet The Host"
                  showViewAll={false}
                  items={[traderHost]}
                  spaceBetween={14}
                  variant="detail"
                  renderItem={(host) => <TraderGridCard item={host} />}
                />
              </div>
            )}

            {property.reviews &&
              (property.reviews.count > 0 ||
                (property.reviews.list &&
                  property.reviews.list.length > 0)) && (
                <div id="reviews">
                  <Reviews
                    data={property.reviews}
                    name={property.agent?.name || property.title}
                  />
                </div>
              )}
          </div>

          {/* Right Sidebar matching Figma width: 360px */}
          <aside className="w-full lg:w-[360px] hidden lg:flex shrink-0 lg:sticky lg:top-28">
            <PropertySidebar
              sidebar={property.sidebar}
              listingPurpose={propertyData.listing_purpose}
              isAuction={isAuction}
              venueAddress={
                propertyData.full_address || propertyData.address || undefined
              }
              auctionVenue={propertyData.auction_details?.venue}
              auctionDate={propertyData.auction_details?.date}
              auctionTime={propertyData.auction_details?.time}
              auctioneer={propertyData.auction_details?.auctioneer}
              auctionContact={propertyData.auction_details?.contact}
              auctionDescription={propertyData.auction_details?.description}
              propertyId={propertyData.id}
              propertyTitle={propertyData.title}
              organizationId={propertyData.organization?.id || undefined}
              statusTag={
                propertyData.transaction_status
                  ? propertyStatusLabel(
                      propertyData.listing_purpose,
                      propertyData.transaction_status,
                    )
                  : undefined
              }
              statusDate={
                propertyData.transaction_status === "SOLD"
                  ? "Sold on 18 Sep 2026"
                  : undefined
              }
              address={property.address}
              organizationName={propertyData.organization?.name || undefined}
              onEnquiry={openGeneralEnquiry}
            />
          </aside>
        </div>

        {/* Similar Properties Section */}
        <SimilarSection
          type="property"
          currentId={id}
          items={similarProperties}
        />
      </main>
      <div className="my-10 px-[3%]  w-full flex items-center justify-center ">
        <FraudBanner />
      </div>
      <div className="sticky bottom-0 z-20">
        <MobileStickyAction
          price={
            isAuction
              ? "Auction"
              : property.sidebar.price
                ? `$${(property.sidebar.price / 1000).toFixed(0)}k`
                : "Contact"
          }
          priceLabel={
            isAuction
              ? "Saturday, 17 October 2026"
              : property.sidebar.price
                ? "fixed price"
                : undefined
          }
          onEnquiry={openGeneralEnquiry}
        />
      </div>
      <EnquiryModal
        open={isEnquiryOpen}
        companyName={propertyData.organization?.name || undefined}
        initialSubject={`Enquiry about ${propertyData.title}`}
        submitting={enquirySubmitting}
        error={enquiryError}
        success={enquirySuccess}
        onClose={() => setIsEnquiryOpen(false)}
        onSubmit={submitEnquiry}
        initialInterestedIn={initialInterestedIn}
      />
    </div>
  );
};

export default PropertyDetail;
