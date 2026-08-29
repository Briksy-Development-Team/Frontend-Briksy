import { useState } from 'react'
import { Eye, EyeOff, LoaderCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth, getAuthErrorMessage } from '../../../auth/AuthContext'
import { Field, Btn, ScreenWrapper, AuthHeader } from '../shared'

export const LoginScreen = () => {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [touched, setTouched] = useState({ email: false, password: false })

  const emailError = touched.email && !email.trim() ? 'Email is required' : ''
  const passwordError = touched.password && !password ? 'Password is required' : ''

  const submit = async (): Promise<void> => {
    setTouched({ email: true, password: true })

    if (!email.trim() || !password) {
      return
    }

    try {
      setLoading(true)
      setError('')
      await login({ email, password })
    } catch (authError) {
      setError(getAuthErrorMessage(authError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScreenWrapper className="w-full max-w-[40.625rem] px-6 py-10 text-[#342511] sm:px-10 sm:py-12">
      <div className="mx-auto flex w-full max-w-md flex-col gap-6">
        <AuthHeader title="Log in" subtitle="Use your email address to access your seeker account." />

        <div className="space-y-4">
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
            placeholder="Enter your password"
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
        </div>

        {error ? (
          <div className="rounded-2xl border border-[#ecd7cf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4d38]">
            {error}
          </div>
        ) : null}

        <Btn onClick={() => void submit()} disabled={loading} className="flex items-center justify-center gap-2">
          {loading ? <LoaderCircle className="h-5 w-5 animate-spin" /> : null}
          {loading ? 'Signing in' : 'Login'}
        </Btn>

        <div className="flex items-center justify-between text-sm text-[#7c5f42]">
          <span>New to Briksy?</span>
          <Link to="/register" className="font-medium text-[#342511] underline underline-offset-2">
            Create account
          </Link>
        </div>
      </div>
    </ScreenWrapper>
  )
}
