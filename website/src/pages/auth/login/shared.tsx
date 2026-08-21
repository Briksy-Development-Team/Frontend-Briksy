import { useRef, useEffect, type InputHTMLAttributes, type ButtonHTMLAttributes, type ReactNode } from 'react';
import gsap from 'gsap';

export type Screen = 'login' | 'forgot' | 'link-sent' | 'new-password' | 'updated';

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

export const Field = ({ label, error, ...props }: { label: string; error?: string } & InputHTMLAttributes<HTMLInputElement>) => (
  <div className="space-y-1.5">
    <label className="block text-xs font-medium text-[#2e2318]">{label}</label>
    <input {...props} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm text-[#2e2318] placeholder:text-[#A89F95] outline-none transition-colors bg-white ${error ? 'border-red-400 focus:border-red-400' : 'border-white-100 focus:border-[#3D2C1E]'}`} />
    {error && <p className="text-[11px] text-red-500">{error}</p>}
  </div>
);

export const Btn = ({ children, variant = 'primary', ...props }: { variant?: 'primary' | 'outline' } & ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...props} className={`w-full rounded-xl py-2.5 text-sm font-medium transition-opacity ${variant === 'primary' ? 'bg-[#3D2C1E] text-white hover:opacity-90 disabled:opacity-50' : 'border border-white-100 text-[#3D2C1E] hover:bg-white-50'}`}>
    {children}
  </button>
);

export const IconBubble = ({ children }: { children: ReactNode }) => (
  <div className="w-11 h-11 rounded-full bg-white-50 flex items-center justify-center">{children}</div>
);

export const Divider = () => (
  <div className="flex items-center gap-3">
    <div className="flex-1 border-t border-white-100" />
    <span className="text-[10px] text-[#A89F95] shrink-0">Or continue with</span>
    <div className="flex-1 border-t border-white-100" />
  </div>
);
