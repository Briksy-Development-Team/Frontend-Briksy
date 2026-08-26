import { type RegisterStep } from '../Register';
import { useRef, useState } from 'react';
import { StepIndicator, AuthHeader, Btn, ScreenWrapper } from '../../shared';

const CODE_LENGTH = 6;

export const VerifyScreen = ({ go }: { go: (step: RegisterStep) => void }) => {
  const [code, setCode] = useState(() => Array.from({ length: CODE_LENGTH }, (_, i) => '417'[i] ?? ''));
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const setDigit = (index: number, value: string) => {
    const next = [...code];
    next[index] = value.slice(-1);
    setCode(next);
    if (value && index < CODE_LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.5rem] flex flex-col gap-[1rem] max-w-[40.625rem] mx-auto text-[#342511]">
      <StepIndicator step={2} />
      <AuthHeader title="Confirm your email" subtitle="We sent a 6-digit code to your email address. It expires in 10 minutes." />

      <div className="flex justify-center gap-[0.75rem] pt-[0.5rem] pb-[1.5rem]">
        {code.map((val, i) => (
          <input
            key={i}
            ref={el => { inputs.current[i] = el; }}
            type="text"
            inputMode="numeric"
            value={val}
            onChange={e => setDigit(i, e.target.value)}
            onKeyDown={e => handleKeyDown(i, e)}
            className="w-[3rem] h-[4rem] sm:w-[4rem] sm:h-[4.625rem] border border-[#EDE8E4] rounded-xl text-center text-[1.5rem] font-medium text-[#342511] outline-none focus:border-[#342511] focus:ring-1 focus:ring-[#342511] transition-all"
          />
        ))}
      </div>

      <Btn onClick={() => go('preferences')}>Verify and continue</Btn>

      <div className="flex flex-col items-center gap-[0.25rem] text-[0.75rem]">
        <div className="text-[#7C5F42]">Didn't get it? Resend in 0:42</div>
        <button onClick={() => go('details')} className="text-[#342511] underline hover:opacity-75">Use a different email address</button>
      </div>
    </ScreenWrapper>
  );
};