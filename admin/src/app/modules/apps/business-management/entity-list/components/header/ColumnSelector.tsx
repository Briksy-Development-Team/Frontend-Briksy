import { useState } from 'react'

type Props = {
    columns: any[]
    visibleColumns: string[]
    setVisibleColumns: React.Dispatch<React.SetStateAction<string[]>>
}

const ColumnSelector = ({ columns, visibleColumns, setVisibleColumns }: Props) => {

    const toggle = (accessor: string) => {
        setVisibleColumns((prev) => {
            if (prev.includes(accessor)) {
                if (prev.length === 1) return prev
                return prev.filter((c) => c !== accessor)
            }
            return [...prev, accessor]
        })
    }

    const allSelected = columns.every((col) => visibleColumns.includes(col.accessor))

    const toggleAll = () => {
        if (allSelected) {
            setVisibleColumns([columns[0].accessor])
        } else {
            setVisibleColumns(columns.map((col) => col.accessor))
        }
    }

    return (
        <div className="position-relative">

            <button
                type="button"
                className="btn btn-light-secondary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
            >
                <i className="ki-duotone ki-setting-4 fs-5 me-1" />
                Columns
                <span className="badge badge-secondary ms-2">
                    {visibleColumns.length}/{columns.length}
                </span>
            </button>

            <div
                className="menu menu-sub menu-sub-dropdown w-250px"
                data-kt-menu="true"
            >
                <div className="px-7 py-4 d-flex align-items-center justify-content-between">
                    <div className="fs-5 fw-bolder">Select Columns</div>
                    <span
                        className="text-muted fs-7 cursor-pointer text-hover-primary"
                        onClick={toggleAll}
                    >
                        {allSelected ? 'Deselect All' : 'Select All'}
                    </span>
                </div>

                <div className="separator border-gray-200" />

                <div
                    className="px-7 py-5"
                    style={{
                        maxHeight: '220px',
                        overflowY: 'auto',
                    }}
                >
                    {columns.map((col) => (
                        <label
                            key={col.accessor}
                            className="form-check mb-3 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                className="form-check-input"
                                checked={visibleColumns.includes(col.accessor)}
                                onChange={() => toggle(col.accessor)}
                            />
                            <span className="form-check-label">
                                {col.Header}
                            </span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { ColumnSelector }