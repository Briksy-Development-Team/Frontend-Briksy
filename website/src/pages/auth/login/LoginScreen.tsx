import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apple from '../../../assets/login/apple.svg';
import google from '../../../assets/login/google.svg';
import { type Screen, ScreenWrapper, Field, Btn, Divider, AuthHeader } from '../shared';
import { Eye, EyeOff } from 'lucide-react';

export const LoginScreen = ({ go }: { go: (s: Screen) => void }) => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

  const submit = () => {
    const e = { email: !email ? 'Email is required' : '', password: !password ? 'Password is required' : '' };
    if (e.email || e.password) return setErrors(e);
    navigate('/profile', { replace: true });
  };

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.75rem] flex flex-col gap-[1.5rem] w-full mx-auto  text-[#342511]">
      <AuthHeader title="Log in" subtitle="Welcome back — good to see you." />

      <div className="flex flex-col gap-[0.75rem]">
        <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })); }} error={errors.email} />
        <Field label="Password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })); }} error={errors.password}>
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[#342511] transition-colors">
            {showPassword ? <EyeOff className="w-[1.25rem] h-[1.25rem]" /> : <Eye className="w-[1.25rem] h-[1.25rem]" />}
          </button>
        </Field>
      </div>

      <div className="flex items-center justify-between mt-[-0.25rem]">
        <label className="flex items-center gap-[0.5rem] text-[0.75rem] text-[#2e2318] cursor-pointer select-none">
          <input type="checkbox" className="accent-primary-brown rounded w-[1rem] h-[1rem]" />
          Keep me signed in
        </label>
        <button onClick={() => go('forgot')} className="text-[0.75rem] text-[#7C5F42] hover:text-[#3D2C1E] underline transition-colors">
          Forgot password?
        </button>
      </div>

      <Btn onClick={submit}>Login</Btn>

      <Divider />

      <div className="flex gap-[0.75rem]">
        <button className="flex-1 flex items-center justify-center border border-white-100 rounded-xl py-[0.625rem] hover:bg-white-50 transition-colors">
          <img src={apple} className="h-[1.25rem] w-[1.25rem]" alt="Apple" />
        </button>
        <button className="flex-1 flex items-center justify-center border border-white-100 rounded-xl py-[0.625rem] hover:bg-white-50 transition-colors">
          <img src={google} className="h-[1.25rem] w-[1.25rem]" alt="Google" />
        </button>
      </div>
    </ScreenWrapper>
  );
};
