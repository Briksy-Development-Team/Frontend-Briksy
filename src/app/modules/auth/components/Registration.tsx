import { AxiosError } from 'axios'
import { useEffect, useRef, useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { useSearchParams } from 'react-router-dom'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'
import { verifyAbn as verifyAbnRequest } from '../core/_requests'

type BusinessType = 'organisation' | 'company' | 'solo_trader'

const initialValues = {
  first: '',
  last: '',
  email: '',
  business_name: '',
  trading_name: '',
  business_type: 'organisation' as BusinessType,
  abn_number: '',
  entity_type: '',
  gst_registered: '',
  abn_verified: false,
  contact_phone: '',
  address: '',
  state: '',
  postcode: '',
  password: '',
  password_confirmation: '',
  referral_code: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  first: Yup.string().min(3, 'Minimum 3 symbols').max(120, 'Maximum 120 symbols').required('First name is required'),
  last: Yup.string().min(3, 'Minimum 3 symbols').max(120, 'Maximum 120 symbols').required('Last name is required'),
  email: Yup.string().email('Wrong email format').min(3, 'Minimum 3 symbols').max(150, 'Maximum 150 symbols').required('Email is required'),
  business_name: Yup.string().min(2, 'Minimum 2 symbols').max(200, 'Maximum 200 symbols').required('Business name is required'),
  trading_name: Yup.string().max(200, 'Maximum 200 symbols'),
  business_type: Yup.string().oneOf(['organisation', 'company', 'solo_trader']).required('Business type is required'),
  abn_number: Yup.string().matches(/^\d{11}$/, 'ABN must be 11 digits').required('ABN is required'),
  contact_phone: Yup.string().max(30, 'Maximum 30 symbols'),
  address: Yup.string().max(500, 'Maximum 500 symbols'),
  state: Yup.string().max(50, 'Maximum 50 symbols'),
  postcode: Yup.string().max(10, 'Maximum 10 symbols'),
  password: Yup.string().min(8, 'Minimum 8 symbols').max(50, 'Maximum 50 symbols').required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match")
    .required('Password confirmation is required'),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const [abnVerificationState, setAbnVerificationState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [abnVerificationMessage, setAbnVerificationMessage] = useState<string | null>(null)
  const verifiedSignatureRef = useRef<string>('')
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const referralCodeFromUrl = searchParams.get('ref') ?? searchParams.get('referral_code') ?? ''

  const normalizeAbn = (value: string) => value.replace(/\D/g, '').slice(0, 11)

  const clearVerification = () => {
    verifiedSignatureRef.current = ''
    setAbnVerificationState('idle')
    setAbnVerificationMessage(null)
    formik?.setFieldValue('abn_verified', false, false)
    formik?.setFieldValue('entity_type', '', false)
    formik?.setFieldValue('gst_registered', '', false)
    formik?.setFieldValue('business_name', '', false)
    formik?.setFieldValue('state', '', false)
    formik?.setFieldValue('postcode', '', false)
    formik?.setFieldError('abn_number', '')
    formik?.setStatus(undefined)
  }

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setStatus(undefined)

      try {
        const normalizedAbn = normalizeAbn(values.abn_number)

        if (normalizedAbn.length !== 11) {
          const message = 'ABN must be 11 digits.'
          setStatus(message)
          formik.setFieldError('abn_number', message)
          setSubmitting(false)
          return
        }

        setAbnVerificationState('loading')
        setAbnVerificationMessage(null)

        const verification = await verifyAbnRequest({
          abn: normalizedAbn,
          business_type: values.business_type,
        })

        if (!verification.valid) {
          const message = verification.message ?? 'Invalid ABN. Please enter a valid Australian Business Number.'
          verifiedSignatureRef.current = ''
          setAbnVerificationState('error')
          setAbnVerificationMessage(message)
          formik.setFieldError('abn_number', message)
          setStatus(message)
          setSubmitting(false)
          return
        }

        const signature = `${normalizedAbn}:${values.business_type}`
        verifiedSignatureRef.current = signature
        setAbnVerificationState('success')
        setAbnVerificationMessage(null)

        void formik.setFieldValue('abn_verified', true, false)
        void formik.setFieldValue('entity_type', verification.entityType, false)
        void formik.setFieldValue('gst_registered', verification.gstRegistered ? 'yes' : 'no', false)
        void formik.setFieldValue('business_name', verification.entityName, false)
        void formik.setFieldValue('state', verification.state ?? '', false)
        void formik.setFieldValue('postcode', verification.postcode ?? '', false)

        const homeRoute = await register({
          first: values.first,
          last: values.last,
          email: values.email,
          business_name: verification.entityName,
          trading_name: values.trading_name,
          business_type: values.business_type as 'organisation' | 'company' | 'solo_trader',
          abn_number: normalizedAbn,
          contact_email: values.email,
          contact_phone: values.contact_phone,
          address: values.address,
          state: verification.state ?? values.state,
          postcode: verification.postcode ?? values.postcode,
          password: values.password,
          password_confirmation: values.password_confirmation,
          referral_code: values.referral_code || referralCodeFromUrl || undefined,
        })
        navigate(homeRoute, { replace: true })
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { message?: string })?.message ?? 'The registration details are incorrect'
            : 'The registration details are incorrect'

        setStatus(message)
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })

  const currentAbn = normalizeAbn(formik.values.abn_number)
  const currentSignature = `${currentAbn}:${formik.values.business_type}`
  const isAbnVerified = formik.values.abn_verified && verifiedSignatureRef.current === currentSignature

  useEffect(() => {
    if (referralCodeFromUrl && !formik.values.referral_code) {
      void formik.setFieldValue('referral_code', referralCodeFromUrl)
    }
  }, [formik, referralCodeFromUrl])

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign Up</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Create your Australian business account</div>
      </div>

      <div className='row g-3 mb-9'>
        <div className='col-md-6'>
          <a href='#' className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'>
            <img alt='Logo' src={toAbsoluteUrl('media/svg/brand-logos/google-icon.svg')} className='h-15px me-3' />
            Sign in with Google
          </a>
        </div>
        <div className='col-md-6'>
          <a href='#' className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'>
            <img alt='Logo' src={toAbsoluteUrl('media/svg/brand-logos/apple-black.svg')} className='theme-light-show h-15px me-3' />
            <img alt='Logo' src={toAbsoluteUrl('media/svg/brand-logos/apple-black-dark.svg')} className='theme-dark-show h-15px me-3' />
            Sign in with Apple
          </a>
        </div>
      </div>

      <div className='separator separator-content my-14'>
        <span className='w-125px text-gray-500 fw-semibold fs-7'>Or with email</span>
      </div>

      {formik.status ? (
        <div className='mb-lg-15 alert alert-danger'>
          <div className='alert-text font-weight-bold'>{formik.status}</div>
        </div>
      ) : null}

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Business type</label>
        <select
          {...formik.getFieldProps('business_type')}
          disabled={isAbnVerified}
          className={clsx(
            'form-select bg-transparent',
            { 'is-invalid': formik.touched.business_type && formik.errors.business_type },
            { 'is-valid': formik.touched.business_type && !formik.errors.business_type }
          )}
        >
          <option value='organisation'>Organisation</option>
          <option value='company'>Company</option>
          <option value='solo_trader'>Solo trader</option>
        </select>
        <div className='form-text'>Choose how your business operates in Briksy.</div>
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Business name</label>
        <input
          placeholder='Registered business name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('business_name')}
          readOnly={isAbnVerified}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.business_name && formik.errors.business_name },
            { 'is-valid': formik.touched.business_name && !formik.errors.business_name }
          )}
        />
        {formik.touched.business_name && formik.errors.business_name && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.business_name}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Trading name</label>
        <input
          placeholder='Trading name'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('trading_name')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.trading_name && formik.errors.trading_name },
            { 'is-valid': formik.touched.trading_name && !formik.errors.trading_name }
          )}
        />
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>ABN</label>
        <input
          placeholder='12345678901'
          type='text'
          autoComplete='off'
          value={formik.values.abn_number}
          onChange={(event) => {
            const nextAbn = normalizeAbn(event.target.value)
            void formik.setFieldValue('abn_number', nextAbn)

            if (formik.values.abn_verified && verifiedSignatureRef.current !== `${nextAbn}:${formik.values.business_type}`) {
              clearVerification()
            }
          }}
          onBlur={formik.handleBlur}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.abn_number && formik.errors.abn_number },
            { 'is-valid': formik.touched.abn_number && !formik.errors.abn_number }
          )}
        />
        <div className='form-text'>Required for Australian business verification.</div>
        {abnVerificationState === 'loading' && (
          <div className='text-primary fw-semibold mt-2 d-flex align-items-center gap-2'>
            <span className='spinner-border spinner-border-sm'></span>
            Verifying ABN with the Australian Business Register...
          </div>
        )}
        {abnVerificationState === 'success' && isAbnVerified && (
          <div className='text-success fw-semibold mt-2'>
            ABN verified. Business details have been populated.
          </div>
        )}
        {abnVerificationState === 'error' && abnVerificationMessage && (
          <div className='text-danger fw-semibold mt-2'>
            {abnVerificationMessage}
          </div>
        )}
        {formik.touched.abn_number && formik.errors.abn_number && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.abn_number}</span>
            </div>
          </div>
        )}
      </div>

      <div className='row g-3 mb-8'>
        <div className='col-md-6'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>ABR entity type</label>
          <input
            type='text'
            readOnly
            value={formik.values.entity_type}
            placeholder='Verified entity type'
            className='form-control bg-light'
          />
        </div>

        <div className='col-md-6'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>GST registration</label>
          <input
            type='text'
            readOnly
            value={formik.values.gst_registered === 'yes' ? 'Registered' : formik.values.gst_registered === 'no' ? 'Not registered' : ''}
            placeholder='GST registration status'
            className='form-control bg-light'
          />
        </div>
      </div>

      <div className='row g-3 mb-8'>
        <div className='col-md-6'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Contact person first name</label>
          <input
            placeholder='First name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('first')}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.first && formik.errors.first },
              { 'is-valid': formik.touched.first && !formik.errors.first }
            )}
          />
          {formik.touched.first && formik.errors.first && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.first}</span>
              </div>
            </div>
          )}
        </div>

        <div className='col-md-6'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Contact person last name</label>
          <input
            placeholder='Last name'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('last')}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.last && formik.errors.last },
              { 'is-valid': formik.touched.last && !formik.errors.last }
            )}
          />
          {formik.touched.last && formik.errors.last && (
            <div className='fv-plugins-message-container'>
              <div className='fv-help-block'>
                <span role='alert'>{formik.errors.last}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Email</label>
        <input
          placeholder='Email'
          type='email'
          autoComplete='off'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            { 'is-valid': formik.touched.email && !formik.errors.email }
          )}
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.email}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Phone</label>
        <input
          placeholder='Phone'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('contact_phone')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.contact_phone && formik.errors.contact_phone },
            { 'is-valid': formik.touched.contact_phone && !formik.errors.contact_phone }
          )}
        />
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Address</label>
        <input
          placeholder='Business address'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('address')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.address && formik.errors.address },
            { 'is-valid': formik.touched.address && !formik.errors.address }
          )}
        />
      </div>

      <div className='row g-3 mb-8'>
        <div className='col-md-6'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>State / Territory</label>
          <input
            placeholder='State'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('state')}
            readOnly={isAbnVerified}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.state && formik.errors.state },
              { 'is-valid': formik.touched.state && !formik.errors.state }
            )}
          />
        </div>

        <div className='col-md-6'>
          <label className='form-label fw-bolder text-gray-900 fs-6'>Postcode</label>
          <input
            placeholder='Postcode'
            type='text'
            autoComplete='off'
            {...formik.getFieldProps('postcode')}
            readOnly={isAbnVerified}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.postcode && formik.errors.postcode },
              { 'is-valid': formik.touched.postcode && !formik.errors.postcode }
            )}
          />
        </div>
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Referral code</label>
        <input
          placeholder='Referral code (optional)'
          type='text'
          autoComplete='off'
          {...formik.getFieldProps('referral_code')}
          className='form-control bg-transparent'
        />
        <div className='form-text'>If you were invited by another member, add their code here.</div>
      </div>

      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Password</label>

        <div className='input-group'>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Password'
            autoComplete='off'
            {...formik.getFieldProps('password')}
            className={clsx(
              'form-control bg-transparent',
              { 'is-invalid': formik.touched.password && formik.errors.password },
              { 'is-valid': formik.touched.password && !formik.errors.password }
            )}
          />

          <span className='input-group-text' onClick={() => setShowPassword(!showPassword)} style={{ cursor: 'pointer' }}>
            <i className={`bi ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
          </span>
        </div>

        {formik.touched.password && formik.errors.password && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-5'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Confirm Password</label>

        <div className='input-group'>
          <input
            type={showConfirm ? 'text' : 'password'}
            placeholder='Password confirmation'
            autoComplete='off'
            {...formik.getFieldProps('password_confirmation')}
            className={clsx(
              'form-control bg-transparent',
              {
                'is-invalid': formik.touched.password_confirmation && formik.errors.password_confirmation,
              },
              {
                'is-valid': formik.touched.password_confirmation && !formik.errors.password_confirmation,
              }
            )}
          />

          <span className='input-group-text' onClick={() => setShowConfirm(!showConfirm)} style={{ cursor: 'pointer' }}>
            <i className={`bi ${showConfirm ? 'bi-eye' : 'bi-eye-slash'}`}></i>
          </span>
        </div>

        {formik.touched.password_confirmation && formik.errors.password_confirmation && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.password_confirmation}</span>
            </div>
          </div>
        )}
      </div>

      <div className='fv-row mb-8'>
        <label className='form-check form-check-inline' htmlFor='kt_login_toc_agree'>
          <input className='form-check-input' type='checkbox' id='kt_login_toc_agree' {...formik.getFieldProps('acceptTerms')} />
          <span>
            I Accept the{' '}
            <a href='https://keenthemes.com/metronic/?page=faq' target='_blank' className='ms-1 link-primary'>
              Terms
            </a>
            .
          </span>
        </label>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className='fv-plugins-message-container'>
            <div className='fv-help-block'>
              <span role='alert'>{formik.errors.acceptTerms}</span>
            </div>
          </div>
        )}
      </div>

      <div className='text-center'>
        <button
          type='submit'
          id='kt_sign_up_submit'
          className='btn btn-lg btn-primary w-100 mb-5'
          disabled={formik.isSubmitting || loading || abnVerificationState === 'loading' || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Create Account</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
        <Link to='/auth/login'>
          <button type='button' id='kt_login_signup_form_cancel_button' className='btn btn-lg btn-light-primary w-100 mb-5'>
            Cancel
          </button>
        </Link>
      </div>
    </form>
  )
}
