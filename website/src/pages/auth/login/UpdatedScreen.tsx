import { ArrowLeft } from 'lucide-react';

import { type Screen, ScreenWrapper, Btn, IconBubble, AuthHeader } from '../shared';

export const UpdatedScreen = ({ go }: { go: (s: Screen) => void }) => (
  <ScreenWrapper className="w-full lg:px-[3rem] py-[2.75rem] flex flex-col gap-[1.125rem] lg:gap-[1.5rem] mx-auto text-[primary-brown] text-center">

    <button
      type="button"
      onClick={() => go('new-password')}
      className="absolute top-[1.5rem] left-[1.5rem] text-primary-brown hover:text-primary-light-brown transition-colors"
      aria-label="Back to login"
    >
      <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
    </button>

    <div className="lg:flex hidden  justify-center">
      <IconBubble>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5F42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </IconBubble>
    </div>

    <AuthHeader title="Password updated!" subtitle="You're signed in on this device. For safety, we've signed you out everywhere else." />

    <Btn onClick={() => go('login')}>Back to Login</Btn>

    <p className='text-sm text-primary-light-brown text-center w-full'>If you didn't request this, contact us immediately.</p>
  </ScreenWrapper>
);
