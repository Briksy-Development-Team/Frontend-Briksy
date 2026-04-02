import { Route, Routes, Outlet, Navigate, useParams } from 'react-router-dom'
import { PageLink } from '../../../_metronic/layout/core'
import { EntityList } from '../../modules/apps/shared_table/entity-list/EntityList'
import { PageHeader } from '../../modules/apps/shared_table/entity-list/components/header/PageHeader'
import { Content } from '../../../_metronic/layout/components/content'
import EntityDetail from '../../modules/apps/shared_table/entity-list/components/EntityDetail'

const Blank = "/media/avatars/blank.png"

type Agency = {
  id: number
  image: string
  name: string
  email: string
  status: string
  type: string
}

const agencies: Agency[] = [
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
]

const agencyColumns: any = [
  {
    Header: 'ID',
    accessor: 'id',
    alwaysVisible: true,
  },
  {

    Header: 'Image',
    accessor: 'image',
    Cell: ({ value }: { value: string }) => (
      <img
        src={value}
        style={{ width: 30, height: 30, borderRadius: '50%' }}
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

const detailFields = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'status', label: 'Status' },
  { key: 'type', label: 'Type' },
]

const AgencyDetail = () => {
  const { id } = useParams()
  const data = agencies.find((item) => item.id === Number(id))

  return (
    <Content>
      <PageHeader title="Agency Details" />

      <EntityDetail
        title="Agency Details"
        data={data || null}
        fields={detailFields}
      />
    </Content>
  )
}

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
                searchableKeys={['name', 'email']}
                enableRowClick
                getRowLink={(row: Agency) =>
                  `/apps/business-management/agencies/${row.id}`
                }
              />
            </Content>
          }
        />

        <Route path="agencies/:id" element={<AgencyDetail />} />

      </Route>

      <Route
        index
        element={<Navigate to="/apps/business-management/agencies" />}
      />
    </Routes>
  )
}

export default ServicePage