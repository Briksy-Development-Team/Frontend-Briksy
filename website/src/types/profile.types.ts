export interface Property {
  id: number;
  title: string;
  location: string;
  price: string;
  image?: string;
}

export interface ScheduledVisit {
  id: number;
  propertyTitle: string;
  location: string;
  date: string;
  time: string;
}

export interface Enquiry {
  id: number;
  propertyTitle: string;
  location: string;
  date: string;
  message: string;
}

export interface Seeker {
  id: number;
  name: string;
  email: string;
  phone: string;
  city: string;
  joinedDate: string;
  avatar: string;
}

export interface ProfileStats {
  favourites: number;
  viewed: number;
  scheduledVisits: number;
  enquiries: number;
}

export interface ProfileData {
  seeker: Seeker;
  stats: ProfileStats;
  favouriteProperties: Property[];
  viewedProperties: Property[];
  scheduledVisits: ScheduledVisit[];
  enquiries: Enquiry[];
}
