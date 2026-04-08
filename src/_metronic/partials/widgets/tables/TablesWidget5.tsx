import { FC, useState, useEffect } from "react"
import { KTIcon, toAbsoluteUrl } from "../../../helpers"
import { Dropdown4 } from "../../content/dropdown/Droupdown4"

type AgencyStatus = "Active" | "Suspended" | "Pending Approval" | "Expired"

interface AgencyOwner {
  id: number
  agencyName: string
  ownerName: string
  city: string
  totalProperties: number
  activeListings: number
  subscriptionPlan: "Basic" | "Pro" | "Enterprise"
  status: AgencyStatus
  logo: string
  createdAt: string
}

type Props = {
  className: string
}

const statusMap: Record<AgencyStatus, string> = {
  Active: "badge-light-success",
  Suspended: "badge-light-danger",
  "Pending Approval": "badge-light-warning",
  Expired: "badge-light-secondary",
}

const agencies: AgencyOwner[] = [
  {
    id: 1,
    agencyName: "Skyline Realty",
    ownerName: "Rajesh Patel",
    city: "Ahmedabad",
    totalProperties: 48,
    activeListings: 32,
    subscriptionPlan: "Pro",
    status: "Active",
    logo: "media/avatars/300-1.jpg",
    createdAt: "2026-02-01",
  },
  {
    id: 2,
    agencyName: "Urban Nest Properties",
    ownerName: "Amit Shah",
    city: "Surat",
    totalProperties: 25,
    activeListings: 18,
    subscriptionPlan: "Basic",
    status: "Pending Approval",
    logo: "media/avatars/300-2.jpg",
    createdAt: "2026-02-20",
  },
  {
    id: 3,
    agencyName: "Prime Estate Group",
    ownerName: "Neha Mehta",
    city: "Mumbai",
    totalProperties: 72,
    activeListings: 60,
    subscriptionPlan: "Enterprise",
    status: "Active",
    logo: "media/avatars/300-3.jpg",
    createdAt: "2026-03-01",
  },
  {
    id: 4,
    agencyName: "Golden Brick Realty",
    ownerName: "Suresh Iyer",
    city: "Chennai",
    totalProperties: 90,
    activeListings: 70,
    subscriptionPlan: "Enterprise",
    status: "Active",
    logo: "media/avatars/300-8.jpg",
    createdAt: "2026-03-03",
  }, {
    id: 5,
    agencyName: "Blue Horizon Estates",
    ownerName: "Karan Verma",
    city: "Delhi",
    totalProperties: 54,
    activeListings: 41,
    subscriptionPlan: "Pro",
    status: "Active",
    logo: "media/avatars/300-4.jpg",
    createdAt: "2026-01-15",
  },
  {
    id: 6,
    agencyName: "Green Valley Homes",
    ownerName: "Priya Nair",
    city: "Bangalore",
    totalProperties: 37,
    activeListings: 24,
    subscriptionPlan: "Basic",
    status: "Pending Approval",
    logo: "media/avatars/300-5.jpg",
    createdAt: "2026-02-05",
  },
  {
    id: 7,
    agencyName: "Royal Brick Realty",
    ownerName: "Arjun Kapoor",
    city: "Pune",
    totalProperties: 62,
    activeListings: 49,
    subscriptionPlan: "Enterprise",
    status: "Active",
    logo: "media/avatars/300-6.jpg",
    createdAt: "2026-01-28",
  },
  {
    id: 8,
    agencyName: "Elite Property Hub",
    ownerName: "Sneha Gupta",
    city: "Kolkata",
    totalProperties: 29,
    activeListings: 17,
    subscriptionPlan: "Basic",
    status: "Suspended",
    logo: "media/avatars/300-7.jpg",
    createdAt: "2026-02-12",
  },
  {
    id: 9,
    agencyName: "Sunrise Realty Group",
    ownerName: "Vikram Singh",
    city: "Jaipur",
    totalProperties: 46,
    activeListings: 33,
    subscriptionPlan: "Pro",
    status: "Active",
    logo: "media/avatars/300-9.jpg",
    createdAt: "2026-03-05",
  },
  {
    id: 10,
    agencyName: "Urban Square Properties",
    ownerName: "Ritika Sharma",
    city: "Hyderabad",
    totalProperties: 71,
    activeListings: 52,
    subscriptionPlan: "Enterprise",
    status: "Active",
    logo: "media/avatars/300-10.jpg",
    createdAt: "2026-02-18",
  },
  {
    id: 11,
    agencyName: "Modern Living Realty",
    ownerName: "Deepak Choudhary",
    city: "Lucknow",
    totalProperties: 34,
    activeListings: 21,
    subscriptionPlan: "Basic",
    status: "Expired",
    logo: "media/avatars/300-11.jpg",
    createdAt: "2026-01-22",
  },
  {
    id: 12,
    agencyName: "NextNest Real Estate",
    ownerName: "Aisha Khan",
    city: "Indore",
    totalProperties: 40,
    activeListings: 28,
    subscriptionPlan: "Pro",
    status: "Active",
    logo: "media/avatars/300-12.jpg",
    createdAt: "2026-02-25",
  },
  {
    id: 13,
    agencyName: "Prestige Property Partners",
    ownerName: "Rohan Desai",
    city: "Vadodara",
    totalProperties: 58,
    activeListings: 44,
    subscriptionPlan: "Enterprise",
    status: "Active",
    logo: "media/avatars/300-13.jpg",
    createdAt: "2026-03-07",
  },
  {
    id: 14,
    agencyName: "HomeScape Realty",
    ownerName: "Meera Joshi",
    city: "Nagpur",
    totalProperties: 23,
    activeListings: 14,
    subscriptionPlan: "Basic",
    status: "Pending Approval",
    logo: "media/avatars/300-14.jpg",
    createdAt: "2026-02-27",
  }
]

const TablesWidget5: FC<Props> = ({ className }) => {
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredAgencies = agencies.filter((agency) => {
    const created = new Date(agency.createdAt).getTime()

    if (!startDate && !endDate) return true

    const start = startDate ? new Date(startDate).getTime() : null
    const end = endDate ? new Date(endDate).getTime() : null

    if (start && created < start) return false
    if (end && created > end) return false

    return true
  })

  const totalPages = Math.ceil(filteredAgencies.length / itemsPerPage)

  const paginatedAgencies = filteredAgencies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    setCurrentPage(1)
  }, [startDate, endDate])

  return (
    <div className={`card ${className}`}>
      {/* HEADER */}
      <div className="card-header border-0 pt-5">
        <h3 className="card-title flex-column">
          <span className="card-label fw-bold fs-3 mb-1">Agency Owners</span>
          <span className="text-muted mt-1 fw-semibold fs-7">
            Filter by registration date
          </span>
        </h3>

        <div className="card-toolbar">
          <button
            type="button"
            className="btn btn-sm btn-icon btn-color-primary btn-active-light-primary"
            data-kt-menu-trigger="click"
            data-kt-menu-placement="bottom-end"
          >
            <KTIcon iconName="category" className="fs-2" />
          </button>

          <Dropdown4 setStartDate={setStartDate} setEndDate={setEndDate} />
        </div>
      </div>

      {/* BODY */}
      <div className="card-body py-3">
        <div className="table-responsive">
          <table className="table table-row-dashed table-row-gray-200 align-middle gs-0 gy-4">
            <tbody>
              {paginatedAgencies.length === 0 ? (
                <tr>
                  <td className="text-center text-muted py-10">
                    No agencies found
                  </td>
                </tr>
              ) : (
                paginatedAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td>
                      <div className="symbol symbol-45px me-2">
                        <span className="symbol-label">
                          <img
                            src={toAbsoluteUrl(agency.logo)}
                            className="h-50"
                            alt=""
                          />
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="text-gray-900 fw-bold fs-6">
                        {agency.agencyName}
                      </span>

                      <span className="text-muted fw-semibold d-block">
                        {agency.ownerName} • {agency.city}
                      </span>
                    </td>

                    <td className="text-end text-muted fw-semibold">
                      {agency.activeListings}/{agency.totalProperties} Active
                      <br />
                      {agency.subscriptionPlan} Plan
                    </td>

                    <td className="text-end">
                      <span className={`badge ${statusMap[agency.status]}`}>
                        {agency.status}
                      </span>
                    </td>

                    <td className="text-end">
                      <button className="btn btn-sm btn-icon btn-bg-light btn-active-color-primary">
                        <KTIcon iconName="arrow-right" className="fs-2" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="d-flex justify-content-between align-items-center mt-5">

          <button
            className="btn btn-sm btn-light"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((p) => p - 1)}
          >
            Previous
          </button>

          <div>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-primary" : "btn-light"
                  }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>

          <button
            className="btn btn-sm btn-light"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((p) => p + 1)}
          >
            Next
          </button>

        </div>
      </div>
    </div>
  )
}

export { TablesWidget5 }