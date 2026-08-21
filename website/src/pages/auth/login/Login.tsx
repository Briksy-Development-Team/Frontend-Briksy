import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Brandpanel from '../../../assets/login/loginleft.png';
import BriksyLogo from '../../../assets/logo/briskybrown.svg';
import { type Screen } from './shared';
import { LoginScreen } from './LoginScreen';
import { ForgotScreen } from './ForgotScreen';
import { LinkSentScreen } from './LinkSentScreen';
import { NewPasswordScreen } from './NewPasswordScreen';
import { UpdatedScreen } from './UpdatedScreen';

const link = (label: string, onClick: () => void) => (
  <button onClick={onClick} className="text-white underline underline-offset-2 hover:text-white/90 transition-opacity">{label}</button>
);

const leftConfig = (screen: Screen, go: (s: Screen) => void, toRegister: () => void): { title: string; footer: React.ReactNode } => ({
  login: { title: 'Welcome back', footer: <>Not a member yet? {link('Create an account', toRegister)}</> },
  forgot: { title: 'Reset your password', footer: <>Remembered it? {link('Back to login', () => go('login'))}</> },
  'link-sent': { title: 'Reset your password', footer: <>Wrong address? {link('Try another email', () => go('forgot'))}</> },
  'new-password': { title: 'Reset your password', footer: <>Not you? {link('Back to login', () => go('login'))}</> },
  updated: { title: "You're all set", footer: <>Need help? {link('Contact support', () => { })}</> },
}[screen]);

const Login = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const navigate = useNavigate();
  const go = (s: Screen) => setScreen(s);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const { title, footer } = leftConfig(screen, go, () => navigate('/register'));
  console.log(Brandpanel);
  useEffect(() => {
    gsap.fromTo([titleRef.current, footerRef.current], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 });
  }, [title]);

  return (
    <div className="min-h-screen  flex items-center font-helvetica justify-center p-4">
      <div className="flex rounded-[14px] shadow-[0_4px_24px_rgba(61,44,30,0.08)] overflow-hidden w-full" style={{ maxWidth: 860, height: 520 }}>

        <div className="relative shrink-0" style={{ width: '38%' }}>
          <img src={Brandpanel} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a110a]/50 via-transparent to-[#1a110a]/70" />
          <div className="absolute top-6 left-6 z-10">
            <img src={BriksyLogo} alt="BRKSY" className="h-7 w-auto brightness-0 invert" />
          </div>
          <div className="absolute top-[4.5rem] left-6 right-6 z-10">
            <h2 ref={titleRef} className="text-white text-[1.45rem] font-semibold leading-snug">{title}</h2>
          </div>
          <div ref={footerRef} className="absolute bottom-6 left-6 right-6 z-10 text-white/70 text-[0.72rem]">
            {footer}
          </div>
        </div>

        <div className="flex-1 bg-white flex items-center justify-center overflow-y-auto">
          <div className="w-full px-10 py-6" style={{ maxWidth: 340 }}>
            {screen === 'login' && <LoginScreen go={go} />}
            {screen === 'forgot' && <ForgotScreen go={go} />}
            {screen === 'link-sent' && <LinkSentScreen go={go} />}
            {screen === 'new-password' && <NewPasswordScreen go={go} />}
            {screen === 'updated' && <UpdatedScreen go={go} />}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;