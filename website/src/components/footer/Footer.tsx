import { Link } from "react-router-dom";
import Logo from "../../assets/logo/briksyB.svg";
import Insta from "../../assets/icons/instas.svg";
import Face from "../../assets/icons/face.svg";
import Whats from "../../assets/icons/whats.svg";
import Linkd from "../../assets/icons/Linkedin.svg";
import Xs from "../../assets/icons/x.svg";
import FooterTiles from "./FooterTiles";

const footerLinks = [
    {
        title: "For your business",
        links: [
            { label: "Search professionals & properties", href: "/result?type=all" },
            { label: "List your business", href: "/register" },
            { label: "Builder profiles", href: "/builders" },
            { label: "Agency profiles", href: "/agents" },
            { label: "Commercial properties", href: "/commercials" },
            { label: "Pricing", href: "/subs" },
        ],
    },
    {
        title: "Company",
        links: [
            { label: "How verification works", href: "/how-we-verify" },
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
        <footer className="font-helvetica  mt-10">
            <div className="relative border-t border-[#C2B4AA] py-3 md:py-5">
                {/* tiles first = behind the text and logo */}
                <FooterTiles />

                {/* content sits above the tiles; only links/icons catch the mouse */}
                <div className="pointer-events-none relative grid gap-8 px-[3%]  lg:grid-cols-[44%_1fr]">
                    {/* left: copyright, address, socials */}
                    <div className="order-2 lg:order-1 flex  flex-col gap-3 text-[1rem]">
                        <div className="hidden md:block">
                            <p>© 2026 Briksy Pty Ltd. All Rights Reserved.</p>
                            <p>
                                Town Hall House, Level 2, 456 Kent Street, <br /> Sydney NSW 2000, Australia
                            </p>
                        </div>

                        <div className="flex items-center gap-3">
                            {socialLinks.map((social) => (
                                <a
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.name}
                                    className="pointer-events-auto opacity-80 hover:opacity-100 transition-opacity"
                                >
                                    <img loading="lazy" src={social.icon} alt={social.name} className="w-5 h-5 lg:w-6 lg:h-6" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* right: link columns */}
                    <div className="order-1 lg:order-2 grid grid-cols-2 gap-6 md:grid-cols-[auto_auto_auto] md:justify-start md:gap-x-12 lg:gap-x-[4.5rem]">
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
                                                className="pointer-events-auto text-[0.875rem] text-wrap md:text-nowrap text-primary-brown lg:text-[1rem] hover:text-[#A6632F] transition-colors"
                                            >
                                                {item.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="pointer-events-none relative mt-10 lg:mt-20 px-[3%] ">
                    <img
                        loading="lazy"
                        src={Logo}
                        alt="Briksy"
                        className="w-full sm:w-[19.9363rem] sm:h-[6.2138rem] lg:w-[33rem] lg:h-[11.6297rem]"
                    />
                </div>
            </div>

            <div className="items-center flex sm:hidden px-[3%] md:px-0 bg-[#EAEAEA] gap-8 py-3 text-[0.60rem] text-nowrap sm:text-[0.75rem]">
                <span>© 2026 Briksy. All Rights Reserved.</span>

                <Link to="/terms">Terms of Use</Link>

                <Link to="/terms">T&amp;C</Link>
            </div>
        </footer>
    );
};

export default Footer;