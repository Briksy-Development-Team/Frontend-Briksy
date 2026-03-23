import { Route, Routes, Outlet, Navigate, useParams } from 'react-router-dom'
import { EntityList } from '../../modules/apps/business-management/entity-list/EntityList'
import { PageHeader } from '../../modules/apps/business-management/entity-list/components/header/PageHeader'
import { Content } from '../../../_metronic/layout/components/content'
import EntityDetail from '../../modules/apps/business-management/entity-list/components/EntityDetail'
import { Column } from 'react-table'

const Blank = "/media/avatars/blank.png"

type Seeker = {
    id: number
    image: string
    name: string
    email: string
    status: 'Active' | 'Inactive' | 'Blocked'

    last_login: string | null
    current_login: string

    phone?: string | null
    age?: number
    gender?: 'Male' | 'Female' | 'Other'
    location?: string

    is_verified?: boolean
    profile_completed?: number

    created_at?: string
    updated_at?: string

    skills?: string[]
    experience_years?: number
    expected_salary?: number

    bio?: string
    company?: string | null
    education?: string
    resume_url?: string | null
    job_type?: 'Full-time' | 'Part-time' | 'Freelance' | 'Internship'
    availability?: 'Immediate' | '15 Days' | '30 Days' | '60 Days'
    rating?: number
    applied_jobs?: number
}

const seekers: Seeker[] = [
    {
        id: 1,
        image: Blank,
        name: 'Aryan Singh',
        email: 'aryan@brisky.com',
        status: 'Active',
        last_login: '2026-03-10',
        current_login: '2026-03-10',

        phone: '+91 9876543210',
        age: 24,
        gender: 'Male',
        location: 'Ahmedabad',
        is_verified: true,
        profile_completed: 85,
        created_at: '2025-12-01',
        updated_at: '2026-03-10',
        skills: ['React', 'Redux', 'CSS'],
        experience_years: 2.5,
        expected_salary: 600000,
        bio: 'Frontend developer building scalable UI.',
        company: 'Brisky',
        education: 'B.Tech',
        resume_url: 'https://cdn.brisky.com/resumes/aryan.pdf',
        job_type: 'Full-time',
        availability: 'Immediate',
        rating: 4.5,
        applied_jobs: 12,
    },

    {
        id: 2,
        image: Blank,
        name: 'Rahul Patel',
        email: 'rahul@brisky.com',
        status: 'Inactive',
        last_login: null, // important edge case
        current_login: '2026-03-10',

        phone: null,
        age: 29,
        gender: 'Male',
        location: 'Surat',
        is_verified: false,
        profile_completed: 40,
        created_at: '2025-10-15',
        updated_at: '2026-02-01',
        skills: ['Node.js'],
        experience_years: 4,
        expected_salary: 900000,
        bio: '',
        company: null,
        education: 'MCA',
        resume_url: 'https://cdn.brisky.com/resumes/aryan.pdf',
        job_type: 'Full-time',
        availability: 'Immediate',
        rating: 4.5,
        applied_jobs: 12,
    },

    {
        id: 3,
        image: Blank,
        name: 'Sneha Shah',
        email: 'sneha@brisky.com',
        status: 'Blocked',
        last_login: '2026-03-13',
        current_login: '2026-03-10',

        age: 26,
        gender: 'Female',
        location: 'Mumbai',
        is_verified: true,
        profile_completed: 100,
        created_at: '2024-08-20',
        updated_at: '2026-03-13',
        skills: ['Figma', 'UX'],
        experience_years: 3,
        expected_salary: 1200000,
        bio: 'UX designer',
        company: 'DesignCo',
        education: 'B.Des',
        resume_url: 'https://cdn.brisky.com/resumes/aryan.pdf',
        job_type: 'Full-time',
        availability: 'Immediate',
        rating: 4.5,
        applied_jobs: 12,
    },

    {
        id: 4,
        image: Blank,
        name: 'Amit Kumar',
        email: 'amit@brisky.com',
        status: 'Active',
        last_login: '2026-03-14',
        current_login: '2026-03-10',

        age: 31,
        location: 'Delhi',
        is_verified: true,
        profile_completed: 70,
        skills: ['Java'],
        experience_years: 6,
        expected_salary: 1500000,
        bio: 'Backend engineer',
        company: 'TechCorp',
        resume_url: 'https://cdn.brisky.com/resumes/aryan.pdf',
        job_type: 'Full-time',
        availability: 'Immediate',
        rating: 4.5,
        applied_jobs: 12,
    },

    {
        id: 5,
        image: Blank,
        name: 'Neha Jain',
        email: 'neha@brisky.com',
        status: 'Inactive',
        last_login: '2026-03-15',
        current_login: '2026-03-10',

        age: 23,
        gender: 'Female',
        is_verified: false,
        profile_completed: 55,
        skills: [],
        experience_years: 1,
        expected_salary: 400000,
        bio: 'Junior dev',
        education: 'BCA',
        resume_url: 'https://cdn.brisky.com/resumes/aryan.pdf',
        job_type: 'Full-time',
        availability: 'Immediate',
        rating: 4.5,
        applied_jobs: 12,
    }

]



export const columns: Column<Seeker>[] = [
    {
        Header: 'Image',
        accessor: 'image',
        Cell: ({ value }) => (
            <img
                src={value}
                alt="avatar"
                style={{ width: 30, height: 30, borderRadius: '50%' }}
            />
        ),
    },

    { Header: 'Name', accessor: 'name' },
    { Header: 'Email', accessor: 'email' },

    {
        Header: 'Status',
        accessor: 'status',
        Cell: ({ value }) => {
            const color =
                value === 'Active'
                    ? 'gray'
                    : value === 'Inactive'
                        ? 'gray'
                        : 'gray'

            return <span style={{ color }}>{value}</span>
        },

    },

    {
        Header: 'Last Login',
        accessor: 'last_login',
        Cell: ({ value }) =>
            value ? new Date(value).toLocaleDateString() : '—',
    },

    {
        Header: 'Current Login',
        accessor: 'current_login',
        Cell: ({ value }) =>
            new Date(value).toLocaleDateString(),
    },

    // 🔥 NEW FIELDS START HERE

    {
        Header: 'Phone',
        accessor: 'phone',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Age',
        accessor: 'age',
        Cell: ({ value }) => value ?? '—',
    },

    {
        Header: 'Gender',
        accessor: 'gender',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Location',
        accessor: 'location',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Verified',
        accessor: 'is_verified',
        Cell: ({ value }) => (value ? 'yes' : 'no'),
    },

    {
        Header: 'Profile %',
        accessor: 'profile_completed',
        Cell: ({ value }) =>
            value ? `${value}%` : '0%',
    },

    {
        Header: 'Created At',
        accessor: 'created_at',
        Cell: ({ value }) =>
            value ? new Date(value).toLocaleDateString() : '—',
    },

    {
        Header: 'Updated At',
        accessor: 'updated_at',
        Cell: ({ value }) =>
            value ? new Date(value).toLocaleDateString() : '—',
    },

    {
        Header: 'Experience',
        accessor: 'experience_years',
        Cell: ({ value }) =>
            value ? `${value} yrs` : '—',
    },

    {
        Header: 'Salary',
        accessor: 'expected_salary',
        Cell: ({ value }) =>
            value ? `₹${value.toLocaleString()}` : '—',
    },

    {
        Header: 'Skills',
        accessor: 'skills',
        Cell: ({ value }) =>
            value?.length ? value.join(', ') : '—',
    },

    {
        Header: 'Company',
        accessor: 'company',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Education',
        accessor: 'education',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Bio',
        accessor: 'bio',
        Cell: ({ value }) =>
            value
                ? value.length > 30
                    ? value.slice(0, 30) + '...'
                    : value
                : '—',
    },
    {
        Header: 'Resume',
        accessor: 'resume_url',
        Cell: ({ value }) =>
            value ? (
                <a href={value} target="_blank" rel="noreferrer">View</a>
            ) : '—',
    },

    {
        Header: 'Job Type',
        accessor: 'job_type',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Availability',
        accessor: 'availability',
        Cell: ({ value }) => value || '—',
    },

    {
        Header: 'Rating',
        accessor: 'rating',
        Cell: ({ value }) => value ? `⭐ ${value}` : '—',
    },

    {
        Header: 'Applied Jobs',
        accessor: 'applied_jobs',
        Cell: ({ value }) => value ?? '—',
    },
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