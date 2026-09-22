import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOrganization, type PublicOrganization } from "../../../api/seeker/organization.api";
import { getService, type PublicService } from "../../../api/service/service.api";
import { OrganizationView } from "./components/OrganizationView";
import { ServiceOnlyView } from "./components/ServiceOnlyView";

const ServiceDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [organization, setOrganization] = useState<PublicOrganization | null>(null);
  const [service, setService] = useState<PublicService | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let active = true;

    const load = async () => {
      let org: PublicOrganization | null = null;
      try {
        org = (await getOrganization(id)).data;
      } catch (reason: any) {
        if (reason?.response?.status !== 404) throw reason;
        // the id belongs to a service, not an organization
        const svc = (await getService(id)).data;
        if (!active) return;
        setService(svc);
        if (svc.organization?.id) org = (await getOrganization(svc.organization.id)).data;
      }
      if (active) setOrganization(org);
    };

    load()
      .catch((reason: any) => {
        if (active) setError(reason?.response?.status === 404 ? "This professional or service was not found." : "Unable to load this professional or service.");
      })
      .finally(() => { if (active) setLoading(false); });

    return () => { active = false; };
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32">Loading professional...</div>;
  if (error || (!organization && !service)) {
    return <div className="min-h-screen bg-[#F8F4EE] px-[5%] pt-32 text-primary-brown">{error || "Professional or service not found."}</div>;
  }

  if (organization) {
    return <OrganizationView organization={organization} service={service} />;
  }

  if (service) {
    return <ServiceOnlyView service={service} />;
  }

  return null;
};

export default ServiceDetail;