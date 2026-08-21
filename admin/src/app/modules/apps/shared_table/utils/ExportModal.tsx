import { ModalShell } from "../../component/ModalShell";
import { KTIcon } from "../../../../../_metronic/helpers";

type Props = {
  onClose: () => void;
  onExportSelected: () => void;
  onExportCurrent: () => void;
  onExportAll?: () => void;
  selectedCount: number;
};

const ExportModal = ({
  onClose,
  onExportSelected,
  onExportCurrent,
  onExportAll,
  selectedCount,
}: Props) => {
  const handleExport = (action: () => void) => {
    action();
    onClose();
  };

  return (
    <ModalShell
      title="Export Data"
      onClose={onClose}
      onSubmit={() => {}}
      submitLabel=""
      isSubmitting={false}
      isValid
    >
      <div className="d-flex flex-column gap-5">
        <div className="text-muted fs-6">
          Choose what data you would like to export.
        </div>

        <div
          className={`border rounded p-5 cursor-pointer ${
            selectedCount === 0 ? "opacity-50" : "hover-elevate-up"
          }`}
          onClick={() => selectedCount > 0 && handleExport(onExportSelected)}
        >
          <div className="d-flex align-items-center">
            <KTIcon
              iconName="check-square"
              className="fs-2hx text-primary me-4"
            />

            <div className="flex-grow-1">
              <div className="fw-bold fs-5">Export Selected Rows</div>

              <div className="text-muted">
                Export only checked rows from the table.
              </div>
            </div>

            <span className="badge badge-light-primary">{selectedCount}</span>
          </div>
        </div>

        <div
          className="border rounded p-5 cursor-pointer hover-elevate-up"
          onClick={() => handleExport(onExportCurrent)}
        >
          <div className="d-flex align-items-center">
            <KTIcon
              iconName="abstract-26"
              className="fs-2hx text-success me-4"
            />

            <div className="flex-grow-1">
              <div className="fw-bold fs-5">Export Current Page</div>

              <div className="text-muted">
                Export all rows currently visible in the table.
              </div>
            </div>
          </div>
        </div>

        {onExportAll && (
          <div
            className="border rounded p-5 cursor-pointer hover-elevate-up"
            onClick={() => handleExport(onExportAll)}
          >
            <div className="d-flex align-items-center">
              <KTIcon
                iconName="cloud-download"
                className="fs-2hx text-warning me-4"
              />

              <div className="flex-grow-1">
                <div className="fw-bold fs-5">Export All Records</div>

                <div className="text-muted">
                  Export all records available in the system.
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </ModalShell>
  );
};

export default ExportModal;
