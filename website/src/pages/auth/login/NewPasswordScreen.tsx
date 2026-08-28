import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { type Screen, ScreenWrapper, Field, Btn, AuthHeader } from '../shared';

export const NewPasswordScreen = ({ go }: { go: (s: Screen) => void }) => {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const checks: [string, boolean][] = [
    ['At least 10 characters', pw.length >= 10],
    ['One number or symbol', /[\d\W]/.test(pw)],
    ['Passwords match', pw.length > 0 && pw === confirm],
  ];

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.75rem] flex flex-col gap-[1.5rem] mx-auto text-[primary-brown]">
      <AuthHeader title="Set a new password" subtitle="Choose something you don't use anywhere else." />

      <div className="flex flex-col gap-[0.75rem]">
        <Field
          label="Password"
          type={showPw ? 'text' : 'password'}
          placeholder="••••••••"
          value={pw}
          onChange={e => setPw(e.target.value)}
        >
          <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[primary-brown] transition-colors">
            {showPw ? <EyeOff className="w-[1.25rem] h-[1.25rem]" /> : <Eye className="w-[1.25rem] h-[1.25rem]" />}
          </button>
        </Field>
        <Field
          label="Confirm password"
          type={showConfirm ? 'text' : 'password'}
          placeholder="••••••••"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
        >
          <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-[0.75rem] top-1/2 -translate-y-1/2 text-[#A89F95] hover:text-[primary-brown] transition-colors">
            {showConfirm ? <EyeOff className="w-[1.25rem] h-[1.25rem]" /> : <Eye className="w-[1.25rem] h-[1.25rem]" />}
          </button>
        </Field>
      </div>

      <div className="flex flex-col gap-[0.375rem]">
        {checks.map(([label, met]) => (
          <label key={label} className="flex items-center gap-[0.5rem] text-[0.75rem] cursor-default select-none transition-colors" style={{ color: met ? '#3D2C1E' : '#A89F95' }}>
            <span className={`w-[0.875rem] h-[0.875rem] rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${met ? 'bg-[#3D2C1E] border-[#3D2C1E]' : 'border-white-100'}`}>
              {met && (
                <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                  <path d="M1.5 4l2 2 3-3" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
            {label}
          </label>
        ))}
      </div>

      <Btn onClick={() => go('updated')} disabled={!checks.every(([, met]) => met)}>
        Save new password
      </Btn>
    </ScreenWrapper>
  );
};