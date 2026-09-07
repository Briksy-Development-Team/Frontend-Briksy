import { AxiosError } from 'axios'
import api from '../clients.api'
import { toggleLocalFavorite } from '../../favorites/localFavorites'
import type { ApiEnvelope } from '../../auth/auth.types'

export type FavoriteType = 'property' | 'organization'

export interface FavoriteOrganizationTarget {
  id: string
  name: string
  slug: string
  is_verified: boolean
  contact: {
    email: string | null
    phone: string | null
  }
  type?: {
    id: string
    name: string
    slug: string
  } | null
}

export interface PropertyMedia {
  id: string
  url: string
  type: string | null
  is_primary: boolean
}

export interface FavoritePropertyTarget {
  id: string
  generated_id?: string
  display_id?: string
  title: string
  description?: string | null
  address?: string | null
  full_address?: string | null
  status?: string | null
  rating?: number
  location?: {
    suburb: string | null
    postcode: string | null
    latitude: number | null
    longitude: number | null
  }
  organization?: {
    id: string | null
    name: string | null
    slug: string | null
    type?: string | null
    is_verified: boolean
    contact?: {
      email: string | null
      phone: string | null
    } | null
  } | null
  media?: PropertyMedia[]
  created_at?: string
}

export type FavoriteTarget = FavoritePropertyTarget | FavoriteOrganizationTarget | null

export interface FavoriteItem {
  id: string
  type: FavoriteType | null
  target: FavoriteTarget | null
  created_at?: string
}

export interface InquiryItem {
  id: string
  reference_no: string
  display_id: string
  lead_source: string | null
  status: string
  subject: string
  message: string
  seeker: {
    name: string | null
    email: string | null
    phone: string | null
  }
  property: {
    title: string
    address: string | null
    full_address: string | null
    status: string | null
    organization: {
      name: string
      slug: string
      is_verified: boolean
      contact: {
        email: string | null
        phone: string | null
      }
    } | null
  } | null
  organization: {
    name: string
    slug: string
    is_verified: boolean
    contact: {
      email: string | null
      phone: string | null
    }
  } | null
  latest_update: {
    at: string | null
    status: string
    message: string
  }
  created_at?: string
  updated_at?: string
}

export interface PropertyListing {
  id: string
  generated_id?: string
  display_id?: string
  title: string
  description: string | null
  address: string | null
  full_address: string | null
  status: string | null
  rating: number
  location: {
    suburb: string | null
    postcode: string | null
    latitude: number | null
    longitude: number | null
  }
  organization?: {
    id: string | null
    name: string | null
    slug: string | null
    type?: string | null
    is_verified: boolean
  } | null
  media?: PropertyMedia[]
  created_at?: string
}

export interface SeekerProfileItem {
  id: string
  current_postcode: string | null
  preferred_budget_min: number | null
  preferred_budget_max: number | null
  created_at?: string
  updated_at?: string
}

export interface FavoriteToggleResult {
  isFavourite: boolean
  source: 'backend' | 'local'
  favorite: FavoriteItem | null
}

const isMissingFavoriteTargetError = (error: unknown): boolean => {
  if (!(error instanceof AxiosError)) {
    return false
  }

  return error.response?.status === 404 || error.response?.status === 422
}

export const getSeekerFavorites = async (type?: FavoriteType): Promise<ApiEnvelope<FavoriteItem[]>> => {
  const response = await api.get<ApiEnvelope<FavoriteItem[]>>('/seeker/favorites', {
    params: {
      ...(type ? { type } : {}),
      per_page: 100,
      sort: 'created_at',
      direction: 'desc',
    },
  })

  return response.data
}

export const addSeekerFavorite = async (propertyId: string): Promise<void> => {
  await api.post('/seeker/favorites', {
    type: 'property',
    target_id: propertyId,
  })
}

export const toggleSeekerFavorite = async (
  propertyId: string
): Promise<ApiEnvelope<{ favorite: FavoriteItem | null; action: 'added' | 'removed' }>> => {
  const response = await api.post<ApiEnvelope<{ favorite: FavoriteItem | null; action: 'added' | 'removed' }>>(
    '/seeker/favorites/toggle',
    {
      type: 'property',
      target_id: propertyId,
    }
  )

  return response.data
}

export const toggleSeekerPropertyFavorite = async (propertyId: string): Promise<FavoriteToggleResult> => {
  try {
    const response = await toggleSeekerFavorite(propertyId)

    return {
      isFavourite: response.data.action === 'added',
      source: 'backend',
      favorite: response.data.favorite,
    }
  } catch (error) {
    if (isMissingFavoriteTargetError(error)) {
      return {
        isFavourite: toggleLocalFavorite(propertyId),
        source: 'local',
        favorite: null,
      }
    }

    throw error
  }
}

export const removeSeekerFavorite = async (favoriteId: string): Promise<void> => {
  await api.delete(`/seeker/favorites/${favoriteId}`)
}

export const getSeekerInquiries = async (): Promise<ApiEnvelope<InquiryItem[]>> => {
  const response = await api.get<ApiEnvelope<InquiryItem[]>>('/seeker/inquiries')
  return response.data
}

export const getSeekerProperty = async (propertyId: string): Promise<ApiEnvelope<PropertyListing>> => {
  const response = await api.get<ApiEnvelope<PropertyListing>>(`/seeker/properties/${propertyId}`)
  return response.data
}

export const getSeekerProfile = async (): Promise<ApiEnvelope<SeekerProfileItem>> => {
  const response = await api.get<ApiEnvelope<SeekerProfileItem>>('/seeker/profile')
  return response.data
}

export const updateSeekerProfile = async (
  payload: Pick<SeekerProfileItem, 'current_postcode' | 'preferred_budget_min' | 'preferred_budget_max'>
): Promise<ApiEnvelope<SeekerProfileItem>> => {
  const response = await api.put<ApiEnvelope<SeekerProfileItem>>('/seeker/profile', payload)
  return response.data
}