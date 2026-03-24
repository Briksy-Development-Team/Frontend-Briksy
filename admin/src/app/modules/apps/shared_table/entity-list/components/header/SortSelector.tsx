// import React from 'react'
// import { KTIcon } from '../../../../../../../_metronic/helpers'

// type Props = {
//     onSortChange: (config: { key: string; direction: 'asc' | 'desc' }) => void
// }

// const SortSelector = ({ onSortChange }: Props) => {
//     return (
//         <div className="position-relative">
//             <button
//                 type="button"
//                 className="btn btn-light-primary d-flex align-items-center gap-2"
//                 data-kt-menu-trigger="click"
//                 data-kt-menu-placement="bottom-end"
//             >
//                 <KTIcon iconName="sort" className="fs-3" />
//                 Sort
//             </button>

//             <div
//                 className="menu menu-sub menu-sub-dropdown w-225px py-3"
//                 data-kt-menu="true"
//             >
//                 <div className="px-5 pb-2 fw-bold text-gray-700">
//                     Sort by ID
//                 </div>

//                 <div className="separator my-2"></div>

//                 <div className="menu-item px-3">
//                     <div
//                         className="menu-link d-flex justify-content-between align-items-center"
//                         onClick={() =>
//                             onSortChange({ key: 'id', direction: 'asc' })
//                         }
//                     >
//                         <span className="fw-semibold">Low → High</span>
//                         <KTIcon iconName="arrow-up" className="fs-4 text-gray-600" />
//                     </div>
//                 </div>

//                 <div className="menu-item px-3">
//                     <div
//                         className="menu-link d-flex justify-content-between align-items-center"
//                         onClick={() =>
//                             onSortChange({ key: 'id', direction: 'desc' })
//                         }
//                     >
//                         <span className="fw-semibold">High → Low</span>
//                         <KTIcon iconName="arrow-down" className="fs-4 text-gray-600" />
//                     </div>
//                 </div>
//             </div>
//         </div>
//     )
// }

// export default SortSelector