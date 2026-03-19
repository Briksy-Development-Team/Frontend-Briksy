import { Route, Routes, Outlet, Navigate, useParams } from 'react-router-dom'
import { EntityList } from '../../modules/apps/business-management/entity-list/EntityList'
import { PageHeader } from '../../modules/apps/business-management/entity-list/components/header/PageHeader'
import { Content } from '../../../_metronic/layout/components/content'
import EntityDetail from '../../modules/apps/business-management/entity-list/components/EntityDetail'

const Blank = "/media/avatars/blank.png"

type Seeker = {
    id: number
    image: string
    name: string
    email: string
    status: string
    last_login: string
}

const seekers: Seeker[] = [
    { id: 1, image: Blank, name: 'Aryan Singh', email: 'aryan@brisky.com', status: 'Active', last_login: '2026-03-10' },
    { id: 2, image: Blank, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 3, image: Blank, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 4, image: Blank, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 5, image: Blank, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' },
    { id: 6, image: Blank, name: 'Aryan Singh', email: 'aryan@brisky.com', status: 'Active', last_login: '2026-03-10' },
    { id: 7, image: Blank, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 8, image: Blank, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 9, image: Blank, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 10, image: Blank, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' },
    { id: 11, image: Blank, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 12, image: Blank, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 13, image: Blank, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 14, image: Blank, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' },
    { id: 15, image: Blank, name: 'Rahul Patel', email: 'rahul@brisky.com', status: 'Inactive', last_login: '2026-03-12' },
    { id: 16, image: Blank, name: 'Sneha Shah', email: 'sneha@brisky.com', status: 'Blocked', last_login: '2026-03-13' },
    { id: 17, image: Blank, name: 'Amit Kumar', email: 'amit@brisky.com', status: 'Active', last_login: '2026-03-14' },
    { id: 18, image: Blank, name: 'Neha Jain', email: 'neha@brisky.com', status: 'Inactive', last_login: '2026-03-15' },
]

const columns = [
    {
        Header: 'Image',
        accessor: 'image',
        Cell: ({ value }: { value: string }) => (
            <img
                src={value}
                style={{ width: 40, height: 40, borderRadius: '50%' }}
            />
        ),
    },
    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },
    { Header: 'Status', accessor: 'status' },
    { Header: 'Last Login', accessor: 'last_login' },
]

const filters = [
    {
        key: 'status',
        label: 'Status',
        options: ['Active', 'Blocked'],
    },
]

const detailFields = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'status', label: 'Status' },
    { key: 'last_login', label: 'Last Login' },
]

const SeekerDetail = () => {
    const { id } = useParams()
    const data = seekers.find((item) => item.id === Number(id))

    return (
        <Content>
            <PageHeader title="Seeker Details" />

            <EntityDetail
                title="Seeker Details"
                data={data || null}
                fields={detailFields}
            />
        </Content>
    )
}

const SeekerPage = () => {
    return (
        <Routes>
            <Route element={<Outlet />}>

                <Route
                    path="seeker"
                    element={
                        <Content>
                            <PageHeader
                                title="Seeker"
                                subtitle="Manage all seekers"
                            />

                            <EntityList
                                data={seekers}
                                columns={columns}
                                filtersConfig={filters}
                                searchableKeys={['name', 'email']}
                                enableRowClick
                                getRowLink={(row: Seeker) =>
                                    `/apps/seeker-management/seeker/${row.id}`
                                }
                            />
                        </Content>
                    }
                />

                <Route path="seeker/:id" element={<SeekerDetail />} />

            </Route>

            <Route
                index
                element={<Navigate to="/apps/seeker-management/seeker" />}
            />
        </Routes>
    )
}

export default SeekerPage