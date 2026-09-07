import { useNavigate } from 'react-router-dom';
import { Search, Bell, Bookmark } from 'lucide-react';
import { AuthHeader, Btn, ScreenWrapper } from '../../shared';

const STEPS = [
  { Icon: Search, title: 'Start your search', desc: 'Browse verified professionals and properties near you.' },
  { Icon: Bell,   title: 'Set up alerts',     desc: 'Get notified when new listings or pros match your needs.' },
  { Icon: Bookmark, title: 'Save your favourites', desc: 'Bookmark properties and pros to compare later.' },
];

export const WelcomeScreen = () => {
  const navigate = useNavigate();
  return (
    <ScreenWrapper>
      <AuthHeader title="Welcome to Briksy, Abhi" subtitle="Your account is ready. Here's what's worth doing first." />
      <div className="flex flex-col gap-2.5">
        {STEPS.map(({ Icon, title, desc }) => (
          <button key={title} className="w-full flex items-center gap-3.5 px-4 py-4 border border-[#EDE8E4] rounded-2xl bg-white hover:bg-[#F8F4EE] transition-colors text-left">
            <div className="w-10 h-10 rounded-full bg-[#EEECE0] flex items-center justify-center shrink-0"><Icon size={18} className="text-primary-brown" /></div>
            <div className="flex-1"><p className="text-sm font-medium text-primary-brown">{title}</p><p className="text-[0.75rem] text-primary-light-brown">{desc}</p></div>
            <span className="text-lg text-primary-light-brown">→</span>
          </button>
        ))}
      </div>
      <Btn onClick={() => navigate('/')}>Start searching</Btn>
    </ScreenWrapper>
  );
};