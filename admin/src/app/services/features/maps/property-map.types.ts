export type PropertyMapItem = {
  id: string;
  property_number: string;
  title: string;
  latitude: number | null;
  longitude: number | null;
  status: string;
  verified: boolean;
  organization_name?: string | null;
  property_type?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  image_url?: string | null;
  images?: Array<{
    id?: string;
    url: string;
    is_primary?: boolean;
    sort_order?: number;
  }>;
  videos?: Array<{
    id?: string;
    url: string;
    is_primary?: boolean;
    sort_order?: number;
  }>;
  address?: string | null;
  created_at?: string | null;
};

export type PropertyMapFilters = Record<string, string | number | boolean | null | undefined>;
