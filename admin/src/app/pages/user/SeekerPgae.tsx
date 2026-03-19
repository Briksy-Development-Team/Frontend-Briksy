import { Route, Routes, Outlet, Navigate } from 'react-router-dom'
import { PageLink, PageTitle } from '../../../_metronic/layout/core'
import { EntityList } from '../../modules/apps/business-management/entity-list/EntityList'
import { PageHeader } from '../../modules/apps/business-management/entity-list/components/header/PageHeader'
import { Content } from '../../../_metronic/layout/components/content'
import EntityDetail from '../../modules/apps/business-management/entity-list/components/EntityDetail'
const Blank = "/media/avatars/blank.png"

const agencies = [
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
    { Header: 'Last Login', accessor: 'last_login' },
]

const agencyFilters = [
    {
        key: 'status',
        label: 'Status',
        options: ['Active', 'Blocked'],
    },

]

const breadcrumbs: Array<PageLink> = [
    {
        title: 'Seeker',
        path: '/apps/seeker-management/seeker',
        isSeparator: false,
        isActive: false,
    },
    { title: '', path: '', isSeparator: true, isActive: false },
]

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
                                subtitle="Manage all seekers on the platform" />

                            <EntityList
                                data={agencies}
                                columns={agencyColumns}
                                filtersConfig={agencyFilters}
                                enableRowClick
                                getRowLink={(row) =>
                                    `/apps/seeker-management/seeker/${row.id}`
                                }
                            />
                        </Content>
                    }
                />

                <Route
                    path="seeker/:id"
                    element={
                        <Content>
                            <PageHeader title="Seeker Details" />
                            <EntityDetail />
                        </Content>
                    }
                />

            </Route>

            <Route
                index
                element={<Navigate to="/apps/seeker-management/seeker" />}
            />
        </Routes>
    )
}

export default SeekerPage















