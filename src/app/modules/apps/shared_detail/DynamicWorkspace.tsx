import { useState } from "react";
import type { DetailConfig } from "./core/DetailTypes";
import WorkspaceHeader from "./components/WorkspaceHeader";
import SectionRenderer from "./components/SectionRenderer";

type Props<T> = {
  config: DetailConfig<T>;
  data: T | null;
  isLoading: boolean;
  error?: any;
  rowActions?: any[];
};

export default function DynamicWorkspace<T>({ config, data, isLoading, error, rowActions }: Props<T>) {
  const [activeTab, setActiveTab] = useState<string>(config.tabs[0]?.id || "");

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center h-400px">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="alert alert-danger d-flex align-items-center p-5">
        <div className="d-flex flex-column">
          <h4 className="mb-1 text-danger">Error Loading Workspace</h4>
          <span>Failed to load entity data. Please try again.</span>
        </div>
      </div>
    );
  }

  // Find active tab configuration
  const currentTabConfig = config.tabs.find((t) => t.id === activeTab);
  
  // Filter sections that belong to the active tab
  const activeSections = config.sections.filter((s) => 
    currentTabConfig?.sections.includes(s.id)
  );

  return (
    <div className="d-flex flex-column gap-7 gap-lg-10">
      {/* Header */}
      <WorkspaceHeader config={config.header} data={data} rowActions={rowActions} />

      {/* Navigation Tabs */}
      {config.tabs.length > 1 && (
        <div className="card shadow-sm">
          <div className="card-header align-items-stretch border-bottom-0">
            <div className="card-toolbar m-0">
              <ul className="nav nav-stretch nav-line-tabs nav-line-tabs-2x border-transparent fw-bold fs-5">
                {config.tabs.map((tab) => (
                  <li key={tab.id} className="nav-item mt-2">
                    <button
                      className={`nav-link text-active-primary ms-0 me-10 py-5 bg-transparent border-0 ${
                        activeTab === tab.id ? "active" : ""
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Grid */}
      <div className="row g-5 g-xl-10">
        {activeSections.map((section) => (
          <div
            key={section.id}
            className={`col-12 col-xl-${section.gridColumnSpan || 12}`}
          >
            <SectionRenderer config={section} data={data} />
          </div>
        ))}
        {activeSections.length === 0 && (
          <div className="col-12">
            <div className="card">
              <div className="card-body p-10 text-center text-muted">
                No sections configured for this tab.
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}