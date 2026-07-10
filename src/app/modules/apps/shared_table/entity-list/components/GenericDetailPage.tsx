import { useEffect, useMemo, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Content } from '../../../../../../_metronic/layout/components/content'
import DynamicWorkspace from '../../../shared_detail/DynamicWorkspace'
import axiosInstance from '../../../../../services/api/axiosInstance'

import { orderDetailConfig } from '../../../../../services/features/orders/order.detail.config'
import { couponDetailConfig } from '../../../../../services/features/coupons/coupon.detail.config'
import { seekerDetailConfig } from '../../../../../services/features/seeker/seeker.detail.config'
import { propertyDetailConfig } from '../../../../../services/features/properties/property.detail.config'
import { organizationDetailConfig } from '../../../../../services/features/organization/organization.detail.config'
import { serviceDetailConfig } from '../../../../../services/features/service/service_list.detail.config'
import { staffDetailConfig } from '../../../../../services/features/staff/staff.detail.config'
import { planRequestDetailConfig } from '../../../../../services/features/plan_requests/plan-request.detail.config'
import type { DetailConfig } from '../../../shared_detail/core/DetailTypes'

type DetailRegistryEntry = {
  config: DetailConfig<any>
  buildPath: (scopeBase: '/admin' | '/super-admin', id: string) => string
}

const routeAliases: Record<string, string> = {
  inquiry: 'plan-requests',
  solo: 'organization',
  'solo-traders': 'organization',
  users: 'staff',
  businesses: 'organization',
}

const detailRegistry: Record<string, DetailRegistryEntry> = {
  orders: {
    config: orderDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/orders/${id}`,
  },
  coupons: {
    config: couponDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/coupons/${id}`,
  },
  seekers: {
    config: seekerDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/seekers/${id}`,
  },
  'property-management': {
    config: propertyDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/properties/${id}`,
  },
  organization: {
    config: organizationDetailConfig,
    buildPath: (scopeBase, id) =>
      `${scopeBase}/${scopeBase === '/super-admin' ? 'organizations' : 'businesses'}/${id}`,
  },
  services: {
    config: serviceDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/services/${id}`,
  },
  staff: {
    config: staffDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/staff/${id}`,
  },
  'plan-requests': {
    config: planRequestDetailConfig,
    buildPath: (scopeBase, id) => `${scopeBase}/plan-requests/${id}`,
  },
}

const GenericDetailPage = ({ rowActions }: { rowActions?: any[] }) => {
  const location = useLocation()
  const { id } = useParams()
  const state = location.state as any

  const pathParts = location.pathname.split('/').filter(Boolean)
  const segmentIndex = pathParts[pathParts.length - 2] === 'detail' ? pathParts.length - 3 : pathParts.length - 2
  const entitySegment = pathParts[segmentIndex] ?? 'detail'
  const resolvedSegment = routeAliases[entitySegment] ?? entitySegment
  const scopeBase: '/admin' | '/super-admin' = location.pathname.startsWith('/super-admin')
    ? '/super-admin'
    : '/admin'

  const registryEntry = detailRegistry[resolvedSegment]
  const config = registryEntry?.config

  const initialData = useMemo(() => {
    const stateData = state?.data ?? null

    if (!stateData) {
      return null
    }

    if (!id) {
      return stateData
    }

    return String(stateData.id ?? '') === String(id) ? stateData : null
  }, [id, state?.data])

  const [data, setData] = useState<any | null>(initialData)
  const [isLoading, setIsLoading] = useState<boolean>(!initialData)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setData(initialData)
    setIsLoading(!initialData)
    setError(null)
  }, [initialData])

  useEffect(() => {
    let active = true

    if (!registryEntry || !config) {
      setData(null)
      setIsLoading(false)
      setError(`No detail configuration found for module: ${entitySegment}`)
      return () => {
        active = false
      }
    }

    if (!id) {
      setData(null)
      setIsLoading(false)
      setError('Missing detail identifier.')
      return () => {
        active = false
      }
    }

    setIsLoading(true)
    setError(null)

    void axiosInstance
      .get<{ success?: boolean; data?: unknown }>(registryEntry.buildPath(scopeBase, String(id)))
      .then((response) => {
        if (!active) {
          return
        }

        setData((response.data as { data?: unknown })?.data ?? response.data)
      })
      .catch((fetchError: unknown) => {
        if (!active) {
          return
        }

        setData(null)
        setError(fetchError instanceof Error ? fetchError.message : 'Failed to load entity data')
      })
      .finally(() => {
        if (active) {
          setIsLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [config, entitySegment, id, initialData, registryEntry, scopeBase])

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
        isLoading={isLoading}
        error={error}
        rowActions={rowActions}
      />
    </Content>
  )
}

export default GenericDetailPage
