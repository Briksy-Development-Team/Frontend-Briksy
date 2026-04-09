import { useLocation, useParams } from 'react-router-dom'
import EntityDetail from './EntityDetail'
import { Content } from '../../../../../../_metronic/layout/components/content'
import { PageHeader } from "../../../../../modules/apps/shared_table/entity-list/components/header/PageHeader";

const GenericDetailPage = () => {
    const { state } = useLocation()
    const { entity } = useParams()

    const title = entity
        ? entity.charAt(0).toUpperCase() + entity.slice(1).replace(/-/g, ' ')
        : 'Detail'

    const data = state?.data ?? state
    const fields = state?.columns
        ? state.columns.map((col: { key: string; label: string }) => ({
            key: String(col.key),
            label: col.label,
        }))
        : Object.keys(data ?? {}).map((key) => ({
            key,
            label: key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
        }))

    return (
        <Content>
            <PageHeader title={title} subtitle={`Viewing ${title} details`} />
            <EntityDetail
                title={title}
                data={data}
                fields={fields}
            />
        </Content>
    )
}

export default GenericDetailPage