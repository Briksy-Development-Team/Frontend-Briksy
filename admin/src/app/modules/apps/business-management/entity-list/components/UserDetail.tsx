import { useLocation } from 'react-router-dom'

type User = {
    id: number
    image?: string
    name: string
    email: string
    status: string
    last_login: string
}

const UserDetail = () => {
    const location = useLocation()
    const user = location.state as User

    if (!user) {
        return <div className="p-5">No user data found</div>
    }

    return (
        <div className="card p-5">
            <h2 className="mb-5">User Details</h2>

            <table className="table table-bordered">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <td>{user.id}</td>
                    </tr>
                    <tr>
                        <th>Name</th>
                        <td>{user.name}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{user.email}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{user.status}</td>
                    </tr>
                    <tr>
                        <th>Last Login</th>
                        <td>{user.last_login}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}

export default UserDetail