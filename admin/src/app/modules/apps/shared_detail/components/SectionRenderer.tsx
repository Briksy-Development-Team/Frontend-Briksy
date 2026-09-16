import React from "react";
import type { SectionConfig } from "../core/DetailTypes";
import InfoCard from "./sections/InfoCard";
import GalleryWidget from "./sections/GalleryWidget";
import RelatedTable from "./sections/RelatedTable";
import MapWidget from "./sections/MapWidget";
import TimelineWidget from "./sections/TimelineWidget";
import { useEffect, useState } from "react";
import { updateSeekerApi } from "../../../../services/features/seeker/seekerApi";

type Props<T> = {
  config: SectionConfig<T>;
  data: T;
};

function NotesWidget({ data }: { data: any }) {
  const [notes, setNotes] = useState<string>(data?.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  useEffect(() => setNotes(data?.admin_notes ?? ""), [data?.admin_notes]);
  const save = async () => {
    if (!data?.id) return;
    setSaving(true); setMessage("");
    try { await updateSeekerApi(data.id, { admin_notes: notes }); setMessage("Saved"); }
    catch { setMessage("Unable to save notes"); }
    finally { setSaving(false); }
  };
  return <div className="card shadow-sm h-100"><div className="card-header border-0 pt-5"><h3 className="card-title fw-bold text-gray-900">Internal Notes</h3></div><div className="card-body pt-2"><textarea className="form-control form-control-solid" rows={6} value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Add internal notes" /><div className="d-flex align-items-center justify-content-between mt-3"><span className="text-muted fs-7">{message || "Visible to authorised staff only."}</span><button type="button" className="btn btn-primary btn-sm" onClick={save} disabled={saving}>{saving ? "Saving…" : "Save notes"}</button></div></div></div>;
}

export default function SectionRenderer<T>({ config, data }: Props<T>) {
  switch (config.type) {
    case "info":
      return <InfoCard config={config} data={data} />;
    
    case "table":
      return <RelatedTable config={config} data={data} />;
    
    case "custom":
      const CustomComponent = config.component;
      return (
        <div className="card shadow-sm h-100">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold text-gray-900">{config.title}</span>
            </h3>
          </div>
          <div className="card-body pt-5">
            <CustomComponent data={data} />
          </div>
        </div>
      );

    case "gallery":
      return <GalleryWidget config={config} data={data} />;

    case "map":
      return <MapWidget config={config} data={data} />;

    case "timeline":
      return <TimelineWidget config={config} data={data} />;
    case "emails":
      // Placeholders for advanced widgets to be implemented in Phase 2
      return (
        <div className="card shadow-sm h-100 border-dashed border-primary">
          <div className="card-header border-0 pt-5">
            <h3 className="card-title align-items-start flex-column">
              <span className="card-label fw-bold text-gray-900">{config.title}</span>
            </h3>
          </div>
          <div className="card-body pt-5 d-flex align-items-center justify-content-center">
            <div className="text-muted text-center">
              <div className="fs-6 fw-semibold">[{config.type.toUpperCase()} WIDGET PLACEHOLDER]</div>
              <div className="fs-7 mt-2">This widget will be fully implemented in Phase 2.</div>
            </div>
          </div>
        </div>
      );

    case "notes":
      return <NotesWidget data={data} />;

    default:
      return (
        <div className="alert alert-warning">
          Unknown section type
        </div>
      );
  }
}
