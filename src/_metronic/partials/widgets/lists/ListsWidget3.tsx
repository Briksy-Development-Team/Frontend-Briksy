import React, { useState } from 'react'
import { KTIcon } from '../../../helpers'
import { Dropdown1 } from '../../content/dropdown/Dropdown1'

type Props = {
  className: string
}

type PendingAgency = {
  id: number
  agencyName: string
  ownerName: string
  city: string
  submittedDaysAgo: number
  priority: 'High' | 'Medium' | 'Low'
}


const pendingAgencies: PendingAgency[] = [
  {
    id: 1,
    agencyName: 'Urban Nest Realty',
    ownerName: 'Amit Shah',
    city: 'Surat',
    submittedDaysAgo: 2,
    priority: 'High',
  },
  {
    id: 2,
    agencyName: 'Skyline Estates',
    ownerName: 'Rajesh Patel',
    city: 'Ahmedabad',
    submittedDaysAgo: 4,
    priority: 'Medium',
  },
  {
    id: 3,
    agencyName: 'Prime Square Group',
    ownerName: 'Neha Mehta',
    city: 'Mumbai',
    submittedDaysAgo: 6,
    priority: 'Low',
  },
  {
    id: 4,
    agencyName: 'Elite Homes',
    ownerName: 'Vikram Desai',
    city: 'Vadodara',
    submittedDaysAgo: 1,
    priority: 'High',
  },
]

/* ======================
   PRIORITY COLOR
====================== */

const getPriorityColor = (priority: string) => {
  if (priority === 'High') return 'bg-danger'
  if (priority === 'Medium') return 'bg-warning'
  return 'bg-success'
}

const getBadgeColor = (priority: string) => {
  if (priority === 'High') return 'badge-light-danger'
  if (priority === 'Medium') return 'badge-light-warning'
  return 'badge-light-success'
}

/* ======================
   COMPONENT
====================== */

const ListsWidget3: React.FC<Props> = ({ className }) => {
  const [selectedIds, setSelectedIds] = useState<number[]>([])

  const toggleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  return (
    <div className={`card ${className}`}>
      {/* Header */}
      <div className='card-header border-0'>
        <h3 className='card-title fw-bold text-gray-900'>
          Pending Agency Approvals
        </h3>

        <div className='card-toolbar'>
          <button
            type='button'
            className='btn btn-sm btn-icon btn-color-primary btn-active-light-primary'
            data-kt-menu-trigger='click'
            data-kt-menu-placement='bottom-end'
          >
            <KTIcon iconName='category' className='fs-2' />
          </button>
          <Dropdown1 />
        </div>
      </div>

      {/* Body */}
      <div className='card-body pt-2'>
        {pendingAgencies.map((agency) => (
          <div key={agency.id} className='d-flex align-items-center mb-8'>

            {/* Priority Bullet */}
            <span
              className={`bullet bullet-vertical h-40px ${getPriorityColor(
                agency.priority
              )}`}
            ></span>

            {/* Checkbox */}
            <div className='form-check form-check-custom form-check-solid mx-5'>
              <input
                className='form-check-input'
                type='checkbox'
                checked={selectedIds.includes(agency.id)}
                onChange={() => toggleSelect(agency.id)}
              />
            </div>

            {/* Description */}
            <div className='flex-grow-1'>
              <span className='text-gray-800 fw-bold fs-6'>
                {agency.agencyName}
              </span>
              <span className='text-muted d-block'>
                Owner: {agency.ownerName} • {agency.city}
              </span>
              <span className='text-muted d-block fs-7'>
                Submitted {agency.submittedDaysAgo} days ago
              </span>
            </div>

            {/* Status Badge */}
            <span
              className={`badge ${getBadgeColor(agency.priority)} fs-8 fw-bold`}
            >
              Pending
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export { ListsWidget3 }