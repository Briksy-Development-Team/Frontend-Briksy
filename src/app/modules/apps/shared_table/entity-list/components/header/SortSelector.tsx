import React from 'react'
import { KTIcon } from '../../../../../../../_metronic/helpers'

type ColumnKey = string

type Props = {
    columns: { accessor: ColumnKey; Header: string }[]
    onSortChange: (config: { key: ColumnKey; direction: 'asc' | 'desc' }) => void
}

const SortSelector = ({
    columns,
    onSortChange,
}: Props) => {
    return (
        <div className="position-relative">
            <button
                type="button"
                className="btn btn-light-primary d-flex align-items-center gap-2"
                data-kt-menu-trigger="click"
                data-kt-menu-placement="bottom-end"
            >
                <KTIcon iconName="sort" className="fs-3" />
                Sort
            </button>

            <div
                className="menu menu-sub menu-sub-dropdown w-275px py-3"
                data-kt-menu="true"
                style={{
                    maxHeight: '260px',
                    overflowY: 'auto',
                }}
            >
                <div className="px-5 pb-2 fw-bold text-gray-700">
                    Sort Options
                </div>

                <div className="separator my-2"></div>

                {columns.map((col, index) => (
                    <div key={String(col.accessor)}>
                        <div className="px-5 pt-2 pb-1 fw-semibold text-gray-600">
                            {col.Header}
                        </div>

                        <div className="menu-item px-3">
                            <div
                                className="menu-link d-flex justify-content-between align-items-center"
                                onClick={() =>
                                    onSortChange({
                                        key: col.accessor,
                                        direction: 'asc',
                                    })
                                }
                            >
                                <span>Low → High</span>
                                <KTIcon iconName="arrow-up" className="fs-4 text-gray-600" />
                            </div>
                        </div>

                        <div className="menu-item px-3">
                            <div
                                className="menu-link d-flex justify-content-between align-items-center"
                                onClick={() =>
                                    onSortChange({
                                        key: col.accessor,
                                        direction: 'desc',
                                    })
                                }
                            >
                                <span>High → Low</span>
                                <KTIcon iconName="arrow-down" className="fs-4 text-gray-600" />
                            </div>
                        </div>

                        {index !== columns.length - 1 && (
                            <div className="separator my-2"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default SortSelector
