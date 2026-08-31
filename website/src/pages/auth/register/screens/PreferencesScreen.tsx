import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { StepIndicator, AuthHeader, Btn, ScreenWrapper } from '../../shared';
import { type RegisterStep } from '../Register';

const PREFS = ['Buying a home', 'Renting', 'Building new', 'Renovating', 'Hiring a trade', 'Selling'];
const NEARBY = ['Camden NSW', 'Footscray VIC', 'Oran Park NSW', 'Use my location'];
const CHIP = (active: boolean) => `px-4 py-2.5 rounded-full border text-sm font-medium transition-colors ${active ? 'bg-primary-brown text-[#EEECE0] border-primary-brown' : 'bg-white border-[#EDE8E4] text-primary-brown hover:border-primary-brown'}`;

export const PreferencesScreen = ({ go }: { go: (s: RegisterStep) => void }) => {
  const [sel, setSel] = useState(['Buying a home', 'Building new', 'Renovating']);
  const toggle = (p: string) => setSel(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);

  return (
    <ScreenWrapper>
      <StepIndicator step={2} go={go} />
      <AuthHeader title="What are you here for?" subtitle="So your searches and alerts start out useful. You can change all of this later." />
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">I'm interested in</label>
        <div className="flex flex-wrap gap-2.5">{PREFS.map(p => <button key={p} onClick={() => toggle(p)} className={CHIP(sel.includes(p))}>{p}</button>)}</div>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-[1rem] font-bold">Where are you looking?</label>
        <div className="relative">
          <input type="text" placeholder="Search suburbs, regions or postcodes" className="w-full h-12 pl-10 pr-3 border border-[#EDE8E4] rounded-xl text-sm placeholder:text-primary-light-brown outline-none focus:border-primary-brown transition-colors bg-white" />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-light-brown" />
        </div>
        <div className="flex flex-wrap gap-2.5">
          {NEARBY.map(s => <button key={s} className="flex items-center gap-1.5 px-3 py-2 rounded-full border border-[#EDE8E4] bg-[#F8F4EE] text-[0.75rem] hover:border-primary-light-brown transition-colors"><MapPin className="w-3 h-3" />{s}</button>)}
        </div>
      </div>
      <div className="rounded-xl bg-[#EEECE0] px-4 py-3.5 text-[0.75rem] text-primary-light-brown leading-relaxed">
        We'll email you when a new verified professional or listing matches. Nothing else — you control the rest in Settings.
      </div>
      <Btn onClick={() => go('welcome')}>Finish and start searching</Btn>
    </ScreenWrapper>
  );
};