import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { type Screen, ScreenWrapper, Field, Btn, AuthHeader, RuleItem } from '../shared';

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
    <ScreenWrapper
      onBack={() => go('link-sent')}
      className="w-full pb-8 flex flex-col gap-[1.5rem] mx-auto text-primary-brown"
    >
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

      <div className="flex flex-col gap-2">
        {checks.map(([label, met]) => (
          <RuleItem key={label} label={label} met={met} />
        ))}
      </div>

      <Btn onClick={() => go('updated')} disabled={!checks.every(([, met]) => met)}>
        Save new password
      </Btn>
    </ScreenWrapper>
  );
};