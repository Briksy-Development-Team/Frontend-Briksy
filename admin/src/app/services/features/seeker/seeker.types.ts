export type Seeker = {
  id: number
  name: string
  email: string
  status?: string
  last_login?: string
  current_login?: string
  age?: number
  gender?: string
  location?: string
  created_at?: string
  updated_at?: string
}

export type GetSeekersParams = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}
