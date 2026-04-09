export type Staff = {
  id: number
  name: string
  email: string
  status: string
  type: string
}

export type GetStaffParams = {
  page?: number
  pageSize?: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}
