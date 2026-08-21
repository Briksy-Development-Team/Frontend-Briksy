import { useState } from "react";

const Toggle = ({ active, onClick }: { active: boolean; onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors duration-300 ease-in-out ${active ? "bg-[#3D2C1E]" : "bg-[#E0D8D0]"
            }`}
    >
        <div
            className={`h-5 w-5 transform rounded-full bg-white shadow-sm transition-transform duration-300 ease-in-out ${active ? "translate-x-5" : "translate-x-0"
                }`}
        />
    </button>
);

const Myprivacy = () => {
    const [suggested, setSuggested] = useState(true);
    const [updates, setUpdates] = useState(true);
    const [marketing, setMarketing] = useState(false);

    return (
        <div className="w-full space-y-10">
            <div className="space-y-1">
                <h1 className="text-[1.875rem] font-medium text-primary-brown">
                    Privacy
                </h1>
                <p className="text-[0.75rem] text-primary-light-brown">
                    Control how your activity is used to personalise Briksy.
                </p>
            </div>

            <div className="space-y-4">
                <h2 className="text-[1.25rem] font-medium text-primary-brown">
                    Personalisation
                </h2>

                <div className="flex flex-col rounded-[1rem] border border-white-100 bg-white overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white-100 px-6 py-6">
                        <div className="pr-10">
                            <h3 className="font-medium text-primary-brown">
                                Suggested professionals
                            </h3>
                            <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                                We use your recent searches to suggest relevant professionals across the site. Turn this off and you'll stop seeing those suggestions.
                            </p>
                        </div>
                        <Toggle active={suggested} onClick={() => setSuggested(!suggested)} />
                    </div>

                    <div className="flex items-center justify-between border-b border-white-100 px-6 py-6">
                        <div className="pr-10">
                            <h3 className="font-medium text-primary-brown">
                                Listing and enquiry updates
                            </h3>
                            <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                                What you view helps us spot your favourites and tell you when something changes — a price drop, or a provider replying. With this off, you won't get those updates.
                            </p>
                        </div>
                        <Toggle active={updates} onClick={() => setUpdates(!updates)} />
                    </div>

                    <div className="flex items-center justify-between px-6 py-6">
                        <div className="pr-10">
                            <h3 className="font-medium text-primary-brown">
                                Personalised marketing
                            </h3>
                            <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                                Lets us tailor the emails and on-site messages you see. With this off, you'll still receive essential account and enquiry emails.
                            </p>
                        </div>
                        <Toggle active={marketing} onClick={() => setMarketing(!marketing)} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-[1.25rem] font-medium text-primary-brown">
                    Your data
                </h2>

                <button className="flex w-full items-center justify-between rounded-[1rem] border border-white-100 bg-white px-6 py-6 text-left transition-colors hover:bg-gray-50">
                    <div>
                        <h3 className="font-medium text-primary-brown text-[0.875rem]">
                            What we collect, and why
                        </h3>
                        <p className="mt-1 text-[0.75rem] text-[#8A7969]">
                            Every category of data we hold, in plain English.
                        </p>
                    </div>
                    <div className="text-[0.75rem] text-primary-brown">
                        Go to Privacy Centre ›
                    </div>
                </button>
            </div>

            {/* Footer Note */}
            <div className="rounded-xl bg-[#EEECE0] px-6 py-5 text-[0.75rem] text-primary-light-brown">
                Briksy never sells your contact details. Providers only see your name and message after you send them an enquiry.
            </div>
        </div>
    );
};

export default Myprivacy;
