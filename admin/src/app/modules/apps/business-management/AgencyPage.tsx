import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../../_metronic/layout/core'
import { EntityList } from './entity-list/EntityList'
import UserDetail from './entity-list/components/UserDetail'

const agencies = [
  { id: 1, name: 'ABC Realty', email: 'abc@realty.com', status: 'Active', type: 'Agency' },
  { id: 2, name: 'Skyline Estates', email: 'skyline@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 3, name: 'Prime Properties', email: 'prime@realty.com', status: 'Active', type: 'Agency' },
  { id: 4, name: 'Urban Nest', email: 'urban@realty.com', status: 'Active', type: 'Agency' },
  { id: 5, name: 'Golden Key Realty', email: 'golden@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 6, name: 'Blue Brick Homes', email: 'bluebrick@realty.com', status: 'Active', type: 'Agency' },
  { id: 7, name: 'Elite Spaces', email: 'elite@realty.com', status: 'Active', type: 'Agency' },
  { id: 8, name: 'Dream Dwellings', email: 'dream@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 9, name: 'Metro Living', email: 'metro@realty.com', status: 'Active', type: 'Agency' },
  { id: 10, name: 'NextGen Realty', email: 'nextgen@realty.com', status: 'Active', type: 'Agency' },

  { id: 11, name: 'HomeScape Realty', email: 'homescape@realty.com', status: 'Active', type: 'Agency' },
  { id: 12, name: 'Nest Finders', email: 'nest@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 13, name: 'CityRoots Realty', email: 'cityroots@realty.com', status: 'Active', type: 'Agency' },
  { id: 14, name: 'KeyStone Properties', email: 'keystone@realty.com', status: 'Active', type: 'Agency' },
  { id: 15, name: 'GreenField Realty', email: 'greenfield@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 16, name: 'UrbanEdge Homes', email: 'urbanedge@realty.com', status: 'Active', type: 'Agency' },
  { id: 17, name: 'Vista Realty', email: 'vista@realty.com', status: 'Active', type: 'Agency' },
  { id: 18, name: 'Horizon Estates', email: 'horizon@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 19, name: 'BrickLane Realty', email: 'bricklane@realty.com', status: 'Active', type: 'Agency' },
  { id: 20, name: 'Royal Keys', email: 'royalkeys@realty.com', status: 'Active', type: 'Agency' },

  { id: 21, name: 'Elite Nest Realty', email: 'elitenest@realty.com', status: 'Active', type: 'Agency' },
  { id: 22, name: 'Sunrise Homes', email: 'sunrise@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 23, name: 'TrueSpace Realty', email: 'truespace@realty.com', status: 'Active', type: 'Agency' },
  { id: 24, name: 'SkyHigh Estates', email: 'skyhigh@realty.com', status: 'Active', type: 'Agency' },
  { id: 25, name: 'PrimeNest Realty', email: 'primenest@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 26, name: 'UrbanKey Realty', email: 'urbankey@realty.com', status: 'Active', type: 'Agency' },
  { id: 27, name: 'HomeHive Realty', email: 'homehive@realty.com', status: 'Active', type: 'Agency' },
  { id: 28, name: 'CityNest Realty', email: 'citynest@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 29, name: 'NextDoor Realty', email: 'nextdoor@realty.com', status: 'Active', type: 'Agency' },
  { id: 30, name: 'EliteKey Estates', email: 'elitekey@realty.com', status: 'Active', type: 'Agency' },
]

const agencyColumns = [
  { Header: 'Name', accessor: 'name' },
  { Header: 'Email', accessor: 'email' },
  { Header: 'Status', accessor: 'status' },
]

const agencyFilters = [
  {
    key: 'status',
    label: 'Status',
    options: ['Active', 'Blocked'],
  },
  {
    key: 'type',
    label: 'Type',
    options: ['Agency', 'Sole Trader'],
  },
]

const breadcrumbs: Array<PageLink> = [
  {
    title: 'Business Management',
    path: '/apps/business-management/agencies',
    isSeparator: false,
    isActive: false,
  },
  { title: '', path: '', isSeparator: true, isActive: false },
]

const AgencyPage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>

        <Route
          path="agencies"
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>Agencies</PageTitle>

              <EntityList
                data={agencies}
                columns={agencyColumns}
                filtersConfig={agencyFilters}
                enableRowClick
                getRowLink={(row) =>
                  `/apps/business-management/agencies/${row.id}`
                }
              />
            </>
          }
        />

        <Route
          path="agencies/:id"
          element={
            <>
              <PageTitle breadcrumbs={breadcrumbs}>
                Agency Detail
              </PageTitle>
              <UserDetail />
            </>
          }
        />

      </Route>

      <Route
        index
        element={<Navigate to="/apps/business-management/agencies" />}
      />
    </Routes>
  )
}

export default AgencyPage