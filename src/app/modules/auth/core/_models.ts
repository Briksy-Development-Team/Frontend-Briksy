export interface AuthModel {
  api_token: string;
  refreshToken?: string;
  token_type?: string;
  abilities?: string[];
  permissions?: string[];
  enabled_modules?: string[];
  business_type?: string | null;
  business_verification_status?: string | null;
}

export interface AuthResponse {
  user: UserModel;
  token: string;
  token_type: string;
  abilities: string[];
}

export interface UserAddressModel {
  addressLine: string;
  city: string;
  state: string;
  postCode: string;
}

export interface UserCommunicationModel {
  email: boolean;
  sms: boolean;
  phone: boolean;
}

export interface UserEmailSettingsModel {
  emailNotification?: boolean;
  sendCopyToPersonalEmail?: boolean;
  activityRelatesEmail?: {
    youHaveNewNotifications?: boolean;
    youAreSentADirectMessage?: boolean;
    someoneAddsYouAsAsAConnection?: boolean;
    uponNewOrder?: boolean;
    newMembershipApproval?: boolean;
    memberRegistration?: boolean;
  };
  updatesFromKeenthemes?: {
    newsAboutKeenthemesProductsAndFeatureUpdates?: boolean;
    tipsOnGettingMoreOutOfKeen?: boolean;
    thingsYouMissedSindeYouLastLoggedIntoKeen?: boolean;
    newsAboutStartOnPartnerProductsAndOtherServices?: boolean;
    tipsOnStartBusinessProducts?: boolean;
  };
}

export interface UserSocialNetworksModel {
  linkedIn: string;
  facebook: string;
  twitter: string;
  instagram: string;
}

export interface UserModel {
  id: string;
  generated_id?: string | null;
  display_id?: string | null;
  username: string;
  password: string | undefined;
  first?: string;
  last?: string;

  email: string;
  first_name: string;
  last_name: string;
  fullname?: string;
  occupation?: string;
  companyName?: string;
  phone?: string;
  roles?: string[];
  permissions?: string[];
  business_type?: string | null;
  business_verification_status?: string | null;
  subscription?: {
    organization_id?: string | null;
    plan_id?: string | null;
    status?: "trialing" | "active" | "expired" | "inactive";
    is_trial_active?: boolean;
    trial_started_at?: string | null;
    trial_ends_at?: string | null;
    subscription_activated_at?: string | null;
    plan?: {
      id: string;
      name: string;
      price: number;
    } | null;
  };
  pic?: string;
  language?: "en" | "de" | "es" | "fr" | "ja" | "zh" | "ru";
  timeZone?: string;
  website?: "https://keenthemes.com";
  emailSettings?: UserEmailSettingsModel;
  auth?: AuthModel;
  communication?: UserCommunicationModel;
  address?: UserAddressModel;
  socialNetworks?: UserSocialNetworksModel;
}
