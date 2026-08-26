const Myaccounts = () => {
    return (
        <div className="w-full space-y-[2rem]">
            <div className="space-y-1">
                <h1 className="text-[1.875rem] font-medium text-primary-brown">
                    Account
                </h1>
                <p className="text-[0.75rem] text-primary-light-brown">
                    Your sign-in details and account controls.
                </p>
            </div>

            <div className="space-y-[2rem]">
                <h2 className="text-[1.25rem] font-medium text-primary-brown">
                    Email
                </h2>

                <div className="flex items-center justify-between rounded-[1rem] border border-white-100 bg-white px-6 py-6">
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-medium text-primary-brown text-[0.875rem]">
                                abhiguleria1599@gmail.com
                            </h3>
                            <span className="flex items-center gap-1 rounded-full bg-primary-light-brown/50 px-2.5 py-0.5 text-[0.65rem] font-medium text-[#3D2C1E]">
                                <span>✓</span> Verified
                            </span>
                        </div>
                        <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                            We use this to sign you in and send enquiry updates.
                        </p>
                    </div>
                    <button className="text-[0.75rem] text-primary-brown transition-colors hover:opacity-70">
                        Change email ›
                    </button>
                </div>
            </div>

            <div className="space-y-[2rem]">
                <div className="space-y-1">
                    <h2 className="text-[1.25rem] font-medium text-primary-brown">
                        Password
                    </h2>
                    <p className="text-[0.75rem] text-primary-light-brown">
                        Briksy is password-less.
                    </p>
                </div>

                <div className="rounded-[1rem] border border-white-100 bg-white px-6 py-6">
                    <p className="text-[0.875rem] text-primary-brown">
                        There's no password to update. When you sign in, enter your email address and we'll send a single-use verification code.
                    </p>
                </div>
            </div>

            <div className="space-y-[2rem]">
                <h2 className="text-[1.25rem] font-medium text-primary-brown">
                    Security
                </h2>

                <div className="flex flex-col rounded-[1rem] border border-white-100 bg-white overflow-hidden">
                    <div className="flex items-center justify-between border-b border-white-100 px-6 py-6">
                        <div className="pr-10">
                            <h3 className="font-medium text-primary-brown text-[0.875rem]">
                                Sign out everywhere
                            </h3>
                            <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                                Lost a device, or signed in on a public computer? Sign out on all devices to protect your account.
                            </p>
                        </div>
                        <button className="whitespace-nowrap rounded-full border border-white-100 px-5 py-2.5 text-[0.75rem] font-medium text-primary-brown transition-colors hover:bg-gray-50">
                            Sign out on all devices
                        </button>
                    </div>

                    <div className="flex items-center justify-between px-6 py-6">
                        <div className="pr-10">
                            <h3 className="font-medium text-primary-brown text-[0.875rem]">
                                Delete account
                            </h3>
                            <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                                Permanently removes your profile, saved searches, enquiries and reviews. This can't be undone.
                            </p>
                        </div>
                        <button className="whitespace-nowrap rounded-full border border-[#E86749] px-5 py-2.5 text-[0.75rem] font-medium text-[#E86749] transition-colors hover:bg-[#E86749]/10">
                            Delete account
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-[#EEECE0] px-6 py-5">
                <div>
                    <h3 className="font-medium text-primary-brown text-[0.875rem]">
                        Data and privacy, made simple
                    </h3>
                    <p className="mt-1 text-[0.75rem] text-primary-light-brown">
                        See what we collect, how it's used, and what you can turn off.
                    </p>
                </div>
                <button className="whitespace-nowrap rounded-full bg-[#3D2C1E] px-6 py-2.5 text-[0.75rem] font-medium text-white transition-opacity hover:opacity-90">
                    Go to Privacy Centre
                </button>
            </div>
        </div>
    );
};

export default Myaccounts;
