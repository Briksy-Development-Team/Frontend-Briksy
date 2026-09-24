// SubscriptionTabs.tsx
import type { TabData } from '../data/subscription.data';

interface SubscriptionTabsProps {
  tabs: TabData[];
  activeId: string;
  onChange: (id: string) => void;
}

export default function SubscriptionTabs({ tabs, activeId, onChange }: SubscriptionTabsProps) {
  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={`px-5 py-2 rounded-full text-[0.875rem] font-medium transition-all duration-200 cursor-pointer ${
            activeId === tab.id
              ? 'bg-primary-brown text-white shadow-sm'
              : 'bg-white border border-gray-50 text-primary-brown hover:bg-white-50'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
