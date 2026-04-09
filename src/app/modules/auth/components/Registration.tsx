import { AxiosError } from 'axios'
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'

const initialValues = {
  first: '',
  last: '',
  email: '',
  password: '',
  password_confirmation: '',
  acceptTerms: false,
}

const registrationSchema = Yup.object().shape({
  first: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(120, 'Maximum 120 symbols')
    .required('First is required'),
  last: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(120, 'Maximum 120 symbols')
    .required('Last is required'),
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(150, 'Maximum 150 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Minimum 8 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
  password_confirmation: Yup.string()
    .oneOf([Yup.ref('password')], "Password and Confirm Password didn't match")
    .required('Password confirmation is required'),
  acceptTerms: Yup.bool().required('You must accept the terms and conditions'),
})

export function Registration() {
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: registrationSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setStatus(undefined)

      try {
        await register({
          first: values.first,
          last: values.last,

          email: values.email,
          password: values.password,
          password_confirmation: values.password_confirmation,
        })
        navigate('/dashboard', { replace: true })
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { message?: string })?.message ??
            'The registration details are incorrect'
            : 'The registration details are incorrect'

        setStatus(message)
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
      noValidate
      id='kt_login_signup_form'
      onSubmit={formik.handleSubmit}
    >
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign Up</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Create your admin account</div>
      </div>

      <div className='row g-3 mb-9'>
        <div className='col-md-6'>
          <a
            href='#'
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/svg/brand-logos/google-icon.svg')}
              className='h-15px me-3'
            />
            Sign in with Google
          </a>
        </div>
        <div className='col-md-6'>
          <a
            href='#'
            className='btn btn-flex btn-outline btn-text-gray-700 btn-active-color-primary bg-state-light flex-center text-nowrap w-100'
          >
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/svg/brand-logos/apple-black.svg')}
              className='theme-light-show h-15px me-3'
            />
            <img
              alt='Logo'
              src={toAbsoluteUrl('media/svg/brand-logos/apple-black-dark.svg')}
              className='theme-dark-show h-15px me-3'
            />
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
        <label className='form-label fw-bolder text-gray-900 fs-6'>First name</label>
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
      <div className='fv-row mb-8'>
        <label className='form-label fw-bolder text-gray-900 fs-6'>Last name</label>

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

          <span
            className='input-group-text'
            onClick={() => setShowPassword(!showPassword)}
            style={{ cursor: 'pointer' }}
          >
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
                'is-invalid':
                  formik.touched.password_confirmation && formik.errors.password_confirmation,
              },
              {
                'is-valid':
                  formik.touched.password_confirmation && !formik.errors.password_confirmation,
              }
            )}
          />

          <span
            className='input-group-text'
            onClick={() => setShowConfirm(!showConfirm)}
            style={{ cursor: 'pointer' }}
          >
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
          <input
            className='form-check-input'
            type='checkbox'
            id='kt_login_toc_agree'
            {...formik.getFieldProps('acceptTerms')}
          />
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
          disabled={formik.isSubmitting || !formik.isValid || !formik.values.acceptTerms}
        >
          {!loading && <span className='indicator-label'>Submit</span>}
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
