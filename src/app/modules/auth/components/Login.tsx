import { AxiosError } from 'axios'
import { useState } from 'react'
import * as Yup from 'yup'
import clsx from 'clsx'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import { toAbsoluteUrl } from '../../../../_metronic/helpers'
import { useAuth } from '../core/Auth'

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const initialValues = {
  email: '',
  password: '',
}

export function Login() {
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate()

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true)
      setStatus(undefined)

      try {
        await login(values.email, values.password)
        navigate('/dashboard', { replace: true })
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? (error.response?.data as { message?: string })?.message ?? 'The login details are incorrect'
            : 'The login details are incorrect'

        setStatus(message)
        setSubmitting(false)
      } finally {
        setLoading(false)
      }
    },
  })

  return (
    <form className='form w-100' onSubmit={formik.handleSubmit} noValidate id='kt_login_signin_form'>
      <div className='text-center mb-11'>
        <h1 className='text-gray-900 fw-bolder mb-3'>Sign In</h1>
        <div className='text-gray-500 fw-semibold fs-6'>Access the admin dashboard</div>
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
      ) : (
        <div className='mb-10 bg-light-info p-8 rounded'>
          <div className='text-info'>Use your admin email and password to continue.</div>
        </div>
      )}

      <div className='fv-row mb-8'>
        <label className='form-label fs-6 fw-bolder text-gray-900'>Email</label>
        <input
          placeholder='Email'
          {...formik.getFieldProps('email')}
          className={clsx(
            'form-control bg-transparent',
            { 'is-invalid': formik.touched.email && formik.errors.email },
            { 'is-valid': formik.touched.email && !formik.errors.email }
          )}
          type='email'
          name='email'
          autoComplete='off'
        />
        {formik.touched.email && formik.errors.email && (
          <div className='fv-plugins-message-container'>
            <span role='alert'>{formik.errors.email}</span>
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

      <div className='d-flex flex-stack flex-wrap gap-3 fs-base fw-semibold mb-8'>
        <div />
        <Link to='/auth/forgot-password' className='link-primary'>
          Forgot Password ?
        </Link>
      </div>

      <div className='d-grid mb-10'>
        <button type='submit' id='kt_sign_in_submit' className='btn btn-primary' disabled={formik.isSubmitting || !formik.isValid}>
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{ display: 'block' }}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>

      <div className='text-gray-500 text-center fw-semibold fs-6'>
        Not a Member yet?{' '}
        <Link to='/auth/registration' className='link-primary'>
          Sign up
        </Link>
      </div>
    </form>
  )
}
