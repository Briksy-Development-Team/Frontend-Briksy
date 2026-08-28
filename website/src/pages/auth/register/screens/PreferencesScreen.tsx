import { type RegisterStep } from '../Register';
import { useState } from 'react';
import { StepIndicator, AuthHeader, Btn, ScreenWrapper } from '../../shared';
import { Search, MapPin } from 'lucide-react';

const PREFERENCES = ['Buying a home', 'Renting', 'Building new', 'Renovating', 'Hiring a trade', 'Selling'];
const SUGGESTIONS = ['Camden NSW', 'Footscray VIC', 'Oran Park NSW', 'Use my location'];

export const PreferencesScreen = ({ go }: { go: (step: RegisterStep) => void }) => {
  const [selectedPrefs, setSelectedPrefs] = useState<string[]>(['Buying a home', 'Building new', 'Renovating']);
  const [search, setSearch] = useState('');

  const togglePref = (pref: string) =>
    setSelectedPrefs(prev => prev.includes(pref) ? prev.filter(p => p !== pref) : [...prev, pref]);

  return (
    <ScreenWrapper className="w-full px-[3rem] py-[2.5rem] flex flex-col gap-[1.5rem] max-w-[40.625rem] mx-auto text-[primary-brown]">
      <StepIndicator step={3} go={go} />
      <AuthHeader title="Personalize your Briksy" subtitle="Select what you're interested in so we can customize your experience." />

      <div className="flex flex-col gap-[0.5rem]">
        <label className="text-[0.875rem] font-medium text-[#2e2318]">I'm looking for...</label>
        <div className="flex flex-wrap gap-[0.5rem]">
          {PREFERENCES.map(pref => (
            <button
              key={pref}
              onClick={() => togglePref(pref)}
              className={`px-[1rem] h-[2.75rem] rounded-full border text-[0.875rem] font-medium transition-colors ${selectedPrefs.includes(pref) ? 'bg-[primary-brown] text-[#EEECE0] border-[primary-brown]' : 'border-[#CBD5E1] text-[primary-brown] hover:border-[primary-brown]'}`}
            >
              {pref}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-[0.5rem]">
        <label className="text-[0.875rem] font-medium text-[#2e2318]">In these locations...</label>
        <div className="relative">
          <input
            type="text"
            className="w-full h-[2.75rem] pl-[2.5rem] pr-[0.75rem] border border-white-100 rounded-xl text-sm text-[#2e2318] placeholder:text-[#A89F95] outline-none focus:border-[#3D2C1E] transition-colors bg-white"
            placeholder="Search suburbs, regions or postcodes"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Search className="absolute left-[0.75rem] top-1/2 -translate-y-1/2 w-[1.125rem] h-[1.125rem] text-[#A89F95]" />
        </div>
        <div className="flex flex-wrap gap-[0.5rem]">
          {SUGGESTIONS.map(s => (
            <button key={s} className="flex items-center gap-[0.375rem] px-[0.75rem] h-[2rem] rounded-full border border-[#EDE8E4] text-[0.75rem] hover:bg-[#F8F4EE] transition-colors">
              <MapPin className="w-[0.875rem] h-[0.875rem]" />
              {s}
            </button>
          ))}
        </div>
      </div>

      <Btn onClick={() => go('welcome')}>Done</Btn>
    </ScreenWrapper>
  );
};