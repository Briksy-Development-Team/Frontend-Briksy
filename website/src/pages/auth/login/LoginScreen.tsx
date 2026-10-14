import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apple from '../../../assets/login/apple.svg';
import google from '../../../assets/login/google.svg';
import LogoM from '../../../assets/logo/logomobile.svg';
import { type Screen, ScreenWrapper, Field } from '../shared';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';

type LoginScreenProps = {
  go: (s: Screen) => void;
};

const socials = [
  { src: apple, name: 'Apple' },
  { src: google, name: 'Google' },
];

export const LoginScreen = ({ go }: LoginScreenProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  const submit = async () => {
    const newErrors = {
      email: form.email.trim() ? '' : 'Email is required',
      password: form.password ? '' : 'Password is required',
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.password) return;

    setIsLoading(true);
    try {
      const response = await login({ email: form.email.trim(), password: form.password });

      if (response.abilities.includes('seeker')) {
        const fromPath = (location.state as { from?: string } | null)?.from ?? '/account/profile';
        navigate(fromPath, { replace: true });
        return;
      }

      window.localStorage.setItem('kt-auth-react-v', JSON.stringify({
        api_token: response.token,
        token_type: response.token_type,
        abilities: response.abilities,
        user: response.user,
      }));
      const isSuperAdmin = response.abilities.some((a) => a.startsWith('super_admin'));
      window.location.assign(isSuperAdmin ? '/super-admin/dashboard' : '/admin/dashboard');
    } catch {
      setErrors({ email: '', password: "We couldn't sign you in with those details." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenWrapper className="w-full pb-8 h-screen lg:h-auto flex flex-col mx-auto text-primary-brown">
      <img src={LogoM} alt="Briksy" className="block lg:hidden h-[3.5rem] mx-auto w-auto mb-1" />

      <div className="flex flex-col gap-[26px] text-[#342511]">
        <h2 className="text-[1.875rem] font-medium leading-[2.25rem] tracking-[-0.03em]">Log in</h2>

        <div className="flex flex-col gap-4">
          <Field
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={update('email')}
            error={errors.email}
          />

          <Field
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            value={form.password}
            onChange={update('password')}
            error={errors.password}
          >
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light-brown hover:text-primary-brown transition-colors cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </Field>
        </div>

        <div className="flex items-center justify-between gap-2 text-sm">
          <div className="flex items-center gap-1.5">
            <span>Not a member yet?</span>
            <Link to="/register" className="underline underline-offset-2 hover:text-primary-light-brown transition-colors">
              Create an account
            </Link>
          </div>

          <button
            type="button"
            onClick={() => go('forgot')}
            className="text-xs underline underline-offset-2 hover:text-primary-light-brown transition-colors cursor-pointer"
          >
            Forgot your password?
          </button>
        </div>

        <label className="flex items-center gap-3 cursor-pointer select-none">
          <input type="checkbox" className="peer sr-only" />
          <div className="w-[22px] h-[22px] rounded-[5px] border border-[#EDE8E4] bg-white hover:border-primary-brown flex items-center justify-center shrink-0 transition-colors peer-checked:bg-[#342511] peer-checked:border-[#342511] peer-checked:[&>svg]:block">
            <svg width="12" height="10" viewBox="0 0 12 10" fill="none" className="hidden">
              <path d="M1.5 5L4.5 8L10.5 1.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span className="text-base leading-6">Keep me signed in on this device</span>
        </label>

        <button
          type="button"
          onClick={submit}
          disabled={isLoading}
          className="w-full bg-[#342511] hover:bg-[#281c0c] text-white font-medium rounded-full h-[50px] transition-colors text-sm cursor-pointer disabled:opacity-70"
        >
          {isLoading ? 'Logging in...' : 'Continue'}
        </button>

        <div className="flex flex-col gap-3.5">
          <p className="text-center text-sm text-[#7C5F42]">Or continue with</p>

          <div className="flex items-center gap-3 w-full">
            {socials.map(({ src, name }) => (
              <button
                key={name}
                type="button"
                aria-label={`Continue with ${name}`}
                className="flex-1 h-[50px] border border-[#8B6F54] rounded-full flex items-center justify-center hover:bg-[#F8F4EE]/60 transition-colors cursor-pointer"
              >
                <img src={src} alt={name} className="w-[22px] h-[22.5px]" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </ScreenWrapper>
  );
};
