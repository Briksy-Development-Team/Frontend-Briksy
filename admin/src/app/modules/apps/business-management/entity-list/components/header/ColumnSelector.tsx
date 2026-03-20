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

    return (
        <div className="position-relative">

            <button
                type="button"
                className="btn btn-light-secondary"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
            >
                Columns
            </button>

            <div
                className="menu menu-sub menu-sub-dropdown w-250px"
                data-kt-menu="true"
            >
                <div className="px-7 py-5">
                    <div className="fs-5 fw-bolder">Select Columns</div>
                </div>

                <div className="separator border-gray-200"></div>

                <div className="px-7 py-5">
                    {columns.map((col) => (
                        <label key={col.accessor} className="form-check mb-3">
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