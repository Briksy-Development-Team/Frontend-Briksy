import {AxiosError} from 'axios'
import {type ChangeEvent, type FormEvent, useState} from 'react'
import {Link, Navigate, useNavigate} from 'react-router-dom'
import loginbg from '../../assest/login/loginbg.svg'
import briksy from '../../assest/logo/briksy.svg'
import headphone from '../../assest/login/headphone.svg'
import google from '../../assest/login/google.svg'
import apple from '../../assest/login/apple.svg'
import {getAuthErrorMessage, useAuth} from '../../auth/AuthContext'

interface SignUpProps {
  dark: boolean
}

const SignUp = ({dark}: SignUpProps) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirm_password: '',
  })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {register, isAuthenticated} = useAuth()
  const navigate = useNavigate()

  if (isAuthenticated) {
    return <Navigate to='/profile' replace />
  }

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const {name, value} = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    if (form.password !== form.confirm_password) {
      setError('Password and confirm password must match.')
      return
    }

    setIsSubmitting(true)

    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
        password_confirmation: form.confirm_password,
      })
      navigate('/profile', {replace: true})
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 422) {
        const payload = error.response.data as {
          message?: string
          errors?: Record<string, string[]>
        }
        const firstFieldError = payload.errors ? Object.values(payload.errors)[0]?.[0] : undefined
        setError(payload.message ?? firstFieldError ?? 'Please check your details and try again.')
      } else {
        setError(getAuthErrorMessage(error))
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div
      className='h-screen w-screen flex flex-col items-center'
      style={{
        backgroundImage: `url(${loginbg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className='w-full p-6'>
        <div className='flex justify-between items-center w-full'>
          <img src={briksy} alt='Briksy' />
          <Link to='/contact'>
            <img src={headphone} alt='Support' />
          </Link>
        </div>
      </div>
      <div className='h-full w-full flex justify-center items-center'>
        <div className='w-[40%] min-w-[320px] rounded-3xl bg-white'>
          <div className='bg-[#EEECE099] rounded-3xl flex p-3 m-2 flex-col items-center space-y-8'>
            <div className='flex flex-col items-center pt-6 space-y-3 justify-center'>
              <h1 className='text-5xl text-[#2C3F24] font-medium tracking-tighter'>
                Create Your Account
              </h1>
              <p className='text-base text-center font-medium tracking-tight'>
                Join Briksy to connect with verified property
                <br /> professionals across Australia.
              </p>
            </div>
            <div className='h-full w-full'>
              <form onSubmit={handleSubmit} className='space-y-6'>
                <div className='flex flex-col px-2 space-y-2'>
                  <label className='font-bold'>Full Name</label>
                  <input
                    type='text'
                    name='name'
                    placeholder='Enter your full name'
                    value={form.name}
                    onChange={handleChange}
                    className='w-full p-2 bg-white rounded-lg text-sm font-medium'
                    required
                  />
                </div>
                <div className='flex flex-col px-2 space-y-2'>
                  <label className='font-bold'>Email Address</label>
                  <input
                    type='email'
                    name='email'
                    placeholder='Enter your email address'
                    value={form.email}
                    onChange={handleChange}
                    className='w-full p-2 bg-white rounded-lg text-sm font-medium'
                    required
                  />
                </div>
                <div className='flex flex-col px-2 space-y-2'>
                  <label className='font-bold'>Password</label>
                  <input
                    type='password'
                    name='password'
                    placeholder='Enter your password'
                    value={form.password}
                    onChange={handleChange}
                    className='w-full p-2 bg-white rounded-lg text-sm font-medium'
                    required
                  />
                </div>
                <div className='flex flex-col px-2 space-y-2'>
                  <label className='font-bold'>Confirm Password</label>
                  <input
                    type='password'
                    name='confirm_password'
                    placeholder='Re-enter your password'
                    value={form.confirm_password}
                    onChange={handleChange}
                    className='w-full p-2 bg-white rounded-lg text-sm font-medium'
                    required
                  />
                </div>
                {error && (
                  <div
                    className={`mx-2 rounded-lg px-3 py-2 text-sm ${
                      dark ? 'bg-red-950 text-red-200' : 'bg-red-50 text-red-700'
                    }`}
                  >
                    {error}
                  </div>
                )}
                <div className='w-full flex flex-col gap-2'>
                  <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full bg-[#2C3F24] text-white py-3 rounded-lg font-semibold disabled:opacity-70'
                  >
                    {isSubmitting ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
                  </button>
                  <div className='text-start font-medium text-sm'>
                    <span className='text-gray-600'>Already have an account? </span>
                    <Link to='/login' className='text-[#2C3F24] font-medium hover:underline'>
                      Sign In
                    </Link>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className='bg-[#EEECE099] flex gap-3 p-4 m-2 rounded-3xl'>
            <div className='flex-1 bg-white rounded-xl flex items-center justify-center py-4 cursor-pointer hover:shadow-md transition'>
              <img src={google} alt='Google' className='w-8 h-8' />
            </div>

            <div className='flex-1 bg-white rounded-xl flex items-center justify-center py-4 cursor-pointer hover:shadow-md transition'>
              <img src={apple} alt='Apple' className='w-8 h-8' />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp
