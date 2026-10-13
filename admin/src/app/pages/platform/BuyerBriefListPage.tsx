import { useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Content } from "../../../_metronic/layout/components/content";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { buyerBriefConfig } from "../../services/features/buyer_briefs/buyer_brief.config";
import type { BuyerBrief, BuyerBriefFormValues } from "../../services/features/buyer_briefs/buyer_brief.types";
import { createBuyerBriefApi, deleteBuyerBriefApi, fetchBuyerBriefsApi, updateBuyerBriefApi } from "../../services/features/buyer_briefs/buyer_brief.api";
import { BuyerBriefModal } from "../../services/features/buyer_briefs/component/BuyerBriefModal";

const BuyerBriefListPage = () => {
  const location = useLocation();
  const isDetailPage = location.pathname.split("/").filter(Boolean).length > 2;
  const [data, setData] = useState<BuyerBrief[]>([]);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [editing, setEditing] = useState<BuyerBrief | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchBriefs = useCallback(async (params: any) => {
    try {
      setError(null);
      const result = await fetchBuyerBriefsApi(params);
      setData(result.data);
      setTotal(result.total);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "Buyer briefs could not be loaded.");
    }
  }, []);
  const { params, handleParamsChange } = useEntityTable(fetchBriefs);
  useEffect(() => { void fetchBriefs(params); }, [fetchBriefs, params]);

  const save = async (values: BuyerBriefFormValues) => {
    try {
      setSaving(true); setError(null); setNotice(null);
      if (editing) await updateBuyerBriefApi(editing.id, values);
      else await createBuyerBriefApi(values);
      setShowModal(false); setEditing(null);
      setNotice(editing ? "Buyer brief updated successfully." : "Buyer brief added successfully.");
      await fetchBriefs(params);
    } catch (reason: any) {
      setError(reason?.response?.data?.message ?? "The buyer brief could not be saved.");
    } finally { setSaving(false); }
  };

  const remove = async (id: string) => {
    if (!window.confirm("Delete this buyer brief?")) return;
    try { await deleteBuyerBriefApi(id); setNotice("Buyer brief deleted successfully."); await fetchBriefs(params); }
    catch (reason: any) { setError(reason?.response?.data?.message ?? "The buyer brief could not be deleted."); }
  };

  if (isDetailPage) return <><GenericDetailPage rowActions={[{ label: "Edit", onClick: (row: BuyerBrief) => { setEditing(row); setShowModal(true); } }, { label: "Delete", className: "text-danger", onClick: (row: BuyerBrief) => void remove(row.id) }]} />{showModal && <BuyerBriefModal initialValues={editing} isSubmitting={saving} onClose={() => { setShowModal(false); setEditing(null); }} onSubmit={save} />}</>;

  return <Content>
    <PageHeader title="Buyer Briefs" subtitle="Capture and manage your clients’ property requirements" />
    {error && <div className="alert alert-danger">{error}</div>}{notice && <div className="alert alert-success">{notice}</div>}
    <EntityList data={data} total={total} params={params} onParamsChange={handleParamsChange} columns={buyerBriefConfig.columns} filtersConfig={buyerBriefConfig.filters} storageKey={buyerBriefConfig.storageKey} enableRowClick getRowLink={(row) => `/admin/buyer-briefs/${row.id}`} headerActions={[{ label: "Add Buyer Brief", onClick: () => { setEditing(null); setShowModal(true); } }]} rowActions={[{ label: "Edit", onClick: (row: BuyerBrief) => { setEditing(row); setShowModal(true); } }, { label: "Delete", className: "text-danger", onClick: (row: BuyerBrief) => void remove(row.id) }]} />
    {showModal && <BuyerBriefModal initialValues={editing} isSubmitting={saving} onClose={() => { setShowModal(false); setEditing(null); }} onSubmit={save} />}
  </Content>;
};

export default BuyerBriefListPage;
