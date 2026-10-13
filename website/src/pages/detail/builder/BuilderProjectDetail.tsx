import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Breadcrumb from "../../../components/nav/Breadcrumb";
import { PropertyGallery } from "../property/components/PropertyGallery";
import HostProfileCard from "../shared/HostProfileCard";
import { getBuilderProject, type PublicBuilderProject } from "../../../api/seeker/organization.api";
import ProjectPlaceholder from "../../../assets/place holder/builderbg.svg";

export default function BuilderProjectDetail() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<PublicBuilderProject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    getBuilderProject(id)
      .then(({ data }) => { if (active) setProject(data); })
      .catch(() => { if (active) setError("This project was not found."); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  if (loading) return <p className="py-20 text-center text-primary-brown">Loading project...</p>;
  if (error || !project) return <p className="py-20 text-center text-primary-brown">{error || "This project is unavailable."}</p>;

  const media = [
    ...(project.images ?? []).map((item) => ({ src: item.url, type: "image" as const })),
    ...(project.videos ?? []).map((item) => ({ src: item.url, type: "video" as const, videoSrc: item.url })),
  ];
  const location = [project.location, project.state, project.postcode].filter(Boolean).join(", ");

  return (
    <div className="min-h-screen md:mt-20 font-helvetica pb-10 text-primary-brown">
      <main className="w-full px-[5%] py-6">
        <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Builder", href: project.organization?.slug ? `/builder/${project.organization.slug}` : "/builders" }, { label: project.name }]} />
        <div className="mt-6">
          <PropertyGallery images={media.length ? media : [ProjectPlaceholder]} />
        </div>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_19.4375rem]">
          <div className="min-w-0">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-medium">{project.name}</h1>
                {project.project_type && <p className="mt-2 text-primary-light-brown">{project.project_type}</p>}
                {location && <p className="mt-3 text-primary-light-brown">{location}</p>}
              </div>
              <span className="rounded-full bg-[#F7F1EA] px-3 py-1 text-xs capitalize">{project.status.replaceAll("_", " ")}</span>
            </div>
            {project.description && <section className="mt-10"><h2 className="text-xl font-medium">About this project</h2><p className="mt-3 whitespace-pre-line leading-7 text-primary-light-brown">{project.description}</p></section>}
            {project.features?.length ? <section className="mt-8"><h2 className="text-xl font-medium">Project features</h2><div className="mt-3 flex flex-wrap gap-2">{project.features.map((feature) => <span key={feature} className="rounded-full bg-[#F7F1EA] px-3 py-1 text-sm">{feature}</span>)}</div></section> : null}
            <section className="mt-10 border-t border-[#EBE5D9] pt-8">
              <h2 className="mb-4 text-xl font-medium">Meet The Host</h2>
              {project.creator ? <HostProfileCard host={project.creator} avatar={project.organization?.logo_url} organizationName={project.organization?.name} /> : <p className="text-sm text-primary-light-brown">Host details are not available for this project.</p>}
            </section>
          </div>
          <aside>
            <div className="sticky top-28 rounded-2xl border border-[#EDE8E4] bg-white p-6">
              <p className="text-sm text-primary-light-brown">Builder</p>
              <p className="mt-1 text-lg font-medium">{project.organization?.name || "Builder"}</p>
              {project.organization?.slug && <Link to={`/builder/${project.organization.slug}`} className="mt-5 inline-block rounded-full bg-primary-brown px-5 py-2 text-sm font-medium text-white">View builder profile</Link>}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
