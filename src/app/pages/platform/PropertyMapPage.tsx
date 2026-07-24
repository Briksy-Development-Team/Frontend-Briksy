import { useCallback, useEffect, useMemo, useState } from "react";
import { Content } from "../../../_metronic/layout/components/content";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import PropertyMap from "../../services/features/maps/PropertyMap";
import PropertyMapPopup from "../../services/features/maps/PropertyMapPopup";
import { fetchPropertyMapApi } from "../../services/features/maps/property-map.api";
import type { PropertyMapFilters, PropertyMapItem } from "../../services/features/maps/property-map.types";
import { useRoleAccess } from "../../modules/auth";

const DEFAULT_FILTERS: PropertyMapFilters = {
  status: "",
  organization: "",
  verified: "",
  country: "",
  state: "",
  city: "",
  property_type: "",
};

const getVisibleFilterCount = (filters: PropertyMapFilters) =>
  Object.values(filters).filter((value) => value !== undefined && value !== null && value !== "").length;

const PropertyMapPage = () => {
  const { isSuperAdmin } = useRoleAccess();
  const portalBase: "/super-admin" | "/admin" = isSuperAdmin ? "/super-admin" : "/admin";
  const [properties, setProperties] = useState<PropertyMapItem[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<PropertyMapItem | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [draftSearch, setDraftSearch] = useState("");
  const [filters, setFilters] = useState<PropertyMapFilters>(DEFAULT_FILTERS);
  const [refreshCounter, setRefreshCounter] = useState(0);

  const loadProperties = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const items = await fetchPropertyMapApi({
        search: search.trim() || undefined,
        filters,
      });

      setProperties(items);
    } catch (requestError: unknown) {
      setError(requestError instanceof Error ? requestError.message : "Failed to load property map data.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters, search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearch(draftSearch);
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [draftSearch]);

  useEffect(() => {
    void loadProperties();
  }, [filters, refreshCounter, search, loadProperties]);

  useEffect(() => {
    const interval = window.setInterval(() => {
      void loadProperties();
    }, 60000);

    return () => window.clearInterval(interval);
  }, [loadProperties]);

  useEffect(() => {
    if (selectedProperty && !properties.some((item) => item.id === selectedProperty.id)) {
      setSelectedProperty(null);
    }
  }, [properties, selectedProperty]);

  const activeFilterCount = useMemo(() => getVisibleFilterCount(filters), [filters]);

  const updateFilter = (key: keyof PropertyMapFilters, value: string) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const clearFilters = () => {
    setDraftSearch("");
    setSearch("");
    setFilters(DEFAULT_FILTERS);
  };

  const propertyCount = properties.length;

  return (
    <Content>
      <PageHeader title="Property Map" subtitle="Super admin property coverage" />

      <div className="d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4">
        <div className="d-flex flex-wrap gap-2">
          <span className="badge badge-light-primary">{propertyCount} properties</span>
          {activeFilterCount > 0 ? <span className="badge badge-light">{activeFilterCount} filters</span> : null}
          {search ? <span className="badge badge-light-info">Search: {search}</span> : null}
        </div>

        <div className="d-flex gap-2">
          <button type="button" className="btn btn-light" onClick={() => setRefreshCounter((value) => value + 1)}>
            <i className="bi bi-arrow-clockwise me-2" />
            Refresh
          </button>
          <button type="button" className="btn btn-light" onClick={clearFilters}>
            Clear
          </button>
        </div>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-lg-4">
          <label className="form-label">Search</label>
          <input
            type="search"
            className="form-control form-control-solid"
            placeholder="Property number, name, organization, city"
            value={draftSearch}
            onChange={(event) => setDraftSearch(event.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label">Status</label>
          <select
            className="form-select form-select-solid"
            value={String(filters.status ?? "")}
            onChange={(event) => updateFilter("status", event.target.value)}
          >
            <option value="">All</option>
            <option value="Approved">Approved</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Rejected">Rejected</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
            <option value="Draft">Draft</option>
          </select>
        </div>

        <div className="col-lg-2">
          <label className="form-label">Verified</label>
          <select
            className="form-select form-select-solid"
            value={String(filters.verified ?? "")}
            onChange={(event) => updateFilter("verified", event.target.value)}
          >
            <option value="">All</option>
            <option value="1">Verified</option>
            <option value="0">Unverified</option>
          </select>
        </div>

        <div className="col-lg-2">
          <label className="form-label">Country</label>
          <input
            className="form-control form-control-solid"
            value={String(filters.country ?? "")}
            onChange={(event) => updateFilter("country", event.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label">State</label>
          <input
            className="form-control form-control-solid"
            value={String(filters.state ?? "")}
            onChange={(event) => updateFilter("state", event.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label">City</label>
          <input
            className="form-control form-control-solid"
            value={String(filters.city ?? "")}
            onChange={(event) => updateFilter("city", event.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label">Organization</label>
          <input
            className="form-control form-control-solid"
            value={String(filters.organization ?? "")}
            onChange={(event) => updateFilter("organization", event.target.value)}
          />
        </div>

        <div className="col-lg-2">
          <label className="form-label">Property Type</label>
          <input
            className="form-control form-control-solid"
            value={String(filters.property_type ?? "")}
            onChange={(event) => updateFilter("property_type", event.target.value)}
          />
        </div>
      </div>

      {loading ? <div className="alert alert-light">Loading property map...</div> : null}
      {error ? <div className="alert alert-danger">{error}</div> : null}
      {!loading && !error && properties.length === 0 ? (
        <div className="alert alert-light">No properties found for the current filters.</div>
      ) : null}

      <div className="position-relative">
        <PropertyMap
          properties={properties}
          filters={filters}
          onMarkerClick={(property) => setSelectedProperty(property)}
          height={720}
        />

        {selectedProperty ? (
          <PropertyMapPopup
            property={selectedProperty}
            portalBase={portalBase}
            onClose={() => setSelectedProperty(null)}
          />
        ) : null}
      </div>
    </Content>
  );
};

export default PropertyMapPage;
