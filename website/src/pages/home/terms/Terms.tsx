import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { useAuth } from '../../../auth/AuthContext';
import FraudBanner from '../../../components/custom/FraudBanner';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

// ── Data — swap/add sections from here ───────────────────────────────────────
const LAST_UPDATED = 'April 2026';

const SECTIONS = [
  {
    id: 'about',
    title: 'About BRIKSY',
    body: 'BRIKSY is a digital platform designed to connect people involved in the property journey.',
    bullets: [
      'Buy — Discover and enquire about properties.',
      'Build — Find builders, trades, and property professionals.',
      'Connect — Connect with businesses, agents and independent professionals.',
      'Sell — Promote properties and connect with potential buyers.',
      'Find Professionals — Discover property-related services and specialists.',
      'Commercial — Explore commercial property and related services.',
      'Questions — Access property-related information and resources.',
      'Blogs — Read educational and industry-related content.',
    ],
    footer:
      'BRIKSY acts primarily as a platform that facilitates connections between users and property-related businesses or professionals.',
  },
  {
    id: 'accounts',
    title: 'User Accounts',
    body: 'Certain BRIKSY features require you to create an account.',
    bullets: [
      'Provide accurate and up-to-date information about your properties.',
      'Keep your login credentials secure and confidential.',
      'Do not share your account with anyone else.',
      'Update your personal information promptly when it changes.',
      'Notify BRIKSY immediately if you suspect any unauthorised access to your account.',
    ],
    footer: 'You are responsible for activity carried out through your account.',
  },
  {
    id: 'listings',
    title: 'Listings & Content',
    body: 'All content submitted to BRIKSY must be accurate, lawful, and not misleading.',
    bullets: [
      'Listings must reflect genuine properties or services.',
      'Images and descriptions must be owned or licensed by you.',
      'BRIKSY reserves the right to remove any content that violates our guidelines.',
      'Fraudulent or misleading listings may result in account suspension.',
    ],
    footer: null,
  },
  {
    id: 'subscriptions',
    title: 'Subscriptions & Payments',
    body: 'Paid plans are billed monthly. You may cancel at any time with access continuing until the end of the billing period.',
    bullets: [
      'BRIKSY reserves the right to change pricing with 30 days notice.',
      'Refunds are assessed on a case-by-case basis.',
      'Downgrading may remove access to certain features immediately.',
    ],
    footer: null,
  },
  {
    id: 'liability',
    title: 'Limitation of Liability',
    body: 'To the maximum extent permitted by Australian law, BRIKSY is not liable for any indirect, incidental, or consequential damages arising from your use of the platform.',
    bullets: [
      'Our total liability shall not exceed amounts paid in the preceding 12 months.',
      'We do not guarantee the accuracy of third-party listings.',
      'BRIKSY is not a party to any transaction between users.',
    ],
    footer: null,
  },
  {
    id: 'law',
    title: 'Governing Law',
    body: 'These Terms are governed by the laws of New South Wales, Australia.',
    bullets: [
      'Disputes shall be resolved in the courts of New South Wales.',
      'If any provision is found invalid, the remaining provisions continue in full force.',
    ],
    footer: null,
  },
];

const LEGAL_LINKS = [
  {
    category: 'Legal terms',
    title: 'Privacy Policy',
    description: 'Please review our Privacy Policy.',
  },
  {
    category: 'Legal terms',
    title: 'Outside the United States Privacy Supplement',
    description: 'Please review this information which supplements our Privacy Policy.',
  },
  {
    category: 'Community policy',
    title: 'Protecting your privacy',
    description:
      "BRIKSY's commitment to protecting your privacy applies both when you use BRIKSY online and when you engage with professionals. Find out more about our privacy policies and principles.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────

const Terms = () => {
  const container = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useGSAP(
    () => {
      const els = gsap.utils.toArray<Element>('.term-section');
      els.forEach((section) => {
        ScrollTrigger.create({
          trigger: section,
          start: 'top center',
          onEnter: () => highlight(section.getAttribute('id') ?? ''),
          onEnterBack: () => highlight(section.getAttribute('id') ?? ''),
        });
      });

      function highlight(id: string) {
        gsap.to('.nav-item', { opacity: 0.4, duration: 0.25 });
        gsap.to(`.nav-${id}`, { opacity: 1, duration: 0.25 });
      }
    },
    { scope: container },
  );

  return (
    <main ref={container} className="min-h-screen md:mt-20 font-helvetica  text-primary-brown">

      {/* ── Last updated bar ── */}
      <div className="px-[3%] py-3 border-b border-white-100">
        <p className="text-[0.75rem] text-primary-light-brown">
          Last Updated: {LAST_UPDATED}
        </p>
      </div>

      {/* ── Body: left content + right sidebar ── */}
      <div className="flex gap-12 px-[5%] pt-8 pb-20">

        {/* ── Main content ── */}
        <div className="flex-1 min-w-0">

          {/* Title */}
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-medium leading-tight mb-6">
            BRIKSY — Terms & Conditions
          </h1>

          {/* Intro */}
          <p className="text-[0.9rem] text-primary-light-brown leading-relaxed mb-2">
            Welcome to BRIKSY. These Terms & Conditions govern your access to and use of the BRIKSY website, application, marketplace, and related services.
          </p>
          <p className="text-[0.9rem] text-primary-light-brown leading-relaxed mb-8">
            By accessing or using BRIKSY, you agree to these Terms. If you do not agree with these Terms, please do not use the platform.
          </p>

          {/* Sections */}
          {SECTIONS.map((section, i) => (
            <div
              key={section.id}
              id={section.id}
              className="term-section border-b border-white-100 py-8"
            >
              <h2 className="text-[1.125rem] font-semibold mb-3">{`${i + 1}. ${section.title}`}</h2>

              {section.body && (
                <p className="text-[0.9rem] text-primary-light-brown leading-relaxed mb-3">{section.body}</p>
              )}

              {section.bullets && (
                <p className="text-[0.9rem] font-medium text-primary-brown mb-2">
                  {section.id === 'about'
                    ? 'Depending on your needs, BRIKSY allows you to:'
                    : section.id === 'accounts'
                    ? 'When creating an account, you agree to:'
                    : null}
                </p>
              )}

              {section.bullets && (
                <ul className="space-y-1.5 mb-3">
                  {section.bullets.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2 text-[0.875rem] text-primary-light-brown">
                      <span className="mt-1.5 w-1 h-1 rounded-full bg-primary-light-brown shrink-0" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}

              {section.footer && (
                <p className="text-[0.875rem] text-primary-light-brown leading-relaxed">{section.footer}</p>
              )}
            </div>
          ))}

          {/* ── Legal links ── */}
          <div className="mt-8 space-y-0">
            {LEGAL_LINKS.map((link, i) => (
              <div key={i} className="py-5 border-b border-white-100">
                <p className="text-[0.7rem] text-primary-light-brown uppercase tracking-wider mb-1">{link.category}</p>
                <button type="button" className="text-[0.9375rem] font-medium text-primary-brown hover:underline text-left">
                  {link.title}
                </button>
                <p className="mt-1 text-[0.8125rem] text-primary-light-brown leading-relaxed">{link.description}</p>
              </div>
            ))}
          </div>

          {/* ── Fraud banner ── */}
          <div className="mt-10  w-full flex items-center justify-center ">
            <FraudBanner />
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="hidden lg:block w-[280px] shrink-0">

          {/* Help card */}
          <div className="sticky top-[6rem] border border-white-100 rounded-xl p-4 bg-white shadow-sm mb-6">
            <p className="text-[0.9rem] font-medium text-primary-brown mb-0.5">
              Get help with your reservations, account, and more.
            </p>
            {!isAuthenticated && (
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="mt-3 w-full bg-primary-brown text-white rounded-xl py-2.5 text-[0.875rem] font-medium hover:opacity-90 transition"
              >
                Login or Sign up
              </button>
            )}
          </div>


        </aside>
      </div>
    </main>
  );
};

export default Terms;
