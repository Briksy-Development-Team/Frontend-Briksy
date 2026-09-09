import {
  type Screen,
  ScreenWrapper,
  Btn,
  IconBubble,
  AuthHeader,
} from "../shared";
import { ArrowLeft } from 'lucide-react';


export const LinkSentScreen = ({ go }: { go: (s: Screen) => void }) => (
  <ScreenWrapper className="w-full lg:px-[3rem] py-[2.75rem] flex flex-col gap-[1.125rem] lg:gap-[1.5rem]  mx-auto text-[primary-brown]">

    <button
      type="button"
      onClick={() => go('forgot')}
      className="absolute top-[1.5rem] left-[1.5rem] text-primary-brown hover:text-primary-light-brown transition-colors"
      aria-label="Back to login"
    >
      <ArrowLeft className="w-[1.25rem] h-[1.25rem]" />
    </button>
    <span className="hidden lg:flex">
      {" "}
      <IconBubble>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7C5F42"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="M2 7l10 7 10-7" />
        </svg>
      </IconBubble>
    </span>

    <AuthHeader
      title="Check your email"
      subtitle="We sent a reset link. It expires in 30 minutes and can only be used once."
    />

    <span className="bg-[#F8F4EE] rounded-[0.875rem] p-2 space-y-2">
      <p>Didn't arrive?</p>
      <p>
        Check your spam folder, and make sure you used the address you signed up
        with.
      </p>
    </span>
    <Btn onClick={() => go("new-password")}>Open email app</Btn>

    <div className='text-[0.875rem] text-primary-light-brown text-center w-full tracking-wider'>Resend Link in 00:00</div>

  </ScreenWrapper>
);
