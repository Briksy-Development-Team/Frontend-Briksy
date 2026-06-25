import { useLocation, useParams } from 'react-router-dom'
import { Content } from '../../../../../../_metronic/layout/components/content'
import DynamicWorkspace from '../../../shared_detail/DynamicWorkspace'

import { orderDetailConfig } from '../../../../../services/features/orders/order.detail.config'
import { couponDetailConfig } from '../../../../../services/features/coupons/coupon.detail.config'
import { seekerDetailConfig } from '../../../../../services/features/seeker/seeker.detail.config'
import { propertyDetailConfig } from '../../../../../services/features/properties/property.detail.config'
import { organizationDetailConfig } from '../../../../../services/features/organization/organization.detail.config'
import { serviceDetailConfig } from '../../../../../services/features/service/service_list.detail.config'
import { staffDetailConfig } from '../../../../../services/features/staff/staff.detail.config'
import { planRequestDetailConfig } from '../../../../../services/features/plan_requests/plan-request.detail.config'

const configMap: Record<string, any> = {
  'orders': orderDetailConfig,
  'coupons': couponDetailConfig,
  'seekers': seekerDetailConfig,
  'property-management': propertyDetailConfig,
  'organization': organizationDetailConfig,
  'solo-traders': organizationDetailConfig, // Use org config for solo traders too
  'services': serviceDetailConfig,
  'staff': staffDetailConfig,
  'plan-requests': planRequestDetailConfig,
}

const GenericDetailPage = ({ rowActions }: { rowActions?: any[] }) => {
    const location = useLocation()
    const { id } = useParams()
    const state = location.state as any

    const pathParts = location.pathname.split('/').filter(Boolean)
    const segmentIndex = pathParts[pathParts.length - 2] === 'detail' ? pathParts.length - 3 : pathParts.length - 2
    const entitySegment = pathParts[segmentIndex] ?? 'detail'
    
    const config = configMap[entitySegment]
    const data = state?.data ?? null

    if (!config) {
        return (
            <Content>
                <div className="alert alert-warning m-5">
                    No Detail Configuration found for module: {entitySegment}
                </div>
            </Content>
        )
    }

    return (
        <Content>
            <DynamicWorkspace 
              config={config} 
              data={data} 
              isLoading={false} 
              rowActions={rowActions}
            />
        </Content>
    )
}

export default GenericDetailPage