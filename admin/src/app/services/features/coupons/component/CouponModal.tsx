import { ModalShell } from "../../../../modules/apps/component/ModalShell";
import type { Coupon, CouponFormValues } from "../coupon.types";
import { useState } from "react";

type Props = {
    initialValues: Coupon | null;
    isSubmitting: boolean;
    onClose: () => void;
    onSubmit: (values: CouponFormValues) => void;
};

const CouponModal = ({
    initialValues,
    isSubmitting,
    onClose,
    onSubmit,
}: Props) => {
    const [form, setForm] = useState<CouponFormValues>({
        code: initialValues?.code ?? "",
        name: initialValues?.name ?? "",
        description: initialValues?.description ?? "",
        discount_type: initialValues?.discount_type ?? "fixed",
        discount_value: Number(initialValues?.discount_value ?? 0),
        status: initialValues?.status ?? "active",
    });

    return (
        <ModalShell
            title={initialValues ? "Edit Coupon" : "Create Coupon"}
            onClose={onClose}
            onSubmit={() => onSubmit(form)}
            isSubmitting={isSubmitting}
            submitLabel={initialValues ? "Update" : "Create"}
            isValid
        >
            <div className="fv-row mb-4">
                <label className="form-label">Code</label>
                <input
                    className="form-control"
                    value={form.code}
                    onChange={(e) =>
                        setForm({ ...form, code: e.target.value })
                    }
                />
            </div>

            <div className="fv-row mb-4">
                <label className="form-label">Name</label>
                <input
                    className="form-control"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />
            </div>

            <div className="fv-row mb-4">
                <label className="form-label">Discount Value</label>
                <input
                    type="number"
                    className="form-control"
                    value={form.discount_value}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            discount_value: Number(e.target.value),
                        })
                    }
                />
            </div>
        </ModalShell>
    );
};

export default CouponModal;