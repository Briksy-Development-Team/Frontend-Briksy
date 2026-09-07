import { Link } from "react-router-dom";
import Logo from "../../assets/logo/briksyB.svg";
import Insta from "../../assets/icons/instas.svg"
import Face from "../../assets/icons/face.svg"
import Whats from "../../assets/icons/whats.svg"
import Linkd from "../../assets/icons/Linkedin.svg"
import Xs from "../../assets/icons/x.svg"

const footerLinks = [
    {
        title: "Platform",
        links: [
            "Find Professionals",
            "For Agencies",
            "For Agents",
            "Pricing",
        ],
    },
    {
        title: "Company",
        links: [
            "About Briksy",
            "How We Verify",
            "Careers",
            "Contact",
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
        <footer className="font-helvetica border-t-2 border-primary-light-brown/50">
            <div className="w-[95%] mx-auto py-5">
                <div className="flex justify-between items-start">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 sm:gap-10 lg:gap-20">
                        {footerLinks.map((column) => (
                            <div key={column.title}>
                                <h4 className="font-medium text-primary-brown lg:text-[1.125rem] text-[0.875rem] mb-2">
                                    {column.title}
                                </h4>

                                <ul className="space-y-1">
                                    {column.links.map((item) => (
                                        <li key={item}>
                                            <Link
                                                to={item === "Pricing" ? "/subs" : "/coming-soon"}
                                                className="text-[0.875rem] text-primary-brown lg:text-[1rem] hover:text-[#A6632F] transition-colors"
                                            >
                                                {item}
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
                                        <img loading="lazy"
                                            src={social.icon}
                                            alt={social.name}
                                            className="w-5 h-5 lg:w-6 lg:h-6"
                                        />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className=" items-center hidden sm:flex gap-8 lg:text-[1rem] sm:text-[0.625rem] ">

                        <Link to="/terms">Terms of Use</Link>

                        <Link to="/terms">T&amp;C</Link>
                    </div>
                </div>

                <div className=" mt-10 lg:mt-28 flex justify-between items-end">
                    <div className="flex flex-col-reverse sm:flex-row  sm:items-end gap-4 lg:gap-8 ">
                        <img loading="lazy"
                            src={Logo}
                            alt="Briksy"
                            className=" w-full sm:w-[19.9363rem] sm:h-[6.2138rem] lg:w-[37.3125rem] lg:h-[11.6297rem]"
                        />
{/* 
                        <div className="mb-3 text-primary-light-brown text-[0.75rem] sm:text-[0.875rem] lg:text-[0.875rem] leading-6">
                            <p>Architecture</p>
                            <p>Interior Design</p>
                            <p>Project Management</p>
                        </div> */}
                    </div>
                    <span className="hidden sm:flex "> © 2025 Briksy. All Rights Reserved.</span>

                </div>

            </div>
            <div className=" items-center flex sm:hidden bg-[#EAEAEA] gap-8 py-3 text-[0.75rem] ">
                <span>© 2026 Briksy. All Rights Reserved.</span>

                <Link to="/terms">Terms of Use</Link>

                <Link to="/terms">T&amp;C</Link>
            </div>
        </footer>
    );
};

export default Footer;