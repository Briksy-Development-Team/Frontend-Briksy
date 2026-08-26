type FieldConfig = {
    key: string
    label: string
}

type Props = {
    title: string
    data: Record<string, any> | null
    fields: FieldConfig[]
    loading?: boolean
}

const EntityDetail = ({ title, data, fields, loading }: Props) => {
    if (loading) {
        return <div className="p-5">Loading...</div>
    }

    if (!data) {
        return <div className="p-5">No data found</div>
    }

    return (
        <div className="card p-5">
            <h2 className="mb-5">{title}</h2>

            <table className="table table-bordered">
                <tbody>
                    {fields.map((field) => (
                        <tr key={field.key}>
                            <th>{field.label}</th>
                            <td>
                                {typeof data[field.key] === "object"
                                    ? JSON.stringify(data[field.key])
                                    : data[field.key] ?? "-"}
                            </td>                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default EntityDetail