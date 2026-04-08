type Props = {
    title: string
    data: Record<string, any> | null
    columns: { Header: string; accessor: string; Cell?: any }[]
    loading?: boolean
}

const EntityDetail = ({ title, data, columns, loading }: Props) => {
    if (loading) return <div className="p-5">Loading...</div>
    if (!data) return <div className="p-5">No data found</div>

    return (
        <div className="card p-5">
            <h2 className="mb-5">{title}</h2>

            <table className="table table-bordered align-middle">
                <tbody>
                    {columns.map((col) => {
                        const value = data[col.accessor]

                        return (
                            <tr key={col.accessor}>
                                <th className="fw-semibold text-muted w-25">
                                    {col.Header}
                                </th>
                                <td className="fw-bold text-gray-800">
                                    {col.Cell
                                        ? col.Cell(value, data)
                                        : value ?? '-'}
                                </td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}

export default EntityDetail