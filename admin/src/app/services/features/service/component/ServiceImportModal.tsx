import BulkImportModal from "../../imports/BulkImportModal";
import {
  analyzeServiceImportApi,
  downloadServiceImportErrorReportApi,
  downloadServiceImportTemplateApi,
  fetchServiceImportApi,
  previewServiceImportApi,
  startServiceImportApi,
} from "../service.import.api";

type Props = {
  onClose: () => void;
  onCompleted: () => void;
};

const ServiceImportModal = ({ onClose, onCompleted }: Props) => (
  <BulkImportModal
    entityLabel="Service"
    title="Import Services"
    description="Upload a spreadsheet, map its columns, preview validation, then start the queued import."
    templateBaseName="service-import-template"
    analyzeFile={analyzeServiceImportApi}
    previewImport={previewServiceImportApi}
    startImport={startServiceImportApi}
    fetchImport={fetchServiceImportApi}
    downloadErrorReport={downloadServiceImportErrorReportApi}
    downloadTemplate={downloadServiceImportTemplateApi}
    onClose={onClose}
    onCompleted={onCompleted}
  />
);

export default ServiceImportModal;
