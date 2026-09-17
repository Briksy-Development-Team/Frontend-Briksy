import About from "../home/about/About";

type Props = { kind: "about" | "verification" | "privacy" | "cookies" };

const PublicInfoPage = ({ kind }: Props) => {
  if (kind === "about") {
    return <div className="min-h-screen bg-[#F8F4EE] pt-28 font-helvetica"><div className="px-[5%]"><h1 className="text-3xl font-medium text-primary-brown">About Briksy</h1><p className="mt-3 text-primary-light-brown">The Briksy platform overview.</p></div><About /></div>;
  }

  const content = {
    verification: {
      title: "How verification works",
      text: "All listings and professional profiles must pass Briksy’s multi-stage verification process before going live. Briksy may reject, suspend, or remove listings or profiles that violate its guidelines or appear fraudulent.",
    },
    privacy: { title: "Privacy Policy", text: "Privacy policy content is not configured yet." },
    cookies: { title: "Cookie Policy", text: "Cookie policy content is not configured yet." },
  }[kind];

  return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 pb-20 font-helvetica"><div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 md:p-12"><h1 className="text-3xl font-medium text-primary-brown">{content.title}</h1><p className="mt-6 leading-7 text-primary-light-brown">{content.text}</p></div></div>;
};

export default PublicInfoPage;
