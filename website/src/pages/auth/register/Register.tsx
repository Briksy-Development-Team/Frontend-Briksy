import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import Brandpanel from '../../../assets/login/loginleft.png';
import BriksyLogo from '../../../assets/logo/briskybrown.svg';
import { DetailsScreen } from './screens/DetailsScreen';
import { VerifyScreen } from './screens/VerifyScreen';
import { PreferencesScreen } from './screens/PreferencesScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

gsap.registerPlugin(Flip);

export type RegisterStep = 'details' | 'verify' | 'preferences' | 'welcome';

const SCREENS: Record<RegisterStep, React.ComponentType<{ go: (s: RegisterStep) => void }>> = {
  details: DetailsScreen,
  verify: VerifyScreen,
  preferences: PreferencesScreen,
  welcome: WelcomeScreen,
};

const LINK_CLASS = 'text-white underline underline-offset-2 hover:text-white/90 transition-opacity';

const LEFT_CONFIG: Record<'default' | 'welcome', { title: string; linkLabel: string; linkTo: string; prompt: string }> = {
  default: { title: 'Join Briksy', prompt: 'Already a member?', linkLabel: 'Log in', linkTo: '/login' },
  welcome: { title: "You're in", prompt: 'Run a business?', linkLabel: 'List it on Briksy', linkTo: '/business' },
};

const Register = () => {
  const [step, setStep] = useState<RegisterStep>('details');
  const navigate = useNavigate();
  const containerRef = useRef<HTMLDivElement>(null);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const mounted = useRef(false);

  const { title, prompt, linkLabel, linkTo } = LEFT_CONFIG[step === 'welcome' ? 'welcome' : 'default'];
  const Screen = SCREENS[step];

  const go = (s: RegisterStep) => {
    if (s === step) return;
    if (containerRef.current) {
      flipState.current = Flip.getState(containerRef.current, { props: 'width,height' });
    }
    setStep(s);
  };

  useLayoutEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (flipState.current && containerRef.current) {
      Flip.from(flipState.current, { duration: 0.5, ease: 'power3.inOut' });
      flipState.current = null;
    }
  }, [step]);

  useEffect(() => {
    gsap.fromTo([titleRef.current, footerRef.current], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 });
  }, [title]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-helvetica bg-[#F8F4EE]">
      <div ref={containerRef} className="flex rounded-[24px] shadow-[0px_24px_60px_0px_rgba(52,37,17,0.3)] overflow-hidden w-full max-h-[51rem] max-w-[67.5rem]
       bg-white mx-auto origin-center">

        <div className="relative shrink-0 hidden md:block" style={{ width: '26.875rem' }}>
          <img src={Brandpanel} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a110a]/20 via-[#1a110a]/40 to-[#1a110a]/80" />
          <div className="absolute top-[1.5rem] left-[1.5rem] z-10">
            <img src={BriksyLogo} alt="BRKSY" className="h-[1.75rem] w-auto brightness-0 invert" />
          </div>
          <div className="absolute top-[4.5rem] left-[1.5rem] right-[1.5rem] z-10">
            <h2 ref={titleRef} className="text-[#EEECE0] text-[1.875rem] font-medium leading-[1.2] tracking-[-0.03em]">{title}</h2>
          </div>
          <div ref={footerRef} className="absolute bottom-[1.5rem] left-[1.5rem] right-[1.5rem] z-10 text-[#EEECE0]/80 text-[0.875rem]">
            {prompt} <button onClick={() => navigate(linkTo)} className={LINK_CLASS}>{linkLabel}</button>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Screen go={go} />
        </div>

      </div>
    </div>
  );
};

export default Register;