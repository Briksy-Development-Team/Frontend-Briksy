// import { FC } from 'react'
// import { KTIcon, toAbsoluteUrl } from '../../../helpers'

// type Props = {
//   className: string
// }

// type Client = {
//   id: number
//   name: string
//   skills: string
//   company: string
//   companyType: string
//   progress: number
//   avatar: string
// }

// /* ======================
//    DYNAMIC DATA
// ====================== */

// const clients: Client[] = [
//   {
//     id: 1,
//     name: 'Ana Simmons',
//     skills: 'HTML, JS, ReactJS',
//     company: 'Intertico',
//     companyType: 'Web, UI/UX Design',
//     progress: 50,
//     avatar: 'media/avatars/300-14.jpg',
//   },
//   {
//     id: 2,
//     name: 'Jessie Clarcson',
//     skills: 'C#, ASP.NET, MS SQL',
//     company: 'Agoda',
//     companyType: 'Houses & Hotels',
//     progress: 70,
//     avatar: 'media/avatars/300-2.jpg',
//   },
//   {
//     id: 3,
//     name: 'Lebron Wayde',
//     skills: 'PHP, Laravel, VueJS',
//     company: 'RoadGee',
//     companyType: 'Transportation',
//     progress: 60,
//     avatar: 'media/avatars/300-5.jpg',
//   },
//   {
//     id: 4,
//     name: 'Natali Goodwin',
//     skills: 'Python, PostgreSQL, ReactJS',
//     company: 'The Hill',
//     companyType: 'Insurance',
//     progress: 50,
//     avatar: 'media/avatars/300-20.jpg',
//   },
//   {
//     id: 5,
//     name: 'Kevin Leonard',
//     skills: 'HTML, JS, ReactJS',
//     company: 'RoadGee',
//     companyType: 'Art Director',
//     progress: 90,
//     avatar: 'media/avatars/300-23.jpg',
//   },
// ]

// /* ======================
//    PROGRESS COLOR LOGIC
// ====================== */

// const getProgressColor = (progress: number) => {
//   if (progress >= 80) return 'bg-info'
//   if (progress >= 60) return 'bg-success'
//   if (progress >= 40) return 'bg-warning'
//   return 'bg-danger'
// }

// /* ======================
//    COMPONENT
// ====================== */

// const TablesWidget10: FC<Props> = ({ className }) => {
//   return (
//     <div className={`card ${className}`}>
//       {/* Header */}
//       <div className='card-header border-0 pt-5'>
//         <h3 className='card-title align-items-start flex-column'>
//           <span className='card-label fw-bold fs-3 mb-1'>
//             Client Statistics
//           </span>
//           <span className='text-muted mt-1 fw-semibold fs-7'>
//             Over {clients.length} members
//           </span>
//         </h3>

//         <div
//           className='card-toolbar'
//           data-bs-toggle='tooltip'
//           data-bs-placement='top'
//           title='Click to add a user'
//         >
//           <button className='btn btn-sm btn-light-primary'>
//             <KTIcon iconName='plus' className='fs-3' />
//             New Member
//           </button>
//         </div>
//       </div>

//       {/* Body */}
//       <div className='card-body py-3'>
//         <div className='table-responsive'>
//           <table className='table table-row-dashed table-row-gray-300 align-middle gs-0 gy-4'>
//             <thead>
//               <tr className='fw-bold text-muted'>
//                 <th className='w-25px'>
//                   <div className='form-check form-check-sm form-check-custom form-check-solid'>
//                     <input
//                       className='form-check-input'
//                       type='checkbox'
//                     />
//                   </div>
//                 </th>
//                 <th className='min-w-150px'>Author</th>
//                 <th className='min-w-140px'>Company</th>
//                 <th className='min-w-120px text-end'>Progress</th>
//                 <th className='min-w-100px text-end'>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {clients.map((client) => (
//                 <tr key={client.id}>
//                   {/* Checkbox */}
//                   <td>
//                     <div className='form-check form-check-sm form-check-custom form-check-solid'>
//                       <input
//                         className='form-check-input'
//                         type='checkbox'
//                         value={client.id}
//                       />
//                     </div>
//                   </td>

//                   {/* Author */}
//                   <td>
//                     <div className='d-flex align-items-center'>
//                       <div className='symbol symbol-45px me-5'>
//                         <img
//                           src={toAbsoluteUrl(client.avatar)}
//                           alt=''
//                         />
//                       </div>

//                       <div className='d-flex flex-column'>
//                         <span className='text-gray-900 fw-bold fs-6'>
//                           {client.name}
//                         </span>
//                         <span className='text-muted fw-semibold fs-7'>
//                           {client.skills}
//                         </span>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Company */}
//                   <td>
//                     <span className='text-gray-900 fw-bold d-block fs-6'>
//                       {client.company}
//                     </span>
//                     <span className='text-muted fw-semibold d-block fs-7'>
//                       {client.companyType}
//                     </span>
//                   </td>

//                   {/* Progress */}
//                   <td className='text-end'>
//                     <div className='d-flex flex-column w-100 me-2'>
//                       <div className='d-flex flex-stack mb-2'>
//                         <span className='text-muted me-2 fs-7 fw-semibold'>
//                           {client.progress}%
//                         </span>
//                       </div>

//                       <div className='progress h-6px w-100'>
//                         <div
//                           className={`progress-bar ${getProgressColor(
//                             client.progress
//                           )}`}
//                           role='progressbar'
//                           style={{ width: `${client.progress}%` }}
//                         ></div>
//                       </div>
//                     </div>
//                   </td>

//                   {/* Actions */}
//                   <td className='text-end'>
//                     <div className='d-flex justify-content-end'>
//                       <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
//                         <KTIcon iconName='switch' className='fs-3' />
//                       </button>
//                       <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm me-1'>
//                         <KTIcon iconName='pencil' className='fs-3' />
//                       </button>
//                       <button className='btn btn-icon btn-bg-light btn-active-color-primary btn-sm'>
//                         <KTIcon iconName='trash' className='fs-3' />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>

//           </table>
//         </div>
//       </div>
//     </div>
//   )
// }

// export { TablesWidget10 }  




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

/* ======================
   REAL ESTATE DATA
====================== */

const agencies: Agency[] = [
  {
    id: 1,
    agencyName: 'Skyline Realty',
    ownerName: 'Rajesh Patel',
    city: 'Ahmedabad',
    totalProperties: 48,
    activeListings: 32,
    profileCompletion: 80,
    avatar: 'media/avatars/300-1.jpg',
  },
  {
    id: 2,
    agencyName: 'Urban Nest Properties',
    ownerName: 'Amit Shah',
    city: 'Surat',
    totalProperties: 25,
    activeListings: 18,
    profileCompletion: 65,
    avatar: 'media/avatars/300-2.jpg',
  },
  {
    id: 3,
    agencyName: 'Prime Estate Group',
    ownerName: 'Neha Mehta',
    city: 'Mumbai',
    totalProperties: 72,
    activeListings: 60,
    profileCompletion: 90,
    avatar: 'media/avatars/300-3.jpg',
  },
  {
    id: 4,
    agencyName: 'Elite Homes',
    ownerName: 'Vikram Desai',
    city: 'Vadodara',
    totalProperties: 14,
    activeListings: 9,
    profileCompletion: 50,
    avatar: 'media/avatars/300-4.jpg',
  },
]

/* ======================
   PROGRESS COLOR LOGIC
====================== */

const getProgressColor = (value: number) => {
  if (value >= 80) return 'bg-success'
  if (value >= 60) return 'bg-primary'
  if (value >= 40) return 'bg-warning'
  return 'bg-danger'
}

/* ======================
   COMPONENT
====================== */

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
                          className={`progress-bar ${getProgressColor(
                            agency.profileCompletion
                          )}`}
                          role='progressbar'
                          style={{
                            width: `${agency.profileCompletion}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </td>

                  {/* Actions */}
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