import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apple from '../../../assets/login/apple.svg';
import google from '../../../assets/login/google.svg';
import { type Screen, ScreenWrapper, Field, Btn, Divider } from './shared';

export const LoginScreen = ({ go }: { go: (s: Screen) => void }) => {
  const navigate = useNavigate();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors]     = useState({ email: '', password: '' });

  const submit = () => {
    const e = { email: !email ? 'Email is required' : '', password: !password ? 'Password is required' : '' };
    if (e.email || e.password) return setErrors(e);
    navigate('/profile', { replace: true });
  };

  return (
    <ScreenWrapper>
      <div>
        <h1 className="text-[1.6rem] font-semibold text-[#2e2318] leading-tight">Log in</h1>
        <p className="text-xs text-primary-light-brown mt-1">Welcome back — good to see you.</p>
      </div>

      <div className="space-y-3">
        <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setErrors(v => ({ ...v, email: '' })); }} error={errors.email} />
        <Field label="Password" type="password" placeholder="••••••••" value={password} onChange={e => { setPassword(e.target.value); setErrors(v => ({ ...v, password: '' })); }} error={errors.password} />
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-xs text-[#2e2318] cursor-pointer select-none">
          <input type="checkbox" className="accent-[#3D2C1E] rounded" />
          Keep me signed in
        </label>
        <button onClick={() => go('forgot')} className="text-xs text-primary-light-brown hover:text-[#3D2C1E] underline transition-colors">
          Forgot password?
        </button>
      </div>

      <Btn onClick={submit}>Login</Btn>

      <Divider />

      <div className="flex gap-3">
        <button className="flex-1 flex items-center justify-center border border-white-100 rounded-xl py-2.5 hover:bg-white-50 transition-colors">
          <img src={apple} className="h-5 w-5" alt="Apple" />
        </button>
        <button className="flex-1 flex items-center justify-center border border-white-100 rounded-xl py-2.5 hover:bg-white-50 transition-colors">
          <img src={google} className="h-5 w-5" alt="Google" />
        </button>
      </div>
    </ScreenWrapper>
  );
};
