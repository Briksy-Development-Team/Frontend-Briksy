import { useRef, useEffect, type InputHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';
import { type RegisterStep } from './register/Register';



export const ScreenWrapper = ({ children, className = 'space-y-4' }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(Array.from(el.children), { x: 36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08, clearProps: 'all' });
    }, el);
    return () => ctx.revert();
  }, []);
  return <div ref={ref} className={className}>{children}</div>;
};

export const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col gap-[0.25rem]">
    <h2 className="text-[1.875rem] font-bold text-[primary-brown] leading-[1.2] tracking-tight">{title}</h2>
    <p className="text-[0.875rem] text-[primary-light-brown]">{subtitle}</p>
  </div>
);

export const Field = ({ label, error, children, ...props }: { label: string; error?: string; children?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-[0.375rem] w-full">
    <label className="block text-[1rem] font-medium text-[#2e2318]">{label}</label>
    <div className="relative">
      <input {...props} className={`w-full border rounded-[0.75rem] px-[0.875rem] py-[0.625rem] text-[0.875rem] text-[#2e2318] placeholder:text-[#A89F95] outline-none transition-colors bg-white ${error ? 'border-red-400 focus:border-red-400' : 'border-white-100 focus:border-[#3D2C1E]'}`} />
      {children}
    </div>
    {error && <p className="text-[0.688rem] text-red-500">{error}</p>}
  </div>
);

export const Btn = ({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`w-full bg-[primary-brown] text-[#EEECE0] font-medium text-[1.25rem] rounded-[0.875rem] h-[4.25rem] hover:bg-[primary-brown]/90 transition-colors disabled:opacity-50 ${className}`}>
    {children}
  </button>
);

export const IconBubble = ({ children }: { children: ReactNode }) => (
  <div className="w-[2.75rem] h-[2.75rem] rounded-full bg-white-50 flex items-center justify-center">{children}</div>
);

export const Divider = () => (
  <div className="flex items-center gap-[0.75rem]">
    <div className="flex-1 border-t border-white-100" />
    <span className="text-[0.625rem] text-[#A89F95] shrink-0">Or continue with</span>
    <div className="flex-1 border-t border-white-100" />
  </div>
);

export const StepIndicator = ({ step, go }: { step: number; go?: (step: RegisterStep) => void }) => (
  <div className="flex flex-col gap-[0.125rem]">
    <div className="flex gap-[0.375rem]">
      {[1, 2, 3].map(i => <div key={i} className={`h-[0.25rem] flex-1 rounded-full ${i <= step ? 'bg-[primary-brown]' : 'bg-[#EDE8E4]'}`} />)}
    </div>
    <div className="flex justify-between items-center text-[0.75rem] text-[primary-light-brown] mt-[0.25rem]">
      <span>Step {step} of 3</span>
      {step === 3 && go && <button onClick={() => go('welcome')} className="text-[primary-brown] underline hover:opacity-75 transition-opacity">Skip for now</button>}
    </div>
  </div>
);

export type Screen = 'login' | 'forgot' | 'link-sent' | 'new-password' | 'updated';
