import { useState } from 'react';
import { type Screen, ScreenWrapper, Field, Btn, AuthHeader } from '../shared';

export const ForgotScreen = ({ go }: { go: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!email) return setError('Email is required');
    go('link-sent');
  };

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.75rem] flex flex-col gap-[1.5rem]   mx-auto text-primary-brown">
      <AuthHeader title="Forgot your password?" subtitle="Enter your email and we'll send a link to reset your password." />
      <div className="flex flex-col gap-[0.75rem]">
        <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} error={error} />
      </div>
      <div className='text-[0.875rem] text-primary-light-brown text-center w-full tracking-wider'>Resend Link in 00:00</div>
      <Btn onClick={submit}>Send reset link</Btn>
    </ScreenWrapper>
  );
};
