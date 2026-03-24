import { KTIcon } from '../../../../../../../_metronic/helpers'

type Props<T extends Record<string, any>> = {
    columns: {
        accessor: keyof T
        Header: string
        alwaysVisible?: boolean
    }[]
    visibleColumns: (keyof T)[]
    setVisibleColumns: React.Dispatch<
        React.SetStateAction<(keyof T)[]>
    >
}

const ColumnSelector = <T extends Record<string, any>>({
    columns,
    visibleColumns,
    setVisibleColumns,
}: Props<T>) => {

    const toggle = (accessor: keyof T) => {
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
                className="btn btn-light-primary d-flex align-items-center gap-2"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
            >
                <KTIcon iconName="setting-3" className="fs-3" />
                Columns
            </button>

            <div
                className="menu menu-sub menu-sub-dropdown w-275px"
                data-kt-menu="true"
            >
                <div className="px-5 py-4">
                    <div className="fw-bold text-gray-800 fs-6">
                        Select Columns
                    </div>
                </div>

                <div className="separator mx-3"></div>

                <div className="px-5 py-4 mh-250px overflow-auto">
                    {columns.map((col) => (
                        <label
                            key={String(col.accessor)}
                            className="form-check form-check-sm form-check-custom form-check-solid d-flex align-items-center justify-content-between mb-3"
                        >
                            <div className="d-flex align-items-center gap-2">
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    checked={
                                        col.alwaysVisible ||
                                        visibleColumns.includes(col.accessor)
                                    }
                                    disabled={col.alwaysVisible}
                                    onChange={() => toggle(col.accessor)}
                                />

                                <span className="form-check-label text-gray-800 fw-semibold">
                                    {col.Header}
                                </span>
                            </div>

                            {col.alwaysVisible && (
                                <span className="badge badge-light-danger">
                                    Required
                                </span>
                            )}
                        </label>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { ColumnSelector }