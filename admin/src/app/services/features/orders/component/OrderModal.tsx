import { useEffect, useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type {
  Order,
  OrderFormValues,
} from "../order.types";

type Props = {
  initialValues?: Order | null;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: OrderFormValues) => void;
};

const emptyForm: OrderFormValues = {
  subtotal: 0,
  discount_amount: 0,
  tax_amount: 0,
  total_amount: 0,
  currency: "INR",
  payment_status: "pending",
  order_status: "draft",
};

export const OrderModal = ({
  initialValues,
  isSubmitting,
  onClose,
  onSubmit,
}: Props) => {
  const [form, setForm] =
    useState<OrderFormValues>(emptyForm);

  useEffect(() => {
    if (!initialValues) {
      setForm(emptyForm);
      return;
    }

    setForm({
      organization_id:
        initialValues.organization_id ?? null,
      user_id:
        initialValues.user_id ?? null,
      plan_id:
        initialValues.plan_id ?? null,
      coupon_id:
        initialValues.coupon_id ?? null,

      subtotal: Number(
        initialValues.subtotal ?? 0
      ),

      discount_amount: Number(
        initialValues.discount_amount ?? 0
      ),

      tax_amount: Number(
        initialValues.tax_amount ?? 0
      ),

      total_amount: Number(
        initialValues.total_amount ?? 0
      ),

      currency:
        initialValues.currency ?? "INR",

      billing_cycle:
        initialValues.billing_cycle ?? null,

      payment_status:
        initialValues.payment_status,

      order_status:
        initialValues.order_status,

      payment_method:
        initialValues.payment_method ?? null,

      transaction_reference:
        initialValues.transaction_reference ??
        null,

      starts_at:
        initialValues.starts_at ?? null,

      ends_at:
        initialValues.ends_at ?? null,

      notes:
        initialValues.notes ?? null,
    });
  }, [initialValues]);

  return (
    <ModalShell
      title={
        initialValues
          ? "Edit Order"
          : "Create Order"
      }
      onClose={onClose}
      onSubmit={() => onSubmit(form)}
      isSubmitting={isSubmitting}
      submitLabel={
        initialValues ? "Update" : "Create"
      }
      isValid={true}
    >
      <div className="fv-row mb-4">
        <label className="form-label required">
          Subtotal
        </label>

        <input
          type="number"
          className="form-control form-control-solid"
          value={form.subtotal}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              subtotal: Number(e.target.value),
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">
          Discount Amount
        </label>

        <input
          type="number"
          className="form-control form-control-solid"
          value={form.discount_amount ?? 0}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              discount_amount: Number(
                e.target.value
              ),
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">
          Tax Amount
        </label>

        <input
          type="number"
          className="form-control form-control-solid"
          value={form.tax_amount ?? 0}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              tax_amount: Number(
                e.target.value
              ),
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">
          Total Amount
        </label>

        <input
          type="number"
          className="form-control form-control-solid"
          value={form.total_amount ?? 0}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              total_amount: Number(
                e.target.value
              ),
            }))
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">
          Currency
        </label>

        <input
          className="form-control form-control-solid"
          value={form.currency ?? ""}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              currency: e.target.value,
            }))
          }
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <label className="form-label">
            Payment Status
          </label>

          <select
            className="form-select form-select-solid"
            value={form.payment_status}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                payment_status:
                  e.target.value as OrderFormValues["payment_status"],
              }))
            }
          >
            <option value="pending">
              Pending
            </option>
            <option value="paid">
              Paid
            </option>
            <option value="failed">
              Failed
            </option>
            <option value="refunded">
              Refunded
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>

        <div className="col-md-6 mb-4">
          <label className="form-label">
            Order Status
          </label>

          <select
            className="form-select form-select-solid"
            value={form.order_status}
            onChange={(e) =>
              setForm((current) => ({
                ...current,
                order_status:
                  e.target.value as OrderFormValues["order_status"],
              }))
            }
          >
            <option value="draft">
              Draft
            </option>
            <option value="confirmed">
              Confirmed
            </option>
            <option value="active">
              Active
            </option>
            <option value="expired">
              Expired
            </option>
            <option value="cancelled">
              Cancelled
            </option>
          </select>
        </div>
      </div>

      <div className="fv-row">
        <label className="form-label">
          Notes
        </label>

        <textarea
          className="form-control form-control-solid"
          rows={4}
          value={form.notes ?? ""}
          onChange={(e) =>
            setForm((current) => ({
              ...current,
              notes: e.target.value,
            }))
          }
        />
      </div>
    </ModalShell>
  );
};