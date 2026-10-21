import { useRef, useEffect, type InputHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import Brandpanel from '../../assets/login/loginleft.svg';
import appleIcon from '../../assets/login/apple.svg';
import googleIcon from '../../assets/login/google.svg';
import { type RegisterStep } from './register/Register';

export const AuthBackButton = ({
  onBack,
  className = "",
}: {
  onBack?: () => void;
  className?: string;
}) => {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      onClick={() => (onBack ? onBack() : navigate(-1))}
      className={`flex items-center gap-2 text-[0.875rem] font-medium text-primary-brown hover:text-primary-light-brown transition-colors cursor-pointer self-start ${className}`}
      aria-label="Back"
    >
      <ArrowLeft className="w-4 h-4 stroke-[2]" />
      <span>Back</span>
    </button>
  );
};

/**
 * Shared modal container for all Auth screens (Login, Forgot, Reset, and Register flow).
 * Left side is identical across all screens, right side supports internal scroll.
 */
export const AuthModalLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="h-screen flex items-start sm:items-center justify-center lg:p-4 font-helvetica bg-white">
      <div
        className="
          flex
          rounded-[1.5rem]
          lg:shadow-[0px_24px_60px_0px_rgba(52,37,17,0.3)]
          shadow-none
          overflow-hidden
          w-full
          lg:max-w-[60rem]
          lg:bg-white
          mx-auto
          origin-center
          min-h-[38.75rem]
          h-full
          lg:h-[38.75rem]
        "
      >
        {/* Left panel - identical across Login and Register */}
        <div
          className="relative shrink-0 hidden lg:block"
          style={{ width: "23.875rem" }}
        >
          <img
            src={Brandpanel}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        </div>

        {/* Right panel with internal scroll */}
        <main
          data-lenis-prevent
          className="flex-1 flex flex-col min-h-0 h-full overflow-hidden"
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export const ScreenWrapper = ({
  children,
  className = '',
  onBack,
  showBack = true,
  hasSticky = false,
}: {
  children: ReactNode;
  className?: string;
  onBack?: () => void;
  showBack?: boolean;
  hasSticky?: boolean;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const arr = Array.isArray(children) ? children : [children];
  const sticky = hasSticky ? arr[0] : null;
  const content = hasSticky ? arr.slice(1) : arr;

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        Array.from(ref.current!.children),
        { x: 36, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08, clearProps: 'all' }
      );
    }, ref.current);
    return () => ctx.revert();
  }, []);

  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 overflow-hidden max-w-[40rem] w-full mx-auto text-primary-brown relative ${className}`}>
      {showBack && (
        <div className="px-6 lg:px-12 pt-6 pb-2 shrink-0">
          <AuthBackButton onBack={onBack} />
        </div>
      )}
      {sticky && <div className="sticky top-0 z-10 px-6 lg:px-12 pt-2 pb-2 shrink-0 bg-white/95 backdrop-blur-sm">{sticky}</div>}
      <div
        ref={ref}
        data-lenis-prevent
        className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-6 lg:px-12 py-3 flex flex-col gap-4 no-scrollbar"
      >
        {content}
      </div>
    </div>
  );
};

export const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center gap-4 ">
    <h2 className="lg:text-[1.5rem] text-[1.875rem] font-medium text-center text-primary-brown leading-[1.2] tracking-[-0.03em]">{title}</h2>
    <p className="text-[0.875rem] text-center lg:text-start lg:text-[0.75rem] text-primary-light-brown">{subtitle}</p>
  </div>
);

export const Field = ({ label, error, children, ...props }: { label: string; error?: string; children?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-2 mb-3 lg:mb-0 w-full">
    <label className="text-sm font-medium text-primary-brown">{label}</label>
    <div className="relative">
      <input {...props} className={`w-full border rounded-[0.375rem] px-3 py-3 text-sm text-primary-brown placeholder:text-primary-light-brown outline-none transition-colors ${error ? 'border-red-400' : 'border-[#CBD5E1] focus:border-primary-brown'} ${props.className ?? ''}`} />
      {children}
    </div>
    {error && <p className="text-[0.688rem] text-red-500">{error}</p>}
  </div>
);

export const Btn = ({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`w-full bg-primary-brown text-[#EEECE0] font-medium rounded-full py-[0.5rem] h-[50px] transition-colors cursor-pointer hover:bg-[#281c0c] disabled:opacity-70 ${className}`}>{children}</button>
);

export const StepIndicator = ({ step, go }: { step: number; go?: (s: RegisterStep) => void }) => (
  <div className="flex flex-col gap-1">
    <div className="flex gap-1.5">
      {[1, 2].map(i => <div key={i} className={`h-[3px] flex-1 rounded-full ${i <= step ? 'bg-primary-brown' : 'bg-[#EDE8E4]'}`} />)}
    </div>
    <div className="flex justify-between text-[0.7rem] text-primary-light-brown">
      <span>Step {step} of 2</span>
      {step === 2 && go && <button onClick={() => go('welcome')} className="text-primary-brown underline hover:opacity-75 cursor-pointer">Skip for now</button>}
    </div>
  </div>
);

// Used by login screens
export const IconBubble = ({ children }: { children: ReactNode }) => (
  <div className="w-11 h-11 rounded-full bg-[#F8F4EE] flex items-center justify-center">{children}</div>
);

export const RuleItem = ({ met, label }: { met: boolean; label: string }) => (
  <div className="flex items-center gap-2.5 text-xs select-none transition-colors" style={{ color: met ? '#342511' : '#A89F95' }}>
    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 transition-all duration-200 ${met ? 'bg-primary-brown border-primary-brown text-white' : 'border-[#EDE8E4] bg-white'}`}>
      {met && (
        <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
          <path d="M1.5 4l2 2 3-3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </span>
    <span className={met ? 'font-medium text-primary-brown' : 'text-primary-light-brown'}>{label}</span>
  </div>
);

export const SocialAuthButtons = ({ title = 'Or continue with', showLabel = false }: { title?: string; showLabel?: boolean }) => (
  <div className="flex flex-col gap-3.5">
    {title && <p className="text-center text-sm text-[#7C5F42]">{title}</p>}
    <div className="flex items-center gap-3 w-full">
      {[
        { src: appleIcon, name: 'Apple' },
        { src: googleIcon, name: 'Google' },
      ].map(({ src, name }) => (
        <button
          key={name}
          type="button"
          aria-label={`Continue with ${name}`}
          className="flex-1 h-[50px] border border-[#8B6F54] rounded-full flex items-center justify-center gap-2 hover:bg-[#F8F4EE]/60 transition-colors cursor-pointer text-sm font-medium text-primary-brown"
        >
          <img src={src} alt={name} className="w-[22px] h-[22.5px]" />
          {showLabel && <span>{name}</span>}
        </button>
      ))}
    </div>
  </div>
);

export type Screen = 'login' | 'forgot' | 'link-sent' | 'new-password' | 'updated';
