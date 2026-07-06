import { KTIcon } from '../../../_metronic/helpers'
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
    <div style={{ fontFamily: 'Inter, Helvetica, sans-serif' }}>

      {/* ── Header ── */}
      <div className='d-flex justify-content-between align-items-center mb-10 flex-wrap gap-4'>
        <div>
          <h2 className='fw-bold mb-1' style={{ fontSize: 26, letterSpacing: '-0.3px' }}>
            {canManage ? 'Plan Catalog' : 'Choose Your Plan'}
          </h2>
          <p className='mb-0' style={{ color: '#8b6f54', fontSize: 14 }}>
            {canManage
              ? 'Manage and configure subscription plans'
              : currentPlan
              ? `Current plan: ${currentPlan.name} — upgrade anytime`
              : 'Pick the plan that fits your agency best'}
          </p>
        </div>
        {canManage && (
          <button
            className='btn btn-primary d-flex align-items-center gap-2'
            onClick={onAdd}
            style={{ borderRadius: 10, padding: '10px 20px', fontWeight: 600 }}
          >
            <KTIcon iconName='plus' className='fs-4' />
            Add Plan
          </button>
        )}
      </div>

      {/* ── Trust bar (shown to buyers only) ── */}
      {!canManage && (
        <div
          className='d-flex align-items-center justify-content-center gap-8 mb-10 flex-wrap'
          style={{
            background: 'rgba(245,85,26,0.06)',
            border: '1px solid rgba(245,85,26,0.15)',
            borderRadius: 14,
            padding: '14px 24px',
          }}
        >
          {[
            { icon: '🔒', text: 'Secure checkout' },
            { icon: '↩️', text: '7-day refund policy' },
            { icon: '⚡', text: 'Instant activation' },
            { icon: '🎯', text: 'Cancel anytime' },
          ].map((item) => (
            <div key={item.text} className='d-flex align-items-center gap-2' style={{ fontSize: 13, color: '#342511', fontWeight: 500 }}>
              <span style={{ fontSize: 16 }}>{item.icon}</span>
              {item.text}
            </div>
          ))}
        </div>
      )}

      {/* ── Plan Cards ── */}
      <div className='row g-5 align-items-stretch'>
        {plans.map((plan, index) => {
          const isCurrent = !!plan.is_current
          const isPopular = !!plan.popular

          const accentColor = '#f5551a'
          const popularGradient = 'linear-gradient(145deg, #342511 0%, #5c3d1a 100%)'

          return (
            <div className='col-xl-4 col-md-6 col-sm-12' key={plan.id}>
              <div
                style={{
                  background: isPopular ? popularGradient : '#fff',
                  border: isPopular ? 'none' : isCurrent ? `2px solid ${accentColor}` : '1.5px solid #ede8e4',
                  borderRadius: 20,
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transform: isPopular ? 'translateY(-10px)' : 'none',
                  boxShadow: isPopular
                    ? '0 24px 60px rgba(52,37,17,0.30)'
                    : isCurrent
                    ? '0 8px 30px rgba(245,85,26,0.12)'
                    : '0 4px 20px rgba(52,37,17,0.06)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  overflow: 'visible',
                }}
              >
                {/* Popular badge */}
                {isPopular && (
                  <div
                    style={{
                      position: 'absolute',
                      top: -16,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      background: accentColor,
                      color: '#fff',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '5px 18px',
                      borderRadius: 20,
                      letterSpacing: '0.05em',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 4px 12px rgba(245,85,26,0.4)',
                    }}
                  >
                     Most Popular
                  </div>
                )}

                {/* Current plan badge */}
                {!canManage && isCurrent && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      background: 'rgba(58,132,81,0.12)',
                      color: '#3a8451',
                      fontSize: 11,
                      fontWeight: 700,
                      padding: '4px 12px',
                      borderRadius: 20,
                    }}
                  >
                    ✓ Active
                  </div>
                )}

                {/* Admin action buttons */}
                {canManage && (
                  <div style={{ position: 'absolute', top: 14, right: 14, display: 'flex', gap: 6, zIndex: 3 }}>
                    <button
                      className='btn btn-icon btn-sm'
                      style={{
                        background: isPopular ? 'rgba(255,255,255,0.15)' : '#f8f4ee',
                        border: 'none',
                        borderRadius: 8,
                        width: 32,
                        height: 32,
                        color: isPopular ? '#fff' : '#8b6f54',
                      }}
                      onClick={() => onEdit?.(plan)}
                      title='Edit plan'
                    >
                      <KTIcon iconName='pencil' className='fs-5' />
                    </button>
                    <button
                      className='btn btn-icon btn-sm'
                      style={{
                        background: isPopular ? 'rgba(255,255,255,0.15)' : '#fbeae8',
                        border: 'none',
                        borderRadius: 8,
                        width: 32,
                        height: 32,
                        color: isPopular ? '#fff' : '#c0392b',
                      }}
                      onClick={() => onDelete?.(plan)}
                      title='Delete plan'
                    >
                      <KTIcon iconName='trash' className='fs-5' />
                    </button>
                  </div>
                )}

                {/* Card content */}
                <div style={{ padding: '32px 28px 28px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                  {/* Plan icon + name */}
                  <div style={{ marginBottom: 20 }}>
                
                    <h4
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        color: isPopular ? '#fff' : '#342511',
                        marginBottom: 4,
                      }}
                    >
                      {plan.name}
                    </h4>
                    <p style={{ fontSize: 12, color: isPopular ? 'rgba(255,255,255,0.6)' : '#8b6f54', margin: 0 }}>
                      {plan.description ??
                        (index === 0
                          ? 'Perfect for small agencies'
                          : index === 1
                          ? 'Best for growing teams'
                          : 'For large organizations')}
                    </p>
                  </div>

                  {/* Price */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4 }}>
                      <span style={{ fontSize: 13, color: isPopular ? 'rgba(255,255,255,0.7)' : '#8b6f54', marginBottom: 6 }}>$</span>
                      <span
                        style={{
                          fontSize: 42,
                          fontWeight: 800,
                          color: isPopular ? '#fff' : '#342511',
                          letterSpacing: '-1px',
                          lineHeight: 1,
                        }}
                      >
                        {((plan.monthly_price ?? plan.price) || 0).toLocaleString('en-IN')}
                      </span>
                    </div>
                    <p style={{ fontSize: 12, color: isPopular ? 'rgba(255,255,255,0.5)' : '#8b6f54', margin: '6px 0 0' }}>
                      {plan.monthly_price ? `Monthly $${plan.monthly_price.toLocaleString('en-IN')}` : 'Monthly pricing unavailable'}
                      {plan.yearly_price ? ` · Annual $${plan.yearly_price.toLocaleString('en-IN')}` : ''}
                    </p>
                  </div>

                  {plan.addons?.length ? (
                    <div className='d-flex flex-wrap gap-2 mb-4'>
                      {plan.addons.map((addon) => (
                        <span
                          key={addon.id}
                          className='badge badge-light'
                          style={{ background: isPopular ? 'rgba(255,255,255,0.14)' : '#f6f1ea', color: isPopular ? '#fff' : '#6b5846' }}
                        >
                          {addon.name}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  {/* CTA Button */}
                  {canManage ? (
                    <button
                      disabled
                      style={{
                        width: '100%',
                        padding: '12px 0',
                        borderRadius: 10,
                        border: isPopular ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #ede8e4',
                        background: 'transparent',
                        color: isPopular ? 'rgba(255,255,255,0.6)' : '#8b6f54',
                        fontWeight: 600,
                        fontSize: 13,
                        cursor: 'not-allowed',
                        marginBottom: 24,
                      }}
                    >
                      Preview
                    </button>
                  ) : (
                    <button
                      disabled={isCurrent}
                      onClick={() => onSelectPlan?.(plan)}
                      style={{
                        width: '100%',
                        padding: '13px 0',
                        borderRadius: 10,
                        border: 'none',
                        background: isCurrent
                          ? 'rgba(58,132,81,0.12)'
                          : isPopular
                          ? accentColor
                          : `rgba(245,85,26,0.10)`,
                        color: isCurrent
                          ? '#3a8451'
                          : isPopular
                          ? '#fff'
                          : accentColor,
                        fontWeight: 700,
                        fontSize: 14,
                        cursor: isCurrent ? 'default' : 'pointer',
                        marginBottom: 24,
                        boxShadow: !isCurrent && isPopular ? '0 6px 20px rgba(245,85,26,0.35)' : 'none',
                        transition: 'all 0.2s',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {isCurrent ? '✓ Current Plan' : isPopular ? '🚀 Get Started' : 'Select Plan →'}
                    </button>
                  )}

                  {/* Divider */}
                  <div
                    style={{
                      width: '100%',
                      height: 1,
                      background: isPopular ? 'rgba(255,255,255,0.12)' : '#ede8e4',
                      marginBottom: 20,
                    }}
                  />

                  {/* Features */}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, flex: 1 }}>
                    {plan.features.map((feature) => (
                      <li
                        key={feature.name}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          marginBottom: 11,
                          opacity: feature.enabled ? 1 : 0.45,
                        }}
                      >
                        <span
                          style={{
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                            background: feature.enabled
                              ? isPopular
                                ? 'rgba(255,255,255,0.2)'
                                : 'rgba(245,85,26,0.12)'
                              : 'rgba(139,111,84,0.1)',
                            color: feature.enabled
                              ? isPopular
                                ? '#fff'
                                : accentColor
                              : '#8b6f54',
                          }}
                        >
                          {feature.enabled ? '✓' : '✕'}
                        </span>
                        <span
                          style={{
                            fontSize: 13,
                            color: feature.enabled
                              ? isPopular
                                ? '#fff'
                                : '#342511'
                              : isPopular
                              ? 'rgba(255,255,255,0.4)'
                              : '#8b6f54',
                            fontWeight: feature.enabled ? 500 : 400,
                          }}
                        >
                          {feature.name}
                          {feature.value !== undefined && (
                            <span style={{ fontWeight: 700, marginLeft: 4 }}>
                              : {feature.value}
                            </span>
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

      {/* ── Bottom reassurance (buyers only) ── */}
      {!canManage && (
        <div className='text-center mt-12'>
          <p style={{ fontSize: 13, color: '#8b6f54' }}>
            All plans include a <strong style={{ color: '#342511' }}>14-day free trial</strong>. No credit card required to start.&nbsp;
            <a href='#' style={{ color: '#f5551a', fontWeight: 600, textDecoration: 'underline' }}>
              Compare all features →
            </a>
          </p>
        </div>
      )}
    </div>
  )
}
