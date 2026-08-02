import type { ServiceAreaGeometry } from "../service/serviceAreaGeometry";

export type ServiceMapItem = {
  id: string;
  generated_id?: string | null;
  name: string;
  title?: string | null;
  category?: string | null;
  slug?: string | null;
  service_area?: string | null;
  service_area_geometry?: ServiceAreaGeometry | null;
  rate_from?: number | null;
  rate_to?: number | null;
  is_active?: boolean;
  status?: string;
  organization?: {
    id: string;
    name: string;
    slug?: string | null;
    business_type?: string | null;
  } | null;
  organization_type?: {
    id: string;
    name: string;
    slug?: string | null;
  } | null;
  created_at?: string | null;
};
