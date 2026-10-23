import { useMemo, useState } from "react";

export type MarketingReelItem = { id?: string; url: string; sort_order?: number };

type Props = {
  existing?: MarketingReelItem[];
  selected: File[];
  limit: number | null;
  included: boolean;
  onChange: (files: File[]) => void;
  onDelete?: (id: string) => void | Promise<unknown>;
};

export default function MarketingReelsSection({ existing = [], selected, limit, included, onChange, onDelete }: Props) {
  const [error, setError] = useState<string | null>(null);
  const remaining = limit === null ? null : Math.max(0, limit - existing.length);
  const selectedSize = useMemo(() => selected.length, [selected]);

  const handleChange = (files: File[]) => {
    const videos = files.filter((file) => file.type.startsWith("video/"));
    const invalid = files.find((file) => !file.type.startsWith("video/") || file.size > 1024 * 1024 * 1024);
    if (invalid) {
      setError(`${invalid.name} must be a supported video smaller than 1 GB.`);
      onChange([]);
      return;
    }
    if (!included) {
      setError("Marketing shorts/reels are not included in your current plan.");
      onChange([]);
      return;
    }
    if (remaining !== null && videos.length > remaining) {
      setError(`Your plan allows ${remaining} more marketing short${remaining === 1 ? "" : "s"}/reel${remaining === 1 ? "" : "s"}.`);
      onChange([]);
      return;
    }
    setError(null);
    onChange(videos);
  };

  return (
    <div className="border rounded p-4 mt-6">
      <div className="d-flex justify-content-between align-items-start gap-3 mb-3">
        <div>
          <h4 className="fw-bold mb-1">Marketing Shorts/Reels</h4>
          <div className="text-muted fs-7">
            Uploaded: {existing.length}{limit === null ? " / Unlimited" : ` / ${limit}`} · Remaining: {remaining === null ? "Unlimited" : remaining}
          </div>
        </div>
      </div>
      {existing.length > 0 && (
        <div className="row g-3 mb-3">
          {existing.map((item) => (
            <div className="col-md-4" key={item.id ?? item.url}>
              <div className="position-relative border rounded p-2">
                <video src={item.url} controls preload="metadata" className="w-100 rounded" style={{ height: 130, objectFit: "cover" }} />
                {item.id && onDelete && <button type="button" className="btn btn-sm btn-light-danger position-absolute top-0 end-0 m-2" onClick={() => void onDelete(item.id as string)} aria-label="Remove marketing reel">×</button>}
              </div>
            </div>
          ))}
        </div>
      )}
      <input type="file" multiple accept="video/mp4,video/quicktime,video/x-msvideo,video/x-matroska,video/webm" className="form-control" disabled={!included || remaining === 0} onChange={(event) => handleChange(Array.from(event.target.files ?? []))} />
      <div className="form-text">{selectedSize} new video{selectedSize === 1 ? "" : "s"} selected.</div>
      {error && <div className="text-danger fs-7 mt-2">{error}</div>}
    </div>
  );
}
