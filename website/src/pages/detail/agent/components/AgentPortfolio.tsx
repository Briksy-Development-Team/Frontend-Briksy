export interface AgentPortfolioProps {
  serviceAreas?: string[];
  socialLinks?: Record<string, string>;
  introVideoUrl?: string | null;
  reelUrls?: string[];
}

export function AgentPortfolio({
  serviceAreas = [],
  socialLinks = {},
  introVideoUrl,
  reelUrls = [],
}: AgentPortfolioProps) {
  const links = Object.entries(socialLinks).filter(([, url]) => url?.trim());
  const hasContent = serviceAreas.length > 0 || Boolean(introVideoUrl) || reelUrls.length > 0 || links.length > 0;

  if (!hasContent) return null;

  return (
    <section className="flex flex-col gap-6 w-full" aria-labelledby="agent-portfolio-title">
      <div className="flex flex-col gap-2">
        <h2
          id="agent-portfolio-title"
          className="text-[1.25rem] md:text-[1.375rem] font-medium text-[#222222]"
        >
          Portfolio
        </h2>
        <p className="text-[0.875rem] text-[#7C5F42]">Information shared by this agency.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {serviceAreas.length > 0 && (
          <article className="rounded-xl bg-white p-5">
            <h3 className="text-[1rem] font-medium text-[#342511]">Service areas</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {serviceAreas.map((area) => (
                <span key={area} className="rounded-full bg-[#F8F4EE] px-3 py-1 text-[0.8125rem] text-[#5F5146]">
                  {area}
                </span>
              ))}
            </div>
          </article>
        )}

        {introVideoUrl && (
          <article className="rounded-xl bg-white p-5">
            <h3 className="text-[1rem] font-medium text-[#342511]">Intro video</h3>
            <a href={introVideoUrl} target="_blank" rel="noopener noreferrer" className="mt-3 block break-all text-[0.875rem] text-[#7C5F42] underline">
              Watch agency intro
            </a>
          </article>
        )}

        {reelUrls.length > 0 && (
          <article className="rounded-xl bg-white p-5">
            <h3 className="text-[1rem] font-medium text-[#342511]">Reels</h3>
            <div className="mt-3 flex flex-col gap-2">
              {reelUrls.map((url, index) => (
                <a key={`${url}-${index}`} href={url} target="_blank" rel="noopener noreferrer" className="break-all text-[0.875rem] text-[#7C5F42] underline">
                  View reel {index + 1}
                </a>
              ))}
            </div>
          </article>
        )}

        {links.length > 0 && (
          <article className="rounded-xl bg-white p-5">
            <h3 className="text-[1rem] font-medium text-[#342511]">Social links</h3>
            <div className="mt-3 flex flex-col gap-2">
              {links.map(([network, url]) => (
                <a key={network} href={url} target="_blank" rel="noopener noreferrer" className="capitalize text-[0.875rem] text-[#7C5F42] underline">
                  {network}
                </a>
              ))}
            </div>
          </article>
        )}
      </div>
    </section>
  );
}

export default AgentPortfolio;
