import { useCallback, useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { useRoleAccess } from "../../modules/auth";
import { ServiceCoverageMap } from "../../services/features/maps/ServiceCoverageMap";
import { ServiceCoveragePopup } from "../../services/features/maps/ServiceCoveragePopup";
import { fetchServiceMapApi } from "../../services/features/maps/service-map.api";
import type { ServiceMapItem } from "../../services/features/maps/service-map.types";

const ServiceMapPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const [services, setServices] = useState<ServiceMapItem[]>([]);
  const [selectedService, setSelectedService] = useState<ServiceMapItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const loadServices = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await fetchServiceMapApi();
      setServices(items);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load service coverage data.");
      setServices([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadServices();
  }, [loadServices, refreshCounter]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadServices();
    }, 60000);

    return () => window.clearInterval(interval);
  }, [loadServices]);

  useEffect(() => {
    if (selectedService && !services.some((item) => item.id === selectedService.id)) {
      setSelectedService(null);
    }
  }, [selectedService, services]);

  const serviceCount = useMemo(() => services.length, [services]);

  return (
    <Content>
      <PageHeader
        title="Service Coverage Map"
        subtitle={isSuperAdmin ? "Platform-wide service coverage regions" : "Your organization's service coverage regions"}
      />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <span className="badge badge-light-primary">{serviceCount} services</span>
        <button type="button" className="btn btn-light" onClick={() => setRefreshCounter((value) => value + 1)}>
          <i className="bi bi-arrow-clockwise me-2" />
          Refresh
        </button>
      </div>

      {loading ? <div className="alert alert-light">Loading service coverage map...</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {!loading && !error && services.length === 0 ? (
        <div className="alert alert-light">No service coverage regions found.</div>
      ) : null}

      <div className="position-relative">
        <ServiceCoverageMap
          services={services}
          onRegionClick={(service) => setSelectedService(service)}
          height={720}
        />

        {selectedService ? (
          <ServiceCoveragePopup
            service={selectedService}
            onClose={() => setSelectedService(null)}
          />
        ) : null}
      </div>
    </Content>
  );
};

export default ServiceMapPage;
