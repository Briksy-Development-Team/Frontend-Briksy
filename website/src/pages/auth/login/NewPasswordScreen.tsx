import { useState } from 'react';
import { type Screen, ScreenWrapper, Field, Btn } from './shared';

export const NewPasswordScreen = ({ go }: { go: (s: Screen) => void }) => {
  const [pw, setPw] = useState('');
  const [confirm, setConfirm] = useState('');

  const checks: [string, boolean][] = [
    ['At least 10 characters', pw.length >= 10],
    ['One number or symbol', /[\d\W]/.test(pw)],
    ['Passwords match', pw.length > 0 && pw === confirm],
  ];

  return (
    <ScreenWrapper>
      <div>
        <h1 className="text-[1.6rem] font-semibold text-[#2e2318] leading-tight">Set a new password</h1>
        <p className="text-xs text-primary-light-brown mt-1.5">Choose something you don't use anywhere else.</p>
      </div>

      <div className="space-y-3">
        <Field label="New password" type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="••••••••" />
        <Field label="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} placeholder="••••••••" />
      </div>

      <div className="space-y-1.5">
        {checks.map(([label, met]) => (
          <label key={label} className="flex items-center gap-2 text-xs cursor-default select-none transition-colors" style={{ color: met ? '#3D2C1E' : '#A89F95' }}>
            <span className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${met ? 'bg-[#3D2C1E] border-[#3D2C1E]' : 'border-white-100'}`}>
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
