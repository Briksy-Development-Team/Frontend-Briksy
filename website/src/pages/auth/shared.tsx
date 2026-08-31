import { useRef, useEffect, type InputHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';
import { type RegisterStep } from './register/Register';

export const ScreenWrapper = ({ children, className = '' }: { children: ReactNode; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const arr = Array.isArray(children) ? children : [children];
  const [sticky, ...rest] = arr;
  useEffect(() => {
    const ctx = gsap.context(() => gsap.fromTo(Array.from(ref.current!.children), { x: 36, opacity: 0 }, { x: 0, opacity: 1, duration: 0.4, ease: 'power3.out', stagger: 0.08, clearProps: 'all' }), ref.current!);
    return () => ctx.revert();
  }, []);
  return (
    <div className={`flex flex-col flex-1 overflow-hidden max-w-[40rem] w-full  mx-auto text-primary-brown ${className}`}>
      <div className="sticky top-0 bg-white z-10 px-8 pt-5 pb-3 border-b border-[#EDE8E4]">{sticky}</div>
      <div ref={ref} className="flex-1 overflow-y-auto px-8 py-5 flex flex-col gap-3">{rest}</div>
    </div>
  );
};

export const AuthHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="flex flex-col gap-4 ">
    <h2 className="text-[1.5rem] font-medium text-primary-brown leading-[1.2] tracking-[-0.03em]">{title}</h2>
    <p className="text-[0.75rem] text-primary-light-brown">{subtitle}</p>
  </div>
);

export const Field = ({ label, error, children, ...props }: { label: string; error?: string; children?: ReactNode } & InputHTMLAttributes<HTMLInputElement>) => (
  <div className="flex flex-col gap-1 w-full">
    <label className="text-sm font-medium text-primary-brown">{label}</label>
    <div className="relative">
      <input {...props} className={`w-full border rounded-xl px-3 py-2 text-sm text-primary-brown placeholder:text-primary-light-brown outline-none transition-colors bg-white ${error ? 'border-red-400' : 'border-[#EDE8E4] focus:border-primary-brown'} ${props.className ?? ''}`} />
      {children}
    </div>
    {error && <p className="text-[0.688rem] text-red-500">{error}</p>}
  </div>
);

export const Btn = ({ children, className = '', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`w-full bg-primary-brown text-[#EEECE0] font-medium rounded-[0.875rem] h-12 transition-colors   ${className}`}>{children}</button>
);

export const StepIndicator = ({ step, go }: { step: number; go?: (s: RegisterStep) => void }) => (
  <div className="flex flex-col gap-1">
    <div className="flex gap-1.5">
      {[1, 2, 3].map(i => <div key={i} className={`h-[3px] flex-1 rounded-full ${i <= step ? 'bg-primary-brown' : 'bg-[#EDE8E4]'}`} />)}
    </div>
    <div className="flex justify-between text-[0.7rem] text-primary-light-brown">
      <span>Step {step} of 3</span>
      {step === 3 && go && <button onClick={() => go('welcome')} className="text-primary-brown underline hover:opacity-75">Skip for now</button>}
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
