import { useRef, useEffect, type InputHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { type RegisterStep } from './register/Register';

export const AuthBackButton = ({
  onBack,
  className = "",
}: {
  onBack?: () => void;
  className?: string;
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className={`flex items-center gap-2 text-[0.875rem] font-medium text-primary-brown hover:text-primary-light-brown transition-colors cursor-pointer self-start ${className}`}
      aria-label="Back"
    >
      <ArrowLeft className="w-4 h-4 stroke-[2]" />
      <span>Back</span>
    </button>
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
    <div className={`flex flex-col flex-1 overflow-hidden max-w-[40rem] w-full mx-auto text-primary-brown relative ${className}`}>
      {showBack && (
        <div className="px-6 lg:px-12 pt-6 pb-2 shrink-0">
          <AuthBackButton onBack={onBack} />
        </div>
      )}
      {sticky && <div className="sticky top-0 z-10 px-6 lg:px-12 pt-1 pb-3">{sticky}</div>}
      <div ref={ref} className="flex-1 overflow-y-auto px-6 lg:px-12 py-3 flex flex-col gap-4">{content}</div>
    </div>
  );
};

export const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col items-center gap-4 ">
    <h2 className="lg:text-[1.5rem] text-[1.875rem] font-medium  text-center text-primary-brown leading-[1.2] tracking-[-0.03em]">{title}</h2>
    <p className=" text-[0.875reml text-center lg:text-start g:text-[0.75rem]  text-primary-light-brown">{subtitle}</p>
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
  <button {...props} className={`w-full bg-primary-brown text-[#EEECE0] font-medium rounded-[56.25rem] lg:rounded-[0.875rem] py-[0.5rem] h-12 transition-colors   ${className}`}>{children}</button>
);

export const StepIndicator = ({ step, go }: { step: number; go?: (s: RegisterStep) => void }) => (
  <div className="flex flex-col gap-1">
    <div className="flex gap-1.5">
      {[1, 2].map(i => <div key={i} className={`h-[3px] flex-1 rounded-full ${i <= step ? 'bg-primary-brown' : 'bg-[#EDE8E4]'}`} />)}
    </div>
    <div className="flex justify-between text-[0.7rem] text-primary-light-brown">
      <span>Step {step} of 2</span>
      {step === 2 && go && <button onClick={() => go('welcome')} className="text-primary-brown underline hover:opacity-75">Skip for now</button>}
    </div>
  </div>
);

// Used by login screens
export const IconBubble = ({ children }: { children: ReactNode }) => (
  <div className="w-11 h-11 rounded-full bg-[#F8F4EE] flex items-center justify-center">{children}</div>
);
export const Divider = () => (
  <div className="flex items-center gap-3"><div className="flex-1 border-t border-[#EDE8E4]" /><span className="text-[0.625rem] text-primary-light-brown">Or continue with</span><div className="flex-1 border-t border-[#EDE8E4]" /></div>
);

// Unused in login — kept for reference
export type Screen = 'login' | 'forgot' | 'link-sent' | 'new-password' | 'updated';
