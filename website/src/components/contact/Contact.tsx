import { Link, useNavigate } from "react-router-dom";
import Contacts from "../../assets/videos/Contact.mp4";

const badges = ["ABN verification required", "No setup fees", "Cancel anytime"];

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full px-[5%] font-helvetica  py-10 lg:py-14">
      <div className="w-full bg-[#F0ECE5] rounded-[2rem] lg:px-8 p-4  flex flex-col lg:flex-row items-center justify-between gap-10">
        <div className="lg:w-[50%] w-full ">
          <div className=" flex-wrap hidden lg:flex gap-3 mb-8">
            {badges.map((badge) => (
              <span
                key={badge}
                className="bg-white rounded-full px-5 py-2 text-lg text-[#2E2620]"
              >
                {badge}
              </span>
            ))}
          </div>

          <h2 className="text-[#2E2620] text-[1.875rem] lg:text-[3.625rem] leading-tight font-medium">
            Are you a property
            <br />
            professional?
          </h2>

          <p className="text-[#5C5347] text-[1rem] mt-6 max-w-lg">
            Join <span className="font-semibold text-[1.25rem] text-[#2E2620]">340+</span>{" "}
            verified builders, brokers, and trades on Briksy. List your
            services, manage enquiries, and grow your business.
          </p>

          <div className="flex items-center gap-4 mt-10">
            <button onClick={() => navigate("/coming-soon")} className="sm:px-6 sm:py-3 px-3 py-2  bg-primary-brown text-white rounded-xl text-[0.8rem] sm:text-[1rem] font-medium">
              List Your Business
            </button>

            <Link
              to="/subs"
              className="sm:px-6 sm:py-3 border px-3 py-2  text-[0.8rem] border-primary-brown text-primary-brown rounded-xl sm:text-[1rem] font-medium bg-white"
            >
              View Subscription Plans
            </Link>
          </div>
        </div>

        <div className="lg:w-[40%] bg-gray-400  hidden lg:flex   justify-center">
          <video preload="none"
            src={Contacts}
            autoPlay
            loop
            muted
            playsInline
            className="w-full  h-auto object-contain"
          />{" "}
        </div>
      </div>
    </div>
  );
};

export default Contact;
