
import { FC } from 'react'
import { KTIcon } from '../../../helpers'

type Props = {
  className: string
}

const monthData = [
  {
    icon: 'scroll',
    bg: 'bg-light-danger',
    color: 'text-danger',
    title: 'School Music Festival',
    author: 'by Rose Liam',
    date: '4:20PM, 03 Sep',
  },
  {
    icon: 'category',
    bg: 'bg-light-warning',
    color: 'text-warning',
    title: 'Maths Championship',
    author: 'By Tom Gere',
    date: '10:05PM, 25 Oct',
  },
  {
    icon: 'compass',
    bg: 'bg-light-info',
    color: 'text-info',
    title: 'Who Knows Geography',
    author: 'By Zoey Dylan',
    date: '3:22PM, 07 Sep',
  },
  {
    icon: 'abstract-26',
    bg: 'bg-light-primary',
    color: 'text-primary',
    title: 'Napoleon Days',
    author: 'By Luke Owen',
    date: '1:20PM, 02 Dec',
  },
  {
    icon: 'bucket',
    bg: 'bg-light-success',
    color: 'text-success',
    title: 'The School Art Leads',
    author: 'By Ellie Cole',
    date: '6:20PM, 07 Sep',
  },
]

const weekData = [
  {
    icon: 'compass',
    bg: 'bg-light-info',
    color: 'text-info',
    title: 'Who Knows Geography',
    author: 'By Zoey Dylan',
    date: '3:22PM, 07 Sep',
  },
  {
    icon: 'category',
    bg: 'bg-light-warning',
    color: 'text-warning',
    title: 'Maths Championship',
    author: 'By Tom Gere',
    date: '10:05PM, 25 Oct',
  },
  {
    icon: 'scroll',
    bg: 'bg-light-danger',
    color: 'text-danger',
    title: 'School Music Festival',
    author: 'by Rose Liam',
    date: '4:20PM, 03 Sep',
  },
]

const dayData = [
  {
    icon: 'category',
    bg: 'bg-light-warning',
    color: 'text-warning',
    title: 'Maths Championship',
    author: 'By Tom Gere',
    date: '10:05PM, 25 Oct',
  },
  {
    icon: 'compass',
    bg: 'bg-light-info',
    color: 'text-info',
    title: 'Who Knows Geography',
    author: 'By Zoey Dylan',
    date: '3:22PM, 07 Sep',
  },
  {
    icon: 'abstract-26',
    bg: 'bg-light-primary',
    color: 'text-primary',
    title: 'Napoleon Days',
    author: 'By Luke Owen',
    date: '1:20PM, 02 Dec',
  },
  {
    icon: 'scroll',
    bg: 'bg-light-danger',
    color: 'text-danger',
    title: 'School Music Festival',
    author: 'by Rose Liam',
    date: '4:20PM, 03 Sep',
  },
]
const TablesWidget8: FC<Props> = ({ className }) => {
  return (
    <div className={`card ${className}`}>
      {/* begin::Header */}
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bold fs-3 mb-1'>Latest Products</span>
          <span className='text-muted mt-1 fw-semibold fs-7'>More than 100 new orders</span>
        </h3>
        <div className='card-toolbar'>
          <ul className='nav'>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary active fw-bold px-4 me-1'
                data-bs-toggle='tab'
                href='#kt_table_widget_8_tab_1'
              >
                Month
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4 me-1'
                data-bs-toggle='tab'
                href='#kt_table_widget_8_tab_2'
              >
                Week
              </a>
            </li>
            <li className='nav-item'>
              <a
                className='nav-link btn btn-sm btn-color-muted btn-active btn-active-light-primary fw-bold px-4'
                data-bs-toggle='tab'
                href='#kt_table_widget_8_tab_3'
              >
                Day
              </a>
            </li>
          </ul>
        </div>
      </div>
      {/* end::Header */}
      {/* begin::Body */}
      <div className='card-body py-3'>
        <div className='tab-content'>
          {/* begin::Tap pane */}
          <div className='tab-pane fade show active' id='kt_table_widget_8_tab_1'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-3'>
                {/* begin::Table head */}
                <thead>
                  <tr>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-120px'></th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {dayData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className='symbol symbol-50px me-2'>
                          <span className={`symbol-label ${item.bg}`}>
                            <KTIcon
                              iconName={item.icon}
                              className={`fs-2x ${item.color}`}
                            />
                          </span>
                        </div>
                      </td>

                      <td>
                        <a
                          href='#'
                          className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'
                        >
                          {item.title}
                        </a>

                        <span className='text-muted fw-semibold d-block fs-7'>
                          {item.author}
                        </span>
                      </td>

                      <td className='text-end'>
                        <span className='text-gray-900 fw-bold d-block fs-7'>
                          {item.date}
                        </span>

                        <span className='text-muted fw-semibold d-block fs-8'>
                          Date
                        </span>
                      </td>

                      <td className='text-end'>
                        <a
                          href='#'
                          className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        >
                          <i className='bi bi-three-dots fs-5'></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
          {/* begin::Tap pane */}
          <div className='tab-pane fade' id='kt_table_widget_8_tab_2'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-3'>
                {/* begin::Table head */}
                <thead>
                  <tr>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-120px'></th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {monthData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className='symbol symbol-50px me-2'>
                          <span className={`symbol-label ${item.bg}`}>
                            <KTIcon
                              iconName={item.icon}
                              className={`fs-2x ${item.color}`}
                            />
                          </span>
                        </div>
                      </td>

                      <td>
                        <a
                          href='#'
                          className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'
                        >
                          {item.title}
                        </a>

                        <span className='text-muted fw-semibold d-block fs-7'>
                          {item.author}
                        </span>
                      </td>

                      <td className='text-end'>
                        <span className='text-gray-900 fw-bold d-block fs-7'>
                          {item.date}
                        </span>

                        <span className='text-muted fw-semibold d-block fs-8'>
                          Date
                        </span>
                      </td>

                      <td className='text-end'>
                        <a
                          href='#'
                          className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        >
                          <i className='bi bi-three-dots fs-5'></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
          {/* begin::Tap pane */}
          <div className='tab-pane fade' id='kt_table_widget_8_tab_3'>
            {/* begin::Table container */}
            <div className='table-responsive'>
              {/* begin::Table */}
              <table className='table align-middle gs-0 gy-3'>
                {/* begin::Table head */}
                <thead>
                  <tr>
                    <th className='p-0 w-50px'></th>
                    <th className='p-0 min-w-150px'></th>
                    <th className='p-0 min-w-120px'></th>
                  </tr>
                </thead>
                {/* end::Table head */}
                {/* begin::Table body */}
                <tbody>
                  {weekData.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <div className='symbol symbol-50px me-2'>
                          <span className={`symbol-label ${item.bg}`}>
                            <KTIcon
                              iconName={item.icon}
                              className={`fs-2x ${item.color}`}
                            />
                          </span>
                        </div>
                      </td>

                      <td>
                        <a
                          href='#'
                          className='text-gray-900 fw-bold text-hover-primary mb-1 fs-6'
                        >
                          {item.title}
                        </a>

                        <span className='text-muted fw-semibold d-block fs-7'>
                          {item.author}
                        </span>
                      </td>

                      <td className='text-end'>
                        <span className='text-gray-900 fw-bold d-block fs-7'>
                          {item.date}
                        </span>

                        <span className='text-muted fw-semibold d-block fs-8'>
                          Date
                        </span>
                      </td>

                      <td className='text-end'>
                        <a
                          href='#'
                          className='btn btn-sm btn-icon btn-bg-light btn-active-color-primary'
                        >
                          <i className='bi bi-three-dots fs-5'></i>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
                {/* end::Table body */}
              </table>
            </div>
            {/* end::Table */}
          </div>
          {/* end::Tap pane */}
        </div>
      </div>
      {/* end::Body */}
    </div>
  )
}

export { TablesWidget8 }
