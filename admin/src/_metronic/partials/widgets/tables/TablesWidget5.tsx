import { FC, useState } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'
import { Dropdown4 } from '../../content/dropdown/Droupdown4'

type AgencyStatus = 'Active' | 'Suspended' | 'Pending Approval' | 'Expired'

interface AgencyOwner {
  id: number
  agencyName: string
  ownerName: string
  city: string
  totalProperties: number
  activeListings: number
  subscriptionPlan: 'Basic' | 'Pro' | 'Enterprise'
  status: AgencyStatus
  logo: string
  createdAt: string
}

type Props = {
  className: string
}

const statusMap: Record<AgencyStatus, string> = {
  Active: 'badge-light-success',
  Suspended: 'badge-light-danger',
  'Pending Approval': 'badge-light-warning',
  Expired: 'badge-light-secondary',
}

const agencies: AgencyOwner[] = [
  {
    id: 1,
    agencyName: 'Skyline Realty',
    ownerName: 'Rajesh Patel',
    city: 'Ahmedabad',
    totalProperties: 48,
    activeListings: 32,
    subscriptionPlan: 'Pro',
    status: 'Active',
    logo: 'media/avatars/300-1.jpg',
    createdAt: '2026-02-01',
  },
  {
    id: 2,
    agencyName: 'Urban Nest Properties',
    ownerName: 'Amit Shah',
    city: 'Surat',
    totalProperties: 25,
    activeListings: 18,
    subscriptionPlan: 'Basic',
    status: 'Pending Approval',
    logo: 'media/avatars/300-2.jpg',
    createdAt: '2026-02-20',
  },
  {
    id: 3,
    agencyName: 'Prime Estate Group',
    ownerName: 'Neha Mehta',
    city: 'Mumbai',
    totalProperties: 72,
    activeListings: 60,
    subscriptionPlan: 'Enterprise',
    status: 'Active',
    logo: 'media/avatars/300-3.jpg',
    createdAt: '2026-03-01',
  },
  {
    id: 4,
    agencyName: 'Golden Brick Realty',
    ownerName: 'Suresh Iyer',
    city: 'Chennai',
    totalProperties: 90,
    activeListings: 70,
    subscriptionPlan: 'Enterprise',
    status: 'Active',
    logo: 'media/avatars/300-8.jpg',
    createdAt: '2026-03-03',
  },
]

const TablesWidget5: FC<Props> = ({ className }) => {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const filteredAgencies = agencies.filter((agency) => {
    const created = new Date(agency.createdAt)

    if (!startDate && !endDate) return true

    const start = startDate ? new Date(startDate) : null
    const end = endDate ? new Date(endDate) : null

    if (start && created < start) return false
    if (end && created > end) return false

    return true
  })

  return (
    <div className={`card ${className}`}>
      {/* HEADER */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Agency Owners</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Filter by registration date
          </span>
        </h3>

        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
            data-kt-menu-flip='top-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown4 />
        </div>
      </div>

      {/* BODY */}
      <div className='card-body py-3'>
        <div
          className='table-responsive'
          style={{ maxHeight: '400px', overflowY: 'auto' }}
        >
          <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
            <tbody>
              {filteredAgencies.length === 0 ? (
                <tr>
                  <td className='text-center text-muted py-10'>
                    No agencies found
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td>
                      <div className='symbol symbol-45px me-2'>
                        <span className='symbol-label'>
                          <img
                            src={toAbsoluteUrl(agency.logo)}
                            className='h-50'
                            alt=''
                          />
                        </span>
                      </div>
                    </td>

                    <td>
                      <a
                        href='#'
                        className='text-gray-900 fw-bold text-hover-primary fs-6'
                      >
                        {agency.agencyName}
                      </a>

                      <span className='text-muted fw-semibold d-block'>
                        {agency.ownerName} • {agency.city}
                      </span>
                    </td>

                    <td className='text-end text-muted fw-semibold'>
                      {agency.activeListings}/{agency.totalProperties} Active
                      <br />
                      {agency.subscriptionPlan} Plan
                    </td>

                    <td className='text-end'>
                      <span className={`badge ${statusMap[agency.status]}`}>
                        {agency.status}
                      </span>
                    </td>

                    <td className='text-end'>
                      <a
                        href='#'
                        className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                      >
                        <KTIcon iconName='arrow-right' className='fs-2' />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export { TablesWidget5 }