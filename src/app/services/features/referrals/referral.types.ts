export type ReferralOrganization = {
  id: string;
  name: string;
  trading_name?: string | null;
  contact_email?: string | null;
  referral_code?: string | null;
  referred_by_name?: string | null;
  referred_organizations_count?: number;
  status?: string;
  created_at?: string;
};

export type ReferralDashboard = {
  organization: ReferralOrganization;
  referral_code: string | null;
  referral_link: string;
  total_referrals: number;
  recent_referrals: ReferralOrganization[];
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};

export type ReferralProgramOverview = {
  organizations: ReferralOrganization[];
  totals: {
    organizations: number;
    with_referrals: number;
  };
  pagination?: {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
  };
};
