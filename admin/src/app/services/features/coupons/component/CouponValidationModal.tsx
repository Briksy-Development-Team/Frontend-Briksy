import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { CouponValidationValues } from "../coupon.types";

type Props = {
  onClose: () => void;
  onSubmit: (values: CouponValidationValues) => void;
};

const CouponValidationModal = ({ onClose, onSubmit }: Props) => {
  const [form, setForm] = useState<CouponValidationValues>({
    code: "",
    amount: 0,
  });

  return (
    <ModalShell
      title="Validate Coupon"
      onClose={onClose}
      onSubmit={() => onSubmit(form)}
      submitLabel="Validate"
      isSubmitting={false}
      isValid
    >
      <div className="fv-row mb-4">
        <label className="form-label">Coupon Code</label>

        <input
          className="form-control"
          value={form.code}
          onChange={(e) =>
            setForm({
              ...form,
              code: e.target.value,
            })
          }
        />
      </div>

      <div className="fv-row mb-4">
        <label className="form-label">Amount</label>

        <input
          type="number"
          className="form-control"
          value={form.amount}
          onChange={(e) =>
            setForm({
              ...form,
              amount: Number(e.target.value),
            })
          }
        />
      </div>
    </ModalShell>
  );
};

export default CouponValidationModal;
