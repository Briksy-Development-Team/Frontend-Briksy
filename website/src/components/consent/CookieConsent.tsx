import React from "react";
import { Link } from "react-router-dom";
import { useCookieConsent } from "../../context/CookieConsentContext";
import { useReady } from "../utils/ReadyContext";

export const CookieConsent: React.FC = () => {
  const { consent, acceptConsent, declineConsent } = useCookieConsent();
  const { ready } = useReady();

  if (consent !== null || !ready) return null;

  return (
    <div className="fixed inset-0 z-[100] flex   p-4  ">
      <div className="w-full max-w-[400px] h-48 rounded-[20px] bg-[#E2CBB3] p-4 text-[#342511] shadow-[0_10px_10px_rgba(0,0,0,0.10)]">
        <div className="flex flex-col gap-2">
          <h2 className="text-[20px] font-medium leading-7 tracking-[-0.1px]">
            We use cookies
          </h2>

          <p className="text-[14px] leading-5 tracking-[0.42px]">
            We use cookies to improve your experience, analyze traffic and
            show relevant content. Choose whether to allow analytics cookies
            below. Read our{" "}
            <Link
              to="/privacy-policy"
              className="text-[#8B6F54] hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between w-full  gap-1.5">
          <button
            type="button"
            onClick={declineConsent}
            className=" rounded-full  text-[14px] leading-5 tracking-[0.42px] text-[#8B6F54] hover:text-[#342511]"
          >
            Manage cookies
          </button>

          <button
            type="button"
            onClick={acceptConsent}
            className="rounded-full bg-[#342511] px-6 py-3 text-[14px] leading-5 tracking-[0.42px] text-[#F8F4EE] hover:opacity-90"
          >
            Accept cookies
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;