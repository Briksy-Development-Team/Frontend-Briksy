import { useState } from "react";
import { ModalShell } from "../../../../modules/apps/component/ModalShell";

import type { ServiceList, ServiceFormValues, ServiceCategory } from "../service_list.types";

type Props = {
    initialValues?: ServiceList | null;
    isSubmitting?: boolean;
    onClose: () => void;
    onSubmit: (values: ServiceFormValues) => void;
};

const ServiceModal = ({
    initialValues,
    isSubmitting,
    onClose,
    onSubmit,
}: Props) => {
    const [form, setForm] = useState<ServiceFormValues>({
        name: initialValues?.name ?? "",
        slug: initialValues?.slug ?? "",
        description: initialValues?.description ?? "",
        category: initialValues?.category ?? "electrical",
    });

    return (
        <ModalShell
            title={initialValues ? "Edit Service" : "Add Service"}
            onClose={onClose}
            onSubmit={() => onSubmit(form)}
            isSubmitting={isSubmitting}
            submitLabel={initialValues ? "Update Service" : "Create Service"}
            isValid={!!form.name}
        >
            <div className="fv-row mb-7">
                <label className="required form-label">Service Name</label>

                <input
                    className="form-control form-control-solid"
                    value={form.name}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            name: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mb-7">
                <label className="form-label">Slug</label>

                <input
                    className="form-control form-control-solid"
                    value={form.slug}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            slug: e.target.value,
                        }))
                    }
                />
            </div>

            <div className="fv-row mb-7">
                <label className="form-label">Category</label>

                <select
                    className="form-select form-select-solid"
                    value={form.category}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            category: e.target.value as ServiceCategory,
                        }))
                    }
                >
                    <option value="electrical">Electrical</option>

                    <option value="plumbing">Plumbing</option>

                    <option value="fencing">Fencing</option>

                    <option value="landscapers">Landscapers</option>

                    <option value="conveyancers">Conveyancers</option>

                    <option value="brokers">Brokers</option>
                </select>
            </div>

            <div className="fv-row">
                <label className="form-label">Description</label>

                <textarea
                    rows={4}
                    className="form-control form-control-solid"
                    value={form.description}
                    onChange={(e) =>
                        setForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                        }))
                    }
                />
            </div>
        </ModalShell>
    );
};

export default ServiceModal;
