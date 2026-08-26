import {
  BuilderHeader,
  BuilderTabs,
  BuilderAbout,
  BuilderContact,
} from "./components/BuilderMain";
import {
  BuilderSnapshot,
  BuilderHomes,
  BuilderPerformance,
  BuilderTeam,
} from "./components/BuilderPortfolio";
import { BuilderSidebar } from "./components/BuilderSidebar";
import Reviews from "../../../components/reviews/Reviews";
import { Share } from "lucide-react";

export const builderData = {
  id: 1,
  name: "Harkaway Homes",
  registration: "Registered building practitioner • CDB-U 51204 NSW",
  address: "Shop 1/33 Village Circuit, Gregory Hills NSW 2557",
  rating: 4.9,
  reviewsCount: 64,
  teamSize: 6,
  bannerImage:
    "https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop",
  logo: "https://ui-avatars.com/api/?name=troi&background=0D8ABC&color=fff&size=150&font-size=0.33",
  fixedPrice: 850000,

  snapshot: {
    medianBuildPrice: 845000,
    medianBuildTime: 34,
    homesCompleted: 62,
    underConstruction: 18,
    medianPackagePrice: 610000,
    packagesAvailable: 9,
    displayHomesOpen: 12,
    estates: 4,
  },

  homes: [
    {
      id: 101,
      title: "Home in Bhelupura",
      price: 10000,
      beds: 3,
      baths: 2,
      sqm: 135,
      address: "Bhelupura, NSW",
      image:
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=600&auto=format&fit=crop",
      posterName: "Name of the Poster",
      posterAvatar: "https://i.pravatar.cc/100?img=11",
      badge: "Trending",
      isFavourite: false,
    },
    {
      id: 102,
      title: "Home in Bhelupura",
      price: 10000,
      beds: 3,
      baths: 2,
      sqm: 135,
      address: "Bhelupura, NSW",
      image:
        "https://images.unsplash.com/photo-1600607687931-cebf0046cbb4?q=80&w=600&auto=format&fit=crop",
      posterName: "Name of the Poster",
      posterAvatar: "https://i.pravatar.cc/100?img=12",
      badge: "Trending",
      isFavourite: false,
    },
    {
      id: 103,
      title: "Home in Bhelupura",
      price: 10000,
      beds: 3,
      baths: 2,
      sqm: 135,
      address: "Bhelupura, NSW",
      image:
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=600&auto=format&fit=crop",
      posterName: "Name of the Poster",
      posterAvatar: "https://i.pravatar.cc/100?img=13",
      badge: "Trending",
      isFavourite: false,
    },
  ],

  performance: {
    singleStorey: { built: 28, medianPrice: 720000, medianTime: 30 },
    doubleStorey: { built: 26, medianPrice: 965000, medianTime: 38 },
    knockdown: { built: 8, medianPrice: 880000, medianTime: 42 },
  },

  team: [
    {
      id: 1,
      name: "Sunrise Property Group",
      role: "Licensed Mortgage Broker",
      location: "Richmond, VIC 3121",
      rating: 4.5,
      reviewsCount: 123,
      tags: ["Mortgage Broker", "12 Year Experience", "Tag Line 2"],
      avatar: "https://i.pravatar.cc/150?img=33",
      banner:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    },
    {
      id: 2,
      name: "Sunrise Property Group",
      role: "Licensed Mortgage Broker",
      location: "Richmond, VIC 3121",
      rating: 4.5,
      reviewsCount: 123,
      tags: ["Mortgage Broker", "12 Year Experience", "Tag Line 2"],
      avatar: "https://i.pravatar.cc/150?img=32",
      banner:
        "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=600&auto=format&fit=crop",
    },
  ],

  about: {
    tradingSince: 1998,
    teamSize: "6 staff, 40+ trades",
    buildRegions: "Camden, Macarthur, South West Sydney",
    buildTypes: "Custom, knockdown rebuild, house and land",
    contractType: "Fixed price, HIA contract",
    warranty: "6-year structural, 90-day maintenance",
    description:
      "Harkaway Homes has been building across south-west Sydney since 1998. We specialise in custom family homes, knockdown rebuilds and house and land packages in the Camden, Oran Park and Gregory Hills growth corridors.\n\nEvery home is delivered on a fixed-price contract with a nominated completion date. We hold our own trades in-house for framing, carpentry and site management, which is how we keep a 34-week median build time in a market where 50 weeks is common.",
  },

  reviews: {
    overall: 4.8,
    count: 123,
    distribution: { 5: 86, 4: 11, 3: 2, 2: 1, 1: 0 },
    list: [
      {
        id: 1,
        author: "Priya & Marcus",
        context: "Sold in Cremorne - May 2026",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=11",
        text: "He told us to hold off six weeks and repaint rather than list immediately. Cost us $4k and added a lot more than that at auction. The advice was against his own short-term interest and that told us everything.",
      },
      {
        id: 2,
        author: "Priya & Marcus",
        context: "Sold in Cremorne - May 2026",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=11",
        text: "He told us to hold off six weeks and repaint rather than list immediately. Cost us $4k and added a lot more than that at auction. The advice was against his own short-term interest and that told us everything.",
      },
      {
        id: 3,
        author: "Priya & Marcus",
        context: "Sold in Cremorne - May 2026",
        rating: 5,
        avatar: "https://i.pravatar.cc/150?img=11",
        text: "He told us to hold off six weeks and repaint rather than list immediately. Cost us $4k and added a lot more than that at auction. The advice was against his own short-term interest and that told us everything.",
      },
    ],
  },
};

import Breadcrumb from "../../../components/nav/Breadcrumb";
import FavoriteButton from "../../../components/custom/FavoriteButton";

const BuilderDetail = () => {
  const addressParts = builderData.address.split(", ");
  const suburbStateZip = addressParts[addressParts.length - 1].split(" ");
  const state = suburbStateZip[suburbStateZip.length - 2] || "NSW";
  const suburb = suburbStateZip.slice(0, -2).join(" ") || "Camden";

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Find a builder", isBack: true },
    { label: "New home builders" },
    { label: `${suburb} ${state}` },
    { label: builderData.name },
  ];

  return (
    <div className="min-h-screen mt-20 font-helvetica flex flex-col">
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
            />
          </div>
        </div>
        <div className="flex flex-col lg:flex-row gap-10 items-start relative">
          <div className="flex-1 min-w-0 flex flex-col gap-10 w-full">
            <BuilderHeader builder={builderData} />
            <BuilderTabs />

            <div className="flex flex-col gap-16">
              <div id="snapshot">
                <BuilderSnapshot snapshot={builderData.snapshot} />
              </div>
              <div id="homes">
                <BuilderHomes homes={builderData.homes} />
              </div>
              <div id="performance">
                <BuilderPerformance performance={builderData.performance} />
              </div>
              <div id="team">
                <BuilderTeam team={builderData.team} />
              </div>
              <div id="about">
                <BuilderAbout about={builderData.about} />
              </div>
              <div id="reviews">
                <Reviews data={builderData.reviews} />
              </div>
            </div>
          </div>

          <aside className="w-full lg:w-[25%] shrink-0 lg:sticky lg:top-32">
            <BuilderSidebar price={builderData.fixedPrice} />
          </aside>
        </div>

        <div className="mt-16 w-full lg:w-[calc(100%-400px)]">
          <BuilderContact />
        </div>
      </main>
    </div>
  );
};

export default BuilderDetail;
