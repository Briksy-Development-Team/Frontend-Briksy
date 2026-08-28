import { type RegisterStep } from '../Register';
import googleIcon from '../../../../assets/login/google.svg';
import appleIcon from '../../../../assets/login/apple.svg';
import { Eye, EyeOff, Check } from 'lucide-react';
import { useState } from 'react';
import { StepIndicator, AuthHeader, Field, Btn, ScreenWrapper } from '../../shared';

export const DetailsScreen = ({ go }: { go: (step: RegisterStep) => void }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.5rem] flex flex-col gap-[1.5rem] max-w-[40.625rem] mx-auto text-[primary-brown]">
      <StepIndicator step={1} />
      <AuthHeader title="Create your account" subtitle="Sign up to access exclusive property listings and features." />

      <div className="flex flex-col gap-[1rem]">
        <Field label="Name" placeholder="Full name" />
        <Field label="Email" type="email" placeholder="Email address" />
        <Field label="Phone" type="tel" placeholder="Phone number" />
        <Field label="Password" type={showPassword ? 'text' : 'password'} placeholder="Create a password">
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[primary-brown] transition-colors">
            {showPassword ? <EyeOff className="w-[1.25rem] h-[1.25rem]" /> : <Eye className="w-[1.25rem] h-[1.25rem]" />}
          </button>
        </Field>
      </div>

      <div className="flex gap-[0.5rem]">
        <button className="flex-1 h-[3rem] border border-[#E2E8F0] rounded-xl flex items-center justify-center hover:bg-[#F8F4EE] transition-colors">
          <img src={googleIcon} alt="Google" className="w-[1.25rem] h-[1.25rem]" />
        </button>
        <button className="flex-1 h-[3rem] border border-[#E2E8F0] rounded-xl flex items-center justify-center hover:bg-[#F8F4EE] transition-colors">
          <img src={appleIcon} alt="Apple" className="w-[1.25rem] h-[1.25rem]" />
        </button>
      </div>

      <Btn onClick={() => go('verify')}>Continue</Btn>

      <label className="flex gap-[0.75rem] items-start cursor-pointer group">
        <div className={`mt-[0.125rem] w-[1.25rem] h-[1.25rem] rounded border flex items-center justify-center transition-colors shrink-0 ${agreed ? 'bg-[primary-brown] border-[primary-brown]' : 'border-[#CBD5E1] group-hover:border-[primary-brown]'}`}>
          {agreed && <Check className="w-[0.875rem] h-[0.875rem] text-white" />}
        </div>
        <input type="checkbox" className="hidden" checked={agreed} onChange={e => setAgreed(e.target.checked)} />
        <span className="text-[0.875rem] text-[primary-light-brown] leading-tight">
          I agree to the <a href="#" className="text-[primary-brown] hover:underline">Terms of Service</a> and <a href="#" className="text-[primary-brown] hover:underline">Privacy Policy</a>
        </span>
      </label>
    </ScreenWrapper>
  );
};