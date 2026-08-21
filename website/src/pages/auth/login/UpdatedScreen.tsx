import { type Screen, ScreenWrapper, Btn, IconBubble } from './shared';

export const UpdatedScreen = ({ go }: { go: (s: Screen) => void }) => (
  <ScreenWrapper className="space-y-4 text-center">
    <div className="flex justify-center">
      <IconBubble>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#7C5F42" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="11" width="18" height="11" rx="2" />
          <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
      </IconBubble>
    </div>

    <div>
      <h1 className="text-[1.6rem] font-semibold text-[#2e2318] leading-tight">Password updated!</h1>
      <p className="text-xs text-primary-light-brown mt-2 leading-relaxed">
        You're signed in on this device. For safety, we've signed you out everywhere else.
      </p>
    </div>

    <Btn onClick={() => go('login')}>Back to Login</Btn>
  </ScreenWrapper>
);
