import type { Property } from "./property.types";

type Props = {
  data: Property & {
    briksy_exclusive_offers?: Array<{
      id: string;
      title: string;
      tag_label?: string | null;
      summary?: string | null;
      description?: string | null;
      highlights?: string[] | null;
      terms?: string | null;
      starts_at?: string | null;
      ends_at?: string | null;
    }>;
  };
};

const PropertyOffersSection = ({ data }: Props) => {
  const offers = data.briksy_exclusive_offers ?? [];

  if (offers.length === 0) {
    return <div className="text-muted">No exclusive offers are currently active for this property.</div>;
  }

  return (
    <div className="d-flex flex-column gap-5">
      {offers.map((offer) => (
        <div key={offer.id} className="border border-dashed border-gray-300 rounded-3 p-5 bg-light">
          <div className="d-flex flex-wrap justify-content-between align-items-start gap-3 mb-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <span className="badge badge-light-primary">{offer.tag_label ?? "BRIKSY EXCLUSIVE"}</span>
                <h4 className="mb-0 text-gray-900">{offer.title}</h4>
              </div>
              {offer.summary ? <div className="text-gray-700 fw-semibold">{offer.summary}</div> : null}
            </div>
            {offer.starts_at || offer.ends_at ? (
              <div className="text-muted fs-7 text-end">
                {offer.starts_at ? <div>Starts: {new Date(offer.starts_at).toLocaleDateString()}</div> : null}
                {offer.ends_at ? <div>Ends: {new Date(offer.ends_at).toLocaleDateString()}</div> : null}
              </div>
            ) : null}
          </div>

          {offer.description ? <p className="mb-4 text-gray-800">{offer.description}</p> : null}

          {Array.isArray(offer.highlights) && offer.highlights.length > 0 ? (
            <div className="mb-4">
              <div className="fw-bold text-gray-900 mb-2">What&apos;s included</div>
              <ul className="mb-0 ps-5">
                {offer.highlights.map((item) => (
                  <li key={item} className="mb-1 text-gray-700">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {offer.terms ? (
            <div>
              <div className="fw-bold text-gray-900 mb-2">Terms</div>
              <div className="text-gray-700">{offer.terms}</div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
};

export default PropertyOffersSection;
