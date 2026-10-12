import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { Check, ChevronLeft, Lock, ShieldCheck } from "lucide-react";

import {
  createDirectCheckout,
  createPricingInquiry,
  getPublicPlans,
  type PublicAddon,
  type PublicPlan,
} from "../../api/subscription/plan.api";
import {
  getCheckoutInvitation,
  payCheckoutInvitation,
} from "../../api/checkoutInvitation.api";
import { getStoredAuth } from "../../auth/auth.storage";

type CheckoutProduct = {
  id: string;
  name: string;
  plan_family?: string;
  description?: string | null;
  monthly_price: number;
  yearly_price: number | null;
  currency: string;
  billing_cycle: "monthly" | "yearly";
  popular?: boolean;
  show_price?: boolean;
  features?: { name: string; enabled: boolean; value?: number | null }[];
  addons?: PublicAddon[];
};

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  company_name: "",
  business_type: "organisation",
  abn_number: "",
  address: "",
  state: "",
  postcode: "",
  password: "",
  password_confirmation: "",
  message: "",
};

const familyMap: Record<string, string> = {
  builder: "builders",
  builders: "builders",
  properties: "property_owner",
  "real-estate": "property_owner",
};

const inputClass =
  "w-full rounded-xl border border-[#EDE8E4] bg-white px-3.5 py-2.5 text-sm text-[#342511] outline-none transition focus:border-[#342511]";
const eyebrow = "text-xs font-medium uppercase tracking-[0.2em] text-[#7C5F42]";

const toProduct = (plan: PublicPlan): CheckoutProduct => ({
  ...plan,
  monthly_price: plan.monthly_price ?? 0,
  yearly_price: plan.yearly_price ?? null,
  currency: plan.currency ?? "AUD",
  billing_cycle: "monthly",
  show_price: plan.show_price !== false,
});

const errorMessage = (reason: any, fallback: string) =>
  reason?.response?.data?.message ?? fallback;

const CheckoutInvitationPage = () => {
  const { token = "" } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const direct = !token;
  const auth = getStoredAuth();

  const [product, setProduct] = useState<CheckoutProduct | null>(null);
  const [availablePlans, setAvailablePlans] = useState<PublicPlan[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">(
    "monthly",
  );
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [isChangingPlan, setIsChangingPlan] = useState(false);
  const [form, setForm] = useState({
    ...emptyForm,
    name: auth?.user?.name ?? "",
    email: auth?.user?.email ?? "",
  });

  const fromTab = searchParams.get("from_tab");
  const returnUrl = searchParams.get("from") || searchParams.get("return_url");
  const handleBack = () =>
    navigate(
      fromTab
        ? `/subs?tab=${encodeURIComponent(fromTab)}`
        : returnUrl || "/subs",
    );

  useEffect(() => {
    setError(null);
    setInquirySubmitted(false);

    const cycle =
      searchParams.get("cycle") || searchParams.get("billing_cycle");
    if (cycle === "yearly" || cycle === "monthly") setBillingCycle(cycle);

    // Invitation checkout
    if (token) {
      getCheckoutInvitation(token)
        .then(({ plan, customer }) => {
          const invCycle =
            plan.billing_cycle === "yearly" ? "yearly" : "monthly";
          setProduct({ ...plan, billing_cycle: invCycle, show_price: true });
          setBillingCycle(invCycle);
          setForm((f) => ({
            ...f,
            name: f.name || customer.name || "",
            email: f.email || customer.email || "",
            phone: customer.phone || "",
            company_name: customer.company_name || "",
          }));
        })
        .catch((reason) =>
          setError(
            errorMessage(reason, "This checkout link is not available."),
          ),
        );
      return;
    }

    // Direct checkout
    const planId = searchParams.get("plan");
    const familyParam = searchParams.get("family") ?? "";
    const family = familyMap[familyParam] ?? familyParam;
    const addons = searchParams.get("addons");

    getPublicPlans()
      .then((plans) => {
        if (!plans.length)
          return setError(
            "No public subscription plans are currently available.",
          );

        const inFamily = plans.filter((p) => p.plan_family === family);
        const plan =
          plans.find((p) => p.id === planId) ||
          inFamily.find((p) => p.popular) ||
          inFamily[0] ||
          plans.find((p) => p.popular && p.show_price !== false) ||
          plans[0];

        setAvailablePlans(
          plans.filter((p) => p.plan_family === plan.plan_family),
        );
        setProduct(toProduct(plan));
        if (addons)
          setSelectedAddons(
            addons
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean),
          );
      })
      .catch((reason) =>
        setError(errorMessage(reason, "Unable to load checkout plans.")),
      );
  }, [searchParams, token]);

  if (searchParams.get("cancelled")) {
    return (
      <State
        title="Checkout cancelled"
        message="No payment was taken. You can return to the plan while it is still available."
        onBack={handleBack}
      />
    );
  }
  if (error)
    return (
      <State title="Checkout unavailable" message={error} onBack={handleBack} />
    );
  if (!product)
    return <State title="Loading checkout" message="Please wait..." />;
  if (inquirySubmitted) {
    return (
      <State
        title="Inquiry Received"
        message={`Thank you! Your inquiry about the ${product.name} plan has been received. Our team will contact you shortly.`}
        onBack={handleBack}
      />
    );
  }

  const isContactPlan = product.show_price === false;
  const yearlyPrice = product.yearly_price ?? 0;
  const hasYearly = yearlyPrice > 0;
  const yearly = billingCycle === "yearly" && hasYearly;
  const discount =
    hasYearly && product.monthly_price
      ? Math.round(100 - (yearlyPrice * 100) / (product.monthly_price * 12))
      : 0;

  const addonPrice = (addon: PublicAddon) =>
    addon.pricing_type === "one_time"
      ? (addon.one_time_price ?? addon.monthly_price ?? 0)
      : yearly
        ? (addon.yearly_price ?? (addon.monthly_price ?? 0) * 12)
        : (addon.monthly_price ?? addon.one_time_price ?? 0);

  const chosenAddons =
    product.addons?.filter((addon) => selectedAddons.includes(addon.id)) ?? [];
  const addonTotal = chosenAddons.reduce(
    (sum, addon) => sum + addonPrice(addon),
    0,
  );
  const totalAmount =
    (yearly ? yearlyPrice : product.monthly_price) + addonTotal;
  const features = (product.features ?? [])
    .filter((feature) => feature.enabled)
    .slice(0, 8);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      if (isContactPlan) {
        const { name, email, phone, company_name, message } = form;
        await createPricingInquiry({
          plan_id: product.id,
          name,
          email,
          phone,
          company_name,
          message,
        });
        setInquirySubmitted(true);
      } else {
        const result = direct
          ? await createDirectCheckout({
              ...form,
              plan_id: product.id,
              billing_cycle: yearly ? "yearly" : "monthly",
              addons: chosenAddons.map((addon) => ({
                addon_id: addon.id,
                quantity: 1,
              })),
            })
          : await payCheckoutInvitation(token, form);
        window.location.assign(result.checkout_url);
      }
    } catch (reason) {
      setError(errorMessage(reason, "Something went wrong. Please try again."));
    } finally {
      setSubmitting(false);
    }
  };

  // Plain function (not a component) so inputs keep focus while typing
  const field = (
    key: keyof typeof emptyForm,
    label: string,
    placeholder: string,
    type = "text",
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#342511]">
        {label} <span className="text-red-500">*</span>
      </label>
      <input
        required
        type={type}
        minLength={type === "password" ? 8 : undefined}
        placeholder={placeholder}
        className={inputClass}
        value={form[key]}
        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
      />
    </div>
  );

  return (
    <main className="min-h-screen bg-[#F8F4EE] px-4 pb-20 pt-28 font-helvetica text-[#342511]">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto mb-4 max-w-6xl">
          <button
            type="button"
            onClick={handleBack}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#7C5F42] transition hover:text-[#342511]"
          >
            <ChevronLeft className="h-5 w-5" />
            Back to {fromTab ? `${fromTab} plans` : "plans"}
          </button>
        </div>

        <header className="mb-10 text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-[#7C5F42]">
            {isContactPlan ? "Briksy plan inquiry" : "Briksy secure checkout"}
          </p>
          <h1 className="mt-3 text-3xl font-normal tracking-tight sm:text-4xl lg:text-5xl">
            {isContactPlan
              ? `Inquire about ${product.name}`
              : `Complete your ${product.name} plan`}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base text-[#7C5F42] sm:text-lg">
            {isContactPlan
              ? "Tell us about your business and requirements to get tailored pricing."
              : "Confirm your plan, add anything you need, and continue securely to Stripe."}
          </p>
        </header>

        <div className="mx-auto grid max-w-6xl items-start gap-8 lg:grid-cols-[400px_1fr] xl:grid-cols-[420px_1fr]">
          {/* Order summary */}
          <aside className="sticky top-28 space-y-5 rounded-[20px] border border-[#EDE8E4] bg-white p-7 shadow-sm">
            <div className="flex items-center justify-between">
              <span className={eyebrow}>Your Plan</span>
              {direct && availablePlans.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsChangingPlan(!isChangingPlan)}
                  className="text-xs font-medium hover:underline"
                >
                  {isChangingPlan ? "Done" : "Change"}
                </button>
              )}
            </div>

            {isChangingPlan ? (
              <select
                aria-label="Choose plan"
                className="w-full rounded-xl border border-[#EDE8E4] bg-white px-3 py-2 text-base font-medium outline-none"
                value={product.id}
                onChange={(e) => {
                  const next = availablePlans.find(
                    (plan) => plan.id === e.target.value,
                  );
                  if (!next) return;
                  setProduct(toProduct(next));
                  setSelectedAddons([]);
                  setIsChangingPlan(false);
                }}
              >
                {availablePlans.map((plan) => (
                  <option key={plan.id} value={plan.id}>
                    {plan.name} —{" "}
                    {plan.show_price === false
                      ? "Contact us"
                      : `${plan.currency ?? "AUD"} ${plan.monthly_price ?? 0}/mo`}
                  </option>
                ))}
              </select>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-3xl font-medium tracking-tight">
                    {product.name}
                  </h2>
                  {product.popular && (
                    <span className="rounded-full bg-[#E2CBB3] px-2.5 py-0.5 text-xs font-medium">
                      Most Popular
                    </span>
                  )}
                </div>
                {product.description && (
                  <p className="text-xs leading-relaxed text-[#7C5F42]">
                    {product.description}
                  </p>
                )}
              </div>
            )}

            {direct && !isContactPlan && hasYearly && (
              <div className="flex rounded-full bg-[#F8F4EE] p-1">
                {(["monthly", "yearly"] as const).map((cycle) => (
                  <button
                    key={cycle}
                    type="button"
                    onClick={() => setBillingCycle(cycle)}
                    className={`flex-1 rounded-full py-2 text-xs font-medium capitalize transition ${
                      billingCycle === cycle
                        ? "bg-white shadow-sm"
                        : "text-[#7C5F42] hover:text-[#342511]"
                    }`}
                  >
                    {cycle}
                    {cycle === "yearly" &&
                      discount > 0 &&
                      ` · save ${discount}%`}
                  </button>
                ))}
              </div>
            )}

            <div className="h-px bg-[#EDE8E4]" />

            {features.length > 0 && (
              <>
                <div className="space-y-3">
                  <p className={eyebrow}>Included</p>
                  <div className="space-y-2.5">
                    {features.map((feature) => (
                      <div
                        key={feature.name}
                        className="flex items-start gap-2.5 text-xs"
                      >
                        <Check className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>
                          {feature.name}
                          {feature.value ? ` — up to ${feature.value}` : ""}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="h-px bg-[#EDE8E4]" />
              </>
            )}

            {isContactPlan ? (
              <div className="rounded-xl bg-[#F8F4EE] p-4 text-center">
                <p className="text-sm font-medium">Custom Enterprise Pricing</p>
                <p className="mt-1 text-xs text-[#7C5F42]">
                  Contact our sales team for bespoke quotes and volume
                  discounts.
                </p>
              </div>
            ) : (
              <>
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span>{product.name} plan</span>
                    <span className="font-medium">
                      {product.currency}{" "}
                      {(yearly
                        ? yearlyPrice
                        : product.monthly_price
                      ).toLocaleString()}
                    </span>
                  </div>
                  {chosenAddons.map((addon) => (
                    <div key={addon.id} className="flex justify-between">
                      <span className="truncate pr-2">
                        {addon.name}
                        {addon.pricing_type === "one_time" && " · one-time"}
                      </span>
                      <span className="whitespace-nowrap font-medium">
                        {product.currency} {addonPrice(addon).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-[#EDE8E4]" />

                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm font-medium">Total due today</p>
                    <p className="text-xs text-[#7C5F42]">
                      Billed {yearly ? "yearly" : "monthly"} · cancel anytime
                    </p>
                  </div>
                  <p className="text-3xl font-medium tracking-tight">
                    {product.currency} {totalAmount.toLocaleString()}
                  </p>
                </div>
              </>
            )}

            <div className="flex items-start gap-2.5 rounded-xl bg-[#F8F4EE] p-3.5">
              <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#8B6F54]" />
              <p className="text-xs leading-relaxed text-[#7C5F42]">
                ABN and business verification included. Payment is handled
                securely by Stripe. Briksy never stores card details.
              </p>
            </div>
          </aside>

          {/* Form */}
          <form
            onSubmit={submit}
            className="space-y-6 rounded-[20px] border border-[#EDE8E4] bg-white p-6 shadow-sm sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-medium">
                  {isContactPlan
                    ? "Business inquiry details"
                    : "Account and business details"}
                </h2>
                <p className="mt-1 text-xs text-[#7C5F42] sm:text-sm">
                  {isContactPlan
                    ? "Our team will review your requirements and get in touch with you."
                    : auth?.user
                      ? `Logged in as ${auth.user.email}. Complete business verification below.`
                      : "Used to verify your business and create your Briksy account."}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-[#E2CBB3] px-3 py-1 text-xs font-medium">
                <Lock className="h-3.5 w-3.5" />
                Secure
              </div>
            </div>

            <div className="space-y-3.5">
              <h3 className={eyebrow}>Your Details</h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {field("name", "Full name", "e.g. John Doe")}
                {field("email", "Email", "john@example.com", "email")}
                {field("phone", "Phone number", "+61 400 000 000", "tel")}
                {field(
                  "company_name",
                  "Company / organisation",
                  "e.g. Acme Constructions",
                )}
              </div>
            </div>

            {isContactPlan ? (
              <div className="space-y-3.5">
                <h3 className={eyebrow}>Your Requirements</h3>
                <div>
                  <label className="mb-1.5 block text-sm font-medium">
                    Tell us about your team or requirements{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your requirements, team size, or expected volume..."
                    className={inputClass}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                  />
                </div>
              </div>
            ) : (
              <>
                <div className="space-y-3.5">
                  <h3 className={eyebrow}>Business Verification</h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field("abn_number", "ABN", "11-digit ABN")}
                    <div>
                      <label className="mb-1.5 block text-sm font-medium">
                        Business type <span className="text-red-500">*</span>
                      </label>
                      <select
                        className={inputClass}
                        value={form.business_type}
                        onChange={(e) =>
                          setForm({ ...form, business_type: e.target.value })
                        }
                      >
                        <option value="organisation">Organisation</option>
                        <option value="company">Company</option>
                        <option value="solo_trader">Sole trader</option>
                      </select>
                    </div>
                  </div>
                  {field("address", "Address", "Street address")}
                  <div className="grid gap-4 sm:grid-cols-2">
                    {field("state", "State", "e.g. NSW")}
                    {field("postcode", "Postcode", "e.g. 2000")}
                  </div>
                </div>

                {!auth?.user && (
                  <div className="space-y-3.5">
                    <h3 className={eyebrow}>Account</h3>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field(
                        "password",
                        "Password",
                        "At least 8 characters",
                        "password",
                      )}
                      {field(
                        "password_confirmation",
                        "Confirm password",
                        "Repeat password",
                        "password",
                      )}
                    </div>
                  </div>
                )}

                {direct && !!product.addons?.length && (
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h3 className={eyebrow}>Add-ons</h3>
                      <span className="text-xs">
                        {chosenAddons.length} selected · {product.currency}{" "}
                        {addonTotal.toLocaleString()}/{yearly ? "yr" : "mo"}
                      </span>
                    </div>
                    <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
                      {product.addons.map((addon) => {
                        const isSelected = selectedAddons.includes(addon.id);
                        const price = addonPrice(addon);
                        return (
                          <div
                            key={addon.id}
                            onClick={() =>
                              setSelectedAddons(
                                isSelected
                                  ? selectedAddons.filter(
                                      (id) => id !== addon.id,
                                    )
                                  : [...selectedAddons, addon.id],
                              )
                            }
                            className={`flex cursor-pointer select-none items-center justify-between gap-3 rounded-xl border p-3 transition ${
                              isSelected
                                ? "border-[#342511] bg-[#F8F4EE]"
                                : "border-[#EDE8E4] bg-white hover:border-[#342511]/30"
                            }`}
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <div
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-[5px] border ${
                                  isSelected
                                    ? "border-[#342511] bg-[#342511] text-white"
                                    : "border-[#EDE8E4] bg-white"
                                }`}
                              >
                                {isSelected && <Check className="h-3 w-3" />}
                              </div>
                              <span className="truncate text-xs font-medium">
                                {addon.name}
                              </span>
                            </div>
                            <span className="shrink-0 text-xs text-[#7C5F42]">
                              {price === 0
                                ? "Included"
                                : `+${product.currency} ${price.toLocaleString()}${addon.pricing_type === "one_time" ? " once" : ""}`}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className="h-px bg-[#EDE8E4]" />

            <label className="flex cursor-pointer select-none items-center gap-3 text-sm">
              <input
                type="checkbox"
                required
                className="h-4 w-4 accent-[#342511]"
              />
              <span>
                I accept the{" "}
                <a
                  href="/terms"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#7C5F42]"
                >
                  Terms of Use
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#7C5F42]"
                >
                  Privacy Policy
                </a>
              </span>
            </label>

            {error && (
              <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="flex h-12 w-full items-center justify-center rounded-full bg-[#342511] text-sm font-medium text-white shadow-sm transition hover:bg-[#342511]/90 disabled:opacity-60"
            >
              {submitting
                ? isContactPlan
                  ? "Submitting inquiry..."
                  : "Preparing secure checkout..."
                : isContactPlan
                  ? "Send inquiry"
                  : `Continue to Stripe checkout · ${product.currency} ${totalAmount.toLocaleString()}`}
            </button>

            <p className="text-center text-xs text-[#7C5F42]">
              {isContactPlan
                ? "Our team usually responds within 1 business day."
                : "Your payment details are handled securely by Stripe. You can cancel or change plan any time."}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
};

const State = ({
  title,
  message,
  onBack,
}: {
  title: string;
  message: string;
  onBack?: () => void;
}) => (
  <main className="flex min-h-[70vh] items-center justify-center bg-[#F8F4EE] px-4 font-helvetica text-[#342511]">
    <div className="max-w-md rounded-3xl border border-[#EDE8E4] bg-white p-8 text-center shadow-sm">
      <h1 className="text-2xl font-medium">{title}</h1>
      <p className="mt-3 text-sm text-[#7C5F42]">{message}</p>
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          className="mt-6 rounded-full bg-[#342511] px-6 py-2.5 text-xs font-medium text-white transition hover:opacity-90"
        >
          Return to plans
        </button>
      )}
    </div>
  </main>
);

export default CheckoutInvitationPage;
