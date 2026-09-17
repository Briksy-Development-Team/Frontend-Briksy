import { Link } from "react-router-dom";
import Logo from "../../assets/logo/briksyB.svg";
import Insta from "../../assets/icons/instas.svg";
import Face from "../../assets/icons/face.svg";
import Whats from "../../assets/icons/whats.svg";
import Linkd from "../../assets/icons/Linkedin.svg";
import Xs from "../../assets/icons/x.svg";

const footerLinks = [
  {
    title: "Find",
    links: [
      { label: "Search professionals & properties", href: "/result?type=all" },
      { label: "Commercial properties", href: "/result?type=comercial" },
      { label: "How verification works", href: "/how-we-verify" },
    ],
  },
  {
    title: "For your business",
    links: [
      { label: "List your business", href: "/register" },
      { label: "Builder profiles", href: "/result?type=builder" },
      { label: "Agency profiles", href: "/result?type=builder&tab=agents" },
      { label: "Pricing", href: "/subs" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Briksy", href: "/company-details" },
      { label: "Blog", href: "/blogs" },
      { label: "Help Centre", href: "/help-support" },
      //   { label: "Careers [ optional ]", href: "/careers" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Cookie Policy", href: "/cookie-policy" },
    ],
  },
];

const socialLinks = [
  { name: "Instagram", icon: Insta, href: "https://instagram.com" },
  { name: "Facebook", icon: Face, href: "https://facebook.com" },
  { name: "Whatsapp", icon: Whats, href: "https://web.whatsapp.com/" },
  { name: "X", icon: Xs, href: "https://x.com/" },
  { name: "LinkedIn", icon: Linkd, href: "https://linkedin.com" },
];

const Footer = () => {
  return (
    <footer className="font-helvetica  md:px-[3%] ">
      <div className=" border-t border-[#C2B4AA] py-3 md:py-5">
        <div className="flex justify-between px-[5%] md:px-0   items-start">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8 lg:gap-16">
            {footerLinks.map((column) => (
              <div key={column.title}>
                <h4 className="font-medium text-primary-light-brown lg:text-[1.125rem] text-[0.875rem] mb-2">
                  {column.title}
                </h4>

                <ul className="space-y-1">
                  {column.links.map((item) => (
                    <li key={item.label}>
                      <Link
                        to={item.href}
                        className="text-[0.875rem] text-nowrap text-primary-brown lg:text-[1rem] hover:text-[#A6632F] transition-colors"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div>
              <h4 className="font-medium text-primary-brown lg:text-[1.125rem] text-[0.875rem] mb-2">
                Connect
              </h4>

              <div className="flex items-center gap-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.name}
                    className="opacity-80 hover:opacity-100 transition-opacity"
                  >
                    <img
                      loading="lazy"
                      src={social.icon}
                      alt={social.name}
                      className="w-5 h-5 lg:w-6 lg:h-6"
                    />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className=" mt-10 lg:mt-20 flex px-[5%] md:px-0  justify-between items-end">
          <div className="flex flex-col-reverse sm:flex-row  sm:items-end gap-4 lg:gap-8 ">
            <img
              loading="lazy"
              src={Logo}
              alt="Briksy"
              className=" w-full sm:w-[19.9363rem] sm:h-[6.2138rem] lg:w-[33rem] lg:h-[11.6297rem]"
            />
          </div>
          <span className=" hidden md:flex md:flex-col text-[1rem] ">
            {" "}
            <p>© 2026 Briksy Pty Ltd. All Rights Reserved.</p>
            <p>
              Town Hall House, Level 2, 456 Kent Street, <br /> Sydney NSW 2000,
              Australia
            </p>
          </span>
        </div>
      </div>
      <div className=" items-center flex sm:hidden px-[5%] md:px-0  bg-[#EAEAEA] gap-8 py-3 text-[0.75rem] ">
        <span>© 2026 Briksy. All Rights Reserved.</span>

        <Link to="/terms">Terms of Use</Link>

        <Link to="/terms">T&amp;C</Link>
      </div>
    </footer>
  );
};

export default Footer;
