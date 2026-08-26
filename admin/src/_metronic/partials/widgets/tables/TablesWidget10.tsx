



import { FC } from 'react'
import { KTIcon, toAbsoluteUrl } from '../../../helpers'

type Props = {
  className: string
}

type Agency = {
  id: number
  agencyName: string
  ownerName: string
  city: string
  totalProperties: number
  activeListings: number
  profileCompletion: number
  avatar: string
}


const agencies: Agency[] = [
  {
    id: 1,
    agencyName: 'Skyline Realty',
    ownerName: 'Rajesh Patel',
    city: 'Melbourne',
    totalProperties: 48,
    activeListings: 32,
    profileCompletion: 80,
    avatar: 'media/avatars/300-1.jpg',
  },
  {
    id: 2,
    agencyName: 'Urban Nest Properties',
    ownerName: 'Amit Shah',
    city: 'Sydney',
    totalProperties: 25,
    activeListings: 18,
    profileCompletion: 65,
    avatar: 'media/avatars/300-2.jpg',
  },
  {
    id: 3,
    agencyName: 'Prime Estate Group',
    ownerName: 'Neha Mehta',
    city: 'Brisbane',
    totalProperties: 72,
    activeListings: 60,
    profileCompletion: 90,
    avatar: 'media/avatars/300-3.jpg',
  },
  {
    id: 4,
    agencyName: 'Elite Homes',
    ownerName: 'Vikram Desai',
    city: 'Sydney',
    totalProperties: 14,
    activeListings: 9,
    profileCompletion: 50,
    avatar: 'media/avatars/300-4.jpg',
  },
]



const getProgressColor = (_value: number) => '#e2cbb3'



const TablesWidget10: FC<Props> = ({ className }) => {
  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>
            Agency Statistics
          </span>
          <span className='text-muted mt-1 fw-semibold fs-7'>
            Total {agencies.length} registered agencies
          </span>
        </h3>

        <div className='card-toolbar'>
          <button className='btn btn-sm btn-light-primary'>
            <KTIcon iconName='plus' className='fs-3' />
            Add Agency
          </button>
        </div>
      </div>

      {/* Body */}
      <div className='card-body py-3'>
        <div className='table-responsive'>
          <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
            <thead>
              <tr className='fw-bold text-muted'>
                <th className='w-25px'></th>
                <th className='min-w-200px'>Agency</th>
                <th className='min-w-150px'>City</th>
                <th className='min-w-150px text-end'>Listings</th>
                <th className='min-w-150px text-end'>Profile Completion</th>
                <th className='min-w-100px text-end'>Actions</th>
              </tr>
            </thead>

            <tbody>
              {agencies.map((agency) => (
                <tr key={agency.id}>
                  {/* Avatar */}
                  <td>
                    <div className='symbol symbol-45px'>
                      <img
                        src={toAbsoluteUrl(agency.avatar)}
                        alt=''
                      />
                    </div>
                  </td>

                  {/* Agency Info */}
                  <td>
                    <span className='text-gray-900 fw-bold fs-6'>
                      {agency.agencyName}
                    </span>
                    <span className='text-muted d-block fs-7'>
                      Owner: {agency.ownerName}
                    </span>
                  </td>

                  {/* City */}
                  <td>
                    <span className='text-gray-900 fw-semibold fs-6'>
                      {agency.city}
                    </span>
                  </td>

                  {/* Listings */}
                  <td className='text-end'>
                    <span className='fw-bold text-gray-900'>
                      {agency.activeListings}/{agency.totalProperties}
                    </span>
                    <span className='text-muted d-block fs-7'>
                      Active Listings
                    </span>
                  </td>

                  {/* Profile Completion */}
                  <td className='text-end'>
                    <div className='d-flex flex-column w-100'>
                      <span className='text-muted fs-7 fw-semibold'>
                        {agency.profileCompletion}%
                      </span>
                      <div className='progress h-6px w-100'>
                        <div
                          className='progress-bar'
                          role='progressbar'
                          style={{
                            width: `${agency.profileCompletion}%`,
                            backgroundColor: getProgressColor(agency.profileCompletion),
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  <td className='text-end'>
                    <div className='d-flex justify-content-end'>
                      <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
                        <KTIcon iconName='pencil' className='fs-3' />
                      </button>
                      <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
                        <KTIcon iconName='trash' className='fs-3' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  )
}

export { TablesWidget10 }