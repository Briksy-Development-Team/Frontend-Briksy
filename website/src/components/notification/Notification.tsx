
import Placeholderproperty from "../../assets/profile/placeholderproperty.svg";

interface INotificationItem {
  id: number;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
  image?: string;
}

interface INotificationGroup {
  group: string;
  items: INotificationItem[];
}

const MOCK_NOTIFICATIONS: INotificationGroup[] = [
  {
    group: "Today",
    items: [
      {
        id: 1,
        title: "Doyle Electrical sent you a quote",
        desc: "$400 for the switchboard upgrade, valid for 14 days.",
        time: "2 hours ago",
        unread: true,
        image: "https://i.pravatar.cc/150?img=33",
      },
      {
        id: 2,
        title: "Hathaway Homes replied to your enquiry",
        desc: "They've suggested a site visit on Thursday at 10am.",
        time: "5 hours ago",
        unread: true,
        image: "https://i.pravatar.cc/150?img=12",
      },
      {
        id: 3,
        title: "Your review of Marshall Tiling is now live",
        desc: "Thanks — reviews are what help the next person choose.",
        time: "8 hours ago",
        unread: false,
        image: "https://i.pravatar.cc/150?img=59",
      },
    ],
  },
  {
    group: "This week",
    items: [
      {
        id: 4,
        title: "3 new builders match your saved search",
        desc: "Camden NSW — two offer fixed price contracts under $300k.",
        time: "Tuesday",
        unread: false,
        image: "https://i.pravatar.cc/150?img=47",
      },
      {
        id: 5,
        title: "How did the job go?",
        desc: "Leave a review for Southbank Plumbing.",
        time: "Monday",
        unread: false,
        image: "https://i.pravatar.cc/150?img=11",
      },
      {
        id: 6,
        title: "Nakamura Landscaping is now licence verified",
        desc: "A professional you saved has completed verification.",
        time: "Monday",
        unread: false,
        image: "https://i.pravatar.cc/150?img=68",
      },
    ],
  },
  {
    group: "Earlier",
    items: [
      {
        id: 7,
        title: "Your enquiry was sent to 3 professionals",
        desc: "You'll usually hear back within a day.",
        time: "2 August",
        unread: false,
        image: "https://i.pravatar.cc/150?img=52",
      },
      {
        id: 8,
        title: "Welcome to Briksy",
        desc: "Save professionals, compare quotes, and keep it all in one place.",
        time: "29 July",
        unread: false,
        image: "https://i.pravatar.cc/150?img=41",
      },
    ],
  },
];

const NotificationCard = ({ item }: { item: INotificationItem }) => {
  return (
    <div className="flex items-start gap-4 rounded-2xl bg-white px-3 py-2 md:px-5 md:py-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md cursor-pointer relative">
      <img
        src={item.image || Placeholderproperty}
        alt=""
        className="md:h-14 md:w-14 h-10 w-10 shrink-0 rounded-xl md:rounded-[0.875rem] object-cover"
        onError={(e) => {
          (e.target as HTMLImageElement).src = Placeholderproperty;
        }}
      />
      <div className="flex flex-col pr-6">
        <h3 className="md:text-[0.875rem] text-[0.75rem] font-medium text-primary-brown">
          {item.title}
        </h3>
        <p className="mt-0.5 md:text-[0.75rem] text-[0.657rem] text-primary-light-brown">
          {item.desc}
        </p>
        <span className="mt-1.5 md:text-[0.75rem] text-[0.6rem] text-primary-light-brown/80 font-medium">
          {item.time}
        </span>
      </div>

      {item.unread && (
        <div className="absolute top-1/2 right-5 h-2 w-2 md:h-3 md:w-3 -translate-y-6 rounded-full bg-[#E86749]" />
      )}
    </div>
  );
};

const Notification = () => {
  
  const hasData = MOCK_NOTIFICATIONS.length > 0;
  return (
    <div className="w-full max-w-2xl mx-auto space-y-10 py-24  lg:pt-10 lg:pb-20">
      <h1 className="text-center text-[1.875rem] font-medium text-primary-brown">
        Notifications
      </h1>

      {!hasData ? (
        <div className="flex flex-col items-center justify-center pt-20">
          <div className="mb-8 w-48 h-48 relative flex items-center justify-center">
            <img
              src={Placeholderproperty}
              alt="No notifications"
              className="w-full h-full object-contain opacity-80"
            />
          </div>

          <h2 className="mb-2 text-[1rem] font-medium text-primary-brown">
            No notifications yet
          </h2>
          <p className="max-w-[280px] text-center text-[0.75rem] text-primary-light-brown">
            You've got a blank slate (for now). We'll let you know when updates
            arrive.
          </p>
        </div>
      ) : (
        <div className="md:space-y-8 space-y-10  w-[90%] mx-auto">
          {MOCK_NOTIFICATIONS.map((section, idx) => (
            <div key={idx} className="md:space-y-3 space-y-6 ">
              <h2 className="text-[0.875rem] font-medium text-primary-brown px-1">
                {section.group}
              </h2>
              <div className="md:space-y-2 space-y-4">
                {section.items.map((item) => (
                  <NotificationCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notification;
