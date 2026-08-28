import Placeholder from "../../../assets/profile/placeholders.svg";

const Myprofile = () => {
  return (
    <div className="w-full mx-auto font-helvetica space-y-[2.5rem]">
      <div className="w-full h-auto  flex justify-between items-center">
        <h1 className="text-[1.875rem] pb-5 font-medium text-primary-brown">
          About
        </h1>
        <button className="bg-primary-brown text-white px-4 py-3 rounded-xl">
          Save Profile
        </button>
      </div>
      <div className="w-full rounded-xl bg-[#EDE8E4] px-7 py-4 flex items-center gap-5">
        <span className="w-9 h-9 rounded-full bg-primary-light-brown/50 flex items-center justify-center text-[#3D2B1F]">
          i
        </span>

        <p className="text-sm text-[#3D2B1F]">
          Please verify your mobile number to access all features.
        </p>
      </div>

      <div className=" flex w-full h-full">
        <div className=" w-[30%] flex flex-col items-center space-y-[0.75rem]">
          <span className="">
            <img src={Placeholder} className="w-[14.75rem] h-[14.75rem]" />
          </span>
          <button className="px-5 py-3 bg-white rounded-[0.5rem] border-[1.5px] border-[#E7E7E4]">
            Change Profile Picture{" "}
          </button>
        </div>
        <div className=" w-[70%]">
          <form action="" className="grid grid-cols-2 gap-x-5 gap-y-3 pt-10">
            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">First name</label>

              <input
                type="text"
                value="Abhi"
                readOnly
                className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[20px] font-medium text-[#30291F] outline-none"
              />
            </div>


            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">Last name</label>

              <input
                type="text"
                value="****"
                readOnly
                className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[20px] font-medium text-[#30291F] outline-none"
              />
            </div>


            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">Email</label>

              <input
                type="email"
                className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[20px] text-[#30291F] outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">Phone No.</label>

              <div className="relative">
                <input
                  type="tel"
                  className="h-[2.875rem] w-full rounded-xl border border-[#C8C5BD] bg-white px-4 pr-32 text-[20px] text-[#30291F] outline-none"
                />

                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.875rem] font-medium text-red-600"
                >
                  Verify Now
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">Email</label>

              <input
                type="email"
                className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[0.875rem] text-[#30291F] outline-none"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">Phone No.</label>

              <div className="relative">
                <input
                  type="tel"
                  className="h-[2.875rem] w-full rounded-xl border border-[#C8C5BD] bg-white px-4 pr-28 text-[0.875rem] text-[#30291F] outline-none"
                />

                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.875rem] font-medium text-[#30291F]">
                  Verified
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">D.O.B.</label>

              <div className="relative">
                <input
                  type="date"
                  className="h-[2.875rem] w-full rounded-xl border border-[#C8C5BD] bg-white px-4 text-[0.875rem] text-[#30291F] outline-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[0.875rem] text-[#8E8B82]">
                Preference Budget
              </label>

              <input
                type="text"
                className="h-[2.875rem] rounded-xl border border-[#C8C5BD] bg-white px-4 text-[20px] text-[#30291F] outline-none"
              />
            </div>
          </form>
        </div>
      </div>

      <div className="w-full rounded-xl bg-white p-6 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-[0.875rem] text-primary-brown">abhiguleria1599@gmail.com</span>
            <span className="text-[0.75rem] bg-[#E2CBB3] text-[#3D2B1F] px-2 py-0.5 rounded-full">
              ✓ Verified
            </span>
          </div>
          <p className="text-xs text-primary-light-brown mt-1">
            We use this to sign you in and send enquiry updates.
          </p>
        </div>
        <button className="text-[0.75rem] text-primary-brown">Change email ›</button>
      </div>

      {/* Password */}
      <div className="space-y-3">
        <div>
          <h2 className="text-[1.25rem] font-medium text-primary-brown">Password</h2>
          <p className="text-[0.75rem] text-primary-brown">Briksy is password-less.</p>
        </div>
        <div className="w-full rounded-xl bg-white p-6">
          <p className="text-[1rem] text-primary-brown">
            There's no password to update. When you sign in, enter your email
            address and we'll send a single-use verification code.
          </p>
        </div>
      </div>

      <div className="space-y-3">
        <h2 className="text-[1.25rem] font-medium text-primary-brown">Security</h2>
        <div className="w-full rounded-xl bg-white divide-y divide-[#E7E7E4]">
          <div className="flex justify-between items-center p-6">
            <div>
              <p className="font-medium text-primary-brown text-[0.875rem]">Sign out everywhere</p>
              <p className="text-xs text-primary-light-brown text-[0.75rem]">
                Lost a device, or signed in on a public computer? Sign out on
                all devices to protect your account.
              </p>
            </div>
            <button className="px-6.5  py-3.5 rounded-[62.4375rem] border border-[#C8C5BD] text-[0.875rem] text-primary-brown">
              Sign out on all devices
            </button>
          </div>
          <div className="flex justify-between items-center p-6">
            <div>
              <p className="font-medium text-primary-brown text-[0.875rem]">Delete account</p>
              <p className="text-xs text-primary-light-brown text-[0.75rem]">
                Permanently removes your profile, saved searches, enquiries
                and reviews. This can't be undone.
              </p>
            </div>
            <button className="px-6.5  py-3.5 rounded-[62.4375rem] border border-red-400 text-sm text-red-500">
              Delete account
            </button>
          </div>
        </div>
      </div>

      <div className="w-full rounded-xl bg-[#EEECE0] p-6 flex justify-between items-center">
        <div>
          <p className="font-medium text-[0.875rem] text-primary-brown">Data and privacy, made simple</p>
          <p className="text-[0.75rem] text-primary-light-brown">
            See what we collect, how it's used, and what you can turn off.
          </p>
        </div>
        <button className="bg-primary-brown text-white px-6.5 py-3.5 rounded-[62.4375rem]">
          Go to Privacy Centre
        </button>
      </div>
    </div>
  );
};

export default Myprofile;