import { useState } from 'react';
import { Eye, EyeOff, Check, LoaderCircle } from 'lucide-react';
import googleIcon from '../../../../assets/login/google.svg';
import appleIcon from '../../../../assets/login/apple.svg';
import { StepIndicator, AuthHeader, Field, Btn, ScreenWrapper } from '../../shared';
import { type RegisterStep } from '../Register';
import { useAuth, getAuthErrorMessage } from '../../../../auth/AuthContext';

const Rule = ({ met, label }: { met: boolean; label: string }) => (
  <div className="flex items-center gap-2.5">
    <div className={`w-4 h-4 rounded-full shrink-0 ${met ? 'bg-primary-brown' : 'bg-[#EDE8E4]'}`} />
    <span className={`text-[0.75rem] ${met ? 'text-primary-brown font-medium' : 'text-primary-light-brown'}`}>{label}</span>
  </div>
);

export const DetailsScreen = ({ go }: { go: (s: RegisterStep) => void }) => {
  const { register } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const hasLength = pw.length >= 10;
  const hasSymbol = /[\d!@#$%^&*]/.test(pw);
  const valid = firstName && email && pw && hasLength && hasSymbol && agreed;

  const submit = async () => {
    if (!valid) return;
    try {
      setLoading(true);
      setError('');
      await register({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        email: email.trim(),
        password: pw,
        password_confirmation: pw,
      });
      go('preferences');
    } catch (e) {
      setError(getAuthErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScreenWrapper>
      <StepIndicator step={1} />
      <AuthHeader title="Create your account" subtitle="Free for anyone buying, renting or hiring. Takes about a minute." />
      <div className="flex gap-4">
        <Field label="First name" placeholder="First name" value={firstName} onChange={e => setFirstName(e.target.value)} />
        <Field label="Last name" placeholder="Last name" value={lastName} onChange={e => setLastName(e.target.value)} />
      </div>
      <Field label="Email Address" type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
      <Field label="Password" type={showPw ? 'text' : 'password'} placeholder="Create a password" value={pw} onChange={e => { setPw(e.target.value); setError(''); }}>
        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-primary-light-brown hover:text-primary-brown transition-colors">
          {showPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </Field>
      <div className="flex flex-col gap-2">
        <Rule met={hasLength} label="At least 10 characters" />
        <Rule met={hasSymbol} label="One number or symbol" />
      </div>
      <label className="flex gap-3 items-start cursor-pointer group">
        <div className={`mt-0.5 w-[1.375rem] h-[1.375rem] rounded-[5px] border flex items-center justify-center transition-colors shrink-0 ${agreed ? 'bg-primary-brown border-primary-brown' : 'border-[#EDE8E4] group-hover:border-primary-brown'}`}>
          {agreed && <Check className="w-3.5 h-3.5 text-white" />}
        </div>
        <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span className="text-[1rem] text-primary-brown">I agree to Briksy's <a href="#" className="underline hover:opacity-75">Terms of Use</a> and <a href="#" className="underline hover:opacity-75">Privacy Policy</a></span>
      </label>
      {error && <div className="rounded-xl border border-[#ecd7cf] bg-[#fff6f3] px-4 py-3 text-sm text-[#8b4d38]">{error}</div>}
      <Btn onClick={() => void submit()} disabled={!valid || loading} className="flex items-center justify-center gap-2">
        {loading && <LoaderCircle className="w-5 h-5 animate-spin" />}
        {loading ? 'Creating account…' : 'Continue'}
      </Btn>
      <div className="flex items-center gap-3"><div className="flex-1 border-t border-[#EDE8E4]" /><span className="text-sm text-primary-light-brown">Or sign up with</span><div className="flex-1 border-t border-[#EDE8E4]" /></div>
      <div className="flex gap-3">
        {[{ src: googleIcon, label: 'Google' }, { src: appleIcon, label: 'Apple' }].map(({ src, label }) => (
          <button key={label} className="flex-1 h-12 border border-[#8B6F54] rounded-xl flex items-center justify-center gap-2 hover:bg-[#F8F4EE] transition-colors text-sm text-primary-brown font-medium">
            <img src={src} alt={label} className="w-5 h-5" /> {label}
          </button>
        ))}
      </div>
    </ScreenWrapper>
  );
};