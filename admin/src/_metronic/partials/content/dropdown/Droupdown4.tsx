export function Dropdown4() {
  return (
    <div
      className='menu menu-sub menu-sub-dropdown w-300px'
      data-kt-menu='true'
    >
      <div className='px-7 py-5'>
        <div className='fs-5 text-gray-900 fw-bolder'>Date Filter</div>
      </div>

      <div className='separator border-gray-200'></div>

      <div className='px-7 py-5'>

        {/* Tabs */}
        <ul className='nav nav-tabs nav-line-tabs mb-5 fs-6'>
          <li className='nav-item'>
            <a
              className='nav-link active'
              data-bs-toggle='tab'
              href='#kt_filter_days'
            >
              Days
            </a>
          </li>

          <li className='nav-item'>
            <a
              className='nav-link'
              data-bs-toggle='tab'
              href='#kt_filter_weeks'
            >
              Weeks
            </a>
          </li>

          <li className='nav-item'>
            <a
              className='nav-link'
              data-bs-toggle='tab'
              href='#kt_filter_months'
            >
              Months
            </a>
          </li>

          <li className='nav-item'>
            <a
              className='nav-link'
              data-bs-toggle='tab'
              href='#kt_filter_years'
            >
              Years
            </a>
          </li>

          <li className='nav-item'>
            <a
              className='nav-link'
              data-bs-toggle='tab'
              href='#kt_filter_custom'
            >
              Custom
            </a>
          </li>
        </ul>

        {/* Tab Content */}
        <div className='tab-content'>

          {/* DAYS */}
          <div className='tab-pane fade show active' id='kt_filter_days'>
            <label className='form-label fw-bold'>Select Day</label>
            <input
              type='date'
              className='form-control form-control-solid'
            />
          </div>

          {/* WEEKS */}
          <div className='tab-pane fade' id='kt_filter_weeks'>
            <label className='form-label fw-bold'>Select Week</label>
            <input
              type='week'
              className='form-control form-control-solid'
            />
          </div>

          {/* MONTHS */}
          <div className='tab-pane fade' id='kt_filter_months'>
            <label className='form-label fw-bold'>Select Month</label>
            <input
              type='month'
              className='form-control form-control-solid'
            />
          </div>

          {/* YEARS */}
          <div className='tab-pane fade' id='kt_filter_years'>
            <label className='form-label fw-bold'>Select Year</label>
            <input
              type='number'
              placeholder='2026'
              className='form-control form-control-solid'
            />
          </div>

          {/* CUSTOM RANGE */}
          <div className='tab-pane fade' id='kt_filter_custom'>
            <label className='form-label fw-bold'>Start Date</label>
            <input
              type='date'
              className='form-control form-control-solid mb-3'
            />

            <label className='form-label fw-bold'>End Date</label>
            <input
              type='date'
              className='form-control form-control-solid'
            />
          </div>

        </div>

        {/* Buttons */}
        <div className='d-flex justify-content-end mt-5'>
          <button
            type='reset'
            className='btn btn-sm btn-light btn-active-light-primary me-2'
            data-kt-menu-dismiss='true'
          >
            Reset
          </button>

          <button
            type='submit'
            className='btn btn-sm btn-primary'
            data-kt-menu-dismiss='true'
          >
            Apply
          </button>
        </div>

      </div>
    </div>
  )
}