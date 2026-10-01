import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useLocation } from "react-router-dom";

import type { RootState, AppDispatch } from "../../services/store";
import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";
import { getRolePortalBaseRoute, useModuleAccess, useRoleAccess } from "../../modules/auth";
import { getDisplayId } from "../../services/utils/displayId";
import { fetchInquiries } from "../../services/features/inquiries/inquiry.slice";
import { inquiryConfig } from "../../services/features/inquiries/inquiry.config";
import { CheckoutLinkModal } from "./CheckoutLinkModal";
import { InquiryStatusModal } from "./InquiryStatusModal";

const InquiryList = ({ rowActions, pricingOnly = false }: { rowActions?: any[]; pricingOnly?: boolean }) => {
    const dispatch = useDispatch<AppDispatch>();

    const { isSuperAdmin } = useRoleAccess();
    const { hasModule } = useModuleAccess();
    const inquiryTitle = !isSuperAdmin && hasModule("builder_management")
        ? "Enquiries"
        : !isSuperAdmin && hasModule("service_management")
            ? "Service Enquiries"
            : "Property Enquiries";

    const portalBase = getRolePortalBaseRoute(
        isSuperAdmin ? ["super_admin"] : ["admin"],
    );

    const {
        data,
        total,
    } = useSelector((s: RootState) => s.inquiries);

    const { params, handleParamsChange } = useEntityTable((p) =>
        dispatch(fetchInquiries(pricingOnly ? { ...p, filters: { ...p.filters, lead_source: "pricing" } } : p)),
    );

    return (
        <Content>
            <PageHeader
                title={inquiryTitle}
                subtitle="Manage enquiries submitted from the website"
            />

            <EntityList
                data={data}
                total={total}
                params={params}
                onParamsChange={handleParamsChange}
                columns={pricingOnly
                    ? inquiryConfig.pricingColumns
                    : !isSuperAdmin && hasModule("builder_management")
                    ? inquiryConfig.builderColumns
                    : !isSuperAdmin && hasModule("service_management")
                        ? inquiryConfig.serviceColumns
                        : inquiryConfig.columns}
                filtersConfig={inquiryConfig.filters}
                getRowLink={(row) => `${portalBase}/${pricingOnly ? "pricing-inquiries" : "inquiry"}/${getDisplayId(row)}`}
                enableRowClick
                rowActions={rowActions}
            />
        </Content>
    );
};

export default function InquiryPage() {
    const location = useLocation();
    const pricingOnly = location.pathname.startsWith("/super-admin/pricing-inquiries");
    const { isSuperAdmin } = useRoleAccess();
    const [selectedInquiry, setSelectedInquiry] = useState<any | null>(null);
    const [statusInquiry, setStatusInquiry] = useState<any | null>(null);
    const rowActions = isSuperAdmin ? [{ label: "Create Checkout Link", permission: "plan.update", onClick: (row: any) => { setSelectedInquiry(row); } }, { label: "Change Status", permission: "plan.update", onClick: (row: any) => { setStatusInquiry(row); } }] : undefined;
    return (
        <><Routes><Route index element={<InquiryList rowActions={rowActions} pricingOnly={pricingOnly} />} /><Route path=":id" element={<GenericDetailPage rowActions={rowActions} />} /></Routes>{selectedInquiry && <CheckoutLinkModal inquiry={selectedInquiry} onClose={() => setSelectedInquiry(null)} />}{statusInquiry && <InquiryStatusModal inquiry={statusInquiry} onClose={() => setStatusInquiry(null)} />}</>
    );
}
