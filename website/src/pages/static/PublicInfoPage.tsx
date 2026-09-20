import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import Breadcrumb from "../../components/nav/Breadcrumb";

type Props = {
  kind: "about" | "verification" | "privacy" | "cookies";
};

const legalLinks = [
  {
    label: "Privacy Policy",
    to: "/privacy",
    text: "We value your privacy and encourage you to read our Privacy Policy.",
  },
  {
    label: "User Agreement",
    to: "/terms",
    text: "All users must agree to our User Agreement to access services.",
  },
  {
    label: "Cookie Policy",
    to: "/cookies",
    text: "Learn about how we use cookies in our Cookie Policy.",
  },
];

const mobileLinks = [
  { label: "Privacy Policy", to: "/privacy" },
  { label: "User Agreement", to: "/terms" },
  { label: "Cookie Policy", to: "/cookies" },
];

const PublicInfoPage = ({ kind }: Props) => {
  const navigate = useNavigate();

  if (kind !== "about") {
    return (
      <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 pb-20 font-helvetica" />
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F4EE] font-helvetica text-[#342511]">
      {/* Mobile */}
      <div className="md:hidden">
        <div className="flex  h-14 items-center gap-2 bg-white px-2 pr-4">
          <button
            onClick={() => navigate("/")}
            className="flex h-10 w-10 items-center justify-center"
          >
            <ArrowLeft className="h-5 w-5 text-[#342511]" />
          </button>

          <h1 className="text-[20px] font-medium leading-7 tracking-[-0.1px]">
            Company details
          </h1>
        </div>

        <div className="h-px bg-[#EDE8E4]" />

        <div className="flex flex-col gap-5 px-5 pt-5 pb-6">
          <div className="flex flex-col gap-1 rounded-[14px] border border-[#EDE8E4] bg-white p-4">
            <h2 className="text-[14px] font-medium leading-5">
              Provider of the platform
            </h2>

            <div className="text-[14px] font-normal leading-5 tracking-[0.42px] text-[#7C5F42]">
              <p>Briksy Pty Ltd</p>
              <p>
                Town Hall House, Level 2, 456 Kent Street, Sydney NSW 2000,
                Australia
              </p>
            </div>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-[#EDE8E4] bg-white">
            {mobileLinks.map((item, index) => (
              <Link
                key={item.label}
                to={item.to}
                className={`flex h-[56px] items-center gap-2.5 px-4 ${index !== 0 ? "border-t border-[#EDE8E4]" : ""
                  }`}
              >
                <span className="flex-1 text-[14px] font-medium leading-5">
                  {item.label}
                </span>

                <ChevronRight className="h-5 w-5 text-[#8B6F54]" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="hidden md:block pt-28 pb-20">
        <div className="px-[5%]">
          <Breadcrumb
            items={[
              { label: "Home", href: "/" },
              { label: "company details" },
            ]}
          />

          <div className="mt-4 max-w-[924px]">
            <h1 className="text-[1.875rem] font-medium leading-9 tracking-[-0.03em]">
              About Briksy
            </h1>

            <section className="mt-4">
              <h2 className="text-[1.25rem] font-medium leading-7">
                Provider of platform for accommodation:
              </h2>

              <p className="text-[1rem] leading-7">
                Briksy Pty Ltd
                <br />
                Town Hall House, Level 2, 456 Kent Street, Sydney NSW 2000,
                Australia
              </p>
            </section>

            <ul className="mt-8">
              {legalLinks.map((item) => (
                <li
                  key={item.label}
                  className="flex flex-col space-y-1 text-[1rem] sm:flex-row sm:gap-3"
                >
                  <Link
                    to={item.to}
                    className="shrink-0 font-bold leading-7 tracking-wider hover:underline"
                  >
                    {item.label}
                  </Link>

                  <span className="leading-7 text-[#6C6C6C]">
                    {item.text}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-[1rem] leading-7">
              BRIKSY acts primarily as a platform that facilitates connections
              between users and property-related businesses or professionals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicInfoPage;