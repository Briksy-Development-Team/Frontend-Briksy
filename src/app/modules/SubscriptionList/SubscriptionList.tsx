import { KTCard, KTIcon } from '../../../_metronic/helpers'
import type { Plan } from '../../services/features/subscriptions/plan.types'

type Props = {
  plans: Plan[]
  canManage: boolean
  onAdd?: () => void
  onEdit?: (plan: Plan) => void
  onDelete?: (plan: Plan) => void
  onSelectPlan?: (plan: Plan) => void
}

export const SubscriptionList = ({ plans, canManage, onAdd, onEdit, onDelete, onSelectPlan }: Props) => {
  const currentPlan = plans.find((p) => p.is_current)

  return (
    <KTCard>
      <div className="container-fluid py-6">

        <div className="card mb-8">
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-4">
            <div>
              <h3 className="fw-bold mb-1">
                {canManage ? "Plan Catalog" : "Active Plan"}
              </h3>
              {!canManage && (
                <span className="text-muted">
                  Current plan: {currentPlan?.name ?? "No active plan"}
                </span>
              )}
            </div>
            {canManage && (
              <button className="btn btn-primary d-flex align-items-center gap-2" onClick={onAdd}>
                <KTIcon iconName="plus" className="fs-2" />
                Add Plan
              </button>
            )}
          </div>
        </div>

        <div className="row g-5 g-xl-8 align-items-stretch">
          {plans.map((plan) => {
            const isCurrent = !!plan.is_current

            return (
              <div className="col-xl-4 col-md-6 col-sm-12" key={plan.id}>
                <div
                  className={`card h-100 shadow-sm border-0 position-relative ${plan.popular ? 'text-white' : 'bg-white'}`}
                  style={plan.popular ? { background: '#2E42FF', transform: 'scale(1.05)', zIndex: 2 } : {}}
                >
                  {plan.popular && (
                    <div
                      className="position-absolute top-0 start-50 translate-middle badge badge-light-primary"
                      style={{ marginTop: '-10px' }}
                    >
                      Most Popular
                    </div>
                  )}

                  {canManage && (
                    <div className="position-absolute top-0 end-0 p-3 d-flex gap-2" style={{ zIndex: 3 }}>
                      <button
                        className={`btn btn-icon btn-sm ${plan.popular ? 'btn-light' : 'btn-light-primary'}`}
                        onClick={() => onEdit?.(plan)}
                        title="Edit plan"
                      >
                        <KTIcon iconName="pencil" className="fs-4" />
                      </button>
                      <button
                        className="btn btn-icon btn-sm btn-light-danger"
                        onClick={() => onDelete?.(plan)}
                        title="Delete plan"
                      >
                        <KTIcon iconName="trash" className="fs-4" />
                      </button>
                    </div>
                  )}

                  {!canManage && isCurrent && (
                    <div className="position-absolute top-0 end-0 p-3" style={{ zIndex: 3 }}>
                      <span className="badge badge-light-success">Active</span>
                    </div>
                  )}

                  <div className="card-body d-flex flex-column pt-10">
                    <div className="mb-4">
                      <h4 className="fw-bold mb-2">{plan.name}</h4>
                    </div>

                    <div className="fw-bold mb-4">
                      <span className="fs-1">₹{plan.price}</span>
                    </div>

                    {canManage ? (
                      <button
                        className={`btn w-100 mb-4 ${plan.popular ? 'btn-light' : 'btn-light-primary'}`}
                        disabled
                      >
                        Preview
                      </button>
                    ) : (
                      <button
                        className={`btn w-100 mb-4 ${isCurrent ? 'btn-light' : plan.popular ? 'btn-light' : 'btn-light-primary'
                          }`}
                        disabled={isCurrent}
                        onClick={() => onSelectPlan?.(plan)}
                      >
                        {isCurrent ? 'Current Plan' : 'Select Plan'}
                      </button>
                    )}

                    <ul className="list-unstyled mb-0">
                      {plan.features.map((feature) => (
                        <li key={feature.name} className="d-flex align-items-center mb-3">
                          <span
                            className={`me-3 d-flex align-items-center justify-content-center rounded-circle ${feature.enabled
                                ? plan.popular ? 'bg-white text-primary' : 'bg-light-primary text-primary'
                                : 'bg-light text-muted'
                              }`}
                            style={{ width: 24, height: 24, fontSize: 12 }}
                          >
                            {feature.enabled ? '✓' : '✕'}
                          </span>
                          <span className={feature.enabled ? (plan.popular ? 'text-white' : 'text-dark') : 'text-muted'}>
                            {feature.name}
                            {feature.value !== undefined && (
                              <span className="fw-semibold ms-1">: {feature.value}</span>
                            )}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

      </div>
    </KTCard>
  )
}