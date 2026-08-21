import { useState } from 'react';
import { type Screen, ScreenWrapper, Field, Btn } from './shared';

export const ForgotScreen = ({ go }: { go: (s: Screen) => void }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const submit = () => {
    if (!email) return setError('Email is required');
    go('link-sent');
  };

  return (
    <ScreenWrapper>
      <div>
        <h1 className="text-[1.6rem] font-semibold text-[#2e2318] leading-tight">Forgot your password?</h1>
        <p className="text-xs text-primary-light-brown mt-2 leading-relaxed">Enter your email and we'll send a link to reset your password.</p>
      </div>
      <Field label="Email Address" type="email" placeholder="you@example.com" value={email} onChange={e => { setEmail(e.target.value); setError(''); }} error={error} />
      <Btn onClick={submit}>Send reset link</Btn>
    </ScreenWrapper>
  );
};
