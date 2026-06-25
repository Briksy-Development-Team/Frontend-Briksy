import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Content } from '../../../_metronic/layout/components/content'
import { PageHeader } from '../../modules/apps/shared_table/entity-list/components/header/PageHeader'
import { SubscriptionList } from '../../modules/SubscriptionList/SubscriptionList'
import { PlanModal } from '../../modules/SubscriptionList/PlanModal'
import { DeleteConfirmModal } from '../../modules/apps/component/DeleteConfirmModal'
import { ModalShell } from '../../modules/apps/component/ModalShell'
import {
    fetchPlans, savePlan, removePlan, changePlan,
    openPlanModal, closePlanModal,
} from '../../services/features/subscriptions/plan.slice'
import type { Plan } from '../../services/features/subscriptions/plan.types'
import type { RootState, AppDispatch } from '../../services/store'
import { useRoleAccess } from '../../modules/auth'

const Subscription = () => {
    const dispatch = useDispatch<AppDispatch>()
    const { isSuperAdmin } = useRoleAccess()
    const canManage = isSuperAdmin

    const { data: plans, loading, isModalOpen, editingPlan, saving, changing } =
        useSelector((s: RootState) => s.plans)

    const [deletingPlan, setDeletingPlan] = useState<Plan | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
    const selectedPlanPropertyLimit =
        selectedPlan?.features.find((feature) => feature.name === "Properties")?.value ?? "unlimited"
    useEffect(() => {
        dispatch(fetchPlans())
    }, [dispatch])

    const handleConfirmChange = async () => {
        if (!selectedPlan) return
        await dispatch(changePlan(selectedPlan.id))
        setSelectedPlan(null)
    }

    const selectedPlanPropertyLimit = selectedPlan
        ? selectedPlan.features.find((feature) => feature.name.toLowerCase() === "properties")?.value ?? "unlimited"
        : null

    if (loading) return <Content><div className="p-10">Loading...</div></Content>

    return (
        <Content>
            <PageHeader
                title="Subscription Plans"
                subtitle={canManage ? "Manage platform plans" : "Choose a plan that fits your business"}
            />

            <SubscriptionList
                plans={plans}
                canManage={canManage}
                onAdd={canManage ? () => dispatch(openPlanModal(null)) : undefined}
                onEdit={canManage ? (plan) => dispatch(openPlanModal(plan)) : undefined}
                onDelete={canManage ? (plan) => setDeletingPlan(plan) : undefined}
                onSelectPlan={!canManage ? (plan) => setSelectedPlan(plan) : undefined}
            />

            {canManage && isModalOpen && (
                <PlanModal
                    initialValues={editingPlan}
                    isSubmitting={saving}
                    onClose={() => dispatch(closePlanModal())}
                    onSubmit={(values) => dispatch(savePlan({ id: editingPlan?.id, values }))}
                />
            )}

            {canManage && deletingPlan && (
                <DeleteConfirmModal
                    title="Delete Plan"
                    message={`Are you sure you want to delete the "${deletingPlan.name}" plan?`}
                    onClose={() => setDeletingPlan(null)}
                    onConfirm={() => {
                        dispatch(removePlan(deletingPlan.id))
                        setDeletingPlan(null)
                    }}
                />
            )}

            {!canManage && selectedPlan && (
                <ModalShell
                    title="Confirm Plan Change"
                    onClose={() => setSelectedPlan(null)}
                    onSubmit={handleConfirmChange}
                    isSubmitting={changing}
                    submitLabel="Confirm"
                >
                    <div className="text-center py-4">
                        <h4 className="fw-bold mb-2">Switch to {selectedPlan.name}</h4>
                        <p className="text-gray-700 fs-5">
                            ₹{selectedPlan.price}/month — up to {selectedPlanPropertyLimit} properties
                        </p>
                        <p className="text-muted fs-6">
                            This change takes effect immediately and your billing will be updated.
                        </p>
                    </div>
                </ModalShell>
            )}
        </Content>
    )
}

export default Subscription
