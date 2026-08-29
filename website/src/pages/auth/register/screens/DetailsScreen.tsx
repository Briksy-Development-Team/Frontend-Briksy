import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth, getAuthErrorMessage } from '../../../../auth/AuthContext'
import { AuthHeader, Btn, Field, ScreenWrapper } from '../../shared'

const TERMS_LABEL = 'I agree to the Briksy Terms and Privacy Policy'

export const DetailsScreen = () => {
  const { register } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    passwordConfirmation: false,
  })

  const nameError = touched.name && !name.trim() ? 'Name is required' : ''
  const emailError = touched.email && !email.trim() ? 'Email is required' : ''
  const passwordError = touched.password && password.length < 8 ? 'Use at least 8 characters' : ''
  const confirmError =
    touched.passwordConfirmation && passwordConfirmation !== password
      ? 'Passwords do not match'
      : ''

  const submit = async (): Promise<void> => {
    setTouched({
      name: true,
      email: true,
      password: true,
      passwordConfirmation: true,
    })

    if (!name.trim() || !email.trim() || password.length < 8 || passwordConfirmation !== password || !agreed) {
      if (!agreed) {
        setError('You need to accept the terms before creating an account.')
      }
      return
    }

    try {
      setLoading(true)
      setError('')
      await register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
      })
    } catch (authError) {
      setError(getAuthErrorMessage(authError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper className="w-full max-w-[40.625rem] px-6 py-10 text-[#342511] sm:px-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <AuthHeader title="Create your seeker account" subtitle="Register to save properties, send enquiries and manage your Briksy activity." />

        <div className="space-y-4">
          <Field
            label="Full name"
            placeholder="Your name"
            value={name}
            onChange={(e) => {
              setName(e.target.value)
              setError('')
            }}
            onBlur={() => setTouched((value) => ({ ...value, name: true }))}
            error={nameError}
          />

          <Field
            label="Email address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setError('')
            }}
            onBlur={() => setTouched((value) => ({ ...value, email: true }))}
            error={emailError}
          />

          <Field
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            onBlur={() => setTouched((value) => ({ ...value, password: true }))}
            error={passwordError}
          >
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8b6f54] transition-colors hover:text-[#342511]"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </Field>

          <Field
            label="Confirm password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Repeat your password"
            value={passwordConfirmation}
            onChange={(e) => {
              setPasswordConfirmation(e.target.value)
              setError('')
            }}
            onBlur={() => setTouched((value) => ({ ...value, passwordConfirmation: true }))}
            error={confirmError}
          />
        </div>

        <label className="flex items-start gap-3 rounded-2xl border border-[#ede8e4] bg-[#fbfaf3] px-4 py-3 text-sm text-[#7c5f42]">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-[#8b6f54] text-[#342511]"
          />
          <span>{TERMS_LABEL}</span>
        </label>

        {error ? (
          <div className="rounded-2xl border border-[#ecd7cf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4d38]">
            {error}
          </div>
        ) : null}

        <Btn onClick={() => void submit()} disabled={loading} className="flex items-center justify-center gap-2">
          {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
          {loading ? 'Creating account' : 'Register'}
        </Btn>

        <div className="flex items-center justify-between text-sm text-[#7c5f42]">
          <span>Already a member?</span>
          <Link to="/login" className="font-medium text-[#342511] underline underline-offset-2">
            Log in
          </Link>
        </div>
      </div>
    </ScreenWrapper>
  )
}
