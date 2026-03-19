import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { EntityList } from '../../modules/apps/business-management/entity-list/EntityList'
import UserDetail from '../../modules/apps/business-management/entity-list/components/EntityDetail'
import { PageHeader } from '../../modules/apps/business-management/entity-list/components/header/PageHeader'
import { Content } from '../../../_metronic/layout/components/content'
const Blank = "/media/avatars/blank.png"
const agencies = [
  { id: 1, image: Blank, name: 'ABC Realty', email: 'abc@realty.com', status: 'Active', type: 'Agency' },
  { id: 2, image: Blank, name: 'Skyline Estates', email: 'skyline@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 3, image: Blank, name: 'Prime Properties', email: 'prime@realty.com', status: 'Active', type: 'Agency' },
  { id: 4, image: Blank, name: 'Urban Nest', email: 'urban@realty.com', status: 'Active', type: 'Agency' },
  { id: 5, image: Blank, name: 'Golden Key Realty', email: 'golden@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 6, image: Blank, name: 'Blue Brick Homes', email: 'bluebrick@realty.com', status: 'Active', type: 'Agency' },
  { id: 7, image: Blank, name: 'Elite Spaces', email: 'elite@realty.com', status: 'Active', type: 'Agency' },
  { id: 8, image: Blank, name: 'Dream Dwellings', email: 'dream@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 9, image: Blank, name: 'Metro Living', email: 'metro@realty.com', status: 'Active', type: 'Agency' },
  { id: 10, image: Blank, name: 'NextGen Realty', email: 'nextgen@realty.com', status: 'Active', type: 'Agency' },

  { id: 11, image: Blank, name: 'HomeScape Realty', email: 'homescape@realty.com', status: 'Active', type: 'Agency' },
  { id: 12, image: Blank, name: 'Nest Finders', email: 'nest@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 13, image: Blank, name: 'CityRoots Realty', email: 'cityroots@realty.com', status: 'Active', type: 'Agency' },
  { id: 14, image: Blank, name: 'KeyStone Properties', email: 'keystone@realty.com', status: 'Active', type: 'Agency' },
  { id: 15, image: Blank, name: 'GreenField Realty', email: 'greenfield@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 16, image: Blank, name: 'UrbanEdge Homes', email: 'urbanedge@realty.com', status: 'Active', type: 'Agency' },
  { id: 17, image: Blank, name: 'Vista Realty', email: 'vista@realty.com', status: 'Active', type: 'Agency' },
  { id: 18, image: Blank, name: 'Horizon Estates', email: 'horizon@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 19, image: Blank, name: 'BrickLane Realty', email: 'bricklane@realty.com', status: 'Active', type: 'Agency' },
  { id: 20, image: Blank, name: 'Royal Keys', email: 'royalkeys@realty.com', status: 'Active', type: 'Agency' },

  { id: 21, image: Blank, name: 'Elite Nest Realty', email: 'elitenest@realty.com', status: 'Active', type: 'Agency' },
  { id: 22, image: Blank, name: 'Sunrise Homes', email: 'sunrise@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 23, image: Blank, name: 'TrueSpace Realty', email: 'truespace@realty.com', status: 'Active', type: 'Agency' },
  { id: 24, image: Blank, name: 'SkyHigh Estates', email: 'skyhigh@realty.com', status: 'Active', type: 'Agency' },
  { id: 25, image: Blank, name: 'PrimeNest Realty', email: 'primenest@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 26, image: Blank, name: 'UrbanKey Realty', email: 'urbankey@realty.com', status: 'Active', type: 'Agency' },
  { id: 27, image: Blank, name: 'HomeHive Realty', email: 'homehive@realty.com', status: 'Active', type: 'Agency' },
  { id: 28, image: Blank, name: 'CityNest Realty', email: 'citynest@realty.com', status: 'Blocked', type: 'Agency' },
  { id: 29, image: Blank, name: 'NextDoor Realty', email: 'nextdoor@realty.com', status: 'Active', type: 'Agency' },
  { id: 30, image: Blank, name: 'EliteKey Estates', email: 'elitekey@realty.com', status: 'Active', type: 'Agency' },
]

const agencyColumns = [
  {
    Header: 'Image',
    accessor: 'image',
    Cell: ({ value }: any) => (
      <img
        src={value}
        alt="avatar"
        style={{
          width: 40,
          height: 40,
          borderRadius: '50%',
          objectFit: 'cover',
        }}
      />
    ),
  },
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
    title: 'Service Provider',
    path: '/apps/business-management/agencies',
    isSeparator: false,
    isActive: false,
  },
  { title: '', path: '', isSeparator: true, isActive: false },
]

const ServicePage = () => {
  return (
    <Routes>
      <Route element={<Outlet />}>

        <Route
          path="agencies"
          element={
            <Content>
              <PageHeader
                title="Agencies"
                subtitle="Manage all agencies on the platform"
              />

              <EntityList
                data={agencies}
                columns={agencyColumns}
                filtersConfig={agencyFilters}
                enableRowClick
                getRowLink={(row) =>
                  `/apps/business-management/agencies/${row.id}`
                }
              />
            </Content>
          }
        />

        <Route
          path="agencies/:id"
          element={
            <>
              <PageHeader
                title="Agencies"
              />
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

export default ServicePage