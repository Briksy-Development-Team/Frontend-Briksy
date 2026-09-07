import { type Screen, ScreenWrapper, Btn, IconBubble, AuthHeader } from '../shared';

export const LinkSentScreen = ({ go }: { go: (s: Screen) => void }) => (
  <ScreenWrapper className="w-full px-[3rem] py-[2.75rem] flex flex-col gap-[1.5rem]  mx-auto text-[primary-brown]">
    <IconBubble>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5F42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="M2 7l10 7 10-7" />
      </svg>
    </IconBubble>

    <AuthHeader title="Check your email" subtitle="We sent a reset link. It expires in 30 minutes and can only be used once." />

    <Btn onClick={() => go('new-password')}>Open email app</Btn>

    <p className="text-center text-[0.75rem] text-[#A89F95]">
      Didn't get it?{' '}
      <button onClick={() => go('forgot')} className="text-[primary-light-brown] underline hover:text-[#3D2C1E] transition-colors">
        Resend
      </button>
    </p>
  </ScreenWrapper>
);
