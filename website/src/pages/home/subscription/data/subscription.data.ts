// ─────────────────────────────────────────────────────────────────────────────
// Subscription data — fully dynamic, editable from admin.
// All tabs share the same structure so columns & rows can be swapped at runtime.
// ─────────────────────────────────────────────────────────────────────────────

export type CellValue =
  | boolean          // renders ✓ check icon
  | '—'              // not available
  | string           // plain text (e.g. "Up to 5", "Unlimited")
  | { label: string; badge?: string }; // text with an optional badge (e.g. "✓ Premium")

export interface Plan {
  id: string;
  name: string;
  badge?: string;          // e.g. "Most Popular"
  description: string;
  price: number | null;    // null = "Contact us"
  ctaLabel: string;
  popular?: boolean;
  highlights: string[];    // bullet list on the card
}

export interface FeatureRow {
  label: string;
  values: CellValue[];     // one per plan, same order as plans array
}

export interface FeatureSection {
  title: string;
  rows: FeatureRow[];
}

export interface Stat {
  value: string;
  label: string;
  icon?: string;
}

export interface TabData {
  id: string;
  label: string;
  plans: Plan[];
  stats: Stat[];
  sections: FeatureSection[];
}

// ─── Properties Tab ──────────────────────────────────────────────────────────
const propertiesTab: TabData = {
  id: 'properties',
  label: 'Properties',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Best for individual property owners getting started',
      price: 29,
      ctaLabel: 'Get Starter',
      highlights: [
        'Up to 3 active listings',
        'Basic property profile',
        'Up to 5 photos per listing',
        'Enquiry form',
        'Unlimited lead history',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Popular',
      description: 'Best for landlords & investors wanting more visibility',
      price: 79,
      ctaLabel: 'Get Growth',
      popular: true,
      highlights: [
        'Everything in Starter, plus:',
        'Up to 15 active listings',
        'Up to 15 photos, 2 videos per listing',
        'Featured in search results',
        'Basic performance analytics',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Best for established property managers',
      price: 149,
      ctaLabel: 'Get Elite',
      highlights: [
        'Everything in Growth, plus:',
        'Up to 40 active listings',
        'Homepage featured placement',
        'AI property insights',
        'Priority support',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Best for real estate agencies & large portfolios',
      price: 399,
      ctaLabel: 'Get Enterprise',
      highlights: [
        'Everything in Elite, plus:',
        'Unlimited listings',
        'Dedicated account manager',
        'Custom branding',
        'API access',
      ],
    },
  ],
  stats: [
    { value: '85,000+', label: 'active listings' },
    { value: '12', label: 'property categories' },
    { value: '4.7★', label: 'average landlord rating' },
  ],
  sections: [
    {
      title: 'Listing Management',
      rows: [
        { label: 'Active Listings', values: ['Up to 3', 'Up to 15', 'Up to 40', 'Unlimited'] },
        { label: 'Photos per Listing', values: ['Up to 5', 'Up to 15', 'Up to 25', 'Up to 50'] },
        { label: 'Video per Listing', values: ['—', '2 (30s max)', '5 (60s max)', '10 (120s max)'] },
        { label: 'Virtual Tour / 3D', values: ['—', '—', true, true] },
        { label: 'Floor Plan Upload', values: [true, true, true, true] },
        { label: 'Property Description', values: ['1,000 chars', '1,500 chars', '2,000 chars', '2,500 chars'] },
      ],
    },
    {
      title: 'Reach & Visibility',
      rows: [
        { label: 'Search Placement', values: ['Standard', 'Priority', 'Featured', 'Premium'] },
        { label: 'Homepage Feature', values: ['—', '—', 'Included', 'Premium'] },
        { label: 'Map View', values: [true, true, true, true] },
        { label: 'Suburb Targeting', values: ['1 suburb', 'Up to 5', 'Up to 15', 'Unlimited'] },
        { label: 'Social Media Sharing', values: [true, true, true, true] },
      ],
    },
    {
      title: 'Enquiries & Leads',
      rows: [
        { label: 'Enquiry Form', values: [true, true, true, true] },
        { label: 'Lead History', values: ['30 days', 'Unlimited', 'Unlimited', 'Unlimited'] },
        { label: 'Email Notifications', values: [true, true, true, true] },
        { label: 'SMS Notifications', values: ['—', true, true, true] },
        { label: 'CRM Integration', values: ['—', '—', true, true] },
      ],
    },
    {
      title: 'Analytics & Growth',
      rows: [
        { label: 'Listing Views', values: [true, true, true, true] },
        { label: 'Performance Analytics', values: ['—', 'Basic', 'Advanced', 'Enterprise Dashboard'] },
        { label: 'Monthly Report', values: ['—', '—', true, 'Weekly + Monthly'] },
        { label: 'Export Leads (CSV)', values: ['—', true, true, true] },
        { label: 'AI Price Insights', values: ['—', '—', true, { label: '✓ Advanced' }] },
      ],
    },
  ],
};

// ─── Builder Tab ─────────────────────────────────────────────────────────────
const builderTab: TabData = {
  id: 'builder',
  label: 'Builder',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Best for sole traders getting started',
      price: 59,
      ctaLabel: 'Get Starter',
      highlights: [
        'Business profile with logo & cover',
        'Up to 5 suburbs served',
        'Up to 5 portfolio photos',
        '1 team member',
        'Unlimited lead history',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Popular',
      description: 'Best for busy trades wanting more reach',
      price: 129,
      ctaLabel: 'Get Growth',
      popular: true,
      highlights: [
        'Everything in Starter, plus:',
        'Up to 20 suburbs served',
        'Up to 10 photos, 2 videos',
        'Up to 3 team members',
        'Basic performance analytics',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Best for established businesses',
      price: 199,
      ctaLabel: 'Get Elite',
      highlights: [
        'Everything in Growth, plus:',
        'Up to 35 suburbs served',
        'Up to 20 photos, 5 videos',
        'Homepage & search featured placement',
        'AI business insights',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Best for multi-branch operators',
      price: 499,
      ctaLabel: 'Get Enterprise',
      highlights: [
        'Everything in Elite, plus:',
        'Unlimited, state-wide reach',
        'Up to 30 photos, 10 videos',
        'Up to 5 service categories',
        'AI lead recommendations',
      ],
    },
  ],
  stats: [
    { value: '1,240+', label: 'verified professionals' },
    { value: '6', label: 'service categories' },
    { value: '4.8★', label: 'average provider rating' },
  ],
  sections: [
    {
      title: 'Profile & Verification',
      rows: [
        { label: 'Professional Business Profile', values: [true, true, true, { label: '✓ Premium' }] },
        { label: 'Verification Level', values: [true, true, true, true] },
        { label: 'Business Logo', values: [true, true, true, true] },
        { label: 'Cover Image', values: [true, true, true, true] },
        { label: 'Business Description', values: ['1,500 chars', '1,500 chars', '1,500 chars', '1,500 chars'] },
        { label: 'Website', values: [true, true, true, true] },
        { label: 'Social Media Links', values: [true, true, true, true] },
      ],
    },
    {
      title: 'Reach & Discovery',
      rows: [
        { label: 'Service Areas', values: ['Up to 5 suburbs', 'Up to 20 suburbs', 'Up to 35 suburbs', 'Unlimited, state-wide'] },
        { label: 'Map View', values: ['Office location', 'Office location', 'Office location', 'Office location'] },
        { label: 'List View', values: ['Distance-based', 'Distance-based', 'Distance-based', 'State-wide'] },
        { label: 'Service Categories', values: ['—', '—', '—', 'Up to 5'] },
        { label: 'Homepage Featured Business', values: ['—', '—', 'Included', 'Premium'] },
        { label: 'Featured Search Placement', values: ['—', '—', 'Included', 'Included'] },
      ],
    },
    {
      title: 'Content',
      rows: [
        { label: 'Portfolio Photos', values: ['Up to 5', 'Up to 10', 'Up to 20', 'Up to 30'] },
        { label: 'Portfolio Videos', values: ['—', '2 (25s max)', '5 (25s max)', '10 (60s max)'] },
        { label: 'Promotional Offers & Coupons', values: ['—', 'Up to 2 active', 'Up to 5 active', 'Up to 10 active'] },
      ],
    },
    {
      title: 'Team & Engagement',
      rows: [
        { label: 'Team Members', values: ['1', 'Up to 3', 'Up to 5', 'Up to 10'] },
        { label: 'Google Reviews Link', values: [true, true, true, true] },
        { label: 'Get in Touch Enquiry Form', values: [true, true, true, true] },
        { label: 'Email Notifications', values: [true, true, true, true] },
        { label: 'Mobile App Notifications', values: ['—', true, true, true] },
      ],
    },
    {
      title: 'Analytics & Growth',
      rows: [
        { label: 'Lead History', values: ['Unlimited', 'Unlimited', 'Unlimited', 'Unlimited'] },
        { label: 'Performance Analytics', values: ['—', 'Basic', 'Premium Insights', 'Enterprise Dashboard'] },
        { label: 'Monthly Performance Report', values: ['—', 'Basic', 'Advanced', 'Weekly + Monthly'] },
        { label: 'Export Leads (CSV/Excel)', values: ['—', true, true, true] },
        { label: 'AI Business Insights', values: ['—', '—', true, { label: '✓ Advanced' }] },
        { label: 'AI Lead Recommendations', values: ['—', '—', '—', true] },
      ],
    },
  ],
};

// ─── Agents Tab ───────────────────────────────────────────────────────────────
const agentsTab: TabData = {
  id: 'agents',
  label: 'Agents',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Best for new agents building their client base',
      price: 49,
      ctaLabel: 'Get Starter',
      highlights: [
        'Agent profile with photo & bio',
        'Up to 10 active listings',
        'Basic search visibility',
        'Enquiry form',
        'Email notifications',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Popular',
      description: 'Best for growing agents wanting stronger reach',
      price: 109,
      ctaLabel: 'Get Growth',
      popular: true,
      highlights: [
        'Everything in Starter, plus:',
        'Up to 30 active listings',
        'Priority search placement',
        'Client testimonials showcase',
        'Performance analytics',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Best for top-performing agents',
      price: 189,
      ctaLabel: 'Get Elite',
      highlights: [
        'Everything in Growth, plus:',
        'Unlimited active listings',
        'Homepage featured agent',
        'AI buyer-match recommendations',
        'Advanced reporting',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Best for agency teams & principal agents',
      price: 449,
      ctaLabel: 'Get Enterprise',
      highlights: [
        'Everything in Elite, plus:',
        'Multi-agent team accounts',
        'Branded agency microsite',
        'Dedicated account manager',
        'API integrations',
      ],
    },
  ],
  stats: [
    { value: '3,500+', label: 'verified agents' },
    { value: '18', label: 'property types' },
    { value: '4.9★', label: 'average agent rating' },
  ],
  sections: [
    {
      title: 'Profile & Credentials',
      rows: [
        { label: 'Agent Profile Page', values: [true, true, true, { label: '✓ Premium' }] },
        { label: 'Licence Verification Badge', values: [true, true, true, true] },
        { label: 'Profile Photo & Bio', values: [true, true, true, true] },
        { label: 'Sold & Leased History', values: ['Last 12 months', 'Full history', 'Full history', 'Full history'] },
        { label: 'Client Testimonials', values: ['Up to 3', 'Up to 10', 'Unlimited', 'Unlimited'] },
      ],
    },
    {
      title: 'Listing Management',
      rows: [
        { label: 'Active Listings', values: ['Up to 10', 'Up to 30', 'Unlimited', 'Unlimited'] },
        { label: 'Photos per Listing', values: ['Up to 10', 'Up to 20', 'Up to 30', 'Unlimited'] },
        { label: 'Video Walkthrough', values: ['—', '1 per listing', '3 per listing', 'Unlimited'] },
        { label: 'Open Home Scheduler', values: [true, true, true, true] },
        { label: 'Price History Display', values: ['—', true, true, true] },
      ],
    },
    {
      title: 'Reach & Lead Generation',
      rows: [
        { label: 'Search Placement', values: ['Standard', 'Priority', 'Featured', 'Premium'] },
        { label: 'Suburb Farming Radius', values: ['1 suburb', 'Up to 5', 'Up to 20', 'Unlimited'] },
        { label: 'Homepage Agent Spotlight', values: ['—', '—', 'Included', 'Premium'] },
        { label: 'Email Lead Alerts', values: [true, true, true, true] },
        { label: 'SMS Lead Alerts', values: ['—', true, true, true] },
      ],
    },
    {
      title: 'Analytics & Reporting',
      rows: [
        { label: 'Listing Performance', values: [true, true, true, true] },
        { label: 'Lead Analytics', values: ['—', 'Basic', 'Advanced', 'Enterprise Dashboard'] },
        { label: 'Market Comparison Reports', values: ['—', '—', true, true] },
        { label: 'Export Leads (CSV)', values: ['—', true, true, true] },
        { label: 'AI Buyer Match', values: ['—', '—', true, { label: '✓ Advanced' }] },
      ],
    },
  ],
};

// ─── Traders Tab ─────────────────────────────────────────────────────────────
const tradersTab: TabData = {
  id: 'traders',
  label: 'Traders',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Best for sole traders just starting out',
      price: 39,
      ctaLabel: 'Get Starter',
      highlights: [
        'Trade profile with logo & cover',
        'Up to 3 service areas',
        'Up to 5 portfolio photos',
        'Basic enquiry form',
        'Lead history (30 days)',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Popular',
      description: 'Best for growing trade businesses',
      price: 89,
      ctaLabel: 'Get Growth',
      popular: true,
      highlights: [
        'Everything in Starter, plus:',
        'Up to 10 service areas',
        'Up to 10 portfolio photos, 1 video',
        'Google Reviews integration',
        'Basic analytics',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Best for established trade businesses',
      price: 169,
      ctaLabel: 'Get Elite',
      highlights: [
        'Everything in Growth, plus:',
        'Up to 25 service areas',
        'Featured search placement',
        'Up to 5 team members',
        'Premium insights',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Best for large trade companies',
      price: 349,
      ctaLabel: 'Get Enterprise',
      highlights: [
        'Everything in Elite, plus:',
        'Unlimited service areas',
        'Dedicated account manager',
        'Custom trade categories',
        'AI lead matching',
      ],
    },
  ],
  stats: [
    { value: '6,800+', label: 'verified traders' },
    { value: '40+', label: 'trade categories' },
    { value: '4.7★', label: 'average trader rating' },
  ],
  sections: [
    {
      title: 'Business Profile',
      rows: [
        { label: 'Trade Business Profile', values: [true, true, true, { label: '✓ Premium' }] },
        { label: 'Licence & Insurance Verified', values: [true, true, true, true] },
        { label: 'Logo & Cover Image', values: [true, true, true, true] },
        { label: 'Service Description', values: ['1,000 chars', '1,500 chars', '2,000 chars', '2,500 chars'] },
        { label: 'Specialisations', values: ['1 category', 'Up to 3', 'Up to 5', 'Unlimited'] },
      ],
    },
    {
      title: 'Service Coverage',
      rows: [
        { label: 'Service Areas', values: ['Up to 3', 'Up to 10', 'Up to 25', 'Unlimited'] },
        { label: 'Emergency Call-Out', values: ['—', true, true, true] },
        { label: 'Online Quoting Tool', values: ['—', '—', true, true] },
        { label: 'Booking Calendar', values: ['—', true, true, true] },
      ],
    },
    {
      title: 'Content',
      rows: [
        { label: 'Portfolio Photos', values: ['Up to 5', 'Up to 10', 'Up to 20', 'Up to 40'] },
        { label: 'Portfolio Videos', values: ['—', '1 (30s max)', '3 (30s max)', '10 (60s max)'] },
        { label: 'Before & After Gallery', values: ['—', true, true, true] },
        { label: 'Promotional Offers', values: ['—', 'Up to 2', 'Up to 5', 'Up to 15'] },
      ],
    },
    {
      title: 'Team & Reviews',
      rows: [
        { label: 'Team Members', values: ['1', 'Up to 3', 'Up to 5', 'Up to 15'] },
        { label: 'Google Reviews Link', values: [true, true, true, true] },
        { label: 'Review Response Tool', values: ['—', true, true, true] },
        { label: 'Email Notifications', values: [true, true, true, true] },
        { label: 'SMS Notifications', values: ['—', true, true, true] },
      ],
    },
    {
      title: 'Analytics',
      rows: [
        { label: 'Lead History', values: ['30 days', 'Unlimited', 'Unlimited', 'Unlimited'] },
        { label: 'Performance Dashboard', values: ['—', 'Basic', 'Advanced', 'Enterprise'] },
        { label: 'Export Leads', values: ['—', true, true, true] },
        { label: 'AI Trade Recommendations', values: ['—', '—', true, { label: '✓ Advanced' }] },
      ],
    },
  ],
};

// ─── Commercial Tab ──────────────────────────────────────────────────────────
const commercialTab: TabData = {
  id: 'commercial',
  label: 'Commercial',
  plans: [
    {
      id: 'starter',
      name: 'Starter',
      description: 'Best for small business owners listing commercial space',
      price: 99,
      ctaLabel: 'Get Starter',
      highlights: [
        'Up to 5 commercial listings',
        'Basic floor plan upload',
        'Up to 10 photos per listing',
        'Enquiry & callback form',
        'Email lead notifications',
      ],
    },
    {
      id: 'growth',
      name: 'Growth',
      badge: 'Most Popular',
      description: 'Best for commercial agencies scaling up',
      price: 199,
      ctaLabel: 'Get Growth',
      popular: true,
      highlights: [
        'Everything in Starter, plus:',
        'Up to 20 commercial listings',
        'Priority search visibility',
        'Interactive floor plan viewer',
        'Analytics dashboard',
      ],
    },
    {
      id: 'elite',
      name: 'Elite',
      description: 'Best for established commercial operators',
      price: 349,
      ctaLabel: 'Get Elite',
      highlights: [
        'Everything in Growth, plus:',
        'Up to 60 listings',
        'Homepage featured placement',
        'AI tenant-match recommendations',
        'Advanced market reports',
      ],
    },
    {
      id: 'enterprise',
      name: 'Enterprise',
      description: 'Best for large commercial property groups',
      price: 799,
      ctaLabel: 'Get Enterprise',
      highlights: [
        'Everything in Elite, plus:',
        'Unlimited listings',
        'Dedicated commercial advisor',
        'API & CRM integration',
        'White-label options',
      ],
    },
  ],
  stats: [
    { value: '12,000+', label: 'commercial listings' },
    { value: '8', label: 'commercial categories' },
    { value: '4.6★', label: 'average operator rating' },
  ],
  sections: [
    {
      title: 'Listing & Presentation',
      rows: [
        { label: 'Active Listings', values: ['Up to 5', 'Up to 20', 'Up to 60', 'Unlimited'] },
        { label: 'Photos per Listing', values: ['Up to 10', 'Up to 20', 'Up to 40', 'Unlimited'] },
        { label: 'Video Tour', values: ['—', '1 (60s)', '3 (120s)', 'Unlimited'] },
        { label: 'Floor Plan Upload', values: [true, true, true, true] },
        { label: 'Interactive Floor Plan', values: ['—', true, true, true] },
        { label: 'Virtual Tour / 3D', values: ['—', '—', true, true] },
        { label: 'Listing Description', values: ['2,000 chars', '3,000 chars', '4,000 chars', 'Unlimited'] },
      ],
    },
    {
      title: 'Reach & Targeting',
      rows: [
        { label: 'Search Placement', values: ['Standard', 'Priority', 'Featured', 'Premium'] },
        { label: 'Suburb / Zone Targeting', values: ['1 zone', 'Up to 5', 'Up to 20', 'Unlimited'] },
        { label: 'Homepage Featured', values: ['—', '—', 'Included', 'Premium'] },
        { label: 'Industry Category Tags', values: ['1', 'Up to 3', 'Up to 6', 'Unlimited'] },
        { label: 'External Portal Syndication', values: ['—', '—', true, true] },
      ],
    },
    {
      title: 'Leads & Enquiries',
      rows: [
        { label: 'Enquiry & Callback Form', values: [true, true, true, true] },
        { label: 'Lead History', values: ['60 days', 'Unlimited', 'Unlimited', 'Unlimited'] },
        { label: 'Email Notifications', values: [true, true, true, true] },
        { label: 'SMS Notifications', values: ['—', true, true, true] },
        { label: 'CRM Integration', values: ['—', '—', true, true] },
      ],
    },
    {
      title: 'Analytics & Intelligence',
      rows: [
        { label: 'Listing Performance', values: [true, true, true, true] },
        { label: 'Market Comparison Data', values: ['—', 'Basic', 'Advanced', 'Full'] },
        { label: 'Monthly Reports', values: ['—', '—', 'Monthly', 'Weekly + Monthly'] },
        { label: 'Export Leads (CSV)', values: ['—', true, true, true] },
        { label: 'AI Tenant Match', values: ['—', '—', true, { label: '✓ Advanced' }] },
        { label: 'Yield & ROI Calculator', values: ['—', '—', true, true] },
      ],
    },
  ],
};

// ─── All tabs export ──────────────────────────────────────────────────────────
export const ALL_TABS: TabData[] = [
  propertiesTab,
  builderTab,
  agentsTab,
  tradersTab,
  commercialTab,
];
