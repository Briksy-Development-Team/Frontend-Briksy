import React from 'react'
import { KTCard } from '../../../_metronic/helpers'
import { useRoleAccess } from '../auth'

type Props = {
  data: any
}

const SubscriptionList = ({ data }: Props) => {
  const { currentPlan, plans, features } = data
  const { canManageSubscriptions } = useRoleAccess()

  const isLimitReached =
    currentPlan.usedProperties >= currentPlan.propertyLimit

  return (
    <KTCard>
      <div className="container-fluid">

        {/* Banner */}
        <div className="card mb-5">
          <div className="card-body d-flex justify-content-between align-items-center flex-wrap gap-4">

            <div>
              <h3 className="fw-bold mb-1">
                {isLimitReached ? '⚠️ Limit Reached' : 'Active Plan'}
              </h3>
              <span className="text-muted">
                Current plan: {currentPlan.name}
              </span>
            </div>

            <div className="d-flex align-items-center gap-3">
              <span className="badge badge-light-primary fs-6">
                {currentPlan.usedProperties}/{currentPlan.propertyLimit} Properties
              </span>
            </div>

          </div>
        </div>

        <div className="row g-5 g-xl-8 align-items-stretch">

          {plans.map((plan: any) => {
            const isCurrent = plan.id === currentPlan.id

            return (
              <div className="col-xl-4 col-md-6 col-sm-12" key={plan.id}>

                <div
                  className={`card h-100 shadow-sm border-0 position-relative ${plan.popular ? 'text-white' : 'bg-white'
                    }`}
                  style={
                    plan.popular
                      ? {
                        background:
                          '#2E42FF',
                        transform: 'scale(1.05)',
                        zIndex: 2,
                      }
                      : {}
                  }
                >

                  {/* Popular Badge */}
                  {plan.popular && (
                    <div
                      className="position-absolute top-0 start-50 translate-middle badge badge-light-primary"
                      style={{ marginTop: '-10px' }}
                    >
                      Most Popular
                    </div>
                  )}

                  <div className="card-body d-flex flex-column">

                    {/* Title */}
                    <div className="mb-4">
                      <h4 className="fw-bold mb-2">
                        {plan.name}
                      </h4>

                      <div className={plan.popular ? 'text-white opacity-75' : 'text-muted'}>
                        Up to {plan.propertyLimit} properties
                      </div>
                    </div>

                    {/* Price */}
                    <div className="fw-bold mb-4">
                      <span className="fs-1">₹{plan.price}</span>
                    </div>

                    {/* Button */}
                    <button
                      className={`btn w-100 mb-4 ${plan.popular ? 'btn-light' : 'btn-light-primary'
                        }`}
                      disabled={isCurrent || !canManageSubscriptions}
                    >
                      {isCurrent ? 'Current Plan' : canManageSubscriptions ? 'Get Started Now' : 'Admin Only'}
                    </button>

                    {/* Features */}
                    <ul className="list-unstyled mb-4">
                      {features.map((feature: string) => {
                        const available = plan.features[feature]

                        return (
                          <li
                            key={feature}
                            className="d-flex align-items-center mb-3"
                          >

                            <span
                              className={`me-3 d-flex align-items-center justify-content-center rounded-circle ${available
                                ? plan.popular
                                  ? 'bg-white text-primary'
                                  : 'bg-light-primary text-primary'
                                : 'bg-light text-muted'
                                }`}
                              style={{ width: 24, height: 24, fontSize: 12 }}
                            >
                              {available ? '✓' : '✕'}
                            </span>

                            <span
                              className={`${available
                                ? plan.popular
                                  ? 'text-white'
                                  : 'text-dark'
                                : 'text-muted'
                                }`}
                            >
                              {feature}
                            </span>

                          </li>
                        )
                      })}
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

export default SubscriptionList
