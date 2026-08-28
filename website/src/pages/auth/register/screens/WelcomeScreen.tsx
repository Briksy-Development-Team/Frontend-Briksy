import { useNavigate } from 'react-router-dom';
import { Bookmark, Scale, Send, type LucideIcon } from 'lucide-react';
import { AuthHeader, Btn, ScreenWrapper } from '../../shared';

const ACTIONS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Bookmark, title: 'Save properties', description: 'Keep track of homes you love and get updates.' },
  { icon: Send, title: 'Contact agents instantly', description: 'Send inquiries directly to listing agents.' },
  { icon: Scale, title: 'Compare the market', description: 'Access detailed property data and trends.' },
];

export const WelcomeScreen = () => {
  const navigate = useNavigate();

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.5rem] flex flex-col items-center text-center gap-[1.5rem] max-w-[40.625rem] mx-auto text-[primary-brown]">
      <div className="w-[8.125rem] h-[7.5rem] bg-[#EEECE0] rounded-[1.5rem] flex items-center justify-center">
        <span className="text-[3.75rem]">🎉</span>
      </div>

      <AuthHeader title="Welcome to Briksy, Abhi" subtitle="Your account is ready. Here's what you can do next." />

      <div className="flex flex-col gap-[0.75rem] w-full text-left">
        {ACTIONS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-[1rem] p-[1rem] rounded-[0.875rem] border border-[#EDE8E4] bg-white hover:bg-[#F8F4EE] transition-colors cursor-pointer">
            <div className="w-[2.5rem] h-[2.5rem] rounded-full bg-[#EEECE0] flex items-center justify-center shrink-0">
              <Icon size={20} className="text-[primary-brown]" />
            </div>
            <div className="flex flex-col gap-[0.25rem]">
              <h3 className="text-[0.875rem] font-medium text-[primary-brown]">{title}</h3>
              <p className="text-[0.75rem] text-[primary-light-brown]">{description}</p>
            </div>
          </div>
        ))}
      </div>

      <Btn onClick={() => navigate('/')}>Start exploring</Btn>
    </ScreenWrapper>
  );
};