import { useState } from "react"

type Props = {
  setStartDate: (date: string) => void
  setEndDate: (date: string) => void
}

export function Dropdown4({ setStartDate, setEndDate }: Props) {

  const [activeTab, setActiveTab] = useState("days")

  const [day, setDay] = useState("")
  const [week, setWeek] = useState("")
  const [month, setMonth] = useState("")
  const [year, setYear] = useState("")
  const [customStart, setCustomStart] = useState("")
  const [customEnd, setCustomEnd] = useState("")

  const resetInputs = () => {
    setDay("")
    setWeek("")
    setMonth("")
    setYear("")
    setCustomStart("")
    setCustomEnd("")
  }

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    resetInputs()
  }

  const applyFilter = () => {

    if (activeTab === "days" && day) {
      setStartDate(day)
      setEndDate(day)
      return
    }

    if (activeTab === "weeks" && week) {
      const [y, w] = week.split("-W")

      const start = new Date(Number(y), 0, 1 + (Number(w) - 1) * 7)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)

      setStartDate(start.toISOString().slice(0, 10))
      setEndDate(end.toISOString().slice(0, 10))
      return
    }

    if (activeTab === "months" && month) {
      const start = new Date(month + "-01")
      const end = new Date(start)
      end.setMonth(end.getMonth() + 1)
      end.setDate(0)

      setStartDate(start.toISOString().slice(0, 10))
      setEndDate(end.toISOString().slice(0, 10))
      return
    }

    if (activeTab === "years" && year) {
      setStartDate(`${year}-01-01`)
      setEndDate(`${year}-12-31`)
      return
    }

    if (activeTab === "custom") {
      setStartDate(customStart)
      setEndDate(customEnd)
    }
  }

  const resetFilter = () => {
    resetInputs()
    setStartDate("")
    setEndDate("")
  }

  return (
    <div className="menu menu-sub menu-sub-dropdown w-300px" data-kt-menu="true">

      <div className="px-7 py-5">
        <div className="fs-5 text-gray-900 fw-bolder">Date Filter</div>
      </div>

      <div className="separator border-gray-200"></div>

      <div className="px-7 py-5">

        {/* Tabs */}
        <ul className="nav nav-tabs nav-line-tabs mb-5 fs-6">

          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "days" ? "active" : ""}`}
              onClick={() => handleTabChange("days")}
            >
              Days
            </a>
          </li>

          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "weeks" ? "active" : ""}`}
              onClick={() => handleTabChange("weeks")}
            >
              Weeks
            </a>
          </li>

          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "months" ? "active" : ""}`}
              onClick={() => handleTabChange("months")}
            >
              Months
            </a>
          </li>

          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "years" ? "active" : ""}`}
              onClick={() => handleTabChange("years")}
            >
              Years
            </a>
          </li>

          <li className="nav-item">
            <a
              className={`nav-link ${activeTab === "custom" ? "active" : ""}`}
              onClick={() => handleTabChange("custom")}
            >
              Custom
            </a>
          </li>

        </ul>

        {/* Content */}

        {activeTab === "days" && (
          <>
            <label className="form-label fw-bold">Select Day</label>
            <input
              type="date"
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="form-control form-control-solid"
            />
          </>
        )}

        {activeTab === "weeks" && (
          <>
            <label className="form-label fw-bold">Select Week</label>
            <input
              type="week"
              value={week}
              onChange={(e) => setWeek(e.target.value)}
              className="form-control form-control-solid"
            />
          </>
        )}

        {activeTab === "months" && (
          <>
            <label className="form-label fw-bold">Select Month</label>
            <input
              type="month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="form-control form-control-solid"
            />
          </>
        )}

        {activeTab === "years" && (
          <>
            <label className="form-label fw-bold">Select Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2026"
              className="form-control form-control-solid"
            />
          </>
        )}

        {activeTab === "custom" && (
          <>
            <label className="form-label fw-bold">Start Date</label>
            <input
              type="date"
              value={customStart}
              onChange={(e) => setCustomStart(e.target.value)}
              className="form-control form-control-solid mb-3"
            />

            <label className="form-label fw-bold">End Date</label>
            <input
              type="date"
              value={customEnd}
              onChange={(e) => setCustomEnd(e.target.value)}
              className="form-control form-control-solid"
            />
          </>
        )}

        <div className="d-flex justify-content-end mt-5">

          <button
            type="reset"
            className="btn btn-sm btn-light btn-active-light-primary me-2"
            onClick={resetFilter}
            data-kt-menu-dismiss="true"
          >
            Reset
          </button>

          <button
            type="submit"
            className="btn btn-sm btn-primary"
            onClick={applyFilter}
            data-kt-menu-dismiss="true"
          >
            Apply
          </button>

        </div>

      </div>
    </div>
  )
}