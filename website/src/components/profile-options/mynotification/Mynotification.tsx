import { useState } from "react";

type Channel = "email" | "push";

type RowConfig = {
  id: string;
  title: string;
  desc: string;
  email: boolean;
  push: boolean;
};

type SectionConfig = {
  id: string;
  title: string;
  desc: string;
  rows: RowConfig[];
};

const SECTIONS: SectionConfig[] = [
  {
    id: "enquiries",
    title: "Enquiries and quotes",
    desc: "Updates about professionals you've contacted.",
    rows: [
      {
        id: "replies",
        title: "Replies to your enquiry",
        desc: "A provider responds to something you sent.",
        email: true,
        push: true,
      },
      {
        id: "quotes",
        title: "New quotes",
        desc: "A provider sends you a price.",
        email: true,
        push: true,
      },
      {
        id: "expiring",
        title: "Quote expiring soon",
        desc: "A quote you received is about to lapse",
        email: false,
        push: true,
      },
    ],
  },
  {
    id: "saved-searches",
    title: "Saved searches and alerts",
    desc: "New matches for the searches you've saved.",
    rows: [
      {
        id: "pros",
        title: "New professionals matching your search",
        desc: "Verified providers in your saved categories",
        email: true,
        push: false,
      },
      {
        id: "listings",
        title: "New listings in your saved areas",
        desc: "Homes matching your saved property searches.",
        email: true,
        push: true,
      },
      {
        id: "price",
        title: "Price changes",
        desc: "A saved property changes price",
        email: false,
        push: true,
      },
    ],
  },
  {
    id: "reviews",
    title: "Reviews",
    desc: "Reviews you've left, and ones you owe",
    rows: [
      {
        id: "reminders",
        title: "Reminders to review a completed job",
        desc: "A nudge once the work has finished",
        email: true,
        push: false,
      },
      {
        id: "responses",
        title: "Responses to your reviews",
        desc: "A provider replies to something you wrote",
        email: false,
        push: true,
      },
    ],
  },
  {
    id: "advice",
    title: "Advice and insights",
    desc: "Guides and market news. Turn these off any time.",
    rows: [
      {
        id: "guides",
        title: "Guides and how-tos",
        desc: "Choosing a builder, what things cost",
        email: true,
        push: false,
      },
      {
        id: "market",
        title: "Market updates and trends",
        desc: "Sales results and local movements",
        email: false,
        push: false,
      },
      {
        id: "product",
        title: "Briksy product news",
        desc: "New features and changes",
        email: false,
        push: false,
      },
    ],
  },
];

const initialState = () =>
  Object.fromEntries(
    SECTIONS.flatMap((section) => section.rows).map((row) => [
      row.id,
      { email: row.email, push: row.push },
    ]),
  ) as Record<string, Record<Channel, boolean>>;

const Toggle = ({
  active,
  onClick,
}: {
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${
      active ? "bg-[#3D2C1E]" : "bg-[#E0D8D0]"
    }`}
  >
    <div
      className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${
        active ? "translate-x-5" : "translate-x-0"
      }`}
    />
  </button>
);

const NotificationHeader = () => (
  <div className="flex items-center justify-end px-6 py-4 bg-[#EDE8E4]/60 border-b border-white-100">
    <div className="flex gap-8 items-center justify-center">
      <div className="w-12 flex justify-center">
        <span className="text-[0.75rem] text-primary-light-brown">Email</span>
      </div>
      <div className="w-12 flex justify-center">
        <span className="text-[0.75rem] text-primary-light-brown">Push</span>
      </div>
    </div>
  </div>
);

const ToggleRow = ({
  row,
  state,
  onToggle,
  isLast,
}: {
  row: RowConfig;
  state: Record<Channel, boolean>;
  onToggle: (channel: Channel) => void;
  isLast: boolean;
}) => (
  <div
    className={`flex items-center justify-between px-6 py-6 ${!isLast ? "border-b border-white-100" : ""}`}
  >
    <div className="pr-10">
      <h3 className="font-medium text-primary-brown text-[0.875rem]">
        {row.title}
      </h3>
      <p className="mt-1 text-[0.75rem] text-primary-light-brown">{row.desc}</p>
    </div>
    <div className="flex gap-8 items-center justify-center shrink-0">
      <div className="w-12 flex justify-center">
        <Toggle active={state.email} onClick={() => onToggle("email")} />
      </div>
      <div className="w-12 flex justify-center">
        <Toggle active={state.push} onClick={() => onToggle("push")} />
      </div>
    </div>
  </div>
);

const Mynotification = () => {
  const [pauseAll, setPauseAll] = useState(false);
  const [prefs, setPrefs] = useState(initialState);

  const toggle = (rowId: string, channel: Channel) => {
    setPrefs((prev) => ({
      ...prev,
      [rowId]: { ...prev[rowId], [channel]: !prev[rowId][channel] },
    }));
  };

  return (
    <div className="w-full space-y-10">
      <div className="space-y-1">
        <h1 className="text-[1.875rem] font-medium text-primary-brown">
          Notifications
        </h1>
        <p className="text-[0.75rem] text-primary-light-brown">
          Choose what you hear about, and where it reaches you.
        </p>
      </div>

      <div className="flex items-center justify-between rounded-[1rem] border border-white-100 bg-white px-6 py-6">
        <div className="pr-10">
          <h3 className="font-medium text-primary-brown text-[0.875rem]">
            Pause all notifications
          </h3>
          <p className="mt-1 text-[0.75rem] text-primary-light-brown">
            Mutes everything below. We'll still send you account security and
            anything you've asked us to keep you posted on legally.
          </p>
        </div>
        <Toggle active={pauseAll} onClick={() => setPauseAll(!pauseAll)} />
      </div>

      {SECTIONS.map((section) => (
        <div key={section.id} className="space-y-4">
          <div className="space-y-1">
            <h2 className="text-[1.25rem] font-medium text-primary-brown">
              {section.title}
            </h2>
            <p className="text-[0.75rem] text-primary-light-brown">{section.desc}</p>
          </div>
          <div className="flex flex-col rounded-[1rem] border border-white-100 bg-white overflow-hidden">
            <NotificationHeader />
            {section.rows.map((row, i) => (
              <ToggleRow
                key={row.id}
                row={row}
                state={prefs[row.id]}
                onToggle={(channel) => toggle(row.id, channel)}
                isLast={i === section.rows.length - 1}
              />
            ))}
          </div>
        </div>
      ))}

      <div className="rounded-xl bg-[#EEECE0] px-6 py-5 text-[0.75rem] text-primary-light-brown">
        Security alerts and messages about an active enquiry are always sent by
        email, whatever you choose here.
      </div>
    </div>
  );
};

export default Mynotification;
