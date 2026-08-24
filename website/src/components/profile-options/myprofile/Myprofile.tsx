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
    </div>
  );
};

export default Myprofile;
