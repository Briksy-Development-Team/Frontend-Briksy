import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import Brandpanel from '../../../assets/login/loginleft.png';
import BriksyLogo from '../../../assets/logo/briskybrown.svg';
import { DetailsScreen } from './screens/DetailsScreen';
import { PreferencesScreen } from './screens/PreferencesScreen';
import { WelcomeScreen } from './screens/WelcomeScreen';

gsap.registerPlugin(Flip);

export type RegisterStep = 'details' | 'preferences' | 'welcome';

const SCREENS: Record<RegisterStep, React.ComponentType<{ go: (s: RegisterStep) => void }>> = {
  details: DetailsScreen,
  preferences: PreferencesScreen,
  welcome: WelcomeScreen,
};



const Register = () => {
  const [step, setStep] = useState<RegisterStep>('details');
  const containerRef = useRef<HTMLDivElement>(null);
  const flipState = useRef<ReturnType<typeof Flip.getState> | null>(null);
  const mounted = useRef(false);

  const Screen = SCREENS[step];

  const go = (s: RegisterStep) => {
    if (s === step) return;
    if (containerRef.current) flipState.current = Flip.getState(containerRef.current, { props: 'width,height' });
    setStep(s);
  };

  useLayoutEffect(() => {
    if (!mounted.current) { mounted.current = true; return; }
    if (flipState.current && containerRef.current) {
      Flip.from(flipState.current, { duration: 0.5, ease: 'power3.inOut' });
      flipState.current = null;
    }
  }, [step]);

  

  return (
    <div className="min-h-screen flex items-center justify-center p-4 font-helvetica bg-white">
      <div ref={containerRef} className="flex rounded-[24px] shadow-[0px_24px_60px_0px_rgba(52,37,17,0.3)] overflow-hidden w-full max-h-[51rem] max-w-[67.5rem] bg-white mx-auto origin-center">

        <div className="relative shrink-0 hidden md:block" style={{ width: '26.875rem' }}>
          <img src={Brandpanel} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a110a]/20 via-[#1a110a]/40 to-[#1a110a]/80" />
          <div className="absolute left-6 top-6 z-10">
            <img src={BriksyLogo} alt="Briksy" className="h-7 w-auto brightness-0 invert" />
          </div>
          <div className="absolute left-6 right-6 top-20 z-10">
            <h2 className="text-[1.875rem] font-medium leading-[1.2] tracking-[-0.03em] text-[#eeece0]">
              Join Briksy
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-[#eeece0]/80">
              Create a seeker account to save properties, track inquiries and manage your activity.
            </p>
          </div>
          <div className="absolute bottom-6 left-6 right-6 z-10 text-sm text-[#eeece0]/85">
            Already a member?{' '}
            <Link to="/login" className="underline underline-offset-2 transition hover:text-white">
              Log in
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Screen go={go} />
        </div>
      </div>
    </div>
  )
}

export default Register
