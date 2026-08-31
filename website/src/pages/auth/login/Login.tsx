import { useRef, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import Brandpanel from '../../../assets/login/loginleft.png';
import BriksyLogo from '../../../assets/logo/briskybrown.svg';
import { type Screen } from '../shared';
import { LoginScreen } from './LoginScreen';
import { ForgotScreen } from './ForgotScreen';
import { LinkSentScreen } from './LinkSentScreen';
import { NewPasswordScreen } from './NewPasswordScreen';
import { UpdatedScreen } from './UpdatedScreen';

const LINK_CLASS = 'text-white underline underline-offset-2 hover:text-white/90 transition-opacity';

const leftConfig = (screen: Screen, go: (s: Screen) => void, toRegister: () => void): { title: string; footer: React.ReactNode } => ({
  login: { title: 'Welcome back', footer: <>Not a member yet? <button onClick={toRegister} className={LINK_CLASS}>Create an account</button></> },
  forgot: { title: 'Reset your password', footer: <>Remembered it? <button onClick={() => go('login')} className={LINK_CLASS}>Back to login</button></> },
  'link-sent': { title: 'Reset your password', footer: <>Wrong address? <button onClick={() => go('forgot')} className={LINK_CLASS}>Try another email</button></> },
  'new-password': { title: 'Reset your password', footer: <>Not you? <button onClick={() => go('login')} className={LINK_CLASS}>Back to login</button></> },
  updated: { title: "You're all set", footer: <>Need help? <button onClick={() => {}} className={LINK_CLASS}>Contact support</button></> },
}[screen]);

const Login = () => {
  const [screen, setScreen] = useState<Screen>('login');
  const navigate = useNavigate();
  const go = (s: Screen) => setScreen(s);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  
  const { title, footer } = leftConfig(screen, go, () => navigate('/register'));

  useEffect(() => {
    gsap.fromTo([titleRef.current, footerRef.current], { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.06 });
  }, [title]);

  return (
    <div className="h-screen flex items-start sm:items-center justify-center p-4 font-helvetica bg-[#F8F4EE]">
      <div className="flex rounded-[1.5rem] shadow-[0px_24px_60px_0px_rgba(52,37,17,0.3)] overflow-hidden w-full max-w-[55.5rem] bg-white mx-auto origin-center
       min-h-[38.75rem]">

        <div className="relative shrink-0 hidden md:block" style={{ width: '23.875rem' }}>
          <img src={Brandpanel} alt="" className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#1a110a]/20 via-[#1a110a]/40 to-[#1a110a]/80" />
          <div className="absolute top-[1.5rem] left-[1.5rem] z-10">
            <img src={BriksyLogo} alt="BRKSY" className="h-[1.75rem] w-auto brightness-0 invert" />
          </div>
          <div className="absolute top-[4.5rem] left-[1.5rem] right-[1.5rem] z-10">
            <h2 ref={titleRef} className="text-[#EEECE0] text-[1.875rem] font-medium leading-[1.2] tracking-[-0.03em]">{title}</h2>
          </div>
          <div ref={footerRef} className="absolute bottom-[1.5rem] left-[1.5rem] right-[1.5rem] z-10 text-[#EEECE0]/80 text-[0.875rem]">
            {footer}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center min-h-[25rem] bg-white">
          <div className="w-full flex flex-col items-center justify-center">
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