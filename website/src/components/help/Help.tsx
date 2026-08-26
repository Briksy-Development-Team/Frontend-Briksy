import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
    Search,
    ChevronDown,
    ShieldCheck,
    Banknote,
    ChevronUp,
    Sparkles,
    User,
    MessageSquareReply,
    AlertCircle,
    Wrench,
    CreditCard
} from 'lucide-react';
import Helps from "../../assets/icons/help/help.svg"
import ContactModal from './ContactModal';

const FAQ_DATA = [
    {
        id: 1,
        question: "How does Briksy verify a professional?",
        answer: "Every provider gives us their ABN, licence and insurance details. We check each one against the issuing authority before the profile goes live, and re-check licences when they come up for renewal.",
        icon: ShieldCheck
    },
    {
        id: 2,
        question: "Is Briksy free to use?",
        answer: "Yes! Briksy is completely free for homeowners to search, browse, and request quotes from professionals.",
        icon: Banknote
    },
    {
        id: 3,
        question: "How do I request a quote from a professional?",
        answer: "Simply navigate to a professional's profile and click the 'Request Quote' button. Fill out the details of your project, and they will get back to you.",
        icon: Sparkles
    },
    {
        id: 4,
        question: "What happens after I send an enquiry?",
        answer: "The professional receives your project details. If they are available and interested, they will reply directly to your inbox with next steps or a quote.",
        icon: User
    },
    {
        id: 5,
        question: "Can I leave a review, and who can see it?",
        answer: "Yes, once a job is marked as complete, you can leave a verified review. Reviews are public and help other homeowners make informed decisions.",
        icon: MessageSquareReply
    },
    {
        id: 6,
        question: "How do I report a profile or raise a problem?",
        answer: "You can click the 'Report' flag on any profile or message. Our moderation team reviews all reports within 24 hours.",
        icon: AlertCircle
    },
    {
        id: 7,
        question: "I'm a tradesperson — how do I list my business?",
        answer: "Click 'Join as a Pro' at the bottom of the page to start your onboarding. You'll need your ABN and licence details handy.",
        icon: Wrench
    },
    {
        id: 8,
        question: "How does billing work for provider subscriptions?",
        answer: "Providers are billed on a monthly cycle. You can manage your payment methods and view invoices from the Billing section of your Account.",
        icon: CreditCard
    }
];

const Help = () => {
    const [expandedId, setExpandedId] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);

    const headerRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLDivElement>(null);
    const listRef = useRef<HTMLDivElement>(null);

    const toggleAccordion = (id: number) => {
        setExpandedId(expandedId === id ? 0 : id);
    };

    useEffect(() => {
        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

        tl.fromTo(
            headerRef.current,
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8 },
            0.1
        )
            .fromTo(
                searchRef.current,
                { y: 20, opacity: 0, scale: 0.95 },
                { y: 0, opacity: 1, scale: 1, duration: 0.7 },
                0.3
            );

        if (listRef.current) {
            const cards = listRef.current.children;
            gsap.fromTo(
                cards,
                { y: 30, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.08,
                    ease: "power2.out",
                    delay: 0.4
                }
            );
        }
    }, []);

    return (
        <div className="min-h-screen mx-auto md:w-full font-helvetica pb-10 md:pb-20 relative mt-16 md:mt-28 px-4 md:px-0">

            <div className="absolute top-6 md:top-0 right-4 md:right-8 z-10">
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="group flex items-center gap-1.5 md:gap-2 text-[0.75rem] md:text-[0.875rem] font-medium text-primary-brown transition-all duration-300 hover:text-primary-light-brown"
                >
                    <img src={Helps} alt="help" className="w-5 h-5 md:w-auto md:h-auto transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                    <span className='font-medium'>Still Need Help</span>
                </button>
            </div>

            <div className="mx-auto max-w-3xl pt-14 md:pt-16 relative z-0">

                <div className="text-center mb-8 md:mb-12">
                    <div ref={headerRef}>
                        <h1 className="text-[1.875rem] md:text-[2.5rem] font-medium text-primary-brown mb-6 md:mb-8">
                            Hi Abhi, how can we help?
                        </h1>
                    </div>

                    
                    <div ref={searchRef} className="relative mx-auto max-w-2xl">
                        <input
                            type="text"
                            placeholder="Search our help centre..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full rounded-full bg-white py-3 pl-5 pr-14 md:py-4 md:pl-6 md:pr-16 text-[0.75rem] md:text-[0.875rem] text-primary-brown shadow-[0_2px_10px_rgba(0,0,0,0.04)] outline-none placeholder:text-[#A89F95]"
                        />
                        <button className="absolute right-2 top-1/2 flex h-8 w-8 md:h-10 md:w-10 -translate-y-1/2 items-center justify-center rounded-full bg-[#3D2C1E] text-white transition-colors hover:bg-black">
                            <Search size={16} className="md:w-[18px] md:h-[18px]" strokeWidth={2.5} />
                        </button>
                    </div>
                </div>

                
                <div ref={listRef} className="space-y-2 md:space-y-3">
                    {FAQ_DATA.filter(faq => faq.question.toLowerCase().includes(searchQuery.toLowerCase())).map((faq) => {
                        const isExpanded = expandedId === faq.id;
                        const Icon = faq.icon;

                        return (
                            <div
                                key={faq.id}
                                className="faq-item overflow-hidden rounded-xl md:rounded-2xl bg-white shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-shadow hover:shadow-md"
                            >
                                <button
                                    onClick={() => toggleAccordion(faq.id)}
                                    className="flex w-full items-center justify-between px-4 py-4 md:px-6 md:py-5 text-left"
                                >
                                    <div className="flex items-center gap-3 md:gap-4 pr-4">
                                        <Icon size={16} className="text-[#8A7969] md:w-[18px] md:h-[18px]" strokeWidth={1.5} />
                                        <span className="text-[0.875rem] md:text-[0.95rem] font-medium text-primary-brown leading-snug">
                                            {faq.question}
                                        </span>
                                    </div>
                                    {isExpanded ? (
                                        <ChevronUp size={16} className="text-[#8A7969] shrink-0 md:w-[18px] md:h-[18px]" />
                                    ) : (
                                        <ChevronDown size={16} className="text-[#8A7969] shrink-0 md:w-[18px] md:h-[18px]" />
                                    )}
                                </button>

                                <div
                                    className={`transition-all duration-300 ease-in-out ${isExpanded ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                                        }`}
                                >
                                    <div className="px-11 pb-5 pt-1 md:px-14 md:pb-6">
                                        <p className="text-[0.75rem] md:text-[0.875rem] leading-relaxed text-primary-light-brown">
                                            {faq.answer}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
            <ContactModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default Help;
