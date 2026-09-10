import { useState } from 'react';
import { type Screen, ScreenWrapper, Field, Btn, AuthHeader } from '../shared';
import { ArrowLeft } from 'lucide-react';

export const ForgotScreen = ({ go }: { go: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!email) return setError('Email is required');
    go('link-sent');
  };

  return (
    <ScreenWrapper className="w-full lg:px-[3rem] py-[2.75rem] flex flex-col gap-[1.5rem]   mx-auto text-primary-brown">

      <button
        type="button"
        onClick={() => go('login')}
        className="absolute top-[1.5rem] left-[1.5rem] text-primary-brown hover:text-primary-light-brown transition-colors"
        aria-label="Back to login"
      >
        <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
      </button>
      <AuthHeader title="Forgot your password?" subtitle="Enter your email and we'll send a link to reset your password." />
      <div className="flex flex-col gap-[0.75rem]">
        <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} error={error} />
      </div>
      <Btn onClick={submit}>Send reset link</Btn>
    </ScreenWrapper>
  );
};