import { useEffect, useState } from 'react'  
import axios from 'axios' 
import { Route, Routes, Outlet, Navigate, useParams } from 'react-router-dom' 
import { Column, EntityList } from '../../modules/apps/shared_table/entity-list/EntityList' 
import { PageHeader } from '../../modules/apps/shared_table/entity-list/components/header/PageHeader' 
import { Content } from '../../../_metronic/layout/components/content' 
import EntityDetail from '../../modules/apps/shared_table/entity-list/components/EntityDetail' 
import { useRoleAccess } from '../../modules/auth' 
import { ReadOnlyNotice } from '../../components/ReadOnlyNotice' 
 
type Agency = { 
  id: string 
  image: string 
  name: string 
  email: string | null 
  status: string 
  type?: string 
  abn?: string | null 
  acn?: string | null 
  licensed_staff_seats?: number 
} 
 
const agencyColumns: Column<Agency>[] = [ 
  { Header: 'ID', accessor: 'id', alwaysVisible: true }, 
  { 
    Header: 'Image', 
    accessor: 'image', 
    Cell: (value) => ( 
      <img src={String(value ?? '/media/avatars/blank.png')} style={{ width: 30, height: 30, borderRadius: '50%' }} /> 
    ), 
  }, 
  { Header: 'Name', accessor: 'name' }, 
  { Header: 'Email', accessor: 'email' }, 
  { Header: 'Status', accessor: 'status' }, 
] 
 
const agencyFilters = [ 
  { key: 'status', label: 'Status', options: ['Active', 'Blocked'] }, 
  { key: 'type', label: 'Type', options: ['Agency', 'Sole Trader'] }, 
] 
 
const detailFields = [ 
  { key: 'id', label: 'ID' }, 
  { key: 'name', label: 'Name' }, 
  { key: 'email', label: 'Email' }, 
  { key: 'status', label: 'Status' }, 
  { key: 'type', label: 'Type' }, 
  { key: 'abn', label: 'ABN' }, 
  { key: 'acn', label: 'ACN' }, 
  { key: 'licensed_staff_seats', label: 'Licensed Staff Seats' }, 
] 
 
const apiUrl = import.meta.env.VITE_APP_API_URL ?? 'http://127.0.0.1:8000/api/admin'
 
const AgencyDetail = () => { 
  const { id } = useParams() 
  const { isAdminStaff } = useRoleAccess() 
  const [data, setData] = useState<Agency | null>(null) 
  const [loading, setLoading] = useState(true) 
 
  useEffect(() => { 
    const fetchAgency = async () => { 
      try { 
        const response = await axios.get(`${apiUrl}/businesses/${id}`) 
        setData(response.data.data) 
      } catch (error) { 
        console.error('Failed to fetch organization details', error) 
        setData(null) 
      } finally { 
        setLoading(false) 
      } 
    } 
 
    void fetchAgency() 
  }, [id]) 
 
  return ( 
    <Content> 
      <PageHeader title='Agency Details' /> 
      {isAdminStaff && ( 
        <ReadOnlyNotice message='Admin staff has read-only access to service provider details.' /> 
      )} 
      <EntityDetail title='Agency Details' data={data} fields={detailFields} loading={loading} /> 
    </Content> 
  ) 
} 
 
const ServiceProvidersList = () => { 
  const { isAdminStaff, canAccessDashboard } = useRoleAccess() 
  const [agencies, setAgencies] = useState<Agency[]>([]) 
  const [loading, setLoading] = useState(true) 
  const [error, setError] = useState<string | null>(null) 
 
  useEffect(() => { 
    const fetchOrganizations = async () => { 
      try { 
        const response = await axios.get(`${apiUrl}/businesses`, { params: { page: 1, pageSize: 100 } }) 
        setAgencies(response.data.data ?? []) 
      } catch (error) { 
        console.error('Failed to fetch organizations', error) 
        setError('Failed to fetch service providers') 
      } finally { 
        setLoading(false) 
      } 
    } 
 
    void fetchOrganizations() 
  }, [])
 
  return ( 
    <Content> 
      <PageHeader title='Agencies' subtitle='Manage all agencies on the platform' /> 
      {isAdminStaff && ( 
        <ReadOnlyNotice message='Admin staff can view service providers here, but subscription and staff administration remain restricted.' /> 
      )} 
      {error ? ( 
        <div>{error}</div> 
      ) : loading ? ( 
        <div>Loading...</div> 
      ) : ( 
        <EntityList 
          data={agencies} 
          columns={agencyColumns} 
          filtersConfig={agencyFilters} 
          searchableKeys={['name', 'email']} 
          enableRowClick 
          canExport={canAccessDashboard} 
          getRowLink={(row: Agency) => `/apps/business-management/agencies/${row.id}`} 
        /> 
      )} 
    </Content> 
  ) 
} 
 
const ServicePage = () => { 
  return ( 
    <Routes> 
      <Route element={<Outlet />}> 
        <Route path='agencies' element={<ServiceProvidersList />} /> 
        <Route path='agencies/:id' element={<AgencyDetail />} /> 
      </Route> 
 
      <Route index element={<Navigate to='/apps/business-management/agencies' />} /> 
    </Routes> 
  ) 
} 
 
export default ServicePage
