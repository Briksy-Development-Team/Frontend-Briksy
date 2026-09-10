export type FeatureValue = boolean | string;

export type PlanFeatureKey =
  | "professionalBusinessProfile"
  | "verificationLevel"
  | "businessLogo"
  | "coverImage"
  | "businessDescription"
  | "website"
  | "socialMediaLinks"
  | "serviceAreas"
  | "mapView"
  | "listView"
  | "serviceCategories"
  | "homepageFeaturedBusiness"
  | "featuredSearchPlacement"
  | "portfolioPhotos"
  | "portfolioVideos"
  | "promotionalOffers"
  | "teamMembers"
  | "googleReviewsLink"
  | "enquiryForm"
  | "emailNotifications"
  | "mobileAppNotifications"
  | "leadHistory"
  | "performanceAnalytics"
  | "monthlyPerformanceReport"
  | "exportLeads"
  | "aiBusinessInsights"
  | "aiLeadRecommendations";

export type Plan = {
  id: string;
  name: string;
  badge?: string;
  description: string;
  price: string;
  cardFeatures: string[];
  features: Partial<Record<PlanFeatureKey, FeatureValue>>;
};

export type FeatureSection = {
  title: string;
  features: {
    key: PlanFeatureKey;
    label: string;
  }[];
};

export type PricingCategory = {
  title: string;
  stats: {
    value: string;
    label: string;
    star?: boolean;
  }[];
  plans: Plan[];
};

export type PricingTab =
  | "Real Estate"
  | "Trades & Professionals"
  | "Buyers Agent"
  | "Builders";

export const pricingTabs: PricingTab[] = [
  "Real Estate",
  "Trades & Professionals",
  "Buyers Agent",
  "Builders",
];

export const featureSections: FeatureSection[] = [
  {
    title: "Profile & Verification",
    features: [
      {
        key: "professionalBusinessProfile",
        label: "Professional Business Profile",
      },
      {
        key: "verificationLevel",
        label: "Verification Level",
      },
      {
        key: "businessLogo",
        label: "Business Logo",
      },
      {
        key: "coverImage",
        label: "Cover Image",
      },
      {
        key: "businessDescription",
        label: "Business Description",
      },
      {
        key: "website",
        label: "Website",
      },
      {
        key: "socialMediaLinks",
        label: "Social Media Links",
      },
    ],
  },

  {
    title: "Reach & Discovery",
    features: [
      {
        key: "serviceAreas",
        label: "Service Areas",
      },
      {
        key: "mapView",
        label: "Map View",
      },
      {
        key: "listView",
        label: "List View",
      },
      {
        key: "serviceCategories",
        label: "Service Categories",
      },
      {
        key: "homepageFeaturedBusiness",
        label: "Homepage Featured Business",
      },
      {
        key: "featuredSearchPlacement",
        label: "Featured Search Placement",
      },
    ],
  },

  {
    title: "Content",
    features: [
      {
        key: "portfolioPhotos",
        label: "Portfolio Photos",
      },
      {
        key: "portfolioVideos",
        label: "Portfolio Videos",
      },
      {
        key: "promotionalOffers",
        label: "Promotional Offers & Coupons",
      },
    ],
  },

  {
    title: "Team & Engagement",
    features: [
      {
        key: "teamMembers",
        label: "Team Members",
      },
      {
        key: "googleReviewsLink",
        label: "Google Reviews Link",
      },
      {
        key: "enquiryForm",
        label: "Get in Touch Enquiry Form",
      },
      {
        key: "emailNotifications",
        label: "Email Notifications",
      },
      {
        key: "mobileAppNotifications",
        label: "Mobile App Notifications",
      },
    ],
  },

  {
    title: "Analytics & Growth",
    features: [
      {
        key: "leadHistory",
        label: "Lead History",
      },
      {
        key: "performanceAnalytics",
        label: "Performance Analytics",
      },
      {
        key: "monthlyPerformanceReport",
        label: "Monthly Performance Report",
      },
      {
        key: "exportLeads",
        label: "Export Leads (CSV/Excel)",
      },
      {
        key: "aiBusinessInsights",
        label: "AI Business Insights",
      },
      {
        key: "aiLeadRecommendations",
        label: "AI Lead Recommendations",
      },
    ],
  },
];

const commonStats = [
  {
    value: "1,240+",
    label: "verified professionals",
  },
  {
    value: "6",
    label: "service categories",
  },
  {
    value: "4.8",
    label: "average provider rating",
    star: true,
  },
];

export const pricingData: Record<
  PricingTab,
  PricingCategory
> = {
  "Real Estate": {
    title: "Plans for real estate professionals",
    stats: commonStats,

    plans: [
      {
        id: "real-estate-starter",
        name: "Starter",
        description: "For professionals getting started.",
        price: "$59",
        cardFeatures: [
          "Verified business profile",
          "Business logo and cover image",
          "Website and social links",
          "Location map",
          "Lead enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "5 suburbs",
          mapView: "Office location",
          listView: true,
          serviceCategories: "1 category",
          homepageFeaturedBusiness: false,
          featuredSearchPlacement: false,
          portfolioPhotos: "5 photos",
          portfolioVideos: false,
          promotionalOffers: false,
          teamMembers: false,
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "30 days",
          performanceAnalytics: false,
          monthlyPerformanceReport: false,
          exportLeads: false,
          aiBusinessInsights: false,
          aiLeadRecommendations: false,
        },
      },

      {
        id: "real-estate-growth",
        name: "Growth",
        badge: "Most Popular",
        description: "For growing real estate businesses.",
        price: "$129",
        cardFeatures: [
          "Everything in Starter",
          "More service areas",
          "Expanded portfolio",
          "Performance analytics",
          "Priority enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "20 suburbs",
          mapView: "Office location",
          listView: true,
          serviceCategories: "3 categories",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Priority",
          portfolioPhotos: "20 photos",
          portfolioVideos: "5 videos",
          promotionalOffers: true,
          teamMembers: "3 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "90 days",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: false,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "real-estate-elite",
        name: "Elite",
        description: "For established professionals.",
        price: "$199",
        cardFeatures: [
          "Everything in Growth",
          "Unlimited service areas",
          "Advanced portfolio",
          "Advanced analytics",
          "AI lead recommendations",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Office + service areas",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Top placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "20 videos",
          promotionalOffers: true,
          teamMembers: "10 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "1 year",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "real-estate-enterprise",
        name: "Enterprise",
        description: "For large real estate businesses.",
        price: "$499",
        cardFeatures: [
          "Everything in Elite",
          "Unlimited team members",
          "Maximum visibility",
          "Advanced business insights",
          "Dedicated support",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Multiple locations",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Premium placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "Unlimited",
          promotionalOffers: true,
          teamMembers: "Unlimited",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "Unlimited",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },
    ],
  },

  "Trades & Professionals": {
    title: "Plans for trades & professionals",
    stats: commonStats,

    plans: [
      {
        id: "trades-starter",
        name: "Starter",
        description: "For independent professionals.",
        price: "$39",
        cardFeatures: [
          "Verified business profile",
          "Business logo",
          "Service areas",
          "Location map",
          "Lead enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "5 suburbs",
          mapView: "Business location",
          listView: true,
          serviceCategories: "1 category",
          homepageFeaturedBusiness: false,
          featuredSearchPlacement: false,
          portfolioPhotos: "5 photos",
          portfolioVideos: false,
          promotionalOffers: false,
          teamMembers: false,
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "30 days",
          performanceAnalytics: false,
          monthlyPerformanceReport: false,
          exportLeads: false,
          aiBusinessInsights: false,
          aiLeadRecommendations: false,
        },
      },

      {
        id: "trades-growth",
        name: "Growth",
        badge: "Most Popular",
        description: "For growing trade businesses.",
        price: "$89",
        cardFeatures: [
          "Everything in Starter",
          "More service areas",
          "More portfolio content",
          "Performance analytics",
          "Priority enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "20 suburbs",
          mapView: "Business location",
          listView: true,
          serviceCategories: "3 categories",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Priority",
          portfolioPhotos: "20 photos",
          portfolioVideos: "5 videos",
          promotionalOffers: true,
          teamMembers: "3 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "90 days",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: false,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "trades-pro",
        name: "Pro",
        description: "For established trade businesses.",
        price: "$149",
        cardFeatures: [
          "Everything in Growth",
          "Unlimited service areas",
          "Advanced portfolio",
          "Advanced analytics",
          "AI business insights",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Business + service areas",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Top placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "20 videos",
          promotionalOffers: true,
          teamMembers: "10 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "1 year",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "trades-business",
        name: "Business",
        description: "For larger professional businesses.",
        price: "$299",
        cardFeatures: [
          "Everything in Pro",
          "Unlimited team members",
          "Maximum visibility",
          "Advanced reporting",
          "Dedicated support",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Multiple locations",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Premium placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "Unlimited",
          promotionalOffers: true,
          teamMembers: "Unlimited",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "Unlimited",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },
    ],
  },

  "Buyers Agent": {
    title: "Plans for buyers agents",
    stats: commonStats,

    plans: [
      {
        id: "buyers-essential",
        name: "Essential",
        description: "For independent buyers agents.",
        price: "$49",
        cardFeatures: [
          "Verified agent profile",
          "Business logo and cover image",
          "Website and social links",
          "Location map",
          "Lead enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "5 suburbs",
          mapView: "Office location",
          listView: true,
          serviceCategories: "1 category",
          homepageFeaturedBusiness: false,
          featuredSearchPlacement: false,
          portfolioPhotos: "5 photos",
          portfolioVideos: false,
          promotionalOffers: false,
          teamMembers: false,
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "30 days",
          performanceAnalytics: false,
          monthlyPerformanceReport: false,
          exportLeads: false,
          aiBusinessInsights: false,
          aiLeadRecommendations: false,
        },
      },

      {
        id: "buyers-growth",
        name: "Growth",
        badge: "Most Popular",
        description: "For growing buyers agents.",
        price: "$99",
        cardFeatures: [
          "Everything in Essential",
          "More service areas",
          "Expanded portfolio",
          "Performance analytics",
          "Priority enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "20 suburbs",
          mapView: "Office location",
          listView: true,
          serviceCategories: "3 categories",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Priority",
          portfolioPhotos: "20 photos",
          portfolioVideos: "5 videos",
          promotionalOffers: true,
          teamMembers: "3 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "90 days",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: false,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "buyers-elite",
        name: "Elite",
        description: "For established buyers agents.",
        price: "$179",
        cardFeatures: [
          "Everything in Growth",
          "Unlimited service areas",
          "Advanced portfolio",
          "Advanced analytics",
          "AI lead recommendations",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Office + service areas",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Top placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "20 videos",
          promotionalOffers: true,
          teamMembers: "10 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "1 year",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "buyers-agency",
        name: "Agency",
        description: "For larger buyers agencies.",
        price: "$399",
        cardFeatures: [
          "Everything in Elite",
          "Unlimited team members",
          "Maximum visibility",
          "Advanced business insights",
          "Dedicated support",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Multiple locations",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Premium placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "Unlimited",
          promotionalOffers: true,
          teamMembers: "Unlimited",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "Unlimited",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },
    ],
  },

  Builders: {
    title: "Plans for builders",
    stats: commonStats,

    plans: [
      {
        id: "builder",
        name: "Builder",
        description: "For individual builders and small teams.",
        price: "$99",
        cardFeatures: [
          "Verified builder profile",
          "Business logo and cover image",
          "Project portfolio",
          "Location map",
          "Lead enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "10 suburbs",
          mapView: "Business location",
          listView: true,
          serviceCategories: "2 categories",
          homepageFeaturedBusiness: false,
          featuredSearchPlacement: false,
          portfolioPhotos: "20 photos",
          portfolioVideos: "5 videos",
          promotionalOffers: false,
          teamMembers: "3 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "60 days",
          performanceAnalytics: false,
          monthlyPerformanceReport: false,
          exportLeads: false,
          aiBusinessInsights: false,
          aiLeadRecommendations: false,
        },
      },

      {
        id: "builders-growth",
        name: "Growth",
        badge: "Most Popular",
        description: "For growing building businesses.",
        price: "$199",
        cardFeatures: [
          "Everything in Builder",
          "More service areas",
          "Expanded project portfolio",
          "Performance analytics",
          "Priority enquiries",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "30 suburbs",
          mapView: "Business + service areas",
          listView: true,
          serviceCategories: "5 categories",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Priority",
          portfolioPhotos: "50 photos",
          portfolioVideos: "15 videos",
          promotionalOffers: true,
          teamMembers: "10 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "1 year",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: false,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "builders-elite",
        name: "Elite",
        description: "For established building companies.",
        price: "$399",
        cardFeatures: [
          "Everything in Growth",
          "Unlimited service areas",
          "Unlimited portfolio",
          "Advanced analytics",
          "AI business insights",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Multiple locations",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Top placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "Unlimited",
          promotionalOffers: true,
          teamMembers: "25 members",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "Unlimited",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },

      {
        id: "builders-enterprise",
        name: "Enterprise",
        description: "For large building companies.",
        price: "$799",
        cardFeatures: [
          "Everything in Elite",
          "Unlimited team members",
          "Multiple business locations",
          "Maximum visibility",
          "Dedicated support",
        ],
        features: {
          professionalBusinessProfile: true,
          verificationLevel: "Premium Verified",
          businessLogo: true,
          coverImage: true,
          businessDescription: true,
          website: true,
          socialMediaLinks: true,
          serviceAreas: "Unlimited",
          mapView: "Multiple locations",
          listView: true,
          serviceCategories: "Unlimited",
          homepageFeaturedBusiness: true,
          featuredSearchPlacement: "Premium placement",
          portfolioPhotos: "Unlimited",
          portfolioVideos: "Unlimited",
          promotionalOffers: true,
          teamMembers: "Unlimited",
          googleReviewsLink: true,
          enquiryForm: true,
          emailNotifications: true,
          mobileAppNotifications: true,
          leadHistory: "Unlimited",
          performanceAnalytics: true,
          monthlyPerformanceReport: true,
          exportLeads: true,
          aiBusinessInsights: true,
          aiLeadRecommendations: true,
        },
      },
    ],
  },
};