import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import {
  fetchCoupons,
  saveCoupon,
  deleteCoupon,
  activateCoupon,
  deactivateCoupon,
  openCouponModal,
  closeCouponModal,
  openValidationModal,
  closeValidationModal,
  openDeleteCouponModal,
  closeDeleteCouponModal,
  validateCoupon,
} from "../../services/features/coupons/coupon.slice";

import { couponConfig } from "../../services/features/coupons/coupon.config";

import type { RootState, AppDispatch } from "../../services/store";
import { DeleteConfirmModal } from "../../modules/apps/component/DeleteConfirmModal";

import { useEntityTable } from "../../modules/apps/shared_table/hooks/useEntityTable";
import { EntityList } from "../../modules/apps/shared_table/entity-list/EntityList";
import { PageHeader } from "../../modules/apps/shared_table/entity-list/components/header/PageHeader";
import { Content } from "../../../_metronic/layout/components/content";
import GenericDetailPage from "../../modules/apps/shared_table/entity-list/components/GenericDetailPage";

import CouponModal from "../../services/features/coupons/component/CouponModal";
import CouponValidationModal from "../../services/features/coupons/component/CouponValidationModal";
import { getRolePortalBaseRoute, useRoleAccess } from "../../modules/auth";

const CouponList = ({ rowActions }: { rowActions: any[] }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { isSuperAdmin } = useRoleAccess();

  const portalBase = getRolePortalBaseRoute(
    isSuperAdmin ? ["super_admin"] : ["admin"],
  );
  const {
    data,
    total,
    error,
    saving,
    isModalOpen,
  } = useSelector((s: RootState) => s.coupons);

  const { params, handleParamsChange } = useEntityTable((p) =>
    dispatch(fetchCoupons(p)),
  );

  useEffect(() => {
    if (!saving && !isModalOpen) {
      dispatch(fetchCoupons(params));
    }
  }, [isModalOpen, saving, params, dispatch]);

  if (error) {
    return (
      <Content>
        <PageHeader title="Coupons" subtitle="Manage discount coupons" />
        <div className="alert alert-danger">{error}</div>
      </Content>
    );
  }

  return (
    <Content>
      <PageHeader title="Coupons" subtitle="Manage discount coupons" />

      <EntityList
        data={data}
        total={total}
        params={params}
        onParamsChange={handleParamsChange}
        columns={couponConfig.columns}
        filtersConfig={couponConfig.filters}
        getRowLink={(row) => `${portalBase}/coupons/${row.id}`}
        enableRowClick
        storageKey="couponColumns"
        headerActions={[
          {
            label: "Add Coupon",
            onClick: () => dispatch(openCouponModal(null)),
          },
          {
            label: "Validate Coupon",
            onClick: () => dispatch(openValidationModal()),
          },
        ]}
        rowActions={rowActions}
      />
    </Content>
  );
};

const CouponPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    saving,
    isModalOpen,
    editingCoupon,
    isValidationModalOpen,
    deleteModalOpen,
    deletingCoupon,
  } = useSelector((s: RootState) => s.coupons);

  const rowActions = [
    {
      label: "Edit",
      onClick: (row: any) => dispatch(openCouponModal(row)),
    },
    {
      label: "Activate",
      onClick: (row: any) => dispatch(activateCoupon(row.id)),
    },
    {
      label: "Deactivate",
      onClick: (row: any) => dispatch(deactivateCoupon(row.id)),
    },
    {
      label: "Delete",
      className: "text-danger",
      onClick: (row: any) => dispatch(openDeleteCouponModal(row)),
    },
  ];

  return (
    <>
      <Routes>
        <Route index element={<CouponList rowActions={rowActions} />} />
        <Route path=":id" element={<GenericDetailPage rowActions={rowActions} />} />
      </Routes>

      {isModalOpen && (
        <CouponModal
          initialValues={editingCoupon}
          isSubmitting={saving}
          onClose={() => dispatch(closeCouponModal())}
          onSubmit={(values) =>
            dispatch(
              saveCoupon({
                id: editingCoupon?.id,
                values,
              }),
            )
          }
        />
      )}

      {isValidationModalOpen && (
        <CouponValidationModal
          onClose={() => dispatch(closeValidationModal())}
          onSubmit={(values) => dispatch(validateCoupon(values))}
        />
      )}
      {deleteModalOpen && deletingCoupon && (
        <DeleteConfirmModal
          title="Delete Coupon"
          message={`Are you sure you want to delete coupon ${deletingCoupon.code}?`}
          onClose={() => dispatch(closeDeleteCouponModal())}
          onConfirm={() => dispatch(deleteCoupon(deletingCoupon.id))}
          isSubmitting={saving}
        />
      )}
    </>
  );
};

export default CouponPage;
