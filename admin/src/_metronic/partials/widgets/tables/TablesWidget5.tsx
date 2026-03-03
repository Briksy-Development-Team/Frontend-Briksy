import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'


type AgencyStatus = 'Active' | 'Suspended' | 'Pending Approval' | 'Expired'

interface AgencyOwner {
  id: number
  agencyName: string
  ownerName: string
  city: string
  totalProperties: number
  activeListings: number
  subscriptionPlan: 'Basic' | 'Pro' | 'Enterprise'
  revenue: string
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
    // revenue: '₹2,40,000',
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
    // revenue: '₹85,000',
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
    // revenue: '₹5,20,000',
    status: 'Active',
    logo: 'media/avatars/300-3.jpg',
    createdAt: new Date().toISOString(), // today
  },
]



const isSameMonth = (date: Date, now: Date) =>
  date.getMonth() === now.getMonth() &&
  date.getFullYear() === now.getFullYear()

const isSameWeek = (date: Date, now: Date) => {
  const firstDayOfWeek = new Date(now)
  firstDayOfWeek.setDate(now.getDate() - now.getDay())
  firstDayOfWeek.setHours(0, 0, 0, 0)

  return date >= firstDayOfWeek && date <= now
}

const isSameDay = (date: Date, now: Date) =>
  date.toDateString() === now.toDateString()



const TablesWidget5: FC<Props> = ({ className }) => {
  const now = new Date()

  const monthData = agencies.filter((agency) =>
    isSameMonth(new Date(agency.createdAt), now)
  )

  const weekData = agencies.filter((agency) =>
    isSameWeek(new Date(agency.createdAt), now)
  )

  const dayData = agencies.filter((agency) =>
    isSameDay(new Date(agency.createdAt), now)
  )

  const tabs = [
    { label: 'Month', key: 'month', data: monthData },
    { label: 'Week', key: 'week', data: weekData },
    { label: 'Day', key: 'day', data: dayData },
  ]

  return (
    <div className={`card ${className}`}>
      {/* HEADER */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Agency Owners
          </span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Filtered by registration date
          </span>
        </h3>

        <div className='card-toolbar'>
          <ul className='nav'>
            {tabs.map((tab, index) => (
              <li key={tab.key} className='nav-item'>
                <a
                  className={`nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 ${index === 0 ? 'active' : ''
                    }`}
                  data-bs-toggle='tab'
                  href={`#kt_table_widget_5_tab_${tab.key}`}
                >
                  {tab.label} ({tab.data.length})
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* BODY */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          {tabs.map((tab, index) => (
            <div
              key={tab.key}
              className={`tab-pane fade ${index === 0 ? 'show active' : ''
                }`}
              id={`kt_table_widget_5_tab_${tab.key}`}
            >
              <div className='table-responsive'>
                <table className='table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4'>
                  <thead>
                    <tr className='border-0'>
                      <th className='p-0 w-50px'></th>
                      <th className='p-0 min-w-250px'></th>
                      <th className='p-0 min-w-200px text-end'></th>
                      <th className='p-0 min-w-150px text-end'></th>
                      <th className='p-0 min-w-50px'></th>
                    </tr>
                  </thead>

                  <tbody>
                    {tab.data.length === 0 ? (
                      <tr>
                        <td colSpan={5} className='text-center text-muted py-5'>
                          No agencies found
                        </td>
                      </tr>
                    ) : (
                      tab.data.map((agency) => (
                        <tr key={agency.id}>
                          <td>
                            <div className='symbol symbol-45px me-2'>
                              <span className='symbol-label'>
                                <img
                                  src={toAbsoluteUrl(agency.logo)}
                                  className='h-50 align-self-center'
                                  alt=''
                                />
                              </span>
                            </div>
                          </td>

                          <td>
                            <a
                              href='#'
                              className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'
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
                            {/* <span className='fw-bold text-gray-900'>
                              {agency.revenue}
                            </span> */}
                            <span
                              className={`badge ${statusMap[agency.status]} ms-2`}
                            >
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
          ))}
        </div>
      </div>
    </div>
  )
}

export { TablesWidget5 }